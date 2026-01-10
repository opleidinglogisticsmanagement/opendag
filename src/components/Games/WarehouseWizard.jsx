import { useState, useEffect } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const WarehouseWizard = () => {
  const [gameState, setGameState] = useState('intro'); // 'intro' or 'game'
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [orders, setOrders] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [playerRoute, setPlayerRoute] = useState([]);
  const [shortestRoute, setShortestRoute] = useState(0);
  const [routeEfficiency, setRouteEfficiency] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Grid: 4 rows x 5 columns = 20 locations (A-T)
  const grid = [
    ['A', 'B', 'C', 'D', 'E'],
    ['F', 'G', 'H', 'I', 'J'],
    ['K', 'L', 'M', 'N', 'O'],
    ['P', 'Q', 'R', 'S', 'T']
  ];

  // Get all locations as flat array
  const allLocations = grid.flat();

  // Calculate Manhattan distance between two locations
  const getDistance = (loc1, loc2) => {
    const getCoords = (loc) => {
      for (let row = 0; row < grid.length; row++) {
        const col = grid[row].indexOf(loc);
        if (col !== -1) return [row, col];
      }
      return null;
    };

    const coords1 = getCoords(loc1);
    const coords2 = getCoords(loc2);
    if (!coords1 || !coords2) return 0;

    return Math.abs(coords1[0] - coords2[0]) + Math.abs(coords1[1] - coords2[1]);
  };

  // Calculate shortest route using nearest neighbor heuristic
  const calculateShortestRoute = (locations) => {
    if (locations.length <= 1) return 0;
    if (locations.length === 2) return getDistance(locations[0], locations[1]);

    let totalDistance = 0;
    let remaining = [...locations];
    let current = remaining.shift();

    while (remaining.length > 0) {
      let nearest = remaining[0];
      let minDist = getDistance(current, nearest);

      for (let loc of remaining) {
        const dist = getDistance(current, loc);
        if (dist < minDist) {
          minDist = dist;
          nearest = loc;
        }
      }

      totalDistance += minDist;
      current = nearest;
      remaining = remaining.filter(loc => loc !== nearest);
    }

    return totalDistance;
  };

  // Generate a new random order
  const generateOrder = () => {
    const numLocations = 3 + Math.floor(Math.random() * 3); // 3-5 locations
    const shuffled = [...allLocations].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, numLocations);
  };

  // Calculate player route distance
  const calculatePlayerRouteDistance = (route) => {
    if (route.length <= 1) return 0;
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
      total += getDistance(route[i], route[i + 1]);
    }
    return total;
  };

  // Start a new order
  const startNewOrder = () => {
    const newOrder = generateOrder();
    setCurrentOrder(newOrder);
    setPlayerRoute([]);
    const shortest = calculateShortestRoute(newOrder);
    setShortestRoute(shortest);
    setRouteEfficiency(0);
  };

  // Timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setGameStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, timeLeft, gameOver]);

  // Initialize first order when game starts
  useEffect(() => {
    if (gameStarted && currentOrder.length === 0) {
      startNewOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]);

  // Calculate route efficiency when player route changes
  useEffect(() => {
    if (playerRoute.length > 0 && currentOrder.length > 0) {
      const playerDistance = calculatePlayerRouteDistance(playerRoute);
      const allVisited = currentOrder.every(loc => playerRoute.includes(loc));
      
      if (allVisited && shortestRoute > 0) {
        const efficiency = Math.round((shortestRoute / playerDistance) * 100);
        setRouteEfficiency(efficiency);
      } else {
        setRouteEfficiency(0);
      }
    }
  }, [playerRoute, currentOrder, shortestRoute]);

  const handleCellClick = (location) => {
    if (!gameStarted || gameOver) return;

    // Check if location is in current order
    if (!currentOrder.includes(location)) return;

    // Check if already clicked
    if (playerRoute.includes(location)) return;

    // Add to route
    const newRoute = [...playerRoute, location];
    setPlayerRoute(newRoute);

    // Check if all locations visited
    const allVisited = currentOrder.every(loc => newRoute.includes(loc));
    if (allVisited) {
      const playerDistance = calculatePlayerRouteDistance(newRoute);
      const efficiency = shortestRoute > 0 ? Math.round((shortestRoute / playerDistance) * 100) : 0;
      
      // Calculate points: base points + efficiency bonus
      const basePoints = 100;
      const efficiencyBonus = Math.floor(efficiency * 2);
      const timeBonus = Math.floor(timeLeft);
      const points = basePoints + efficiencyBonus + timeBonus;

      setScore(prev => prev + points);
      setOrders(prev => prev + 1);
      setEfficiency(prev => {
        const newEfficiency = prev === 0 ? efficiency : Math.round((prev + efficiency) / 2);
        return newEfficiency;
      });

      // Start new order after a short delay
      setTimeout(() => {
        startNewOrder();
      }, 1000);
    }
  };

  const startGame = () => {
    setGameState('game');
    setGameStarted(true);
    setTimeLeft(60);
    setScore(0);
    setOrders(0);
    setEfficiency(0);
    setCurrentOrder([]);
    setPlayerRoute([]);
    setShortestRoute(0);
    setRouteEfficiency(0);
    setGameOver(false);
  };

  const resetGame = () => {
    setGameStarted(false);
    setTimeLeft(60);
    setScore(0);
    setOrders(0);
    setEfficiency(0);
    setCurrentOrder([]);
    setPlayerRoute([]);
    setShortestRoute(0);
    setRouteEfficiency(0);
    setGameOver(false);
  };

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-logistics-blue via-blue-600 to-logistics-orange p-4">
        <Card className="max-w-2xl w-full text-center">
          <div className="text-7xl mb-6">📦</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Warehouse Wizard
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 px-4 leading-relaxed">
            Test je order picking skills! Klik de vakken in de juiste volgorde om orders zo snel mogelijk te verzamelen. Leer route-efficiëntie en pickingstrategie!
          </p>
          
          {/* Key Metrics */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-yellow-100 px-6 py-3 rounded-full flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="text-gray-800 font-semibold">Snelheid</span>
            </div>
            <div className="bg-pink-100 px-6 py-3 rounded-full flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              <span className="text-gray-800 font-semibold">Tijdstraf</span>
            </div>
            <div className="bg-green-100 px-6 py-3 rounded-full flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span className="text-gray-800 font-semibold">Efficiëntie</span>
            </div>
          </div>

          <Button 
            onClick={startGame} 
            className="bg-logistics-orange hover:bg-orange-600 text-white text-2xl px-16 py-6 w-full max-w-md mx-auto flex items-center justify-center gap-3"
          >
            <span>🎮</span>
            <span>SPEEL NU</span>
          </Button>
        </Card>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-3xl">⬡</div>
            <h1 className="text-3xl md:text-4xl font-bold text-logistics-orange">
              Warehouse Wizard
            </h1>
          </div>
          <p className="text-center text-gray-600 text-lg">
            Vind de kortste route door het magazijn!
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-500 rounded-lg p-4 text-center text-white">
              <div className="text-sm mb-1 flex items-center justify-center gap-1">
                <span>⏰</span>
                <span>Tijd</span>
              </div>
              <div className="text-3xl font-bold">{timeLeft}s</div>
            </div>
            <div className="bg-green-500 rounded-lg p-4 text-center text-white">
              <div className="text-sm mb-1 flex items-center justify-center gap-1">
                <span>📊</span>
                <span>Score</span>
              </div>
              <div className="text-3xl font-bold">{score}</div>
            </div>
            <div className="bg-yellow-500 rounded-lg p-4 text-center text-white">
              <div className="text-sm mb-1 flex items-center justify-center gap-1">
                <span>✅</span>
                <span>Orders</span>
              </div>
              <div className="text-3xl font-bold">{orders}</div>
            </div>
            <div className="bg-purple-500 rounded-lg p-4 text-center text-white">
              <div className="text-sm mb-1 flex items-center justify-center gap-1">
                <span>%</span>
                <span>Efficiëntie</span>
              </div>
              <div className="text-3xl font-bold">{efficiency}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Info and Order Locations */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-100 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-600 mb-1">Jouw Route</div>
              <div className="text-lg font-bold text-gray-800">
                {playerRoute.length > 0 ? `${calculatePlayerRouteDistance(playerRoute)} stappen` : '-'}
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-600 mb-1">Kortste Route</div>
              <div className="text-lg font-bold text-gray-800">
                {shortestRoute > 0 ? `${shortestRoute} stappen` : '-'}
              </div>
            </div>
            <div className="bg-orange-100 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-600 mb-1">Efficiëntie</div>
              <div className="text-lg font-bold text-gray-800">
                {routeEfficiency > 0 ? `${routeEfficiency}%` : '-'}
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1 flex items-center justify-center gap-1">
                <span>📄</span>
                <span>Order Locaties</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {currentOrder.map((loc, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                      playerRoute.includes(loc)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Instructions Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Hoe te spelen:</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-xl">📄</span>
                  <span>Je krijgt een orderlijst met locaties (bijv. A, D, M, G)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">🗺️</span>
                  <span>Vind de kortste route door alle locaties te bezoeken</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">👆</span>
                  <span>Klik de vakken in de volgorde die jij denkt dat het kortst is</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">📊</span>
                  <span>Je route-efficiëntie wordt vergeleken met de kortste route</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">🏆</span>
                  <span>Hoe efficiënter je route, hoe hoger je score!</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Grid Area */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
                {grid.map((row, rowIdx) =>
                  row.map((location, colIdx) => {
                    const isInOrder = currentOrder.includes(location);
                    const isInRoute = playerRoute.includes(location);
                    const routeIndex = playerRoute.indexOf(location);
                    const isNext = isInOrder && !isInRoute;

                    let cellClass = 'bg-gray-200 text-gray-700';
                    if (isInRoute) {
                      cellClass = 'bg-green-500 text-white';
                    } else if (isNext) {
                      cellClass = 'bg-yellow-400 text-gray-800 cursor-pointer hover:bg-yellow-500';
                    } else if (isInOrder) {
                      cellClass = 'bg-blue-300 text-gray-800';
                    }

                    return (
                      <button
                        key={`${rowIdx}-${colIdx}`}
                        onClick={() => handleCellClick(location)}
                        disabled={!isNext || !gameStarted || gameOver}
                        className={`aspect-square rounded-lg font-bold text-xl md:text-2xl transition-all duration-200 ${
                          cellClass
                        } ${isNext ? 'hover:scale-105 shadow-lg' : ''} ${
                          !isNext || !gameStarted || gameOver ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                        }`}
                      >
                        <div>{location}</div>
                        {isInRoute && routeIndex !== -1 && (
                          <div className="text-xs mt-1">{routeIndex + 1}</div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Start Game Button */}
      <div className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="container mx-auto px-4 py-4 text-center">
          <Button
            onClick={gameStarted ? resetGame : startGame}
            className={`${
              gameStarted
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-logistics-orange hover:bg-orange-600'
            } text-white text-xl px-12 py-4`}
          >
            {gameStarted ? '🔄 RESET SPEL' : '► START SPEL'}
          </Button>
        </div>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Tijd is op!</h2>
            <div className="space-y-3 mb-6">
              <div className="text-2xl font-bold text-logistics-blue">
                Finale Score: {score}
              </div>
              <div className="text-lg text-gray-600">
                Orders voltooid: {orders}
              </div>
              <div className="text-lg text-gray-600">
                Gemiddelde efficiëntie: {efficiency}%
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame} variant="primary" className="px-8 py-3">
                Opnieuw Spelen
              </Button>
              <Button onClick={() => setGameState('intro')} variant="outline" className="px-8 py-3">
                Terug naar Intro
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WarehouseWizard;
