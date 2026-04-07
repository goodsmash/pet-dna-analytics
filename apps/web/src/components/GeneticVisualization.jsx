import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';

export const GeneticVisualization = ({ healthData }) => {
  return (
    <div className="h-[500px] w-full rounded-2xl bg-slate-900 overflow-hidden shadow-2xl">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={healthData.riskLevel > 0.5 ? '#ef4444' : '#22c55e'} wireframe />
          </mesh>
        </Float>
        <OrbitControls enableZoom={false} />
        <Stars />
      </Canvas>
    </div>
  );
};
