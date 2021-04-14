<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { PickHelper } from './helpers/PickHelper';

  const pickHelper = new PickHelper();
  const pickPosition = { x: 0, y: 0 };

  let canvas: HTMLCanvasElement;
  let controls: OrbitControls;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;

  onMount(main);

  function main(): void {
    canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas });

    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(10, 10, 10);

    controls = new OrbitControls(camera, canvas);
    controls.update();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf2ebc2);

    addElements();
    requestAnimationFrame(render);

    function addElements() {
      const cubeSize = 1;
      const geometry: THREE.BoxGeometry = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
      const materials: THREE.MeshBasicMaterial[] = [
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // green
        new THREE.MeshBasicMaterial({ color: 0x0000ff }), // blue
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // red
        new THREE.MeshBasicMaterial({ color: 0xff8800 }), // orange
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // white
        new THREE.MeshBasicMaterial({ color: 0xfffb00 }), // yellow
      ];
      const edges: THREE.EdgesGeometry = new THREE.EdgesGeometry(geometry);
      const borderMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

      // const pivot = new THREE.Object3D();
      // pivot.rotation.set(0, 0, 0.5);
      // scene.add(pivot);

      for (let z = 1; z >= -1; z--) {
        for (let y = -1; y <= 1; y++) {
          for (let x = 1; x >= -1; x--) {
            const cube: THREE.Mesh = new THREE.Mesh(geometry, materials);

            // if (z === 1) {
            //   pivot.attach(cube);
            //   pivot.updateMatrixWorld();
            // }

            const line: THREE.LineSegments = new THREE.LineSegments(edges, borderMaterial);
            cube.add(line);

            cube.position.set(x, y, z);
            scene.add(cube);
          }
        }
      }
    }

    function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer): boolean {
      const canvas: HTMLCanvasElement = renderer.domElement;
      const width: number = canvas.clientWidth;
      const height: number = canvas.clientHeight;
      const needResize: boolean = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function render(time: number): void {
      time *= 0.001; // convert to seconds;

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas: HTMLCanvasElement = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      pickHelper.pick(camera, pickPosition);
      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
  }

  const handleRotate = () => {
    console.log('clicked');
  };

  const getCanvasRelativePosition = event => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  };

  const handleMouseDown = () => {
    pickHelper.picked(controls, scene);
  };

  const setPickPosition = event => {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width) * 2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1; // note we flip Y
  };

  function clearPickPosition() {
    pickHelper.dropped(controls);
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }
</script>

<main on:pointerdown={handleMouseDown} on:mousemove={setPickPosition} on:pointerup={clearPickPosition}>
  <button type="button" on:click={handleRotate}>Rotate</button>
  <canvas id="canvas" />
</main>

<style>
  :global(body),
  main {
    padding: 0;
    margin: 0;
    height: 100%;
  }

  #canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  button {
    margin: 1em;
    position: fixed;
  }
</style>
