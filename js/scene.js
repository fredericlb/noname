import React, {Component} from 'react';
import {Scene, PerspectiveCamera, Mesh, Object3D, AmbientLight, PointLight} from '../react-three/src/ReactTHREE';
import * as THREE from 'three';
import assets from './assets';
import FPSControlsListener from './interactions/fps-controls';
import MeshLoader from "./mesh/mesh-loader";
import Grass from './mesh/grass';

let width = 600;
let height = 500;

class MyScene extends Component {
  constructor() {
    super();
    this.state = {
      position: new THREE.Vector3(0, 0, 0),
      lookat: new THREE.Vector3(-1, 0, -3)
    };
  }
  
  componentDidMount() {
    this.setState({
      domElement: React.findDOMNode(this.refs.scene)
    })
  }
  
  
  render() {
    return (
      <Scene width={width} height={height} camera="maincamera" ref="scene"
        background={0xffffff}>
        <FPSControlsListener container={this.state.domElement} 
          position={this.state.position}
          onPositionChange={position => this.setState({position})}
          lookat={this.state.lookat}
          onLookatChange={lookat => this.setState({lookat})} 
          />
        <AmbientLight color={0xffdddd}/>
        <PointLight color={0xff4400} intensity={5} distance={30} 
          position={new THREE.Vector3(5, 0, 0)}/>
        
        
        <PerspectiveCamera name="maincamera"
          position={this.state.position}
          lookat={this.state.lookat}
          fov={70}
          aspect={width/height}
          near={1}
          far={5000}
          />
        <MeshLoader src={assets.testMesh}
          position={new THREE.Vector3(-1, 0, -3)}
          scale={0.001}
          mtlTransform={mtls => {
            mtls[0].color.setHex(0xffaaaa);
            return new THREE.MeshFaceMaterial(mtls);
          }}/>
        <Grass/>
      </Scene>);
  }
}

React.render(<MyScene />, document.getElementById('main'));
