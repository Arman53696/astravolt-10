import * as THREE from './vendor/three.module.min.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';

const gameCanvas = document.getElementById('gameCanvas');
if (!gameCanvas) throw new Error('Astravolt 3D: game canvas missing');

const canvas = document.createElement('canvas');
canvas.id = 'game3dCanvas';
canvas.setAttribute('aria-hidden', 'true');
gameCanvas.insertAdjacentElement('afterend', canvas);

const fx = () => window.__astraFX || { dpr: 1.25, tier: 2 };
/* antialiasing (MSAA) on a full-screen phone canvas is one of the most
   expensive things we can ask a mobile GPU for, and the ships are small
   and glowing - not worth the framerate */
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera();
camera.position.set(0, 500, 0);
camera.up.set(0, 0, -1);
camera.lookAt(0, 0, 0);
scene.add(new THREE.HemisphereLight(0x9edfff, 0x14091f, 2.2));
const key = new THREE.DirectionalLight(0xffffff, 3.2);
key.position.set(-160, 260, 100);
scene.add(key);
const rim = new THREE.DirectionalLight(0x27dfff, 2.4);
rim.position.set(180, 100, -160);
scene.add(rim);

const root = new THREE.Group();
scene.add(root);
const shipPivot = new THREE.Group();
root.add(shipPivot);
let ship = null;
let bossModel = null;
let bossLevel = 0;
let bossFlash = null;
let lastSkin = '';
let failed = false;
const clock = new THREE.Clock();

const palettes = {
  nova: [0x203854, 0x38bdf8], inferno: [0x40151b, 0xff303d], valkyr: [0x483610, 0xffc82e],
  shadow: [0x112c26, 0x28ef78], void: [0x27133f, 0xb142ff], orion: [0x143341, 0x22d3ee]
};
const bossDefs = [
  ['Inferno Core',0x2b1015,0xff263f,'dragon'], ['Frost Colossus',0x102a42,0x35bfff,'crystal'],
  ['Asteroid Beast',0x332521,0xff781f,'rock'], ['Void Reaper',0x24103c,0xaf2cff,'reaper'],
  ['Toxic Queen',0x14351f,0x48f55f,'queen'], ['Solar Titan',0x44300d,0xffc21c,'solar'],
  ['Nebula Phantom',0x351344,0xff38d1,'phantom'], ['Mech Dragon',0x35151b,0xff3546,'dragon'],
  ['Orbital Cannon',0x102c3b,0x27cfff,'orbital'], ['Ancient Entity',0x2b103e,0xc23cff,'entity']
];

