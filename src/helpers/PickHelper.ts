import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class PickHelper {
  raycaster: THREE.Raycaster;
  shift: THREE.Vector3;
  pickedObject: THREE.Mesh;
  isDragging: boolean;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.shift = new THREE.Vector3();
    this.pickedObject = null;
    this.isDragging = false;
  }

  picked(controls: OrbitControls, scene: THREE.Scene) {
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      this.shift.subVectors(intersectedObjects[0].object.position, intersectedObjects[0].point);
      this.pickedObject = intersectedObjects[0].object as THREE.Mesh;
      controls.enabled = false;
      this.isDragging = true;
      console.log('picked ', this.pickedObject);
    }
  }

  pick(camera: THREE.PerspectiveCamera, normalizedPosition: { x: number; y: number }) {
    var planeIntersect = new THREE.Vector3();
    this.raycaster.setFromCamera(normalizedPosition, camera);
    if (this.isDragging) {
      const { x, y, z } = this.shift;
      // this.pickedObject.position.addVectors(planeIntersect, this.shift);
      console.log('dragging ', this.shift);
    }
  }

  dropped(controls: OrbitControls) {
    this.isDragging = false;
    controls.enabled = true;
    this.pickedObject = null;
    console.log('dropped');
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
