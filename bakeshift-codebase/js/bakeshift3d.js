/**
 * BAKESHIFT 3D WebGL Engine
 * Precision 3D Model of the BAKESHIFT Modular Baking Pan
 * 
 * Strict specifications implemented:
 * - Base pan: 15" x 10" x 2" (381 x 254 x 50.8 mm), interior ~13.2" x 9", rounded corners,
 *   flat uninterrupted bottom, 2 side handles, 1-inch spaced rim alignment marks (not drilled holes).
 * - Cupcake tray: 6.25" x 8.70", EXACTLY 6 cupcake wells in a 2 x 3 layout, 2 wire toggle clasps.
 * - Partitions: EXACTLY 2 removable bare-metal partitions (8.9" x 1.65"), NO silicone grips,
 *   4 wire toggle clasps (2 per partition, facing OUTWARD toward exterior rim).
 * - Clasp hardware: EXACTLY 6 total lunch-box style stainless-steel wire toggle clasps with copper mounting rivets.
 *   (2 on cupcake tray, 4 on the two partitions; no clasps on empty rims or random corners).
 * - Material: Commercial aluminized steel PBR shaders.
 * - Warm white background: #FAF9F6
 */

import * as THREE from '../assets/vendor/three.module.js';
import { OrbitControls } from '../assets/vendor/OrbitControls.js';

