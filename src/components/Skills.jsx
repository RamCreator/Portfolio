import { useRef, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';

// --- Static Star Field (Deep Space) ---
const StarLayer = ({ count, size, color, opacity, radius = 50 }) => {
    // Generate random static positions
    const positions = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            temp[i * 3] = (Math.random() - 0.5) * radius * 3; 
            temp[i * 3 + 1] = (Math.random() - 0.5) * radius * 2; 
            temp[i * 3 + 2] = (Math.random() - 0.5) * radius * 1.5; 
        }
        return temp;
    }, [count, radius]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={size}
                color={color}
                transparent
                opacity={opacity}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const DeepSpaceBackground = () => {
    const group = useRef();

    useFrame((state) => {
        if (!group.current) return;
        // Subtle background drift (Parallax)
        const { x, y } = state.mouse;
        // Very slow rotation for "alive" feel
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.02, 0.05);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.02, 0.05);
    });

    return (
        <group ref={group} rotation={[0, 0, Math.PI / 4]}>
            {/* Dense Star Field (like the reference image) */}
            <StarLayer count={6000} size={0.015} color="#ffffff" opacity={0.5} radius={60} />
            <StarLayer count={2000} size={0.03} color="#a5f3fc" opacity={0.4} radius={50} />
            <StarLayer count={500} size={0.08} color="#60A5FA" opacity={0.8} radius={45} />
            
            {/* Subtle "Nebula" wisps using loose particles */}
            <StarLayer count={300} size={0.5} color="#1e3a8a" opacity={0.1} radius={30} />
        </group>
    );
};

// --- Shooting Star Component ---
const ShootingStar = ({ target, onComplete }) => {
    const ref = useRef();
    const trailRef = useRef();
    const [active, setActive] = useState(false);
    
    useEffect(() => {
        if (target) {
            setActive(true);
            // Calculate start pos (off-screen top-left relative to target)
            // If target is (x, y), start at (x-10, y+10) to fly diagonal down-right
            if (ref.current) {
                ref.current.position.set(target.x - 20, target.y + 10, 0);
            }
        }
    }, [target]);

    useFrame((state, delta) => {
        if (!active || !ref.current) return;
        
        // Move diagonal down-right
        ref.current.position.x += 40 * delta; // Fast speed
        ref.current.position.y -= 20 * delta;
        
        // Check if passed the screen/target significantly
        if (target && ref.current.position.x > target.x + 20) {
            setActive(false);
            if (onComplete) onComplete();
        }
    });

    if (!active) return null;

    return (
        <group>
            <mesh ref={ref} position={[-999,0,0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            
            {ref.current && (
                <Trail
                    width={3} 
                    color={'#60A5FA'} 
                    length={15} 
                    decay={0.8} 
                    local={false} 
                    stride={0} 
                    interval={1} 
                    target={ref.current}
                />
            )}
        </group>
    );
};

// --- Glassmorphic Skill Card ---
const SkillCard = ({ title, icon, tools, className }) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden ${className}`}
        >
            {/* Glow Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Content */}
            <div className="relative z-10">
                <div className="mb-4 text-blue-400 group-hover:text-white transition-colors duration-300">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide uppercase">{title}</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                    {tools.map((tool, i) => (
                        <span key={i} className="text-xs font-mono text-gray-400 border border-white/10 px-2 py-1 rounded bg-black/20">
                            {tool}
                        </span>
                    ))}
                </div>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
        </motion.div>
    );
};

// --- Main Component ---
const Skills = () => {
    const [starTarget, setStarTarget] = useState(null);

    // We'll use a transparent plane to catch clicks
    const ClickPlane = () => {
        const { camera } = useThree();
        return (
            <mesh 
                visible={false} 
                position={[0,0,0]} 
                onClick={(e) => {
                     e.stopPropagation();
                     // e.point is the Vector3 intersection point in world space
                     setStarTarget(e.point.clone());
                }}
            >
                <planeGeometry args={[100, 100]} />
                <meshBasicMaterial />
            </mesh>
        );
    }
    
    return (
        <section 
            id="services"
            className="relative py-24 min-h-screen flex flex-col justify-center overflow-hidden bg-[#050510]"
        >
            
            {/* 1. Cosmic Canvas Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <color attach="background" args={['#020205']} /> {/* Darker/Richer Base */}
                    <fog attach="fog" args={['#020205', 10, 40]} />
                    
                    <DeepSpaceBackground />
                    <ClickPlane />
                    <ShootingStar 
                        target={starTarget} 
                        onComplete={() => setStarTarget(null)} 
                    />
                    
                    <ambientLight intensity={0.5} />
                </Canvas>
                
                {/* Vignette & Noise Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
                
                {/* Blue Gradient - Bottom (Cosmic Glow) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-900/30 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-900/30 blur-[100px] rounded-full pointer-events-none" />
            </div>

            {/* 2. Content Container */}
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        <span className="text-blue-500">//</span> TECH STACK <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">& TOOLS</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-sm font-mono tracking-widest uppercase">
                        Quantum Configured Creative Arsenal - <span className="text-blue-500 text-xs">Explore for Meteor</span>
                    </p>
                </motion.div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    
                    {/* UI/UX - Large Card */}
                    <SkillCard 
                        title="UI/UX Design"
                        icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
                        tools={["Wireframing", "Prototyping", "User Research", "Interaction Design"]}
                        className="md:col-span-2 bg-[#0a0a15]/80"
                    />

                    {/* Figma */}
                    <SkillCard 
                        title="Figma"
                        icon={<svg className="w-8 h-8" viewBox="0 0 38 57" fill="none"><path d="M19 28.5C13.754 28.5 9.5 32.754 9.5 38C9.5 43.246 13.754 47.5 19 47.5V28.5Z" fill="#0ACF83"/><path d="M9.5 19C9.5 24.246 13.754 28.5 19 28.5V9.5C13.754 9.5 9.5 13.754 9.5 19Z" fill="#A259FF"/><path d="M19 19C24.246 19 28.5 24.246 28.5 28.5C28.5 32.754 24.246 38 19 38V19Z" fill="#1ABCFE"/><path d="M19 0V9.5C24.246 9.5 28.5 13.754 28.5 19C28.5 13.754 24.246 9.5 19 9.5V0Z" fill="#F24E1E"/><path d="M9.5 0C4.254 0 0 4.254 0 9.5C0 14.746 4.254 19 9.5 19H19V0H9.5Z" fill="#F24E1E"/></svg>}
                        tools={["Components", "Auto Layout"]}
                        className="md:col-span-1"
                    />

                     {/* Adobe Illustrator */}
                     <SkillCard 
                        title="Adobe Illustrator"
                        icon={<span className="text-3xl font-bold text-[#FF9A00]">Ai</span>}
                        tools={["Vector Graphics", "Logo Design", "Typography"]}
                        className="md:col-span-1"
                    />

                    {/* Canva */}
                    <SkillCard 
                        title="Canva"
                        icon={<span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Ca</span>}
                        tools={["Social Media", "Layouts"]}
                        className="md:col-span-1"
                    />

                     {/* Motion Tools Combined */}
                     <SkillCard 
                        title="Motion Graphics"
                        icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        tools={["CapCut", "Alight Motion", "Keyframes"]}
                        className="md:col-span-1"
                    />

                </div>
            </div>
        </section>
    );
};

export default Skills;
