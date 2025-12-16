import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity, useMotionValue, useAnimationFrame } from 'framer-motion';

// Import project images
import dsportszoneShop from '/public/img/Dsprtszone-1.png';
import brightBrains from '/public/img/project1.png';
import kadaikuttyPoster from '/public/img/project 3.png';
import dsportszoneBrand from '/public/img/Dsportszone-2.png';
import brightBrains2 from '/public/img/project 2.jpg';

const projects = [
    { title: "Dsportszone Shop", category: "Social Media", img: dsportszoneShop },
    { title: "Bright Brains", category: "Brand Identity", img: brightBrains },
    { title: "Kadaikutty Poster", category: "Poster Design", img: kadaikuttyPoster },
    { title: "Dsportszone Brand", category: "Brand Design", img: dsportszoneBrand },
    { title: "Bright Brains II", category: "Brand Identity", img: brightBrains2 },
];

const ProjectCard = ({ project, scrollX }) => {
    // 1. Get scrolling velocity
    const xVelocity = useVelocity(scrollX);
    
    // 2. Smooth out the velocity reading
    const smoothVelocity = useSpring(xVelocity, { damping: 50, stiffness: 400 });

    // 3. Map velocity to skew amount (Aggressive skew for velocity)
    const skewX = useTransform(smoothVelocity, [-1000, 1000], [15, -15]);
    
    // 4. Map velocity to scale (Stretch effect)
    const scale = useTransform(smoothVelocity, [-1000, 1000], [1, 1]); // Keeping scale safe implies mostly skew

    return (
        <motion.div 
            className="min-w-[400px] h-[500px] relative rounded-xl overflow-hidden bg-gray-900 group snap-center border border-white/10"
            style={{ 
                skewX, 
            }}
        >
            {/* Image with Glitch/Scale Effect */}
            <div className="absolute inset-0 overflow-hidden">
                <img 
                    src={project.img} 
                    alt={project.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:filter group-hover:contrast-125"
                />
            </div>

            {/* Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-white uppercase font-heading tracking-wide drop-shadow-[0_0_10px_rgba(46,134,222,0.5)]">
                    {project.title}
                </h3>
                <p className="text-blue-400 text-sm tracking-[0.2em] font-mono mt-2 border-l-2 border-blue-500 pl-3">
                    {project.category}
                </p>
            </div>
            
            {/* Neon Border Glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-xl transition-all duration-300 pointer-events-none shadow-[0_0_0px_rgba(46,134,222,0)] group-hover:shadow-[0_0_30px_rgba(46,134,222,0.3)]"></div>
        </motion.div>
    );
};

const Portfolio = () => {
    const containerRef = useRef(null);
    const { scrollX } = useScroll({ container: containerRef });

    return (
        <section id="portfolio" className="py-24 relative min-h-screen flex flex-col justify-center overflow-hidden">
             <div className="container mx-auto mb-12 px-4">
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase text-right">
                    Selected <span className="text-blue-600">Works</span>
                </h2>
                <p className="text-right text-gray-400 mt-2 font-mono text-sm">// DRAG or SCROLL to explore</p>
             </div>

            {/* Scroll Container */}
            <div 
                ref={containerRef}
                className="flex gap-16 overflow-x-auto py-12 px-[10vw] no-scrollbar snap-x snap-mandatory perspective-1000"
                style={{ scrollBehavior: 'smooth' }}
            >
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} scrollX={scrollX} />
                ))}
            </div>
        </section>
    );
};

export default Portfolio;
