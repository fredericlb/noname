import React, {Component} from 'react';
import * as THREE from 'three';
import {Mesh} from '../../react-three/src/ReactTHREE';


class Grass extends Component { 
    
    constructor() {
        super();
        
        this.state = {
            geometry: new THREE.PlaneBufferGeometry( 100, 100 ),
            texture: null
        };
    }
    
    componentWillMount() {
		var canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 512;

		var context = canvas.getContext('2d');

		for (var i = 0; i < 20000; i ++) {
			context.fillStyle = 'hsl(0,0%,' + (Math.random() * 50 + 50) + '%)';
			context.beginPath();
			context.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() + 0.15, 0, Math.PI * 2, true);
			context.fill();
		}

		context.globalAlpha = 0.075;
		context.globalCompositeOperation = 'lighter';

        console.log(THREE);
        
		this.setState({
            material : new THREE.MeshBasicMaterial({
			    color: new THREE.Color().setHSL( 0.3, 0.75, ( i / 15 ) * 0.4 + 0.1 ),
				map: new THREE.CanvasTexture(canvas),
				depthTest: false,
				depthWrite: false,
				transparent: true
			})
		});
    }
    
    render() {
        let {geometry, texture, material} = this.state;
        
        return (
            <Mesh geometry={geometry} material={material}/>
        );
    }
    
}

export default Grass;