import * as msgpack from 'msgpack-js';
import * as THREE from 'three';

class MsgPackAsset {
    
    constructor(path) {
        this.path = path;
        this.isLoaded = false;
        this.data = null;
        this._callbacks = [];
    }
    
    load() {
        
        var loader = new THREE.JSONLoader();
        
        loader.load(`assets/${this.path}`, (geometry, materials) => {
            this.data = {
                geometry: geometry,
                materials: materials 
            };
			this.isLoaded = true;
			this._callbacks.forEach(fct => fct());
        });
        
        return this;
    }
    
    onLoaded(fct) {
        if (this.isLoaded) {
            fct();
        } else {
            this._callbacks.push(fct);
        }
        
        return this;
    }
    
    register() {
        return this;
    }
}

module.exports = {
    testMesh : new MsgPackAsset("monster.js").load().register()
};

