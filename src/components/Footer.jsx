import { motion } from 'framer-motion';
import { Linkedin, Instagram, Mail, ArrowUp } from 'lucide-react';

const SocialLink = ({ href, icon: Icon, label }) => {
    const isMailto = href.startsWith('mailto:');
    
    const handleClick = (e) => {
        if (isMailto) {
            e.preventDefault();
            window.location.href = href;
        }
    };

    const linkProps = isMailto ? { onClick: handleClick } : { target: "_blank", rel: "noreferrer" };

    return (
        <motion.a
            href={href}
            {...linkProps}
            aria-label={label}
            whileHover={{ scale: 1.2, color: "#60A5FA" }}
            whileTap={{ scale: 0.9 }}
            className="relative p-3 bg-white/5 rounded-full border border-white/10 text-gray-400 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-colors group"
        >
            <Icon size={20} />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-blue-600 text-white text-[10px] uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {label}
            </span>
        </motion.a>
    );
};

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative w-full bg-[#050510] py-12 overflow-hidden border-t border-white/5">
            {/* Top Glowing Border Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shadow-[0_0_10px_#3b82f6]" />
            
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.1),transparent_50%)] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    
                    {/* Brand / Copyright */}
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tighter">
                            RAM<span className="text-blue-500">CREATOR</span>
                        </h3>
                        <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">
                            &copy; 2025 // All Systems Operational
                        </p>
                    </div>

                    {/* Social Grid */}
                    <div className="flex gap-4">
                        <SocialLink href="https://www.linkedin.com/in/ramu-762881282/" icon={Linkedin} label="Establish Link" />
                        <SocialLink href="https://www.instagram.com/rhxx_.24?igsh=ZXBwMW4yNzJ2eGNi" icon={Instagram} label="Visual Feed" />
                        <SocialLink href="mailto:rammaye87540644@gmail.com" icon={Mail} label="Send Packet" />
                    </div>

                    {/* Back to Top */}
                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ y: -5, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex flex-col items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors"
                    >
                        <div className="p-3 rounded-xl border border-white/10 bg-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all">
                            <ArrowUp size={20} />
                        </div>
                        <span className="text-[10px] font-mono tracking-widest uppercase opacity-50 group-hover:opacity-100">Return to Base</span>
                    </motion.button>
                </div>

                {/* Bottom Links */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
                    <a href="#" className="hover:text-blue-400 transition-colors">Privacy Protocol</a>
                    <span className="text-gray-800">|</span>
                    <a href="#" className="hover:text-blue-400 transition-colors">Terms of Transmission</a>
                    <span className="text-gray-800">|</span>
                    <a href="#" className="hover:text-blue-400 transition-colors">System Status</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
