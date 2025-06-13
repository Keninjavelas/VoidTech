// ==========================
// THREE.JS CORE SETUP
// ==========================

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a2a, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('product-viewer').appendChild(renderer.domElement);

// ==========================
// LIGHTING SETUP
// ==========================

scene.add(new THREE.DirectionalLight(0xffffff, 2).position.set(5, 10, 7));
scene.add(new THREE.AmbientLight(0x404040, 3));
scene.add(new THREE.DirectionalLight(0x00ffff, 0.5).position.set(-5, -3, -5));
scene.add(new THREE.HemisphereLight(0xff00ff, 0x00ff00, 0.3));

// ==========================
// MODEL + BACKDROP LOADING
// ==========================

let model;
const loader = new THREE.GLTFLoader();
const modelFiles = [
  'assets/models/product.glb',
  'assets/models/hut.glb',
  'assets/models/variant2.glb'
];
let currentModelIndex = 0;

function loadModel(index) {
  if (model) scene.remove(model);
  loader.load(modelFiles[index], (gltf) => {
    model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);
  }, undefined, (err) => {
    console.error("Model load error:", err);
  });
}

const backgrounds = [
  'assets/textures/envmap4.jpg',
  'assets/textures/envmap3.jpg',
  'assets/textures/envmap2.jpg',
  'assets/textures/envmap1.jpg',
  'assets/textures/envmap.jpg'
];
let currentBgIndex = 0;

function loadBackground(index) {
  new THREE.TextureLoader().load(backgrounds[index], (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
  }, undefined, (err) => {
    console.error("Background load error:", err);
  });
}

// ==========================
// INTERACTIONS
// ==========================

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
const modelRotationSpeed = 0.5;

renderer.domElement.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => isDragging = false);

window.addEventListener('mousemove', (e) => {
  if (!isDragging || !model) return;
  const delta = {
    x: e.clientX - previousMousePosition.x,
    y: e.clientY - previousMousePosition.y
  };
  model.rotation.y += delta.x * 0.01 * modelRotationSpeed;
  model.rotation.x += delta.y * 0.01 * modelRotationSpeed;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

// ==========================
// ZOOM CONTROL
// ==========================

const minZoom = 2;
const maxZoom = 20;
const zoomSpeed = 0.5;

renderer.domElement.addEventListener('wheel', (event) => {
  event.preventDefault();
  const delta = Math.sign(event.deltaY);
  let newZ = camera.position.z + delta * zoomSpeed;
  camera.position.z = Math.min(Math.max(newZ, minZoom), maxZoom);
});


let isRotating = false;

function animate() {
  requestAnimationFrame(animate);

  // Apply smooth auto-rotation if enabled
  if (model && isRotating && !isDragging) {
    model.rotation.y += 0.003;
  }

  // If glitch is active, apply jitter to camera
  if (glitchOverlay?.classList.contains('glitch-active')) {
    const shakeIntensity = 0.05;
    camera.position.x += (Math.random() - 0.5) * shakeIntensity;
    camera.position.y += (Math.random() - 0.5) * shakeIntensity;
    camera.rotation.z += (Math.random() - 0.5) * 0.002;
  }

  // Render the scene
  renderer.render(scene, camera);
}
// ==========================
// RESIZE HANDLER
// ==========================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================
// UI BUTTON BINDING
// ==========================

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('toggle-rotation')?.addEventListener('click', () => {
    isRotating = !isRotating;
  });

  document.getElementById('model-prev')?.addEventListener('click', () => {
    currentModelIndex = (currentModelIndex - 1 + modelFiles.length) % modelFiles.length;
    loadModel(currentModelIndex);
  });
  document.getElementById('model-next')?.addEventListener('click', () => {
    currentModelIndex = (currentModelIndex + 1) % modelFiles.length;
    loadModel(currentModelIndex);
  });

  document.getElementById('bg-prev')?.addEventListener('click', () => {
    currentBgIndex = (currentBgIndex - 1 + backgrounds.length) % backgrounds.length;
    loadBackground(currentBgIndex);
  });
  document.getElementById('bg-next')?.addEventListener('click', () => {
    currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
    loadBackground(currentBgIndex);
  });

  loadModel(currentModelIndex);
  loadBackground(currentBgIndex);
  animate();
});

// ======================
// AGGRESSIVE GLITCH TRIGGER
// ======================

const glitchOverlay = document.getElementById('glitchOverlay');

function triggerGlitch() {
  if (!glitchOverlay) return;

  // Activate
  glitchOverlay.classList.add('glitch-active');

  // Short burst glitch, remove class after a few frames
  setTimeout(() => {
    glitchOverlay.classList.remove('glitch-active');
  }, 200 + Math.random() * 200); // Duration: 200–400ms

  // Schedule next glitch randomly
  const nextGlitch = Math.random() * 5000 + 2000; // Every 2–7s
  setTimeout(triggerGlitch, nextGlitch);
}

// Kick off glitching after load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(triggerGlitch, 1000); // Initial delay
});

