import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface P {
  isMobile?: boolean;
}

export function Kalygo3dModel(props: P) {
  const { nodes, materials } = useGLTF("/3d_kalygo.glb");
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta;
    }
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        geometry={(nodes.Curve as THREE.Mesh).geometry}
        material={materials["SVGMat.001"] as THREE.Material}
        rotation={[Math.PI / 2, 0, 0]}
        scale={32}
      />
    </group>
  );
}

useGLTF.preload("/3d_kalygo.glb"); 