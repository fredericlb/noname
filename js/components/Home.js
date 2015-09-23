import React, {Component} from 'react';
//import {connect} from 'react-redux';
//import {bindActionCreators} from 'redux';
//import * as HomeActions from '../actions/HomeActions';
import styles from '../../css/app.css';
import {Scene, PerspectiveCamera, Mesh, Object3D, AmbientLight, PointLight} from '../../react-three/src/ReactTHREE';
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


class FPSScene extends Component {
 // constructor() {
 //   super();
 //   console.log("test");
 // }
 // 
 // componentDidMount() {
 //   console.log("ici");
 //   this._boundOnKeyDown = (e) => {
 //     console.log(e);
 //   };
 //   document.addEventListener('keydown', this._boundOnKeyDown);
 // }
cos// 
 // onKeyDown() {
 // }
 // 
 // componentWillUnmount() {
 //   document.removeEventListener('keydown', this._boundOnKeyDown);
 //   this._boundOnKeyDown = null;
 // }
  
  render() {
    return <Scene {...this.props}/>;
  }
  
  componentWillReceiveProps() {
    
  }
}


/* A fake element to get rid of Scene inheritance issues when changing inputs */
class FPSControlsListener extends Component {
  constructor() {
    super();
    this.state = {
      pointerLocked: false
    };
    this._bounds = [
     { cont: (c) => document, evt: "keydown", cb: e => this.onKeyDown(e) },
     { cont: (c) => c, evt: "mousemove", cb: e => this.onMouseMove(e) },
     { cont: (c) => document, evt: "pointerlockchange", cb: e => this.onPointerLockStatusChange(e) },
     { cont: (c) => c, evt: "click", cb: e => this.onClick(e) },
    ];
  }
  
  componentDidMount(){
    if (this.props.container !== undefined) {
      this.startListeningAt(this.props.container);
    }
  }
  
  componentWillUnmount() {
    if (this.props.container !== undefined) {
      this.stopListening(this.props.container);
    }
  }
  
  stopListening() {
    console.log("stopListening");
    this._bounds.forEach(b => {
      b.cont(this.props.container).removeEventListener(b.evt, b.cb);
    });
  }
  
  onClick() {
    if (!this.state.pointerLocked) {
      this.props.container.requestPointerLock();
    }
  }
  
  onPointerLockStatusChange() {
    console.log("onPointerLockStatusChange");
    this.setState({
      pointerLocked: document.pointerLockElement === this.props.container
    });
    
    if (document.pointerLockElement === this.props.container) {
      console.log("izOK");
    }
  }
  
  onMouseMove(e) {
    console.log("onMouseMove");
    let delta = Math.PI / 90;
    let l = this.props.lookat;
    let p = this.props.position;
    if (this.state.pointerLocked) {
      // https://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/3drota.htm
      let x = (l.z - p.z) * Math.sin(delta) + (l.x - p.x) * Math.cos(delta);
      let y = 0;
      let z = (l.z - p.z) * Math.cos(delta) - (l.x - p.x) * Math.sin(delta);
      //let rot = this.props.lookat.clone().add(new THREE.Vector3(x, y, 0));
      this.props.onLookatChange(p.clone().add(new THREE.Vector3(x, y, z)));
    }
  }
  
  rotateHead() {
    
  }
  
  onKeyDown({keyCode}) {
    const UP = 87, DOWN = 83, LEFT = 65, RIGHT = 68;
    let out = this.props.position.clone();
    let lookat = this.props.lookat.clone();
    let delta = new THREE.Vector3(0, 0, 0);
    if (keyCode === UP) {
      delta = new THREE.Vector3(0, 0, -1);
    } else if (keyCode === DOWN) {
      delta = new THREE.Vector3(0, 0, 1);
    } else if (keyCode === LEFT) {
      delta = new THREE.Vector3(-1, 0, 0);
    } else if (keyCode === RIGHT) {
      delta = new THREE.Vector3(1, 0, 0);
    }
    this.props.onPositionChange(out.add(delta));
    this.props.onLookatChange(lookat.add(delta));
  }
  
  startListeningAt(domNode) {
    console.log("startListeningAt");
    this._bounds.forEach(b => {
      b.cont(domNode).addEventListener(b.evt, b.cb);
    });
  }
  
  render() {
    return <Object3D/>;
  }
  
  componentWillReceiveProps({container}) {
    let oldContainer = this.props.container;
    
    if (oldContainer !== undefined) {
      this.stopListening();
    }
    
    if (container !== undefined) {
      this.startListeningAt(container);
    }
  }
}


class Home extends Component {
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
      <Scene width={width} height={height} camera="maincamera" ref="scene">
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
      </Scene>);
  }
}

//export default connect(state => state.Sample)(Home)
export default Home;