import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import emailjs from '@emailjs/browser';

// ====================================
// EmailJS Configuration
// ====================================
// To set up EmailJS:
// 1. Create a free account at https://www.emailjs.com/
// 2. Create an Email Service (Gmail, Outlook, etc.)
// 3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
// 4. Replace these values with your actual keys:
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';  // e.g., 'service_xxxxxxx'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // e.g., 'template_xxxxxxx'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // e.g., 'xxxxxxxxxxxxxxx'
// ====================================

const ParticleField = () => {
  const count = 200;
  const mesh = useRef();
  const light = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        time: Math.random() * 100,
        speed: Math.random() * 0.01 + 0.001,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        z: Math.random() * 50 - 25,
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current) return; // ✅ prevents crash

    const { x: mouseX, y: mouseY } = state.mouse;

    particles.forEach((p, i) => {
      p.time += p.speed;

      p.x += Math.sin(p.time) * 0.02 + mouseX * 0.05;
      p.y += Math.cos(p.time) * 0.02 + mouseY * 0.05;

      if (p.y > 50) p.y = -50;
      if (p.y < -50) p.y = 50;

      dummy.position.set(p.x, p.y, p.z);
      const s = Math.abs(Math.cos(p.time)) * 0.5 + 0.2;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <pointLight ref={light} distance={40} intensity={2} color="#4fc3dc" />

      <instancedMesh ref={mesh} args={[null, null, count]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#38bdf8"
          emissiveIntensity={0.6}
          roughness={0}
          metalness={1}
        />
      </instancedMesh>
    </group>
  );
};

const InputField = ({ label, type = "text", name, rows, className = "" }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`relative mb-8 group ${className}`}>
            <motion.label 
                animate={{ 
                    y: isFocused ? -28 : 0, 
                    x: isFocused ? -5 : 0,
                    scale: isFocused ? 0.85 : 1, 
                    color: isFocused ? "#60A5FA" : "#6B7280" 
                }}
                className="absolute left-4 top-3 text-gray-500 pointer-events-none origin-left transition-all duration-300 font-tracking-wider text-sm uppercase"
            >
                {label}
            </motion.label>
            
            <div className="relative overflow-hidden rounded-lg bg-white/5 border border-white/10 group-hover:border-blue-500/30 transition-colors">
                 {/* Cosmic Glow Background for Input */}
                <div className={`absolute inset-0 bg-blue-600/5 transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
                
                {rows ? (
                     <textarea
                        name={name}
                        rows={rows}
                        className="w-full bg-transparent px-4 py-3 text-white placeholder-transparent focus:outline-none relative z-10"
                        onFocus={() => setIsFocused(true)}
                        onBlur={(e) => setIsFocused(e.target.value !== "")}
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        className="w-full bg-transparent px-4 py-3 text-white placeholder-transparent focus:outline-none relative z-10"
                        onFocus={() => setIsFocused(true)}
                        onBlur={(e) => setIsFocused(e.target.value !== "")}
                    />
                )}

                {/* Animated Bottom Light Trail */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: isFocused ? 1 : 0, opacity: isFocused ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] origin-left z-20"
                />
                
                 {/* Micro-interaction dots */}
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                    <div className="w-1 h-1 rounded-full bg-blue-500/30" />
                 </div>
            </div>
        </div>
    );
};

const Contact = () => {
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [errors, setErrors] = useState({});

    const validateForm = (formData) => {
        const newErrors = {};
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || name.trim() === '') newErrors.name = 'Identity required';
        if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid frequency required';
        if (!message || message.trim() === '') newErrors.message = 'Data packet empty';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // Validate
        const newErrors = validateForm(formData);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }

        setStatus('sending');
        setErrors({});

        // Simulate transmission delay for effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            const subject = `Portfolio Contact: ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            
            // Open mail client
            window.location.href = `mailto:rammaye87540644@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            setStatus('success');
        } catch (err) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section id="contact" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#050510]">
             {/* Cosmic Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
                    <color attach="background" args={['#050510']} />
                     <fog attach="fog" args={['#050510', 10, 40]} />
                    
                    {/* Stars - Depth field */}
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    
                    {/* Interactive Floating Particles */}
                    <ParticleField />
                    
                    <ambientLight intensity={0.1} />
                </Canvas>
                
                 {/* Nebula/Galaxy Gradients Overlay */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,64,175,0.1),transparent_70%)] pointer-events-none" />
                 <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#050510] to-transparent z-10 pointer-events-none" />
                 <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050510] to-transparent z-10 pointer-events-none" />
            </div>

            <div className="container mx-auto px-4 relative z-10 w-full max-w-2xl">
                 <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                 >
                    {/* Glass Shine Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                    
                    <h2 className="text-4xl md:text-5xl text-white font-bold mb-2 text-center tracking-tight">
                        INITIATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 animate-pulse">SIGNAL</span>
                    </h2>
                    <p className="text-blue-200/60 text-center mb-10 text-sm tracking-widest uppercase">Secure Channel Established</p>

                    <AnimatePresence mode='wait'>
                        {status === 'success' ? (
                             <motion.div 
                                key="success"
                                initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                transition={{ type: "spring", duration: 1 }}
                                className="text-center py-12"
                             >
                                <motion.div 
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} 
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-8 relative"
                                >
                                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 animate-pulse" />
                                    <div className="w-full h-full bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                         <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </motion.div>
                                <h3 className="text-3xl text-white font-bold mb-2">Signal Received</h3>
                                <p className="text-blue-200/50">Transmission successful.</p>
                                
                                <button 
                                    onClick={() => setStatus('idle')}
                                    className="mt-10 px-6 py-2 rounded-full border border-white/10 text-blue-300 text-sm hover:bg-white/5 hover:text-white transition-all hover:scale-105"
                                >
                                    Transmit New Signal
                                </button>
                             </motion.div>
                        ) : (
                            <motion.form 
                                key="form"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                transition={{ duration: 0.5 }}
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <InputField label="Identity (Name)" name="name" />
                                    {errors.name && <p className="text-red-400 text-xs ml-4 -mt-6 mb-2">{errors.name}</p>}
                                </div>
                                <div>
                                    <InputField label="Frequency (Email)" type="email" name="email" />
                                    {errors.email && <p className="text-red-400 text-xs ml-4 -mt-6 mb-2">{errors.email}</p>}
                                </div>
                                <div>
                                    <InputField 
                                        label={`Data Packet \u00A0\u00A0//\u00A0\u00A0 Message`}
                                        rows={4} 
                                        name="message" 
                                        className="mt-8"
                                    />
                                    {errors.message && <p className="text-red-400 text-xs ml-4 -mt-6 mb-2">{errors.message}</p>}
                                </div>

                                <div className="mt-12 text-center">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={status === 'sending'}
                                        className={`relative group w-full md:w-auto px-12 py-4 font-bold rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                                            status === 'error' 
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/50 shadow-red-900/20' 
                                                : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-900/50'
                                        }`}
                                    >
                                        <div className={`absolute inset-0 bg-white/20 transition-transform duration-500 ease-out ${status === 'sending' ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`} />
                                        
                                        {/* Soft Glow Pulse Animation */}
                                        {status === 'sending' && (
                                            <div className="absolute inset-0 bg-blue-400/20 animate-pulse" />
                                        )}

                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                            {status === 'sending' ? (
                                                <>
                                                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                   <span className="tracking-widest text-sm">TRANSMITTING...</span>
                                                </>
                                            ) : status === 'error' ? (
                                                <>
                                                    <span className="tracking-widest text-sm">TRANSMISSION FAILED</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="tracking-widest text-sm">SEND TRANSMISSION</span>
                                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                                </>
                                            )}
                                        </div>
                                        
                                        {/* Button Glow Pulse */}
                                        <div className={`absolute inset-0 rounded-xl ring-2 transition-all duration-500 ${status === 'error' ? 'ring-red-500/20' : 'ring-white/20 group-hover:ring-cyan-400/50'}`} />
                                    </motion.button>
                                    
                                    {status === 'error' && (
                                        <motion.p 
                                            initial={{ opacity: 0, y: 10 }} 
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-400 text-xs mt-4 tracking-wider uppercase"
                                        >
                                            Transmission failed. Please try again.
                                        </motion.p>
                                    )}
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
            
            {/* Corner Interface Elements (Decorations) */}
            <div className="absolute top-24 left-10 hidden lg:block opacity-30">
                <div className="border-l-2 border-t-2 border-blue-500/50 w-12 h-12" />
            </div>
            <div className="absolute bottom-10 right-10 hidden lg:block opacity-30">
                <div className="border-r-2 border-b-2 border-blue-500/50 w-12 h-12" />
            </div>
        </section>
    );
};

export default Contact;
