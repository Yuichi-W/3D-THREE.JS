import './App.css'
import * as THREE from "three";
import { useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function App() {

  let canvas: HTMLCanvasElement;
  let model: THREE.Group;

  useEffect(() => {

    canvas = document.getElementById("canvas") as HTMLCanvasElement ;

    const sizes = {
      width: innerWidth,
      height: innerHeight,
    };

    // scene
    const scene: THREE.Scene = new THREE.Scene();

    // camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      75,                        //for:どこからどこまで映すのか
      sizes.width / sizes.height,//アスペクト：横と縦の比率(ブラウザの縦横)
      0.1,                       //near:手前の画面みたいなもの
      1000                       //far:最奥にある画面みたいなもの　nearとfarの間が視錐台
    );
    // camera.position.set(-0.4, -0.1, 1); //柴犬
    camera.position.set(-0.5, 0.4, 1); //犬アニメーション

    // renderer
    const renderer: WebGLRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true, //3Dのイラストの周りがギザギザになるのを防ぐ
      alpha: true,     //透明度のこと　背景に黒が当たっているので透明度をtrueにする
    });
    // 定型分決まり
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // テスト用の四角い立体像：https://threejs.org/docs/#api/en/geometries/BoxGeometry
    // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    // 3dモデルのインポート
    const gltfLoader = new GLTFLoader();
    // アニメーションさせるための変数の型指定
    let mixer: THREE.AnimationMixer;

    gltfLoader.load("./public/models/animation.gltf", (gltf) => {
      model = gltf.scene;
      // ３Dモデルの大きさ設定
      // model.scale.set(0.5, 0.5, 0.5); //柴犬
      model.scale.set(0.00007, 0.00007, 0.00007);    //犬アニメーション
      // 向きの設定　60度傾ける
      model.rotation.y = -Math.PI / 3;
      scene.add(model);

      // アニメーションさせるための設定
      mixer = new THREE.AnimationMixer(model);
      const clips = gltf.animations;
      // console.log(clips);
      clips.forEach(function (clip) {
        const action = mixer.clipAction(clip);
        action.play();
      });
    });

    // ライト（犬アニメーションは初期ライトなしので真っ黒なので必要）
    // 引数は明かりの色と明かりの大きさ
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    scene.add(pointLight);


    // アニメーション
    const tick = () => {
      renderer.render(scene, camera);

      if(mixer) {
        // どれだけの秒数でアニメーションさせるのかを入れる
        mixer.update(0.01);
      }

      requestAnimationFrame(tick);
    };
    tick();

  },[]);

  return (
    <>
      <canvas id="canvas"></canvas>
      <div className="mainContent">
        <h3>3D THREE</h3>
        <p>Web Developer</p>
      </div>
    </>
  )
}

export default App
