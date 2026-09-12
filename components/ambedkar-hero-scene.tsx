'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, OrbitControls, Sparkles, Text } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Pillar({ position, rotation = [0, 0, 0], scale = 1 }: { position: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.55, 3.8, 0.55]} />
        <meshStandardMaterial color="#d4b483" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[0.9, 0.22, 0.9]} />
        <meshStandardMaterial color="#b85c38" roughness={0.6} />
      </mesh>
    </group>
  )
}

function ArchiveScene() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.12, 0.04)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.05, 0.04)
  })

  return (
    <>
      <ambientLight intensity={1.6} />
      <directionalLight position={[4, 7, 5]} intensity={3} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment preset="studio" />
      <group ref={group} position={[2.15, -0.1, 0]}>
        <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.25}>
          <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[1.55, 1.8, 0.42, 64]} />
            <meshStandardMaterial color="#b85c38" roughness={0.45} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow>
            <cylinderGeometry args={[0.95, 0.95, 0.12, 64]} />
            <meshStandardMaterial color="#f5f1e8" roughness={0.4} />
          </mesh>
          <Text position={[0, 0.59, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.23} color="#132b3f" anchorX="center" anchorY="middle" font="/fonts/Inter_Bold.json">
            360
          </Text>
        </Float>
        <Pillar position={[-2.1, -1.35, -0.4]} rotation={[0, 0, -0.16]} scale={0.8} />
        <Pillar position={[2.1, -1.35, -0.4]} rotation={[0, 0, 0.16]} scale={0.8} />
        <mesh position={[0, -2.1, 0]} receiveShadow>
          <boxGeometry args={[7.4, 0.18, 4.2]} />
          <meshStandardMaterial color="#132b3f" roughness={0.6} />
        </mesh>
      </group>
      <Sparkles count={35} scale={[7, 4, 3]} size={1.8} speed={0.18} color="#d4b483" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} minPolarAngle={Math.PI / 2.4} maxPolarAngle={Math.PI / 1.8} />
    </>
  )
}

export function AmbedkarHeroScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1.1, 8], fov: 36 }}>
        <ArchiveScene />
      </Canvas>
    </div>
  )
}
