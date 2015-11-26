import * as THREE from 'three';
import React, {Component} from 'react';
import {Object3D, Mesh} from '../../react-three/src/ReactTHREE';

export default class MeshLoader extends Component {
  
  constructor() {
    super();
    this.state = {
      loaded: false
    };
  }
  
  componentDidMount() {
    let callback = () => this.setState({loaded: true});
    this.props.src.onLoaded(callback);
  }
  
  
  render() {
    if (this.state.loaded) {
      let {geometry, materials} = this.props.src.data;
      let mtl = null;
      var material = materials[0];
					material.color.setHex( 0xffaaaa );
					
      if (materials && this.props.mtlTransform instanceof Function) {
        mtl = this.props.mtlTransform(materials);
      } else {
        mtl = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
      }
      //mtl = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      return (
        <Object3D position={this.props.position} scale={this.props.scale}>
          <Mesh geometry={geometry} material={mtl}/>
        </Object3D>
      );
    } else {
      return <Object3D/>;
    }
  }
}