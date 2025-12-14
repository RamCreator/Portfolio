import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

// --- Shaders ---
const vertexShader = `
  uniform float uTime;
  uniform vec3 uMouse;
  attribute float size;
  attribute vec3 initialPos;
  
  varying vec3 vColor;

  void main() {
    vec3 pos = position;
    
    // Physics parameters
    float repulsionRadius = 4.0;
    float repulsionForce = 5.0;
    
    // Calculate distance to mouse (mapped to world space roughly)
    float dist = distance(pos.xy, uMouse.xy);
    
    // Repulsion logic
    if (dist < repulsionRadius) {
      vec3 dir = normalize(pos - uMouse);
      float force = (repulsionRadius - dist) / repulsionRadius;
      pos += dir * force * repulsionForce;
    }

    // Gentle float (Noise-like)
    pos.y += sin(uTime * 0.5 + pos.x * 0.5) * 0.1;
    pos.x += cos(uTime * 0.3 + pos.y * 0.5) * 0.05;

    // Return to initial position (Elasticity)
    pos = mix(pos, initialPos, 0.05);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  void main() {
    // Circular particle
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Glow effect
    float glow = 1.0 - (dist * 2.0);
    glow = pow(glow, 2.0);
    
    // Electric Blue Color (#2E86DE)
    vec3 color = vec3(0.18, 0.52, 0.87);
    
    gl_FragColor = vec4(color, glow);
  }
`;

// --- Particle System Component ---
const Particles = () => {
    const mesh = useRef();
    const count = 4000;
    
    // Mouse state for shader
    const mouse = useRef(new THREE.Vector3(9999, 9999, 0));

    // Generate random points
    const { positions, sizes, initialPos } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const initialPos = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20; // Spread x
            const y = (Math.random() - 0.5) * 12; // Spread y
            const z = (Math.random() - 0.5) * 5;  // Depth
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            initialPos[i * 3] = x;
            initialPos[i * 3 + 1] = y;
            initialPos[i * 3 + 2] = z;
            
            sizes[i] = Math.random() * 2;
        }
        return { positions, sizes, initialPos };
    }, []);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(9999, 9999, 0) }
    }), []);

    // Update loop
    useFrame((state) => {
        const { clock, pointer, viewport } = state;
        mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();
        
        // Map normalized pointer (-1 to 1) to world units relative to viewport
        const x = (pointer.x * viewport.width) / 2;
        const y = (pointer.y * viewport.height) / 2;
        
        // Smooth lerp for mouse uniform
        mouse.current.lerp(new THREE.Vector3(x, y, 0), 0.1);
        mesh.current.material.uniforms.uMouse.value.copy(mouse.current);
        
        // Update positions buffer for "snap back" logic if doing it in JS (optional, doing in shader for perf)
        // Note: The shader handles the "snap back" via the 'initialPos' attribute and mix function.
        // We do need to update geometry if we were modifying positions in JS, but we aren't here.
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-initialPos"
                    count={count}
                    array={initialPos}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// --- Magnetic Button Component ---
const MagneticButton = ({ children }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const dist = 50; // trigger distance

        if (Math.abs(clientX - centerX) < width / 2 + dist && Math.abs(clientY - centerY) < height / 2 + dist) {
             x.set((clientX - centerX) * 0.3); // Magnetic pull strength
             y.set((clientY - centerY) * 0.3);
        } else {
            x.set(0);
            y.set(0);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            className="cta-button relative overflow-hidden group"
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
             <span className="relative z-10">{children}</span>
             {/* Hover Glow */}
             <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
        </motion.button>
    );
};


const Hero = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-transparent">
            {/* R3F Canvas Layer */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}> 
                    <Particles />
                </Canvas>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 text-center px-4 pointer-events-none">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-blue-500 tracking-widest text-sm md:text-base mb-4 font-mono uppercase"
                >
                    UX/UI Designer | Video Editor
                </motion.h2>
                
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-none mix-blend-overlay"
                >
                    Ramu
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
                        GRAVITY
                    </span>
                </motion.h1>

                <div className="pointer-events-auto inline-block">
                    <MagneticButton>
                        VIEW WORK
                    </MagneticButton>
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1, duration: 1 }}
                 className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
                <span className="text-[10px] text-blue-400 uppercase tracking-widest">Scroll</span>
            </motion.div>
        </section>
    );
};

export default Hero;
