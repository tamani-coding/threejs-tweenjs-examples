import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

// CAMERA
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
camera.position.set(-35, 70, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// RENDERER
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// WINDOW RESIZE HANDLING
export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// SCENE
const scene: THREE.Scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfd1e5);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);


export function animate() {
  TWEEN.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// ambient light
let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
scene.add(hemiLight);

//Add directional light
let dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-30, 50, -30);
scene.add(dirLight);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.top = 70;
dirLight.shadow.camera.bottom = -70;

function createFloor() {
  let pos = { x: 0, y: -1, z: 3 };
  let scale = { x: 100, y: 2, z: 100 };

  let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(),
       new THREE.MeshPhongMaterial({ color: 0x139436 }));
  blockPlane.position.set(pos.x, pos.y, pos.z);
  blockPlane.scale.set(scale.x, scale.y, scale.z);
  blockPlane.castShadow = true;
  blockPlane.receiveShadow = true;
  scene.add(blockPlane);
}

// box
function createBox() {
  let box = new THREE.Mesh(new THREE.BoxBufferGeometry(), 
      new THREE.MeshPhongMaterial({ color: 0xDC143C }));
  box.position.set(0, 6, 0)
  box.scale.set(6, 6, 6);
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box)

  var start =     { x: 3, y: 3, z: 3};
  var target1 =  { x: 6, y: 6, z: 6};
  var target2 =  { x: 3, y: 3, z: 3};
  var tween1 = new TWEEN.Tween(start).to(target1, 2000).easing(TWEEN.Easing.Elastic.InOut)
  var tween2 = new TWEEN.Tween(start).to(target2, 2000).easing(TWEEN.Easing.Elastic.InOut).chain(tween1)
  tween1.chain(tween2)
  tween1.start()

  tween1.onUpdate(function(){
    box.scale.x = start.x;
    box.scale.y = start.y;
    box.scale.z = start.z;
  });
  tween2.onUpdate(function(){
    box.scale.x = start.x;
    box.scale.y = start.y;
    box.scale.z = start.z;
  });
}

function createSphere() {
  let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(4, 32, 32), 
      new THREE.MeshPhongMaterial({ color: 0x43a1f4 }))
  sphere.position.set(0, 5, -15)
  sphere.castShadow = true
  sphere.receiveShadow = true
  scene.add(sphere)

  var start =  { x: 0, y: 5, z: -15};
  var target1 =  { x: 10, y: 15, z: -15};
  var target2 =  { x: 0, y: 25, z: -15};
  var target3 =  { x: -10, y: 15, z: -15};
  var target4 =  { x: 0, y: 5, z: -15};

  const updateFunc = function (object: {
    x: number;
    y: number;
    z: number;
  }, elapsed: number) {
    sphere.position.x = object.x;
    sphere.position.y = object.y;
    sphere.position.z = object.z;
  }

  var tween1 = new TWEEN.Tween(start).to(target1, 2000).easing(TWEEN.Easing.Elastic.InOut)
  var tween2 = new TWEEN.Tween(start).to(target2, 2000).easing(TWEEN.Easing.Exponential.InOut)
  var tween3 = new TWEEN.Tween(start).to(target3, 2000).easing(TWEEN.Easing.Bounce.InOut)
  var tween4 = new TWEEN.Tween(start).to(target4, 2000).easing(TWEEN.Easing.Quadratic.InOut)

  tween1.chain(tween2).start()
  tween2.chain(tween3)
  tween3.chain(tween4)
  tween4.chain(tween1)

  tween1.onUpdate(updateFunc)
  tween2.onUpdate(updateFunc)
  tween3.onUpdate(updateFunc)
  tween4.onUpdate(updateFunc)
}

function createSwordMan() {
  new MTLLoader().load('./chr_sword.mtl', function (materials) {
      materials.preload();
      new OBJLoader().setMaterials(materials).loadAsync('./chr_sword.obj').then((group) => {
        const swordMan = group.children[0];

        swordMan.position.x = -15
        swordMan.position.z = -15

        swordMan.scale.x = 7;
        swordMan.scale.y = 7;
        swordMan.scale.z = 7;

        swordMan.castShadow = true
        swordMan.receiveShadow = true

        const start = { x: -15, z: -15 }
        const moveto1 = { x: -15, z: 15 }
        const moveto2 = { x: -35, z: 15 }
        const moveto3 = { x: -35, z: -15 }
        const moveto4 = { x: -15, z: -15 }

        const rotStart = { rotY: 0}
        const rotto1 = { rotY: - Math.PI / 2}
        const rotto2 = { rotY: - Math.PI }
        const rotto3 = { rotY: - Math.PI * (3 / 2) }
        const rotto4 = { rotY: - Math.PI  * 2 }

        var tweenRot1 = new TWEEN.Tween(rotStart).to(rotto1, 400)
        var tweenRot2 = new TWEEN.Tween(rotStart).to(rotto2, 400)
        var tweenRot3 = new TWEEN.Tween(rotStart).to(rotto3, 400)
        var tweenRot4 = new TWEEN.Tween(rotStart).to(rotto4, 400)

        var tweenMove1 = new TWEEN.Tween(start).to(moveto1, 2000)
        var tweenMove2 = new TWEEN.Tween(start).to(moveto2, 2000)
        var tweenMove3 = new TWEEN.Tween(start).to(moveto3, 2000)
        var tweenMove4 = new TWEEN.Tween(start).to(moveto4, 2000)

        tweenMove1.chain(tweenRot1)
        tweenRot1.chain(tweenMove2)
        tweenMove2.chain(tweenRot2)
        tweenRot2.chain(tweenMove3)
        tweenMove3.chain(tweenRot3)
        tweenRot3.chain(tweenMove4)
        tweenMove4.chain(tweenRot4)
        tweenRot4.chain(tweenMove1)

        const updatePos = function (object: {
          x: number;
          z: number;
        }, elapsed: number) {
          swordMan.position.x = object.x;
          swordMan.position.z = object.z;
        }
        tweenMove1.onUpdate(updatePos)
        tweenMove2.onUpdate(updatePos)
        tweenMove3.onUpdate(updatePos)
        tweenMove4.onUpdate(updatePos)

        const updateRot = function (object: {
          rotY: number;
        }, elapsed: number) {
          swordMan.rotation.y = object.rotY;
        }
        tweenRot1.onUpdate(updateRot)
        tweenRot2.onUpdate(updateRot)
        tweenRot3.onUpdate(updateRot)
        tweenRot4.onUpdate(updateRot)

        tweenMove1.start()

        scene.add(swordMan)
      })
    });
}

createFloor()
createBox()
createSphere()
createSwordMan()

animate()
