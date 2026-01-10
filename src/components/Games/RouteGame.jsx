import { useState } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const RouteGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [route, setRoute] = useState([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const cities = [
    { id: 1, name: 'Amsterdam', x: 20, y: 30, color: 'bg-blue-500' },
    { id: 2, name: 'Rotterdam', x: 30, y: 60, color: 'bg-orange-500' },
    { id: 3, name: 'Utrecht', x: 50, y: 40, color: 'bg-green-500' },
    { id: 4, name: 'Eindhoven', x: 60, y: 70, color: 'bg-purple-500' },
    { id: 5, name: 'Groningen', x: 70, y: 10, color: 'bg-red-500' },
  ];

  const distances = {
    '1-2': 60,
    '1-3': 40,
    '1-4': 120,
    '1-5': 180,
    '2-3': 60,
    '2-4': 80,
    '2-5': 200,
    '3-4': 70,
    '3-5': 150,
    '4-5': 160,
  };

  const getDistance = (city1, city2) => {
    const key = `${Math.min(city1, city2)}-${Math.max(city1, city2)}`;
    return distances[key] || 0;
  };

  const calculateTotalDistance = (route) => {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
      total += getDistance(route[i], route[i + 1]);
    }
    return total;
  };

  const handleCityClick = (cityId) => {
    if (!gameStarted || completed) return;
    
    if (route.length === 0 || route[route.length - 1] !== cityId) {
      if (!route.includes(cityId)) {
        const newRoute = [...route, cityId];
        setRoute(newRoute);
        
        if (newRoute.length === cities.length) {
          const totalDistance = calculateTotalDistance(newRoute);
          const optimalDistance = 400; // Approximate optimal route
          const efficiency = Math.max(0, Math.round(((optimalDistance / totalDistance) * 100)));
          setScore(efficiency);
          setCompleted(true);
        }
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setRoute([]);
    setScore(0);
    setCompleted(false);
  };

  const resetGame = () => {
    setGameStarted(false);
    setRoute([]);
    setScore(0);
    setCompleted(false);
  };

  if (!gameStarted) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Route Planning Game</h2>
        <p className="text-gray-600 mb-6">
          Plan de meest efficiënte route door alle steden. Klik op de steden in de volgorde waarin je ze wilt bezoeken.
        </p>
        <Button onClick={startGame} variant="primary">
          Start Game
        </Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Plan je route:</h3>
          {completed && (
            <div className="text-xl font-bold text-logistics-blue">
              Efficiëntie: {score}%
            </div>
          )}
        </div>
        
        <div className="relative bg-gray-100 rounded-lg p-8 mb-4" style={{ height: '400px' }}>
          {cities.map((city) => {
            const isInRoute = route.includes(city.id);
            const routeIndex = route.indexOf(city.id);
            
            return (
              <div key={city.id}>
                <button
                  onClick={() => handleCityClick(city.id)}
                  className={`absolute ${city.color} text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg hover:scale-110 transition-transform ${
                    isInRoute ? 'ring-4 ring-logistics-blue' : ''
                  }`}
                  style={{ left: `${city.x}%`, top: `${city.y}%` }}
                  disabled={completed}
                >
                  {isInRoute ? routeIndex + 1 : city.id}
                </button>
                <div
                  className="absolute text-xs font-semibold text-gray-700"
                  style={{ left: `${city.x}%`, top: `${city.y + 8}%` }}
                >
                  {city.name}
                </div>
              </div>
            );
          })}
          
          {/* Draw lines between cities in route */}
          {route.length > 1 && route.map((cityId, index) => {
            if (index === 0) return null;
            const prevCity = cities.find(c => c.id === route[index - 1]);
            const currentCity = cities.find(c => c.id === cityId);
            if (!prevCity || !currentCity) return null;
            
            const x1 = prevCity.x + 6; // Center of circle
            const y1 = prevCity.y + 6;
            const x2 = currentCity.x + 6;
            const y2 = currentCity.y + 6;
            
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            
            return (
              <div
                key={`line-${index}`}
                className="absolute bg-logistics-blue"
                style={{
                  left: `${x1}%`,
                  top: `${y1}%`,
                  width: `${length}%`,
                  height: '3px',
                  transformOrigin: '0 50%',
                  transform: `rotate(${angle}deg)`,
                  zIndex: 0,
                }}
              />
            );
          })}
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Jouw route:</h4>
          <div className="flex flex-wrap gap-2">
            {route.length === 0 ? (
              <span className="text-gray-400">Klik op steden om je route te beginnen</span>
            ) : (
              route.map((cityId, index) => {
                const city = cities.find(c => c.id === cityId);
                return (
                  <span key={index} className="bg-logistics-light-blue px-3 py-1 rounded-full text-sm">
                    {index + 1}. {city.name}
                  </span>
                );
              })
            )}
          </div>
        </div>

        {completed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800">
              {score >= 80 
                ? "Uitstekend! Je hebt een zeer efficiënte route gepland!" 
                : score >= 60 
                ? "Goed gedaan! Je route is redelijk efficiënt."
                : "Probeer het opnieuw voor een efficiëntere route!"}
            </p>
          </div>
        )}
      </div>

      <div className="text-center">
        <Button onClick={resetGame} variant="secondary">
          {completed ? 'Nieuwe Route' : 'Stop Game'}
        </Button>
      </div>
    </Card>
  );
};

export default RouteGame;
