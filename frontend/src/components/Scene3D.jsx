import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

function Shape({ position, color, type, scale, speed }) {
  const mesh = useRef();
  const time = useRef(Math.random() * 100);

  useFrame(({ clock, pointer }) => {
    time.current += 0.01;
    const driftX = pointer.x * 0.15;
    const driftY = pointer.y * 0.1;
    mesh.current.position.x = position[0] + driftX;
    mesh.current.position.y = position[1] + driftY;
    mesh.current.rotation.x += 0.002 * speed;
    mesh.current.rotation.y += 0.003 * speed;
  });

  const args = useMemo(() => {
    switch (type) {
      case 'box': return [1.2, 1.2, 1.2];
      case 'sphere': return [1, 32, 32];
      case 'torus': return [0.8, 0.3, 16, 32];
      default: return [1, 1, 1];
    }
  }, [type]);

  const geometry = useMemo(() => {
    switch (type) {
      case 'box': return <boxGeometry args={args} />;
      case 'sphere': return <sphereGeometry args={args} />;
      case 'torus': return <torusGeometry args={args} />;
      default: return <icosahedronGeometry args={[1, 0]} />;
    }
  }, [type, args]);

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={mesh} position={position} scale={scale}>
        {geometry}
        <MeshDistortMaterial
          color={color}
          speed={1.5}
          distort={0.15}
          radius={0.8}
          transparent
          opacity={0.25}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const shapes = useMemo(() => [
    { position: [-2.5, 1.5, -2], color: '#10b981', type: 'icosahedron', scale: 0.8, speed: 1.2 },
    { position: [2.8, -1.2, -1.5], color: '#f59e0b', type: 'torus', scale: 0.7, speed: 0.9 },
    { position: [-1.8, -1.8, 0.5], color: '#34d399', type: 'sphere', scale: 0.6, speed: 1.5 },
    { position: [2, 2, -0.5], color: '#fbbf24', type: 'box', scale: 0.5, speed: 0.7 },
    { position: [0, 0, -3], color: '#10b981', type: 'icosahedron', scale: 1, speed: 0.5 },
    { position: [-3, 0.5, 1], color: '#f59e0b', type: 'sphere', scale: 0.5, speed: 1.1 },
    { position: [3.2, 1, 0], color: '#6ee7b7', type: 'torus', scale: 0.6, speed: 0.8 },
    { position: [0.5, -2.5, 1.5], color: '#fcd34d', type: 'box', scale: 0.5, speed: 1.3 },
  ], []);

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -3, 5]} intensity={0.4} color="#f59e0b" />
      {shapes.map((s, i) => <Shape key={i} {...s} />)}
    </>
  );
}

export default function Scene3D({ className = '' }) {
  return (
    <div className={`${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