function metal(color, emissive=0x000000, strength=0.12){
  return new THREE.MeshStandardMaterial({color, metalness:.82, roughness:.27, emissive, emissiveIntensity:strength});
}
function mesh(geometry, material, x=0, z=0, ry=0){
  const m=new THREE.Mesh(geometry,material); m.position.set(x,0,z); m.rotation.y=ry; return m;
}
function addWingPair(group, mat, accent, spread=36, length=48, swept=0){
  const geo=new THREE.ConeGeometry(11,length,3); geo.rotateX(Math.PI/2);
  const l=mesh(geo,mat,-spread,5,-.22-swept), r=mesh(geo,mat,spread,5,.22+swept);
  l.scale.set(1,.42,1); r.scale.set(1,.42,1); group.add(l,r);
  const edgeGeo=new THREE.BoxGeometry(3,3,length*.78);
  group.add(mesh(edgeGeo,accent,-spread-8,4,-.22-swept),mesh(edgeGeo,accent,spread+8,4,.22+swept));
}
function makeBoss(level){
  const [,base,glow,type]=bossDefs[level-1];
  const g=new THREE.Group(), hull=metal(base,glow,.2), light=metal(glow,glow,2.8), dark=metal(0x080b15);
  const core=mesh(new THREE.SphereGeometry(type==='orbital'?13:17,16,10),light); core.name='core'; core.scale.y=.55; g.add(core);
  if(type==='orbital'){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(42,7,8,30),hull); ring.rotation.x=Math.PI/2; ring.name='spin'; g.add(ring);
    for(let i=0;i<8;i++){ const a=i*Math.PI/4; g.add(mesh(new THREE.BoxGeometry(11,8,23),light,Math.sin(a)*45,Math.cos(a)*45,-a)); }
  }else if(type==='solar'){
    for(let i=0;i<12;i++){ const a=i*Math.PI/6; const ray=mesh(new THREE.ConeGeometry(7,38,3),light,Math.sin(a)*35,Math.cos(a)*35,-a); g.add(ray); }
    const ring=new THREE.Mesh(new THREE.TorusGeometry(29,5,8,28),hull); ring.rotation.x=Math.PI/2; ring.name='spin'; g.add(ring);
  }else if(type==='rock'){
    for(let i=0;i<7;i++){ const a=i*2.4; const rock=mesh(new THREE.DodecahedronGeometry(i?11:25,0),i?hull:light,Math.sin(a)*(i?42:0),Math.cos(a)*(i?35:0),a); rock.name=i?'orbit':'core'; g.add(rock); }
  }else if(type==='reaper'||type==='entity'||type==='phantom'){
    addWingPair(g,hull,light,35,60,type==='reaper'?.25:0);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(26,4,7,24),light); ring.rotation.x=Math.PI/2; ring.name='spin'; g.add(ring);
    g.add(mesh(new THREE.ConeGeometry(20,56,4),dark,0,22,Math.PI));
  }else{
    addWingPair(g,hull,light,type==='queen'?42:34,type==='queen'?58:48,type==='dragon'?.18:0);
    g.add(mesh(new THREE.ConeGeometry(24,65,5),hull,0,12,Math.PI));
    if(type==='crystal') for(let i=-2;i<=2;i++) g.add(mesh(new THREE.ConeGeometry(6,32+Math.abs(i)*5,4),light,i*15,18,Math.PI));
  }
  g.scale.setScalar(.95+level*.025);
  const meshes=[]; g.traverse(o=>{ if(o.isMesh&&o.material) meshes.push(o); });
  g.userData={core,level,meshes};
  return g;
}
function applyShipSkin(id){
  if(!ship||id===lastSkin)return; lastSkin=id;
  const [base,glow]=palettes[id]||palettes.nova;
  ship.traverse(o=>{ if(!o.isMesh)return; o.material=metal(base,glow,.42); });
}
function resize(w,h){
  const dpr=Math.min(window.devicePixelRatio||1, fx().dpr);
  renderer.setPixelRatio(dpr); renderer.setSize(w,h,false);
  camera.left=-w/2; camera.right=w/2; camera.top=h/2; camera.bottom=-h/2; camera.near=.1; camera.far=1000; camera.updateProjectionMatrix();
}
function viewportSize(){
  const viewport=window.visualViewport;
  return {w:Math.round(viewport?.width||innerWidth),h:Math.round(viewport?.height||innerHeight)};
}
function resizeToViewport(){ const {w,h}=viewportSize(); resize(w,h); }
resizeToViewport();
window.__astra3dQuality=resizeToViewport;
addEventListener('resize',resizeToViewport,{passive:true});
window.visualViewport?.addEventListener('resize',resizeToViewport,{passive:true});

new GLTFLoader().load('./models/player-ship.glb', gltf=>{
  ship=gltf.scene;
  const box=new THREE.Box3().setFromObject(ship), size=box.getSize(new THREE.Vector3()), center=box.getCenter(new THREE.Vector3());
  ship.position.sub(center); ship.scale.setScalar(76/Math.max(size.x,size.z,size.y,1));
  ship.rotation.y=Math.PI;
  ship.traverse(o=>{ if(o.isMesh){ o.frustumCulled=true; } });
  shipPivot.add(ship); window.__astra3dReady=true;
},undefined,()=>{ failed=true; canvas.style.display='none'; window.__astra3dReady=false; });

function frame(){
  const dt=Math.min(clock.getDelta(),.05), state=window.__astra3dState?.();
  if(!state||failed){ requestAnimationFrame(frame); return; }
  const visible=state.playing&&!state.paused&&!document.hidden;
  canvas.style.visibility=visible?'visible':'hidden';
  if(visible&&ship){
    shipPivot.visible=true;
    shipPivot.position.set(state.player.x+state.player.w/2-state.w/2,4,state.player.y+state.player.h/2-state.h/2);
    shipPivot.rotation.z=-state.tilt*.9;
    shipPivot.rotation.x=Math.sin(performance.now()*.005)*.025;
    applyShipSkin(state.skin);
    if(state.boss){
      if(!bossModel||bossLevel!==state.boss.level){ if(bossModel)root.remove(bossModel); bossLevel=state.boss.level; bossModel=makeBoss(bossLevel); root.add(bossModel); }
      bossModel.visible=true;
      bossModel.position.set(state.boss.x-state.w/2,3,state.boss.y-state.h/2);
      bossModel.rotation.y+=dt*.35;
      const core=bossModel.userData.core; if(core){ const p=1+Math.sin(performance.now()*.008)*.08; core.scale.set(p,.55,p); }
      const spin=bossModel.getObjectByName('spin'); if(spin)spin.rotation.z+=dt*(.8+bossLevel*.07);
      const flash=state.boss.hitFlash>0;
      if(flash!==bossFlash){ bossFlash=flash; for(const o of bossModel.userData.meshes) o.material.emissiveIntensity=flash?4:(o.name==='core'?2.8:.2); }
    }else if(bossModel) bossModel.visible=false;
    renderer.render(scene,camera);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
