import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center transition-all bg-black/10 backdrop-blur-md border-b border-white/5">
      <nav className="container mx-auto flex justify-between items-center">
        <a href="#hero" className="font-heading font-bold text-2xl tracking-widest uppercase text-white hover:text-blue-500 transition-colors z-50">
            RamCreator
        </a>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden flex flex-col gap-1.5 z-50 relative group" 
          aria-label="Toggle navigation menu"
          onClick={toggleMenu}
        >
          <span className={`w-8 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-8 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-8 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Desktop & Mobile Nav */}
        <ul className={`
            fixed md:relative inset-0 h-screen md:h-auto flex flex-col md:flex-row items-center justify-center pb-32 md:pb-0 gap-10 md:gap-12 
            transition-all duration-500 ease-in-out z-40
            ${isMenuOpen ? 'opacity-100 pointer-events-auto bg-black/90 backdrop-blur-xl' : 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto bg-transparent'}
        `}>
          {['About', 'Services', 'Portfolio', 'Contact'].map((item) => (
              <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`} 
                    onClick={() => setIsMenuOpen(false)}
                    className="font-mono text-2xl md:text-xs text-white md:text-gray-400 hover:text-blue-500 uppercase tracking-[0.2em] transition-colors relative group"
                  >
                      <span className="relative z-10"> // {item}</span>
                      <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </a>
              </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
