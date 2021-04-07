import * as THREE from 'three';

// Turns both axes and grid visible on/off
// dat.GUI requires a property that returns a bool
// to decide to make a checkbox so we make a setter
// and getter for `visible` which we can tell dat.GUI
// to look at.
export class AxisGridHelper {
  private grid: THREE.GridHelper;
  private axes: THREE.AxesHelper;
  private _visible: boolean;

  constructor(node: THREE.Mesh | THREE.Object3D, units: number = 10) {
    const axes: THREE.AxesHelper = new THREE.AxesHelper();
    (<THREE.Material>axes.material).depthTest = false;
    axes.renderOrder = 2; // after the grid
    node.add(axes);

    const grid: THREE.GridHelper = new THREE.GridHelper(units, units);
    (<THREE.Material>grid.material).depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}
