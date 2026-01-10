import { useState } from 'react';
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Offset in pixels
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-logistics-blue via-blue-600 to-logistics-orange text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welkom bij Logistics Management
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Ontdek de wereld van logistiek, supply chain management en efficiënte distributie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => window.open('https://www.windesheim.nl/opleidingen/voltijd/bachelor/logistics-management', '_blank', 'noopener,noreferrer')}
                className="border-white text-white hover:bg-white hover:text-logistics-blue"
              >
                Meer Weten
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('quiz')}
                className="border-white text-white hover:bg-white hover:text-logistics-blue"
              >
                Doe de Profieltest
              </Button>
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
      <section id="game" className="py-8 md:py-12 bg-logistics-light-orange">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
            Speel de Game
          </h2>
          
          {!activeGame ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <Card className="text-center cursor-pointer hover:shadow-2xl transition-shadow flex flex-col h-full" onClick={() => setActiveGame('packing')}>
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Packing Game</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Pak dozen efficiënt in een container. Test je ruimtelijk inzicht en optimalisatie skills!
                </p>
                <Button variant="primary" className="mt-auto">Speel Nu</Button>
              </Card>

              <Card className="text-center cursor-pointer hover:shadow-2xl transition-shadow flex flex-col h-full" onClick={() => setActiveGame('sorter')}>
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Sorteer Game</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Test je snelheid en precisie! Sorteer pakketjes naar de juiste bestemming voordat de tijd op is. Hoe hoger je score, hoe beter je bent in logistieke besluitvorming onder druk.
                </p>
                <Button variant="primary" className="mt-auto">Speel Nu</Button>
              </Card>

              <Card className="text-center cursor-pointer hover:shadow-2xl transition-shadow flex flex-col h-full" onClick={() => setActiveGame('flowfactory')}>
                <div className="text-6xl mb-4">🏭</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Flow Factory</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Houd de logistieke flow op gang tussen drie stations: Grondstoffen, Productie en Klant!
                </p>
                <Button variant="primary" className="mt-auto">Speel Nu</Button>
              </Card>

              <Card className="text-center cursor-pointer hover:shadow-2xl transition-shadow flex flex-col h-full" onClick={() => setActiveGame('warehousewizard')}>
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Warehouse Wizard</h3>
                <p className="text-gray-600 mb-4 flex-grow">
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