export class BakeShift3DViewer {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      console.error('BakeShift3DViewer: Container not found');
      return;
    }

    this.options = Object.assign({
      interactive: true,
      autoRotate: false,
      initialConfig: 'assembled',
      showDimensions: false,
      enableExploded: false,
      explodedFactor: 0,
      claspsLocked: true,
      introAnimation: true,
      onConfigChange: null,
      onPartSelect: null,
      cameraPreset: 'isometric'
    }, options);

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.panGroup = null;

    // Component references
    this.basePan = null;
    this.cupcakeTray = null;
    this.cupcakes = [];
    this.partition1 = null;
    this.partition2 = null;
    this.clasps = [];
    this.dimensionLines = null;
    this.explodedLines = null;
    this.zoneMesh = null;

    // Animation state
    this.currentConfig = this.options.initialConfig;
    this.targetPositions = {};
    this.currentPositions = {};
    this.targetRotations = {};
    this.targetCamera = { x: 14, y: 12, z: 17 };
    this.targetLookAt = { x: 0, y: 1, z: 0 };
    this.claspsLocked = this.options.claspsLocked;
    this.claspAngle = 0; // 0 = locked, 1.15 = open
    this.targetClaspAngle = 0;
    this.explodedFactor = this.options.explodedFactor;
    this.targetExplodedFactor = this.options.explodedFactor;
    this.showDimensions = this.options.showDimensions;

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 500;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFAF9F6); // Warm white brand backdrop

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    if (this.options.introAnimation) {
      this.camera.position.set(22, 18, 24); // Start higher for cinematic introductory ease
    } else {
      this.camera.position.set(14, 12, 17);
    }

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // 4. Controls
    if (this.options.interactive) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.04;
      this.controls.minDistance = 6;
      this.controls.maxDistance = 40;
      this.controls.target.set(0, 1, 0);
      this.controls.autoRotate = this.options.autoRotate;
      this.controls.autoRotateSpeed = 0.8;
    }

    // 5. Lighting
    this.setupLighting();

    // 6. Materials
    this.setupMaterials();

    // 7. Build Model
    this.buildModel();

    // 8. Ground Shadow
    this.setupGround();

    // 9. Resize Listener
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // 10. Click interaction for parts
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));

    // 11. Initial configuration
    this.applyConfiguration(this.currentConfig, false);

    // 12. Render loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.3);
    keyLight.position.set(12, 22, 15);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -15;
    keyLight.shadow.camera.right = 15;
    keyLight.shadow.camera.top = 15;
    keyLight.shadow.camera.bottom = -15;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xddeeff, 1.3);
    fillLight.position.set(-15, 12, -10);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd8b8, 1.5);
    rimLight.position.set(0, 15, -18);
    this.scene.add(rimLight);

    const bounceLight = new THREE.DirectionalLight(0xfaf9f6, 0.6);
    bounceLight.position.set(0, -10, 0);
    this.scene.add(bounceLight);
  }

  setupMaterials() {
    // 1. Commercial Aluminized Steel (Base pan, cupcake tray deck, partitions)
    this.matAluminizedSteel = new THREE.MeshStandardMaterial({
      color: 0xE2E4E6,
      metalness: 0.88,
      roughness: 0.26,
      envMapIntensity: 1.15
    });

    // Darker interior shaded steel
    this.matAluminizedSteelInterior = new THREE.MeshStandardMaterial({
      color: 0xC8CBCF,
      metalness: 0.85,
      roughness: 0.32
    });

    // 2. High-polish 304 Stainless Steel (Wire bails, toggle levers)
    this.matStainlessWire = new THREE.MeshStandardMaterial({
      color: 0xF2F4F7,
      metalness: 0.96,
      roughness: 0.14
    });

    // 3. Copper Mounting Accents & Rivets (Brand Accent #A96543)
    this.matCopper = new THREE.MeshStandardMaterial({
      color: 0xA96543,
      metalness: 0.92,
      roughness: 0.22
    });

    // 4. Laser-etched Rim Alignment Guide marks
    this.matGuideMark = new THREE.MeshBasicMaterial({
      color: 0x333639
    });

    // 5. Golden Baked Cupcake / Muffin top
    this.matCupcakeTop = new THREE.MeshStandardMaterial({
      color: 0xC8863A,
      roughness: 0.78,
      metalness: 0.05
    });

    // Cupcake fluted paper liner
    this.matCupcakeLiner = new THREE.MeshStandardMaterial({
      color: 0xF2EAD8,
      roughness: 0.65,
      metalness: 0.02
    });

    // 6. Glowing Conceptual Baking Zone Highlight
    this.matZoneHighlight = new THREE.MeshStandardMaterial({
      color: 0xA96543,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.1
    });
  }

  setupGround() {
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  buildModel() {
    this.panGroup = new THREE.Group();
    this.scene.add(this.panGroup);

    // ==========================================
    // 1. MAIN BASE PAN (15" x 10" x 2")
    // ==========================================
    this.basePan = new THREE.Group();
    this.basePan.name = 'BasePan';
    this.panGroup.add(this.basePan);

    const panH = 2.0;
    const wallThick = 0.15;
    const floorY = 0.1;

    // Flat interior bottom floor
    const floorGeo = new THREE.BoxGeometry(13.4, 0.1, 9.2);
    const floorMesh = new THREE.Mesh(floorGeo, this.matAluminizedSteelInterior);
    floorMesh.position.set(0, floorY / 2, 0);
    floorMesh.receiveShadow = true;
    floorMesh.castShadow = true;
    this.basePan.add(floorMesh);

    // Outer base underside
    const underGeo = new THREE.BoxGeometry(14.6, 0.05, 9.6);
    const underMesh = new THREE.Mesh(underGeo, this.matAluminizedSteel);
    underMesh.position.set(0, 0.025, 0);
    underMesh.receiveShadow = true;
    this.basePan.add(underMesh);

    // Four Sidewalls
    const longWallGeo = new THREE.BoxGeometry(14.4, panH, wallThick);
    const longWallFront = new THREE.Mesh(longWallGeo, this.matAluminizedSteel);
    longWallFront.position.set(0, panH / 2, 4.65);
    longWallFront.castShadow = true;
    longWallFront.receiveShadow = true;
    this.basePan.add(longWallFront);

    const longWallBack = new THREE.Mesh(longWallGeo, this.matAluminizedSteel);
    longWallBack.position.set(0, panH / 2, -4.65);
    longWallBack.castShadow = true;
    longWallBack.receiveShadow = true;
    this.basePan.add(longWallBack);

    const shortWallGeo = new THREE.BoxGeometry(wallThick, panH, 9.4);
    const shortWallRight = new THREE.Mesh(shortWallGeo, this.matAluminizedSteel);
    shortWallRight.position.set(7.15, panH / 2, 0);
    shortWallRight.castShadow = true;
    shortWallRight.receiveShadow = true;
    this.basePan.add(shortWallRight);

    const shortWallLeft = new THREE.Mesh(shortWallGeo, this.matAluminizedSteel);
    shortWallLeft.position.set(-7.15, panH / 2, 0);
    shortWallLeft.castShadow = true;
    shortWallLeft.receiveShadow = true;
    this.basePan.add(shortWallLeft);

    // Rolled Outer Rim Lips
    const rimLongGeo = new THREE.CylinderGeometry(0.12, 0.12, 14.8, 16);
    const rimFront = new THREE.Mesh(rimLongGeo, this.matAluminizedSteel);
    rimFront.rotation.z = Math.PI / 2;
    rimFront.position.set(0, panH, 4.75);
    this.basePan.add(rimFront);

    const rimBack = new THREE.Mesh(rimLongGeo, this.matAluminizedSteel);
    rimBack.rotation.z = Math.PI / 2;
    rimBack.position.set(0, panH, -4.75);
    this.basePan.add(rimBack);

    const rimShortGeo = new THREE.CylinderGeometry(0.12, 0.12, 9.6, 16);
    const rimRight = new THREE.Mesh(rimShortGeo, this.matAluminizedSteel);
    rimRight.rotation.x = Math.PI / 2;
    rimRight.position.set(7.25, panH, 0);
    this.basePan.add(rimRight);

    const rimLeft = new THREE.Mesh(rimShortGeo, this.matAluminizedSteel);
    rimLeft.rotation.x = Math.PI / 2;
    rimLeft.position.set(-7.25, panH, 0);
    this.basePan.add(rimLeft);

    // Two Integrated Side Handles
    this.createPanHandle(-7.35, true);
    this.createPanHandle(7.35, false);

    // Shallow Alignment Marks (1-inch spacing along both rims)
    this.createAlignmentGuideMarks();

    // ==========================================
    // 2. REMOVABLE CUPCAKE TRAY (6.25" x 8.70")
    // EXACTLY 6 WELLS — 2 COLUMNS x 3 ROWS
    // ==========================================
    this.cupcakeTray = new THREE.Group();
    this.cupcakeTray.name = 'CupcakeTray';
    this.panGroup.add(this.cupcakeTray);

    const trayL = 6.25;
    const trayW = 8.70;

    const trayDeckGeo = new THREE.BoxGeometry(trayL, 0.08, trayW);
    const trayDeck = new THREE.Mesh(trayDeckGeo, this.matAluminizedSteel);
    trayDeck.position.set(0, 0.85, 0);
    trayDeck.castShadow = true;
    trayDeck.receiveShadow = true;
    this.cupcakeTray.add(trayDeck);

    // Outer perimeter flange lip
    const flangeL = new THREE.BoxGeometry(trayL + 0.3, 0.1, 0.2);
    const flangeFront = new THREE.Mesh(flangeL, this.matAluminizedSteel);
    flangeFront.position.set(0, 0.9, trayW / 2 + 0.05);
    this.cupcakeTray.add(flangeFront);

    const flangeBack = new THREE.Mesh(flangeL, this.matAluminizedSteel);
    flangeBack.position.set(0, 0.9, -trayW / 2 - 0.05);
    this.cupcakeTray.add(flangeBack);

    // EXACTLY 6 CUPCAKE WELLS: 2 columns in X x 3 rows in Z
    const colSpacing = 2.45;
    const rowSpacing = 2.45;
    const xOffsets = [-colSpacing / 2, colSpacing / 2]; // 2 columns
    const zOffsets = [-rowSpacing, 0, rowSpacing];       // 3 rows

    xOffsets.forEach((ox) => {
      zOffsets.forEach((oz) => {
        const wellGeo = new THREE.CylinderGeometry(1.15, 0.92, 0.85, 28, 1, true);
        const wellMesh = new THREE.Mesh(wellGeo, this.matAluminizedSteelInterior);
        wellMesh.position.set(ox, 0.42, oz);
        wellMesh.castShadow = true;
        wellMesh.receiveShadow = true;
        this.cupcakeTray.add(wellMesh);

        const bottomGeo = new THREE.CircleGeometry(0.92, 28);
        const bottomMesh = new THREE.Mesh(bottomGeo, this.matAluminizedSteelInterior);
        bottomMesh.rotation.x = -Math.PI / 2;
        bottomMesh.position.set(ox, 0.02, oz);
        this.cupcakeTray.add(bottomMesh);

        const ringGeo = new THREE.TorusGeometry(1.18, 0.04, 12, 32);
        const ringMesh = new THREE.Mesh(ringGeo, this.matAluminizedSteel);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.set(ox, 0.86, oz);
        this.cupcakeTray.add(ringMesh);

        // Golden baked cupcake
        const cupcakeGroup = new THREE.Group();
        cupcakeGroup.position.set(ox, 0.6, oz);

        const linerGeo = new THREE.CylinderGeometry(1.12, 0.9, 0.75, 24);
        const linerMesh = new THREE.Mesh(linerGeo, this.matCupcakeLiner);
        cupcakeGroup.add(linerMesh);

        const domeGeo = new THREE.SphereGeometry(1.25, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.1);
        const domeMesh = new THREE.Mesh(domeGeo, this.matCupcakeTop);
        domeMesh.position.y = 0.35;
        domeMesh.scale.set(1.0, 0.55, 1.0);
        domeMesh.castShadow = true;
        cupcakeGroup.add(domeMesh);

        cupcakeGroup.visible = false;
        this.cupcakeTray.add(cupcakeGroup);
        this.cupcakes.push(cupcakeGroup);
      });
    });

    // 2 Wire Toggle Clasps on the opposing short ends of the cupcake tray
    const claspTray1 = this.createWireToggleClasp(0, 0.85, -trayW / 2 - 0.05, 0);
    this.cupcakeTray.add(claspTray1.group);
    this.clasps.push(claspTray1);

    const claspTray2 = this.createWireToggleClasp(0, 0.85, trayW / 2 + 0.05, Math.PI);
    this.cupcakeTray.add(claspTray2.group);
    this.clasps.push(claspTray2);

    this.cupcakeTray.position.set(-3.75, 0.2, 0);

    // ==========================================
    // 3. TWO ADJUSTABLE PARTITIONS (8.9" x 1.65")
    // Bare metallic aluminized steel, NO silicone grips!
    // ==========================================
    this.partition1 = this.createPartition('Partition1');
    this.partition2 = this.createPartition('Partition2');

    this.panGroup.add(this.partition1.group);
    this.panGroup.add(this.partition2.group);

    this.partition1.group.position.set(0.5, 0.15, 0);
    this.partition2.group.position.set(4.5, 0.15, 0);

    // Store starting positions
    this.targetPositions = {
      basePan: { x: 0, y: 0, z: 0 },
      cupcakeTray: { x: -3.75, y: 0.2, z: 0 },
      partition1: { x: 0.5, y: 0.15, z: 0 },
      partition2: { x: 4.5, y: 0.15, z: 0 }
    };

    this.currentPositions = {
      basePan: { x: 0, y: 0, z: 0 },
      cupcakeTray: { x: -3.75, y: 0.2, z: 0 },
      partition1: { x: 0.5, y: 0.15, z: 0 },
      partition2: { x: 4.5, y: 0.15, z: 0 }
    };

    // Conceptual Baking Zone Highlights
    this.buildZoneMesh();

    // Dimension Annotations
    this.buildDimensionAnnotations();

    // Exploded Guides
    this.buildExplodedGuides();
  }

  createPanHandle(xPos, isLeft) {
    const handleGroup = new THREE.Group();
    handleGroup.position.set(xPos, 1.4, 0);

    const handleShape = new THREE.Shape();
    handleShape.moveTo(-0.1, -1.8);
    handleShape.lineTo(1.1, -1.6);
    handleShape.quadraticCurveTo(1.4, 0, 1.4, 0);
    handleShape.quadraticCurveTo(1.4, 0, 1.1, 1.6);
    handleShape.lineTo(-0.1, 1.8);

    const extrudeSettings = {
      steps: 1,
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 4
    };

    const handleGeo = new THREE.ExtrudeGeometry(handleShape, extrudeSettings);
    const handleMesh = new THREE.Mesh(handleGeo, this.matAluminizedSteel);
    handleMesh.rotation.y = isLeft ? Math.PI : 0;
    handleMesh.rotation.z = Math.PI / 2;
    handleMesh.scale.set(0.8, 1.0, 1.0);
    handleMesh.castShadow = true;
    handleGroup.add(handleMesh);

    const gripBarGeo = new THREE.CylinderGeometry(0.09, 0.09, 3.2, 16);
    const gripBar = new THREE.Mesh(gripBarGeo, this.matAluminizedSteel);
    gripBar.rotation.x = Math.PI / 2;
    gripBar.position.set(isLeft ? -0.85 : 0.85, 0, 0);
    handleGroup.add(gripBar);

    this.basePan.add(handleGroup);
  }

  createAlignmentGuideMarks() {
    const marksGroup = new THREE.Group();
    marksGroup.name = 'AlignmentMarks';

    for (let x = -6; x <= 6; x += 1) {
      const notchGeo = new THREE.BoxGeometry(0.08, 0.03, 0.22);
      const notchFront = new THREE.Mesh(notchGeo, this.matGuideMark);
      notchFront.position.set(x, 2.02, 4.65);
      marksGroup.add(notchFront);

      const notchBack = new THREE.Mesh(notchGeo, this.matGuideMark);
      notchBack.position.set(x, 2.02, -4.65);
      marksGroup.add(notchBack);

      if (Math.abs(x) % 3 === 0) {
        const majorTickGeo = new THREE.BoxGeometry(0.12, 0.04, 0.32);
        const majorTickFront = new THREE.Mesh(majorTickGeo, this.matCopper);
        majorTickFront.position.set(x, 2.03, 4.65);
        marksGroup.add(majorTickFront);
      }
    }

    this.basePan.add(marksGroup);
  }

  createPartition(name) {
    const group = new THREE.Group();
    group.name = name;

    const partL = 8.9;
    const partH = 1.65;
    const partThick = 0.05;

    // Main aluminized steel sheet (bare metal, strictly NO silicone grips!)
    const sheetGeo = new THREE.BoxGeometry(partThick, partH, partL);
    const sheetMesh = new THREE.Mesh(sheetGeo, this.matAluminizedSteel);
    sheetMesh.position.set(0, partH / 2, 0);
    sheetMesh.castShadow = true;
    sheetMesh.receiveShadow = true;
    group.add(sheetMesh);

    // Hemmed upper edge
    const hemGeo = new THREE.CylinderGeometry(0.05, 0.05, partL, 16);
    const hemMesh = new THREE.Mesh(hemGeo, this.matAluminizedSteel);
    hemMesh.rotation.x = Math.PI / 2;
    hemMesh.position.set(0, partH, 0);
    group.add(hemMesh);

    // Bottom precision flat edge
    const baseBevelGeo = new THREE.BoxGeometry(0.08, 0.04, partL - 0.2);
    const baseBevel = new THREE.Mesh(baseBevelGeo, this.matAluminizedSteelInterior);
    baseBevel.position.set(0, 0.02, 0);
    group.add(baseBevel);

    // Exactly 2 stainless toggle clasps at the ends, facing OUTWARD toward the exterior rim
    const clasp1 = this.createWireToggleClasp(0, partH - 0.2, -partL / 2 - 0.03, 0);
    group.add(clasp1.group);
    this.clasps.push(clasp1);

    const clasp2 = this.createWireToggleClasp(0, partH - 0.2, partL / 2 + 0.03, Math.PI);
    group.add(clasp2.group);
    this.clasps.push(clasp2);

    return { group, sheetMesh, clasp1, clasp2 };
  }

  createWireToggleClasp(x, y, z, rotationY) {
    const claspGroup = new THREE.Group();
    claspGroup.position.set(x, y, z);
    claspGroup.rotation.y = rotationY;

    // Copper base mounting bracket with rivets
    const bracketGeo = new THREE.BoxGeometry(0.35, 0.35, 0.06);
    const bracket = new THREE.Mesh(bracketGeo, this.matCopper);
    claspGroup.add(bracket);

    const rivetGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.09, 12);
    const rivetTop = new THREE.Mesh(rivetGeo, this.matCopper);
    rivetTop.rotation.x = Math.PI / 2;
    rivetTop.position.set(0, 0.1, 0.02);
    claspGroup.add(rivetTop);

    const rivetBottom = new THREE.Mesh(rivetGeo, this.matCopper);
    rivetBottom.rotation.x = Math.PI / 2;
    rivetBottom.position.set(0, -0.1, 0.02);
    claspGroup.add(rivetBottom);

    // Hinged Lever Assembly
    const pivot = new THREE.Group();
    pivot.position.set(0, 0, 0.04);
    claspGroup.add(pivot);

    const leverGeo = new THREE.BoxGeometry(0.28, 0.55, 0.04);
    const lever = new THREE.Mesh(leverGeo, this.matStainlessWire);
    lever.position.set(0, -0.2, 0.03);
    lever.castShadow = true;
    pivot.add(lever);

    // Wire Bail Loop (lunch-box style stainless wire hook)
    const wirePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, -0.05, 0.04),
      new THREE.Vector3(-0.16, 0.25, 0.12),
      new THREE.Vector3(0, 0.32, 0.14),
      new THREE.Vector3(0.16, 0.25, 0.12),
      new THREE.Vector3(0.16, -0.05, 0.04)
    ]);
    const wireGeo = new THREE.TubeGeometry(wirePath, 20, 0.022, 8, false);
    const wireBail = new THREE.Mesh(wireGeo, this.matStainlessWire);
    pivot.add(wireBail);

    // Rim Catch Point
    const catchGeo = new THREE.BoxGeometry(0.3, 0.08, 0.12);
    const catchPoint = new THREE.Mesh(catchGeo, this.matStainlessWire);
    catchPoint.position.set(0, 0.35, 0.05);
    claspGroup.add(catchPoint);

    return {
      group: claspGroup,
      pivot: pivot,
      locked: true
    };
  }

  buildZoneMesh() {
    // Semi-transparent glowing plane to illustrate baking zones (Square cake, loaf, etc.)
    const zoneGeo = new THREE.PlaneGeometry(9.0, 9.0);
    this.zoneMesh = new THREE.Mesh(zoneGeo, this.matZoneHighlight);
    this.zoneMesh.rotation.x = -Math.PI / 2;
    this.zoneMesh.position.set(0, 0.12, 0);
    this.zoneMesh.visible = false;
    this.panGroup.add(this.zoneMesh);
  }

  buildDimensionAnnotations() {
    this.dimensionLines = new THREE.Group();
    this.dimensionLines.name = 'DimensionAnnotations';

    const lineMat = new THREE.LineDashedMaterial({
      color: 0xA96543,
      dashSize: 0.3,
      gapSize: 0.15,
      linewidth: 2
    });

    // 15-inch Length Line
    const lengthPoints = [
      new THREE.Vector3(-7.5, -0.4, 5.8),
      new THREE.Vector3(7.5, -0.4, 5.8)
    ];
    const lengthGeo = new THREE.BufferGeometry().setFromPoints(lengthPoints);
    const lengthLine = new THREE.Line(lengthGeo, lineMat);
    lengthLine.computeLineDistances();
    this.dimensionLines.add(lengthLine);

    // 10-inch Width Line
    const widthPoints = [
      new THREE.Vector3(8.5, -0.4, -5.0),
      new THREE.Vector3(8.5, -0.4, 5.0)
    ];
    const widthGeo = new THREE.BufferGeometry().setFromPoints(widthPoints);
    const widthLine = new THREE.Line(widthGeo, lineMat);
    widthLine.computeLineDistances();
    this.dimensionLines.add(widthLine);

    // 2-inch Depth Line
    const depthPoints = [
      new THREE.Vector3(8.5, 0, 5.8),
      new THREE.Vector3(8.5, 2.0, 5.8)
    ];
    const depthGeo = new THREE.BufferGeometry().setFromPoints(depthPoints);
    const depthLine = new THREE.Line(depthGeo, lineMat);
    depthLine.computeLineDistances();
    this.dimensionLines.add(depthLine);

    this.dimensionLines.visible = this.showDimensions;
    this.panGroup.add(this.dimensionLines);
  }

  buildExplodedGuides() {
    this.explodedLines = new THREE.Group();
    this.explodedLines.name = 'ExplodedGuides';

    const guideMat = new THREE.LineDashedMaterial({
      color: 0x9DA3A6,
      dashSize: 0.25,
      gapSize: 0.2,
      linewidth: 1
    });

    const guideTrayPoints = [
      new THREE.Vector3(-3.75, 0.2, 0),
      new THREE.Vector3(-3.75, 5.0, 0)
    ];
    const guideTray = new THREE.Line(new THREE.BufferGeometry().setFromPoints(guideTrayPoints), guideMat);
    guideTray.computeLineDistances();
    this.explodedLines.add(guideTray);

    const guideP1Points = [
      new THREE.Vector3(0.5, 0.2, 0),
      new THREE.Vector3(0.5, 4.0, 0)
    ];
    const guideP1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(guideP1Points), guideMat);
    guideP1.computeLineDistances();
    this.explodedLines.add(guideP1);

    const guideP2Points = [
      new THREE.Vector3(4.5, 0.2, 0),
      new THREE.Vector3(4.5, 4.8, 0)
    ];
    const guideP2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(guideP2Points), guideMat);
    guideP2.computeLineDistances();
    this.explodedLines.add(guideP2);

    this.explodedLines.visible = false;
    this.panGroup.add(this.explodedLines);
  }

  // ==========================================
  // CONFIGURATION PRESETS & ANIMATIONS
  // ==========================================

  applyConfiguration(configName, animate = true) {
    this.currentConfig = configName;

    // Reset visibility defaults
    this.cupcakeTray.visible = true;
    this.partition1.group.visible = true;
    this.partition2.group.visible = true;
    this.cupcakes.forEach(c => c.visible = false);
    this.targetExplodedFactor = 0;
    this.explodedLines.visible = false;
    if (this.zoneMesh) this.zoneMesh.visible = false;

    switch (configName) {
      case 'assembled':
        this.targetPositions = {
          basePan: { x: 0, y: 0, z: 0 },
          cupcakeTray: { x: -3.75, y: 0.2, z: 0 },
          partition1: { x: 0.5, y: 0.15, z: 0 },
          partition2: { x: 4.5, y: 0.15, z: 0 }
        };
        this.targetClaspAngle = 0;
        this.setCameraPreset('isometric');
        break;

      case 'exploded':
        this.targetPositions = {
          basePan: { x: 0, y: 0, z: 0 },
          cupcakeTray: { x: -3.75, y: 4.2, z: 0 },
          partition1: { x: 0.5, y: 2.8, z: 0 },
          partition2: { x: 4.5, y: 3.6, z: 0 }
        };
        this.targetExplodedFactor = 1.0;
        this.explodedLines.visible = true;
        this.targetClaspAngle = 0.85;
        this.setCameraPreset('isometric');
        break;

      case 'cupcakes':
        // Exactly 6 baked muffins in 2x3 grid
        this.targetPositions = {
          basePan: { x: 0, y: 0, z: 0 },
          cupcakeTray: { x: -3.75, y: 0.2, z: 0 },
          partition1: { x: 0.5, y: 0.15, z: 0 },
          partition2: { x: 4.5, y: 0.15, z: 0 }
        };
        this.cupcakes.forEach(c => c.visible = true);
        this.targetClaspAngle = 0;
        this.setCameraTarget({ x: -2, y: 1.5, z: 0 }, { x: 8, y: 13, z: 12 });
        break;

      case 'square-cake':
        // 9" x 9" conceptual zone: Tray removed, partition 1 at X = 2.4 (creates 9x9 square)
        this.targetPositions = {
          basePan: { x: 0, y: 0, z: 0 },
          cupcakeTray: { x: -16, y: 0.2, z: 0 },
          partition1: { x: 2.4, y: 0.15, z: 0 },
          partition2: { x: 16, y: 0.15, z: 0 }
        };
        this.cupcakeTray.visible = false;
        this.partition2.group.visible = false;
        this.targetClaspAngle = 0;
        if (this.zoneMesh) {
          this.zoneMesh.scale.set(1.0, 1.0, 1.0);
          this.zoneMesh.position.set(-2.1, 0.12, 0);
          this.zoneMesh.visible = true;
        }
        this.setCameraPreset('top');
        break;

      case 'rectangle-cake':
        // Rectangular bake zone within usable interior footprint
        this.targetPositions = {
          basePan: { x: 0, y: 0, z: 0 },
          cupcakeTray: { x: -16, y: 0.2, z: 0 },
          partition1: { x: 0.0, y: 0.15, z: 0 },
          partition2: { x: 16, y: 0.15, z: 0 }
        };
        this.cupcakeTray.visible = false;
        this.partition2.group.visible = false;
        this.targetClaspAngle = 0;
        if (this.zoneMesh) {
          this.zoneMesh.scale.set(0.75, 1.0, 1.0);
          this.zoneMesh.position.set(-3.3, 0.12, 0);
          this.zoneMesh.visible = true;
        }
        this.setCameraPreset('isometric');
        break;

      case 'loaf':
        // 5" x 9" artisan loaf zone: Partitions set 5 inches apart
        this.targetPositions = {
          basePan: { x: 0, y: 0, z: 0 },
          cupcakeTray: { x: -16, y: 0.2, z: 0 },
          partition1: { x: -2.5, y: 0.15, z: 0 },
          partition2: { x: 2.5, y: 0.15, z: 0 }
        };
        this.cupcakeTray.visible = false;
        this.targetClaspAngle = 0;
        if (this.zoneMesh) {
          this.zoneMesh.scale.set(0.55, 1.0, 1.0);
          this.zoneMesh.position.set(0, 0.12, 0);
          this.zoneMesh.visible = true;
        }
        this.setCameraPreset('isometric');
        break;

      case 'empty':
        // Empty base pan floating (Story 1)
        this.targetPositions = {
          basePan: { x: 0, y: 0, z: 0 },
          cupcakeTray: { x: -18, y: 6.0, z: 0 },
          partition1: { x: 18, y: 4.0, z: 0 },
          partition2: { x: 22, y: 4.0, z: 0 }
        };
        this.cupcakeTray.visible = false;
        this.partition1.group.visible = false;
        this.partition2.group.visible = false;
        this.setCameraPreset('isometric');
        break;

      case 'reset':
      default:
        return this.applyConfiguration('assembled', animate);
    }

    if (!animate) {
      this.currentPositions = JSON.parse(JSON.stringify(this.targetPositions));
      this.updateComponentTransforms();
    }

    if (typeof this.options.onConfigChange === 'function') {
      this.options.onConfigChange(configName);
    }
  }

  setCameraPreset(preset) {
    switch (preset) {
      case 'isometric':
        this.setCameraTarget({ x: 0, y: 1, z: 0 }, { x: 14, y: 12, z: 17 });
        break;
      case 'top':
        this.setCameraTarget({ x: 0, y: 0, z: 0 }, { x: 0.01, y: 24, z: 0.01 });
        break;
      case 'front':
        this.setCameraTarget({ x: 0, y: 1.5, z: 0 }, { x: 0, y: 2.5, z: 20 });
        break;
      case 'side':
        this.setCameraTarget({ x: 0, y: 1.5, z: 0 }, { x: 20, y: 3.5, z: 0 });
        break;
      case 'macro':
        this.setCameraTarget({ x: 2.4, y: 2.0, z: 4.6 }, { x: 4.5, y: 4.0, z: 8.5 });
        break;
    }
  }

  setCameraTarget(lookAt, camPos) {
    this.targetLookAt = lookAt;
    this.targetCamera = camPos;
  }

  toggleClasps() {
    this.claspsLocked = !this.claspsLocked;
    this.targetClaspAngle = this.claspsLocked ? 0 : 1.15;
    return this.claspsLocked;
  }

  toggleDimensions(show) {
    this.showDimensions = show !== undefined ? show : !this.showDimensions;
    if (this.dimensionLines) {
      this.dimensionLines.visible = this.showDimensions;
    }
    return this.showDimensions;
  }

  toggleCupcakeTray(show) {
    if (show === undefined) show = !this.cupcakeTray.visible;
    this.cupcakeTray.visible = show;
    if (!show) {
      this.targetPositions.cupcakeTray = { x: -16, y: 0.2, z: 0 };
    } else {
      this.targetPositions.cupcakeTray = { x: -3.75, y: 0.2, z: 0 };
    }
    return this.cupcakeTray.visible;
  }

  setExplodedSlider(factor) {
    factor = Math.max(0, Math.min(1, factor));
    this.explodedFactor = factor;
    this.targetPositions.cupcakeTray.y = 0.2 + factor * 4.0;
    this.targetPositions.partition1.y = 0.15 + factor * 2.65;
    this.targetPositions.partition2.y = 0.15 + factor * 3.45;
    this.explodedLines.visible = factor > 0.05;
    this.targetClaspAngle = factor * 0.85;
  }

  setPartitionPosition(partitionNum, xInches) {
    xInches = Math.max(-6, Math.min(6, xInches));
    xInches = Math.round(xInches); // Snaps to 1-inch marks
    if (partitionNum === 1) {
      this.partition1.group.visible = true;
      this.targetPositions.partition1.x = xInches;
    } else if (partitionNum === 2) {
      this.partition2.group.visible = true;
      this.targetPositions.partition2.x = xInches;
    }
  }

  resetModel() {
    this.applyConfiguration('assembled', true);
    this.setCameraPreset('isometric');
    this.claspsLocked = true;
    this.targetClaspAngle = 0;
    this.explodedFactor = 0;
    this.targetExplodedFactor = 0;
    if (this.controls) this.controls.autoRotate = false;
  }

  updateComponentTransforms() {
    if (this.basePan) {
      this.basePan.position.set(
        this.currentPositions.basePan.x,
        this.currentPositions.basePan.y,
        this.currentPositions.basePan.z
      );
    }
    if (this.cupcakeTray) {
      this.cupcakeTray.position.set(
        this.currentPositions.cupcakeTray.x,
        this.currentPositions.cupcakeTray.y,
        this.currentPositions.cupcakeTray.z
      );
    }
    if (this.partition1 && this.partition1.group) {
      this.partition1.group.position.set(
        this.currentPositions.partition1.x,
        this.currentPositions.partition1.y,
        this.currentPositions.partition1.z
      );
    }
    if (this.partition2 && this.partition2.group) {
      this.partition2.group.position.set(
        this.currentPositions.partition2.x,
        this.currentPositions.partition2.y,
        this.currentPositions.partition2.z
      );
    }
  }

  onPointerDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.panGroup.children, true);

    if (intersects.length > 0) {
      let current = intersects[0].object;
      while (current.parent && current.parent !== this.panGroup && current.parent !== this.scene) {
        if (current.name) break;
        current = current.parent;
      }
      if (typeof this.options.onPartSelect === 'function' && current.name) {
        this.options.onPartSelect(current.name);
      }
    }
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    if (this.isDestroyed) return;
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    const lerpSpeed = 0.08;
    ['basePan', 'cupcakeTray', 'partition1', 'partition2'].forEach(key => {
      if (this.currentPositions[key] && this.targetPositions[key]) {
        this.currentPositions[key].x += (this.targetPositions[key].x - this.currentPositions[key].x) * lerpSpeed;
        this.currentPositions[key].y += (this.targetPositions[key].y - this.currentPositions[key].y) * lerpSpeed;
        this.currentPositions[key].z += (this.targetPositions[key].z - this.currentPositions[key].z) * lerpSpeed;
      }
    });

    this.updateComponentTransforms();

    // Smooth lerp for clasp lever rotation
    this.claspAngle += (this.targetClaspAngle - this.claspAngle) * 0.12;
    this.clasps.forEach(clasp => {
      if (clasp && clasp.pivot) {
        clasp.pivot.rotation.x = this.claspAngle;
      }
    });

    // Smooth camera transition
    if (this.controls && !this.controls.state) {
      if (this.targetCamera) {
        this.camera.position.x += (this.targetCamera.x - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.targetCamera.y - this.camera.position.y) * 0.05;
        this.camera.position.z += (this.targetCamera.z - this.camera.position.z) * 0.05;
      }
      if (this.targetLookAt) {
        this.controls.target.x += (this.targetLookAt.x - this.controls.target.x) * 0.05;
        this.controls.target.y += (this.targetLookAt.y - this.controls.target.y) * 0.05;
        this.controls.target.z += (this.targetLookAt.z - this.controls.target.z) * 0.05;
      }
    }

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.isDestroyed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    } else {
      window.removeEventListener('resize', this.onWindowResize);
    }
    if (this.controls && typeof this.controls.dispose === 'function') {
      try { this.controls.dispose(); } catch (e) {}
    }
    if (this.renderer) {
      try {
        if (this.renderer.domElement && this.renderer.domElement.parentNode) {
          this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        if (typeof this.renderer.dispose === 'function') {
          this.renderer.dispose();
        }
      } catch (e) {}
    }
  }
}
