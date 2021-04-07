<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

  onMount(main);

  function main(): void {
    const canvas: HTMLCanvasElement = document.querySelector('#canvas') as HTMLCanvasElement;
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas });

    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(10, 10, 10);

    const controls: OrbitControls = new OrbitControls(camera, canvas);
    controls.update();

    const scene: THREE.Scene = new THREE.Scene();
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

      for (let z = 1; z >= -1; z--) {
        for (let y = -1; y <= 1; y++) {
          for (let x = 1; x >= -1; x--) {
            const cube: THREE.Mesh = new THREE.Mesh(geometry, materials);
            cube.position.set(x, y, z);

            scene.add(cube);

            const edges: THREE.EdgesGeometry = new THREE.EdgesGeometry(geometry);
            const line: THREE.LineSegments = new THREE.LineSegments(
              edges,
              new THREE.LineBasicMaterial({ color: 0x000000 })
            );
            line.position.set(x, y, z);
            scene.add(line);
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

    function render(): void {
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas: HTMLCanvasElement = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
  }
</script>

<main>
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
</style>
