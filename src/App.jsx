import { useState, useEffect, useCallback } from 'react';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import QuizContainer from './components/Quiz/QuizContainer';
import PackingGame from './components/Games/PackingGame';
import SorterGame from './components/Games/SorterGame';
import FlowFactory from './components/Games/FlowFactory';
import WarehouseWizard from './components/Games/WarehouseWizard';
import Button from './components/UI/Button';
import Card from './components/UI/Card';
import { introText } from './data/quizQuestions';

function App() {
  const [activeGame, setActiveGame] = useState(null);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Offset in pixels for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Handle hash navigation with offset for sticky header
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1); // Remove the #
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 100); // Small delay to ensure DOM is ready
      }
    };

    // Handle initial hash on page load
    if (window.location.hash) {
      handleHashChange();
    }

    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Handle clicks on hash links
    const handleLinkClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link && link.getAttribute('href') !== '#') {
        const href = link.getAttribute('href');
        const sectionId = href.substring(1);
        e.preventDefault();
        window.history.pushState(null, '', href);
        scrollToSection(sectionId);
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('click', handleLinkClick);
    };
  }, [scrollToSection]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-logistics-blue via-blue-600 to-logistics-orange text-white py-20 md:py-32 overflow-hidden">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <iframe
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full min-w-full min-h-full object-cover"
            src="https://www.youtube.com/embed/3nAmjOhIOAE?autoplay=1&mute=1&loop=1&playlist=3nAmjOhIOAE&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
            title="Background Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ pointerEvents: 'none' }}
          />
          {/* Overlay - darker at top and bottom, transparent in middle for video */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-logistics-blue/95 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-logistics-orange/95 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 -mt-8 md:-mt-12">
          <div className="max-w-3xl mx-auto text-center">
            {/* Title at the top */}
            <div className="flex justify-center items-center mb-60 md:mb-[21rem]">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold whitespace-nowrap">
                Welkom bij Logistics Management
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Over de Opleiding Section */}
      <section id="over" className="py-8 md:py-12 bg-logistics-light-blue">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
            Over de Opleiding
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Supply Chain Regisseur</h3>
              <p className="text-gray-600">
                Leer hoe jij de spin in het web bent in complexe ketens. Je verbindt mensen, processen en systemen om niet alleen winst, maar ook maatschappelijke waarde en duurzaamheid te creëren. Jij houdt het overzicht van grondstof tot eindklant.
              </p>
            </Card>
            <Card className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Transport & Distributie</h3>
              <p className="text-gray-600">
                Logistiek gaat verder dan van A naar B. Ontdek hoe je logistieke netwerken slim en circulair inricht. Jij bedenkt innovatieve oplossingen voor de uitdagingen van morgen, zoals emissievrije stadslogistiek en smart warehousing.
              </p>
            </Card>
            <Card className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Data gedreven</h3>
              <p className="text-gray-600">
                Data is de brandstof van de moderne logistiek. Leer hoe je big data verzamelt, analyseert en vertaalt naar slimme dashboards. Met jouw inzichten help je bedrijven om processen te voorspellen en continu te verbeteren.
              </p>
            </Card>
          </div>
          
          <div className="mt-8 max-w-3xl mx-auto">
            <Card className="bg-white">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Waarom Logistics Management?</h3>
              <p className="text-gray-600 mb-4">
                Logistiek is de motor van onze economie en maatschappij. Maar die motor moet schoner, slimmer en sneller. Als student Logistics Management word je opgeleid tot de procesverbeteraar van de toekomst. Je kijkt verder dan het verplaatsen van spullen; je leert complete ecosystemen aansturen.
              </p>
              <p className="text-gray-600 mb-4">
                Bij Windesheim duik je direct de praktijk in. Je leert hoe je met big data processen optimaliseert, hoe je ketens verduurzaamt en hoe je leidinggeeft aan verandering. Of het nu gaat om een groot distributiecentrum, een ziekenhuis of een festival: jij zorgt dat alles stroomt.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-bold text-gray-800 mb-3">Wat maakt deze opleiding uniek?</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span><strong>Persoonlijke groei:</strong> Je ontwikkelt 'future skills' zoals leiderschap, samenwerken en creatief denken.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span><strong>Impact maken:</strong> Je leert balanceren tussen mensen (People), planeet (Planet) en winst (Profit).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    <span><strong>Eigen kleur:</strong> Ontwikkel je tot Regisseur, Innovator of Analist en kies de richting die bij jou past.</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quiz" className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
            Ontdek jouw Logistieke Profiel
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto leading-relaxed">
            {introText}
          </p>
          <QuizContainer />
        </div>
      </section>

      {/* Game Section */}
      <section id="game" className={`${!activeGame ? 'min-h-screen flex flex-col' : 'py-8 md:py-12'} bg-logistics-light-orange`}>
        <div className={`container mx-auto px-4 ${!activeGame ? 'flex-1 flex flex-col justify-center' : ''}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center text-gray-800 ${!activeGame ? 'mb-4 md:mb-6' : 'mb-6'}`}>
            Speel de Game
          </h2>
          
          {!activeGame ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
              <Card className="text-center cursor-pointer hover:shadow-2xl transition-shadow flex flex-col h-full max-h-[400px]" onClick={() => setActiveGame('packing')}>
                <div className="text-5xl md:text-6xl mb-3">📦</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Packing Game</h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 flex-grow overflow-hidden">
                  Pak dozen efficiënt in een container. Test je ruimtelijk inzicht en optimalisatie skills!
                </p>
                <Button variant="primary" className="mt-auto">Speel Nu</Button>
              </Card>

              <Card className="text-center cursor-pointer hover:shadow-2xl transition-shadow flex flex-col h-full max-h-[400px]" onClick={() => setActiveGame('sorter')}>
                <div className="text-5xl md:text-6xl mb-3">📋</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Sorteer Game</h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 flex-grow overflow-hidden">
                  Test je snelheid en precisie! Sorteer pakketjes naar de juiste bestemming voordat de tijd op is. Hoe hoger je score, hoe beter je bent in logistieke besluitvorming onder druk.
                </p>
                <Button variant="primary" className="mt-auto">Speel Nu</Button>
              </Card>

              <Card className="text-center cursor-pointer hover:shadow-2xl transition-shadow flex flex-col h-full max-h-[400px]" onClick={() => setActiveGame('flowfactory')}>
                <div className="text-5xl md:text-6xl mb-3">🏭</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Flow Factory</h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 flex-grow overflow-hidden">
                  Houd de logistieke flow op gang tussen drie stations: Grondstoffen, Productie en Klant!
                </p>
                <Button variant="primary" className="mt-auto">Speel Nu</Button>
              </Card>

              <Card className="text-center cursor-pointer hover:shadow-2xl transition-shadow flex flex-col h-full max-h-[400px]" onClick={() => setActiveGame('warehousewizard')}>
                <div className="text-5xl md:text-6xl mb-3">📦</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Warehouse Wizard</h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 flex-grow overflow-hidden">
                  Test je order picking skills! Klik de vakken in de juiste volgorde om orders zo snel mogelijk te verzamelen. Leer route-efficiëntie en pickingstrategie!
                </p>
                <Button variant="primary" className="mt-auto">Speel Nu</Button>
              </Card>
            </div>
          ) : (
            <div>
              <div className="mb-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveGame(null)}
                  className="mb-4"
                >
                  ← Terug naar Game Selectie
                </Button>
              </div>
              {activeGame === 'packing' && <PackingGame />}
              {activeGame === 'sorter' && <SorterGame />}
              {activeGame === 'flowfactory' && <FlowFactory />}
              {activeGame === 'warehousewizard' && <WarehouseWizard />}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
