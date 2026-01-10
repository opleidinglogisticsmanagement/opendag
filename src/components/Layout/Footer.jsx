const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Logistics Management</h3>
            <p className="text-gray-400">
              Ontdek de wereld van logistiek en supply chain management.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-400">
              <a 
                href="https://www.windesheim.nl/opleidingen/voltijd/bachelor/logistics-management" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors underline"
              >
                Hogeschool Windesheim
              </a>
              <br />
              Zwolle, Nederland
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Volg ons</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/groups/6675037/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://loevlogistiek.nl/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Ik Loev campagne
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Logistics Management - Windesheim. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
