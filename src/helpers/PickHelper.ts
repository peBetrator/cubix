import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class PickHelper {
  raycaster: THREE.Raycaster;
  pivot: THREE.Object3D;
  pickedObject: THREE.Mesh;
  isDragging: boolean;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pivot = new THREE.Object3D();
    this.pickedObject = null;
    this.isDragging = false;
  }

  picked(controls: OrbitControls, scene: THREE.Scene) {
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      this.pickedObject = intersectedObjects[0].object as THREE.Mesh;
      controls.enabled = false;
      this.isDragging = true;
      this.pivot = new THREE.Object3D();
      const { x, y, z } = intersectedObjects[0].object.position;
      this.pivot.position.set(x, y, z);
    }
  }

  pick(camera: THREE.PerspectiveCamera, normalizedPosition: { x: number; y: number }, scene: THREE.Scene) {
    this.raycaster.setFromCamera(normalizedPosition, camera);
    if (this.isDragging) {
      // attach group to be rotated
      this.pivot.attach(this.pickedObject);
      this.pivot.rotation.x += 0.1;

      // back to main scene
      scene.attach(this.pickedObject);
    }
  }

  dropped(controls: OrbitControls) {
    controls.enabled = true;
    this.isDragging = false;
    this.pickedObject = null;
  }

  // pick(normalizedPosition, scene, camera, time) {
  //   // restore the color if there is a picked object
  //   if (this.pickedObject) {
  //     // this.pickedObject.material[this.faceIndex].color.set(this.pickedObjectSavedColor);
  //     this.pickedObject = undefined;
  //   }

  //   // cast a ray through the frustum
  //   this.raycaster.setFromCamera(normalizedPosition, camera);
  //   // get the list of objects the ray intersected
  //   const intersectedObjects = this.raycaster.intersectObjects(scene.children);
  //   if (intersectedObjects.length) {
  //     // pick the first object. It's the closest one
  //     this.pickedObject = intersectedObjects[0].object as THREE.Mesh;
  //     this.faceIndex = intersectedObjects[0].face.materialIndex;
  //     // save its color
  //     // this.pickedObjectSavedColor = this.pickedObject.material[this.faceIndex].color;
  //     // set its emissive color to flashing red/yellow
  //     // this.pickedObject.material[this.faceIndex].color.set((time * 8) % 2 > 1 ? 0xffff00 : 0xff0000);
  //   }
  // }
}
