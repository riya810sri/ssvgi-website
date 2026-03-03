import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Torus, Sphere, Box } from '@react-three/drei';

function FloatingShape({ position, shape, color, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  const ShapeComponent = shape === 'torus' ? Torus : shape === 'sphere' ? Sphere : Box;
  const args = shape === 'torus' ? [0.5, 0.2, 16, 100] : shape === 'sphere' ? [0.5, 32, 32] : [0.5, 0.5, 0.5];

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <ShapeComponent ref={meshRef} position={position} args={args} scale={scale}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
      </ShapeComponent>
    </Float>
  );
}

export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <FloatingShape position={[-3, 2, 0]} shape="torus" color="#4F46E5" scale={1} />
        <FloatingShape position={[3, -2, -2]} shape="sphere" color="#06B6D4" scale={1.2} />
        <FloatingShape position={[0, 0, -3]} shape="box" color="#8B5CF6" scale={0.8} />
        <FloatingShape position={[-2, -3, 1]} shape="sphere" color="#EC4899" scale={0.7} />
        <FloatingShape position={[4, 1, -1]} shape="torus" color="#F59E0B" scale={0.9} />
      </Canvas>
    </div>
  );
}
