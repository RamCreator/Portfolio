import { Canvas } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// --- 3D Blob Component ---
const MorphingBlob = () => {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh scale={2.5}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    color="#2E86DE"
                    attach="material"
                    distort={0.5} // Amount of distortion
                    speed={2}     // Speed of distortion
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
};

// --- Text Reveal Component ---
const RevealText = ({ children, delay = 0 }) => {
    const variants = {
        hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)',
            transition: { duration: 0.8, delay, ease: [0.2, 0.65, 0.3, 0.9] } 
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={variants}
        >
            {children}
        </motion.div>
    );
};

const About = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for the blob
    const yBlob = useTransform(scrollYProgress, [0, 1], [100, -100]);
    // Parallax for text (slower)
    const yText = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <section id="about" ref={containerRef} className="relative py-24 px-4 min-h-screen flex items-center overflow-hidden bg-transparent">
             <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* Left: Text Content */}
                <motion.div style={{ y: yText }} className="order-2 md:order-1 relative z-10">
                    <RevealText delay={0.1}>
                        <h2 className="text-sm font-mono text-blue-500 mb-4 tracking-widest uppercase">
                            // Who I Am
                        </h2>
                    </RevealText>
                    
                    <RevealText delay={0.3}>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
                            DESIGNING THE <br />
                            <span className="text-gray-500">UNSEEN</span>
                        </h3>
                    </RevealText>

                    <RevealText delay={0.5}>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6 font-light">
                            I’m a UI/UX designer with a strong focus on motion and interaction. I design clean, intuitive interfaces that feel smooth, responsive, and easy to use.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6 font-light">
                            I enjoy turning complex ideas into simple, user-friendly digital experiences, using thoughtful design and subtle animations.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed font-light">
                            My goal is to create products that look good, work well, and leave a lasting impression.
                        </p>
                    </RevealText>

                    <RevealText delay={0.7}>
                        <div className="mt-8 flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-blue-500">1+</span>
                                <span className="text-xs text-gray-400 uppercase tracking-widest">Years Exp.</span>
                            </div>
                            <div className="w-[1px] h-12 bg-gray-800"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-blue-500">2+</span>
                                <span className="text-xs text-gray-400 uppercase tracking-widest">Projects</span>
                            </div>
                        </div>
                    </RevealText>
                </motion.div>

                {/* Right: Visual (3D Blob + Portrait) */}
                <motion.div style={{ y: yBlob }} className="order-1 md:order-2 h-[500px] w-full relative flex items-center justify-center">
                    {/* Background Blob */}
                    <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen">
                        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
                            <pointLight position={[-10, -10, -5]} intensity={1} color="#2E86DE" />
                            <MorphingBlob />
                        </Canvas>
                    </div>

                    {/* User Portrait with Glitch/Reveal Effect */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, filter: "brightness(0.5) blur(10px)" }}
                        whileInView={{ opacity: 1, scale: 1, filter: "brightness(1) blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative z-10 w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden border border-white/10 group"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay z-10"></div>
                        <img 
                            src="/img/5.jpg" 
                            alt="RamCreator Portrait" 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-110"
                        />
                        
                        {/* Scanning Line Animation */}
                        <motion.div 
                             animate={{ top: ["0%", "100%", "0%"] }}
                             transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                             className="absolute left-0 w-full h-[2px] bg-blue-500/50 shadow-[0_0_15px_#2E86DE] z-20"
                        />
                    </motion.div>
                </motion.div>

             </div>
        </section>
    );
};

export default About;
