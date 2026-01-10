const Header = () => {
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
          <div className="hidden md:flex space-x-6">
            <a href="#over" className="text-gray-700 hover:text-logistics-blue transition-colors">Over</a>
            <a href="#quiz" className="text-gray-700 hover:text-logistics-blue transition-colors">Quiz</a>
            <a href="#game" className="text-gray-700 hover:text-logistics-blue transition-colors">Game</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
