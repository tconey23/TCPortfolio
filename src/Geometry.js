import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Plane, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { RigidBody } from '@react-three/rapier';
import { Vector3 } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { DoubleSide } from 'three';
import { useRevoluteJoint } from '@react-three/rapier';

const r = Math.PI / 180;

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  return mousePosition;
};

const opac = 0
const BoxContainer = () => (
  <group position={[0, 0, 0]}>
    <Plane castShadow receiveShadow args={[50, 60]} position={[0, 0, -25]}>
      <meshLambertMaterial transparent opacity={opac} side={DoubleSide} />
      {/* <Edges linewidth={2} scale={1} threshold={15} color="silver" /> */}
    </Plane>

    <Plane castShadow receiveShadow args={[50, 60]} position={[0, 0, 25]}>
      <meshLambertMaterial transparent opacity={opac} side={DoubleSide} />
      {/* <Edges linewidth={2} scale={1} threshold={15} color="silver" /> */}
    </Plane>

    <Plane castShadow receiveShadow args={[50, 60]} position={[25, 0, 0]} rotation={[0, r * 90, 0]}>
      <meshLambertMaterial transparent opacity={opac} side={DoubleSide} />
      {/* <Edges linewidth={2} scale={1} threshold={15} color="silver" /> */}
    </Plane>

    <Plane castShadow receiveShadow args={[50, 60]} position={[-25, 0, 0]} rotation={[0, r * 90, 0]}>
      <meshLambertMaterial transparent opacity={opac} side={DoubleSide} />
      {/* <Edges linewidth={2} scale={1} threshold={15} color="silver" /> */}
    </Plane>

    <Plane castShadow receiveShadow args={[50, 50]} position={[0, -30, 0]} rotation={[r * 90, r * 180, 0]}>
      <meshLambertMaterial transparent opacity={opac} side={DoubleSide} />
      {/* <Edges linewidth={2} scale={1} threshold={15} color="silver" /> */}
    </Plane>

    <Plane castShadow receiveShadow args={[50, 50]} position={[0, 30, 0]} rotation={[r * 90, r * 180, 0]}>
      <meshLambertMaterial transparent opacity={opac} side={DoubleSide} />
      {/* <Edges linewidth={2} scale={1} threshold={15} color="silver" /> */}
    </Plane>
  </group>
);

const Geometry = ({ setOnHover, setCameraPosition }) => {
  const dodec = useRef();
  const bodyRef = useRef();
  const pointRef = useRef();
  const forceAmount = useRef(0);
  const rot = useRef(0);
  const { camera } = useThree();
  const [clickAxis, setClickAxis] = useState();
  const navigate = useNavigate();
  const [forceVector, setForceVector] = useState(new Vector3());
  const [clicked, setClicked] = useState(false);
  const mouse = new THREE.Vector2();
  const{x,y} = useMousePosition()

  const enterSite = () => {
    navigate('/home');
  };

  const materials = useLoader(MTLLoader, '/assets/dodec.mtl');
  const obj = useLoader(OBJLoader, '/assets/dodec.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const handleClick = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    const point = event.ray.direction;

    const { x, y, z } = point;
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const absZ = Math.abs(z);
    let closestAxis;

    if (absX > absY && absX > absZ) {
      closestAxis = 'x';
    } else if (absY > absX && absY > absZ) {
      closestAxis = 'y';
    } else {
      closestAxis = 'z';
    }
    setClicked(true);
    setClickAxis(closestAxis);
  };

  const handlePointerUp = (e) => {
    setClicked(false)
    let force = new Vector3(-500,80,50)
    bodyRef.current.applyTorqueImpulse(force, true)
  }


  useFrame(() => {
    if (bodyRef.current) {
      setCameraPosition(bodyRef.current.translation());
    }
    let angvel = bodyRef.current.angvel()
    let angleVelTotal = (angvel.x + angvel.y + angvel.z)

    bodyRef.current.setAngularDamping(2)

      if(clicked){
        let xAxis = x * 0.05
        let yAxis = y * 0.05

        let force = new Vector3(-r*xAxis,-r*yAxis,0)
        // bodyRef.current.applyTorqueImpulse(force, true)
        // console.log(r*xAxis,r*yAxis,0)
      }

      if(!clicked){
        // bodyRef.current.resetTorques(true)
        let force = new Vector3(0,0,0)
        bodyRef.current.applyTorqueImpulse(force, true)
      }
  });

  // useRevoluteJoint(bodyRef, pointRef, [
  //   [0,0,0],
  //   [0,0,0],
  //   [1,1,1],
  //   [0,0,1]
  // ]);

  

  return (
    <group>
      {/* <RigidBody mass={100} ref={pointRef} /> */}
      
      <RigidBody colliders='trimesh' type='fixed'>
        <BoxContainer receiveShadow>

        </BoxContainer>
      </RigidBody>
      <RigidBody
        onPointerDown={(e) => handleClick(e)}
        onPointerUp={(e) => handlePointerUp(e)}
        mass={1000}
        restitution={0}
        ref={bodyRef}
        type="dynamic"
        colliders="trimesh"
        position={[0, 1, 0]}
      >
        <primitive ref={dodec} castShadow receiveShadow object={obj} />
      </RigidBody>
    </group>
  );
  };
  
  export default Geometry;
  
  {/* <RigidBody type='fixed' mass={10} colliders='cuboid' position={[0,-1,0]} rotation={[-r*90,0,0]}>
    <Plane args={[100,100,1]}>
      <meshBasicMaterial />
    </Plane>
  </RigidBody> */}