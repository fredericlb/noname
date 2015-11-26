import * as THREE from 'three';
import {Object3D} from '../../react-three/src/ReactTHREE';
import React, {Component} from 'react';

/* A fake element to get rid of Scene inheritance issues when changing inputs */
export default class FPSControlsListener extends Component {
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
  
  onMouseMove({movementX, movementY}) {
    console.log("onMouseMove");
    let deltaX = -Math.PI / (360 * 2);
    let deltaY = -Math.PI / (360 * 2);
    let rX = deltaX * movementX;
    let rY = deltaY * movementY;
    console.log(movementX, movementY);
    let l = this.props.lookat.clone();
    let p = this.props.position;
    if (this.state.pointerLocked) {
      // https://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/3drota.htm
      // http://www.html5rocks.com/en/tutorials/pointerlock/intro/?redirect_from_locale=fr
      
      let frontDirection = l.sub(p).normalize();
      let qX = new THREE.Quaternion()
          .setFromAxisAngle(new THREE.Vector3(0, 1, 0), rX);
    
      let qY = new THREE.Quaternion()
          .setFromAxisAngle(new THREE.Vector3(1, 0, 0), rY);
          
      frontDirection.applyQuaternion(qX).applyQuaternion(qY);
      let newLookAt = p.clone().add(frontDirection);
      
      this.props.onLookatChange(newLookAt);
    }
  }
  
  onKeyDown({keyCode}) {
    const UP = 87, DOWN = 83, LEFT = 65, RIGHT = 68;
    let absDir = this.props.lookat.clone().setY(0).sub(this.props.position);
    let dir = absDir.clone().normalize();
    let perpDir = new THREE.Vector3(-absDir.z, absDir.y, absDir.x).normalize();
    let out = this.props.position.clone();
    let lookat = this.props.lookat.clone();
    let step = new THREE.Vector3(0, 0, 0);
    if (keyCode === UP) {
      step = dir.clone();
    } else if (keyCode === DOWN) {
      step = dir.clone().negate();
    } else if (keyCode === LEFT) {
      step = perpDir.clone().negate();
    } else if (keyCode === RIGHT) {
      step = perpDir.clone();
    }
    this.props.onPositionChange(out.add(step));
    this.props.onLookatChange(lookat.add(step));
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