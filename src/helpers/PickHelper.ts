import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class PickHelper {
  raycaster: THREE.Raycaster;
  pivot: THREE.Object3D;
  pickedObjects: THREE.Mesh[];
  isDragging: boolean;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pivot = new THREE.Object3D();
    this.pickedObjects = [];
    this.isDragging = false;
  }

  picked(controls: OrbitControls, scene: THREE.Scene) {
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      const {
        point,
        object,
        object: { position },
      } = intersectedObjects[0];
      console.log(point, position);
      const { x, y, z } = position;

      const objectsToRotate: THREE.Mesh[] = [];
      scene.children.forEach((cube: THREE.Mesh) => {
        if (cube.position.x === x) {
          objectsToRotate.push(cube);
        }
      });

      this.pickedObjects = objectsToRotate;
      controls.enabled = false;
      this.isDragging = true;
      this.pivot = new THREE.Object3D();
      this.pivot.position.set(x, 0, 0);
    }
  }

  pick(camera: THREE.PerspectiveCamera, normalizedPosition: { x: number; y: number }, scene: THREE.Scene) {
    this.raycaster.setFromCamera(normalizedPosition, camera);
    if (this.isDragging) {
      // attach group to be rotated
      this.pickedObjects.forEach((cube: THREE.Mesh) => {
        this.pivot.attach(cube);
      });

      // apply rotation
      this.pivot.rotation.x = normalizedPosition.x;

      // back to main scene
      this.pickedObjects.forEach((cube: THREE.Mesh) => {
        scene.attach(cube);
      });
    }
  }

  dropped(controls: OrbitControls) {
    controls.enabled = true;
    this.pickedObjects = [];
    this.isDragging = false;
  }
}
