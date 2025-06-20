"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Kalygo3dModel } from "./Kalygo3dModel";

export default function Logo3D() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div style={{ width: "100%", maxWidth: 600, height: 400, margin: "0 auto" }}>
            <Canvas
              gl={{ preserveDrawingBuffer: true }}
              shadows
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 5], fov: 50 }}
            >
              <Kalygo3dModel />
              <directionalLight color="white" position={[0, 0, 10]} intensity={2.5} />
              <OrbitControls enableZoom={false} />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
} 