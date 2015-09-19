import React, {Component} from 'react';
//import {connect} from 'react-redux';
//import {bindActionCreators} from 'redux';
//import * as HomeActions from '../actions/HomeActions';
import styles from '../../css/app.css';
import {Scene, PerspectiveCamera, Mesh, Object3D} from '../../react-three/src/ReactTHREE';
import * as THREE from 'three';
import * as assets from '../assets';

let width = 600;
let height = 500;

class MeshLoader extends Component {
  
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
      let material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
      return (
        <Object3D position={new THREE.Vector3(0, 0, 0)}>
          <Mesh geometry={geometry} material={material}/>
        </Object3D>
      );
    } else {
      return <Object3D/>;
    }
  }
}


class Home extends Component {
  render() {
    var aspectratio = width / height;
    var cameraprops = {fov:75, aspect:aspectratio, near:1, far:5000,
      position:new THREE.Vector3(0,0,600), lookat:new THREE.Vector3(0,0,0)};
  
    return (
      <Scene width={width} height={height} camera="maincamera">
        <PerspectiveCamera name="maincamera" {...cameraprops} />
        <MeshLoader src={assets.testMesh}/>
      </Scene>);
  }
}

//export default connect(state => state.Sample)(Home)
export default Home;