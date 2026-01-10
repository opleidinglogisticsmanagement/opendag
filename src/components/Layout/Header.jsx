const Header = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-logistics-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">LM</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Logistics Management</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#over" className="text-gray-700 hover:text-logistics-blue transition-colors">Over</a>
            <a href="#quiz" onClick={(e) => { e.preventDefault(); scrollToSection('quiz'); }} className="text-gray-700 hover:text-logistics-blue transition-colors">Doe de profieltest</a>
            <a href="#game" className="text-gray-700 hover:text-logistics-blue transition-colors">Game</a>
            <a 
              href="https://www.windesheim.nl/opleidingen/voltijd/bachelor/logistics-management" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-logistics-blue transition-colors"
            >
              Opleidingssite
            </a>
            <a 
              href="https://loevlogistiek.nl/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-logistics-blue transition-colors"
            >
              Bezoek Loevlogistiek.nl
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
