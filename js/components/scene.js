import * as THREE from "../../libs/three.js/build/three.module.js";

class Scene {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.settings = { ...settings };

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x00000);

    return this.scene;
  }
}
export default Scene;
