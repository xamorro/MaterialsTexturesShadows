import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import "./style.css"

// Declaració d'elements principals
//Loader de models GLTF
let loader = null
//Loader de textures
let textureLoader = null
const rotationSpeed = 0.0001
let scene = null
let camera = null
let renderer = null
// array d’objectes dels quals hem d’actualitzar la rotació.
const objects = [];

setupScene()

const albedoFabric = "textures/fabric/textures/fabric_pattern_07_col_1_1k.jpg"
const normalFabric = "textures/fabric/textures/fabric_pattern_07_nor_gl_1k.jpg"
const roughFabric = "textures/fabric/textures/fabric_pattern_07_rough_1k.jpg"

const albedoMud = "textures/mud/textures/brown_mud_leaves_01_diff_1k.jpg"
const normalMud = "textures/mud/textures/brown_mud_leaves_01_nor_gl_1k.jpg"
const roughMud = "textures/mud/textures/brown_mud_leaves_01_rough_1k.jpg"

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const albedoTexture = textureLoader.load(albedoMud)
const normalTexture = textureLoader.load(normalMud)
//const roughTexture = textureLoader.load(roughMud)

const cubMat = new THREE.MeshStandardMaterial({
  //color: 0xff0000
  map: albedoTexture,
  normalMap: normalTexture
  //roughnessMap: roughTexture
})
const cubito = new THREE.Mesh(cubeGeometry, cubMat)
cubito.castShadow = true
scene.add(cubito)
objects.push(cubito)

////////ENTORN/////////////////
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
  'textures/environmentMaps/foravila/px.png',
  'textures/environmentMaps/foravila/nx.png',
  'textures/environmentMaps/foravila/py.png',
  'textures/environmentMaps/foravila/ny.png',
  'textures/environmentMaps/foravila/pz.png',
  'textures/environmentMaps/foravila/nz.png'
])

scene.background = environmentMap

// ////////////////////////////////////////////////
// // assync loading de texture i generació del cub
// ///////////////////////////////////////////////
// textureLoader.load(
//   // resource URL
//   mudTexturePath,

//   // onLoad callback
//   function (texture) {


//     // in this example we create the material when the texture is loaded
//     const material = new THREE.MeshBasicMaterial({
//       map: texture
//     })
  
//     const cube = new THREE.Mesh(cubeGeometry, material)

//     scene.add(cube)
//     objects.push(cube)
//   },
//   // onError callback
//   function (err) {
//     console.error('An error happened: ' + err)
//   }
// )



let time = Date.now()
function animate() {
  const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime

  objects.forEach((obj) => {
    if (obj != null) obj.rotation.y += rotationSpeed * deltaTime;
  });


  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()


// Preparació de l'escena
function setupScene() {
  //Loader de models GLTF
  loader = new GLTFLoader()
  //Loader de textures
  textureLoader = new THREE.TextureLoader()

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 1, 1)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled=true
  document.body.appendChild(renderer.domElement)

  //controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  //directional light
  const dirlight = new THREE.DirectionalLight(0xffffff);
  dirlight.castShadow= true
  dirlight.position.set(-1, 4, 1);
  scene.add(dirlight);

  //spotlight
  const spotLight = new THREE.SpotLight(0xffffff, 20, 40, Math.PI/8)
  spotLight.position.set(-5, 4, 1)
  spotLight.castShadow= true
  scene.add(spotLight)


  
  //plane
  const planeGeo = new THREE.PlaneGeometry(10, 10)
  const planeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff
  })
  const plane = new THREE.Mesh(planeGeo, planeMat)
  plane.receiveShadow= true
  plane.position.y = -1
  plane.rotation.x = Math.PI * -0.5
  scene.add(plane)
}
