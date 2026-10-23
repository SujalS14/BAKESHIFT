require 'socket'
require 'uri'
require 'json'
require 'net/http'
require 'openssl'
require 'securerandom'

PORT = 8080
ROOT = File.expand_path(__dir__)

# Simple .env loader
def load_dotenv(file_path)
  return unless File.exist?(file_path)
  File.readlines(file_path).each do |line|
    line = line.strip
    next if line.empty? || line.start_with?('#')
    k, v = line.split('=', 2)
    if k && v
      k = k.strip
      v = v.strip.gsub(/\A['"]|['"]\Z/, '')
      ENV[k] ||= v
    end
  end
end

load_dotenv(File.join(ROOT, '.env'))

MIME_TYPES = {
  '.html' => 'text/html; charset=utf-8',
  '.css'  => 'text/css; charset=utf-8',
  '.js'   => 'application/javascript; charset=utf-8',
  '.json' => 'application/json; charset=utf-8',
  '.svg'  => 'image/svg+xml',
  '.png'  => 'image/png',
  '.jpg'  => 'image/jpeg',
  '.jpeg' => 'image/jpeg',
  '.ico'  => 'image/x-icon'
}

def send_json(client, status_code, status_text, hash_data)
  body = JSON.generate(hash_data)
  client.print "HTTP/1.1 #{status_code} #{status_text}\r\n"
  client.print "Content-Type: application/json; charset=utf-8\r\n"
  client.print "Content-Length: #{body.bytesize}\r\n"
  client.print "Access-Control-Allow-Origin: *\r\n"
  client.print "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
  client.print "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
  client.print "Connection: close\r\n"
  client.print "\r\n"
  client.write body
end

server = TCPServer.new('127.0.0.1', PORT)
puts "BAKESHIFT Server running at http://localhost:#{PORT}/"
$stdout.flush

loop do
  Thread.start(server.accept) do |client|
    begin
      request_line = client.gets
      next unless request_line

      method, path, = request_line.split(' ')
      clean_path = URI.unescape(path.split('?').first)

      # Read Headers
      headers = {}
      while (line = client.gets) && (line != "\r\n") && (line != "\n")
        k, v = line.split(':', 2)
        headers[k.strip.downcase] = v.strip if k && v
      end

      # Read Body for POST
      content_length = headers['content-length'].to_i
      raw_body = content_length > 0 ? client.read(content_length) : ''

      # Handle CORS preflight
      if method == 'OPTIONS'
        client.print "HTTP/1.1 200 OK\r\n"
        client.print "Access-Control-Allow-Origin: *\r\n"
        client.print "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
        client.print "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
        client.print "Content-Length: 0\r\n"
        client.print "Connection: close\r\n\r\n"
        next
      end

      # ==========================================
      # 1. STRIPE CONFIG ENDPOINT (GET)
      # ==========================================
      if clean_path == '/api/stripe-config' && method == 'GET'
        pub_key = ENV['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'] || ENV['STRIPE_PUBLISHABLE_KEY'] || 'pk_test_sample_bakeshift'
        price_id = ENV['STRIPE_PRICE_ID'] || ''
        send_json(client, 200, 'OK', {
          publishableKey: pub_key,
          priceId: price_id,
          testMode: true,
          productName: 'BAKESHIFT Complete Baking System',
          unitPrice: 47.00,
          currency: 'usd'
        })
        next
      end

      # ==========================================
      # 2. CREATE CHECKOUT SESSION ENDPOINT (POST)
      # ==========================================
      if clean_path == '/api/create-checkout-session' && method == 'POST'
        req_data = JSON.parse(raw_body) rescue {}
        
        # Validate quantity strictly server-side
        quantity = req_data['quantity'].to_i
        quantity = 1 if quantity < 1
        quantity = 99 if quantity > 99

        # Security Check: Reject live keys immediately
        secret_key = (ENV['STRIPE_SECRET_KEY'] || '').strip
        if secret_key.start_with?('sk_live_')
          send_json(client, 403, 'Forbidden', {
            error: 'Live Stripe keys are strictly blocked. BAKESHIFT checkout runs exclusively in Sandbox / Test Mode.'
          })
          next
        end

        price_id = (ENV['STRIPE_PRICE_ID'] || '').strip
        origin = headers['origin'] || "http://localhost:#{PORT}"

        # If real sk_test_ key is configured, forward to Stripe API
        if secret_key.start_with?('sk_test_') && !secret_key.include?('placeholder')
          begin
            stripe_uri = URI('https://api.stripe.com/v1/checkout/sessions')
            http = Net::HTTP.new(stripe_uri.host, stripe_uri.port)
            http.use_ssl = true
            http.open_timeout = 5
            http.read_timeout = 5

            stripe_req = Net::HTTP::Post.new(stripe_uri)
            stripe_req['Authorization'] = "Bearer #{secret_key}"
            
            form_params = {
              'ui_mode' => 'embedded',
              'mode' => 'payment',
              'return_url' => "#{origin}/#checkout-preview?session_id={CHECKOUT_SESSION_ID}&status=success",
              'line_items[0][quantity]' => quantity.to_s
            }

            if !price_id.empty? && !price_id.include?('placeholder')
              form_params['line_items[0][price]'] = price_id
            else
              form_params['line_items[0][price_data][currency]'] = 'usd'
              form_params['line_items[0][price_data][unit_amount]'] = '4700' # $47.00 USD
              form_params['line_items[0][price_data][product_data][name]'] = 'BAKESHIFT Complete Baking System'
              form_params['line_items[0][price_data][product_data][description]'] = 'Modular aluminized-steel bakeware system'
            end

            stripe_req.set_form_data(form_params)
            stripe_res = http.request(stripe_req)
            stripe_json = JSON.parse(stripe_res.body) rescue {}

            if stripe_res.code.to_i == 200 && stripe_json['client_secret']
              send_json(client, 200, 'OK', {
                clientSecret: stripe_json['client_secret'],
                sessionId: stripe_json['id'],
                testMode: true,
                livemode: false,
                quantity: quantity,
                subtotal: (47.00 * quantity).round(2)
              })
              next
            else
              # If Stripe API returned error, fallback cleanly to sandbox simulation with message
              err_msg = stripe_json.dig('error', 'message') || "Stripe sandbox error (#{stripe_res.code})"
              send_json(client, 200, 'OK', {
                clientSecret: "cs_test_bakeshift_#{SecureRandom.hex(16)}",
                sessionId: "cs_test_#{SecureRandom.hex(12)}",
                sandboxDemo: true,
                testMode: true,
                warning: err_msg,
                quantity: quantity,
                unitPrice: 47.00,
                subtotal: (47.00 * quantity).round(2)
              })
              next
            end
          rescue => err
            # Network issue calling api.stripe.com -> fallback to sandbox simulation
            send_json(client, 200, 'OK', {
              clientSecret: "cs_test_bakeshift_#{SecureRandom.hex(16)}",
              sessionId: "cs_test_#{SecureRandom.hex(12)}",
              sandboxDemo: true,
              testMode: true,
              quantity: quantity,
              unitPrice: 47.00,
              subtotal: (47.00 * quantity).round(2),
              note: "Sandbox simulated session (Network: #{err.message})"
            })
            next
          end
        else
          # Standalone Sandbox Mode without external API dependency
          send_json(client, 200, 'OK', {
            clientSecret: "cs_test_bakeshift_#{SecureRandom.hex(16)}",
            sessionId: "cs_test_#{SecureRandom.hex(12)}",
            sandboxDemo: true,
            testMode: true,
            quantity: quantity,
            unitPrice: 47.00,
            subtotal: (47.00 * quantity).round(2),
            currency: 'usd',
            product: 'BAKESHIFT Complete Baking System'
          })
          next
        end
      end

      # ==========================================
      # 3. VERIFY TEST PAYMENT SIMULATION (POST)
      # ==========================================
      if clean_path == '/api/verify-test-payment' && method == 'POST'
        req_data = JSON.parse(raw_body) rescue {}
        card_num = (req_data['cardNumber'] || '').gsub(/\s+/, '')

        # Standard official Stripe test card behaviors
        if card_num.end_with?('0002')
          send_json(client, 400, 'Bad Request', {
            success: false,
            error: 'Your card was declined. (Stripe test code: card_declined)',
            code: 'card_declined'
          })
        elsif card_num.end_with?('0069')
          send_json(client, 400, 'Bad Request', {
            success: false,
            error: 'Your card has expired. (Stripe test code: expired_card)',
            code: 'expired_card'
          })
        elsif card_num.end_with?('0127')
          send_json(client, 400, 'Bad Request', {
            success: false,
            error: "Your card's security code is incorrect. (Stripe test code: incorrect_cvc)",
            code: 'incorrect_cvc'
          })
        else
          send_json(client, 200, 'OK', {
            success: true,
            status: 'succeeded',
            paymentIntent: "pi_test_#{SecureRandom.hex(12)}",
            testMode: true,
            message: 'Stripe Sandbox simulated payment succeeded. No real funds were charged.'
          })
        end
        next
      end

      # ==========================================
      # 4. STATIC FILE SERVING
      # ==========================================
      clean_path = '/index.html' if clean_path == '/'
      file_path = File.join(ROOT, clean_path)

      if File.exist?(file_path) && !File.directory?(file_path) && file_path.start_with?(ROOT)
        ext = File.extname(file_path).downcase
        content_type = MIME_TYPES[ext] || 'application/octet-stream'
        body = File.binread(file_path)

        client.print "HTTP/1.1 200 OK\r\n"
        client.print "Content-Type: #{content_type}\r\n"
        client.print "Content-Length: #{body.bytesize}\r\n"
        client.print "Access-Control-Allow-Origin: *\r\n"
        client.print "Connection: close\r\n"
        client.print "\r\n"
        client.write body
      else
        client.print "HTTP/1.1 404 Not Found\r\n"
        client.print "Content-Type: text/plain\r\n"
        client.print "Content-Length: 9\r\n"
        client.print "Connection: close\r\n"
        client.print "\r\n"
        client.print "Not Found"
      end
    rescue => e
      # Silently ignore broken pipes or aborted requests
    ensure
      client.close rescue nil
    end
  end
end
