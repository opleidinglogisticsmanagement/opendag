import { useState, useEffect } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const RoutePlannerGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [route, setRoute] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentCapacity, setCurrentCapacity] = useState(100);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(null);
  const [violations, setViolations] = useState([]);

  // Minder klanten voor eenvoudiger spel (7 in plaats van 10)
  // Posities aangepast om overlap te voorkomen en alles binnen scherm te houden
  const [nodes] = useState([
    { 
      id: 0, 
      x: 15, 
      y: 50, 
      type: 'depot', 
      label: 'DEPOT',
      capacity: 0,
      timeWindow: null,
      priority: 0,
      size: 'large'
    },
    { id: 1, x: 30, y: 20, type: 'customer', label: '1', capacity: 20, timeWindow: 40, priority: 3, size: 'medium', icon: '📦' },
    { id: 2, x: 50, y: 15, type: 'customer', label: '2', capacity: 25, timeWindow: 50, priority: 2, size: 'medium', icon: '📦' },
    { id: 3, x: 70, y: 20, type: 'customer', label: '3', capacity: 15, timeWindow: 60, priority: 1, size: 'small', icon: '📦' },
    { id: 4, x: 80, y: 45, type: 'customer', label: '4', capacity: 30, timeWindow: 80, priority: 2, size: 'large', icon: '📦' },
    { id: 5, x: 75, y: 70, type: 'customer', label: '5', capacity: 20, timeWindow: 70, priority: 3, size: 'medium', icon: '📦' },
    { id: 6, x: 50, y: 80, type: 'customer', label: '6', capacity: 18, timeWindow: 55, priority: 1, size: 'medium', icon: '📦' },
    { id: 7, x: 25, y: 75, type: 'customer', label: '7', capacity: 22, timeWindow: 65, priority: 2, size: 'medium', icon: '📦' },
  ]);

  const MAX_CAPACITY = 100;
  const AVERAGE_SPEED = 50; // km/h

  // Bereken Euclidische afstand tussen twee punten
  const calculateDistance = (node1, node2) => {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    const pixelDx = (dx / 100) * 1920;
    const pixelDy = (dy / 100) * 1080;
    const distanceInPixels = Math.sqrt(pixelDx * pixelDx + pixelDy * pixelDy);
    return Math.round((distanceInPixels * 0.01) * 10) / 10;
  };

  // Bereken tijd nodig voor route segment
  const calculateTime = (distance) => {
    return Math.round((distance / AVERAGE_SPEED) * 60); // Minuten
  };

  // Bereken totale afstand en tijd van route
  const calculateRouteMetrics = (routeNodes) => {
    if (routeNodes.length < 2) return { distance: 0, time: 0 };
    
    let totalDist = 0;
    let totalTime = 0;
    
    for (let i = 0; i < routeNodes.length - 1; i++) {
      const node1 = nodes.find(n => n.id === routeNodes[i]);
      const node2 = nodes.find(n => n.id === routeNodes[i + 1]);
      if (node1 && node2) {
        const dist = calculateDistance(node1, node2);
        totalDist += dist;
        totalTime += calculateTime(dist);
      }
    }
    
    return { distance: totalDist, time: totalTime };
  };

  // Controleer tijdvenster violations
  const checkTimeWindows = (routeNodes) => {
    const violations = [];
    let currentTime = 0;
    
    for (let i = 1; i < routeNodes.length - 1; i++) {
      const node = nodes.find(n => n.id === routeNodes[i]);
      if (node && node.timeWindow) {
        const prevNode = nodes.find(n => n.id === routeNodes[i - 1]);
        if (prevNode) {
          const dist = calculateDistance(prevNode, node);
          currentTime += calculateTime(dist);
          
          if (currentTime > node.timeWindow) {
            violations.push({
              nodeId: node.id,
              message: `Klant ${node.label} te laat bezocht (+${Math.round(currentTime - node.timeWindow)} min)`,
              type: 'timeWindow'
            });
          }
        }
      }
    }
    
    return violations;
  };

  // Bereken capaciteit na elke stap
  const calculateCurrentCapacity = (routeNodes) => {
    let used = 0;
    for (let i = 1; i < routeNodes.length - 1; i++) {
      const node = nodes.find(n => n.id === routeNodes[i]);
      if (node) {
        used += node.capacity;
      }
    }
    return MAX_CAPACITY - used;
  };

  // Bereken score
  const calculateScore = (distance, time, violations) => {
    const customerCount = nodes.filter(n => n.type === 'customer').length;
    const baseDistance = 120; // Basis afstand voor 7 klanten
    const baseTime = 180; // Basis tijd
    
    const distanceScore = distance <= baseDistance * 1.2 ? 100 : distance <= baseDistance * 1.5 ? 70 : distance <= baseDistance * 2 ? 40 : 10;
    const timeScore = time <= baseTime * 1.2 ? 100 : time <= baseTime * 1.5 ? 70 : time <= baseTime * 2 ? 40 : 10;
    const violationPenalty = violations.length * 15;
    
    const totalScore = Math.max(0, (distanceScore * 0.5 + timeScore * 0.3) - violationPenalty);
    
    let stars, message;
    if (totalScore >= 80 && violations.length === 0) {
      stars = 3;
      message = 'Uitstekend! Perfect geplande route zonder violations!';
    } else if (totalScore >= 60 && violations.length <= 1) {
      stars = 2;
      message = `Goed gedaan! Route gepland met ${violations.length} violation(s).`;
    } else {
      stars = 1;
      message = `Route voltooid! Probeer het opnieuw voor een betere score.`;
    }
    
    return { stars, message, score: Math.round(totalScore) };
  };

  const handleNodeClick = (nodeId) => {
    if (!gameStarted || gameComplete) return;

    const node = nodes.find(n => n.id === nodeId);
    const customerCount = nodes.filter(n => n.type === 'customer').length;

    // Als route leeg is, moet je beginnen bij depot
    if (route.length === 0 && nodeId !== 0) {
      return;
    }

    if (route.length > 0) {
      const lastNode = route[route.length - 1];
      
      // Als laatste node het depot is (en route heeft meer dan alleen depot), dan is het spel compleet
      if (lastNode === 0 && route.length > 1) {
        return;
      }

      // Controleer of alle klanten bezocht zijn - automatisch eindigen
      const visitedCustomers = route.filter(id => id !== 0).length;
      if (visitedCustomers === customerCount && nodeId !== 0) {
        // Alle klanten bezocht, automatisch terug naar depot
        const finalRoute = [...route, 0];
        setRoute(finalRoute);
        const metrics = calculateRouteMetrics(finalRoute);
        setTotalDistance(metrics.distance);
        setTotalTime(metrics.time);
        
        const routeViolations = checkTimeWindows(finalRoute);
        setViolations(routeViolations);
        
        const scoreResult = calculateScore(metrics.distance, metrics.time, routeViolations);
        setScore(scoreResult);
        setGameComplete(true);
        return;
      }

      // Als je op depot klikt en je hebt alle klanten bezocht
      if (nodeId === 0 && visitedCustomers === customerCount) {
        const finalRoute = [...route, nodeId];
        setRoute(finalRoute);
        const metrics = calculateRouteMetrics(finalRoute);
        setTotalDistance(metrics.distance);
        setTotalTime(metrics.time);
        
        const routeViolations = checkTimeWindows(finalRoute);
        setViolations(routeViolations);
        
        const scoreResult = calculateScore(metrics.distance, metrics.time, routeViolations);
        setScore(scoreResult);
        setGameComplete(true);
        return;
      }

      // Als je op depot klikt maar nog niet alle klanten hebt bezocht
      if (nodeId === 0 && visitedCustomers < customerCount) {
        return;
      }

      // Als je op een klant klikt die al bezocht is
      if (nodeId !== 0 && route.includes(nodeId)) {
        return;
      }

      // Controleer capaciteit
      const newCapacity = calculateCurrentCapacity([...route, nodeId]);
      if (newCapacity < node.capacity) {
        // Visuele feedback in plaats van alert
        return;
      }
    }

    // Voeg node toe aan route
    const newRoute = [...route, nodeId];
    setRoute(newRoute);
    
    // Update metrics
    const metrics = calculateRouteMetrics(newRoute);
    setTotalDistance(metrics.distance);
    setTotalTime(metrics.time);
    setCurrentCapacity(calculateCurrentCapacity(newRoute));

    // Check automatisch of alle klanten bezocht zijn
    const visitedCustomers = newRoute.filter(id => id !== 0).length;
    if (visitedCustomers === customerCount && nodeId !== 0) {
      // Automatisch terug naar depot na 1 seconde
      setTimeout(() => {
        const finalRoute = [...newRoute, 0];
        setRoute(finalRoute);
        const finalMetrics = calculateRouteMetrics(finalRoute);
        setTotalDistance(finalMetrics.distance);
        setTotalTime(finalMetrics.time);
        
        const routeViolations = checkTimeWindows(finalRoute);
        setViolations(routeViolations);
        
        const scoreResult = calculateScore(finalMetrics.distance, finalMetrics.time, routeViolations);
        setScore(scoreResult);
        setGameComplete(true);
      }, 1000);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setRoute([0]);
    setTotalDistance(0);
    setTotalTime(0);
    setCurrentCapacity(MAX_CAPACITY);
    setGameComplete(false);
    setScore(null);
    setViolations([]);
  };

  const resetGame = () => {
    setGameStarted(false);
    setRoute([]);
    setTotalDistance(0);
    setTotalTime(0);
    setCurrentCapacity(MAX_CAPACITY);
    setGameComplete(false);
    setScore(null);
    setViolations([]);
  };

  const isNodeVisited = (nodeId) => {
    return route.includes(nodeId);
  };

  const isNodeActive = (nodeId) => {
    return route.length > 0 && route[route.length - 1] === nodeId;
  };

  const canClickNode = (nodeId) => {
    if (!gameStarted || gameComplete) return false;
    
    const node = nodes.find(n => n.id === nodeId);
    const customerCount = nodes.filter(n => n.type === 'customer').length;
    const visitedCustomers = route.filter(id => id !== 0).length;
    
    // Depot kan alleen als eerste of als laatste (na alle klanten)
    if (nodeId === 0) {
      return route.length === 0 || visitedCustomers === customerCount;
    }
    
    // Als alle klanten bezocht zijn, kun je alleen depot klikken
    if (visitedCustomers === customerCount) {
      return false;
    }
    
    // Klanten kunnen alleen als ze nog niet bezocht zijn en er is genoeg capaciteit
    if (route.includes(nodeId)) return false;
    
    const newCapacity = calculateCurrentCapacity([...route, nodeId]);
    return newCapacity >= node.capacity;
  };

  const getNodeStatus = (node) => {
    if (node.type === 'depot') return null;
    
    const visited = isNodeVisited(node.id);
    const canClick = canClickNode(node.id);
    const routeIndex = route.indexOf(node.id);
    
    if (visited) {
      const metrics = calculateRouteMetrics(route.slice(0, routeIndex + 1));
      const arrivalTime = metrics.time;
      const isLate = node.timeWindow && arrivalTime > node.timeWindow;
      return { visited: true, arrivalTime, isLate };
    }
    
    return { visited: false, canClick };
  };

  const customerCount = nodes.filter(n => n.type === 'customer').length;
  const visitedCustomers = route.filter(id => id !== 0).length;

  if (!gameStarted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-logistics-blue via-blue-600 to-logistics-orange p-4">
        <Card className="max-w-3xl w-full text-center">
          <div className="text-7xl mb-6 animate-bounce">🚚</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Last Mile Planner
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-lg mb-6 border-2 border-logistics-blue">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">🎯 Doel van het spel:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-2xl mr-2">📍</span>
                  <span className="text-gray-700">Bezoek alle <strong className="text-logistics-blue">{customerCount} klanten</strong></span>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-2">📦</span>
                  <span className="text-gray-700">Let op je <strong className="text-orange-600">capaciteit</strong> (100%)</span>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-2">⏰</span>
                  <span className="text-gray-700">Bezorg op <strong className="text-green-600">tijd</strong> (tijdvenster)</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-2xl mr-2">⭐</span>
                  <span className="text-gray-700"><strong className="text-red-600">Hoge prioriteit</strong> eerst!</span>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-2">🎯</span>
                  <span className="text-gray-700">Kortste <strong className="text-blue-600">afstand</strong> = beste score</span>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-2">✨</span>
                  <span className="text-gray-700">Spel eindigt <strong>automatisch</strong> na laatste klant</span>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={startGame} variant="primary" className="text-2xl px-12 py-6 shadow-xl hover:scale-105 transition-transform">
            Start Game 🚀
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 overflow-hidden relative">
      {/* Header met Stats - Visueel verbeterd */}
      <div className="bg-white shadow-xl z-20 flex-shrink-0 border-b-4 border-logistics-blue">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-3 border-2 border-blue-300">
              <div className="text-xs text-gray-600 mb-1">📏 Afstand</div>
              <div className="text-2xl md:text-3xl font-bold text-logistics-blue">{totalDistance.toFixed(1)} km</div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-3 border-2 border-orange-300">
              <div className="text-xs text-gray-600 mb-1">⏱️ Tijd</div>
              <div className="text-2xl md:text-3xl font-bold text-logistics-orange">{totalTime} min</div>
            </div>
            <div className={`rounded-lg p-3 border-2 ${
              currentCapacity < 30 
                ? 'bg-gradient-to-br from-red-100 to-red-200 border-red-300' 
                : currentCapacity < 50 
                ? 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300'
                : 'bg-gradient-to-br from-green-100 to-green-200 border-green-300'
            }`}>
              <div className="text-xs text-gray-600 mb-1">📦 Capaciteit</div>
              <div className={`text-2xl md:text-3xl font-bold ${
                currentCapacity < 30 ? 'text-red-600' : currentCapacity < 50 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {currentCapacity}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-3 border-2 border-purple-300">
              <div className="text-xs text-gray-600 mb-1">✅ Klanten</div>
              <div className="text-2xl md:text-3xl font-bold text-purple-600">{visitedCustomers}/{customerCount}</div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm md:text-base text-gray-700 font-semibold">
              {route.length === 0 && '👆 Klik op DEPOT om te beginnen'}
              {route.length === 1 && `🎯 Bezoek alle ${customerCount} klanten`}
              {route.length > 1 && route.length < customerCount + 1 && (
                <span className="text-lg">
                  Nog <span className="text-logistics-blue font-bold">{customerCount + 1 - route.length}</span> locatie(s) te gaan
                </span>
              )}
              {visitedCustomers === customerCount && route[route.length - 1] !== 0 && '🎉 Alle klanten bezocht! Keer terug naar depot...'}
              {gameComplete && '✅ Route voltooid!'}
            </div>
            <Button onClick={resetGame} variant="outline" className="text-sm px-4 py-2">
              🔄 Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
        {/* Achtergrond patroon - verbeterd */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="#0066CC" />
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0066CC" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* SVG voor lijnen - dikker en mooier */}
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker id="arrowhead" markerWidth="3" markerHeight="3" refX="2.5" refY="1.5" orient="auto">
              <polygon points="0 0, 3 1.5, 0 3" fill="#0066CC" />
            </marker>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0066CC" />
              <stop offset="100%" stopColor="#00AAFF" />
            </linearGradient>
          </defs>
          {route.length > 1 && route.map((nodeId, index) => {
            if (index === 0) return null;
            const node1 = nodes.find(n => n.id === route[index - 1]);
            const node2 = nodes.find(n => n.id === nodeId);
            if (!node1 || !node2) return null;
            return (
              <line
                key={`line-${index}`}
                x1={node1.x}
                y1={node1.y}
                x2={node2.x}
                y2={node2.y}
                stroke="url(#lineGradient)"
                strokeWidth="1.2"
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {/* Nodes - Visueel verbeterd */}
        {nodes.map((node) => {
          const visited = isNodeVisited(node.id);
          const active = isNodeActive(node.id);
          const canClick = canClickNode(node.id);
          const status = getNodeStatus(node);

          let nodeClasses = '';
          let nodeSize = 'w-20 h-20 md:w-24 md:h-24';
          let glowClass = '';
          
          if (node.type === 'depot') {
            nodeSize = 'w-28 h-28 md:w-32 md:h-32';
            if (active) {
              nodeClasses = 'bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-blue-900 shadow-2xl';
              glowClass = 'ring-8 ring-blue-300 ring-opacity-75';
            } else if (visited && !active) {
              nodeClasses = 'bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-blue-700 shadow-xl';
            } else {
              nodeClasses = 'bg-gradient-to-br from-logistics-blue to-blue-700 border-4 border-blue-900 shadow-lg hover:shadow-2xl';
            }
          } else {
            if (active) {
              nodeClasses = 'bg-gradient-to-br from-green-500 to-green-700 border-4 border-green-900 shadow-2xl';
              glowClass = 'ring-8 ring-green-300 ring-opacity-75';
            } else if (visited) {
              if (status?.isLate) {
                nodeClasses = 'bg-gradient-to-br from-red-400 to-red-600 border-4 border-red-800 shadow-xl';
              } else {
                nodeClasses = 'bg-gradient-to-br from-green-400 to-green-600 border-4 border-green-700 shadow-xl';
              }
            } else if (canClick) {
              // Verschillende kleuren op basis van prioriteit met gradient
              if (node.priority === 3) {
                nodeClasses = 'bg-gradient-to-br from-red-500 to-red-700 border-4 border-red-900 shadow-xl hover:shadow-2xl';
                glowClass = 'ring-4 ring-red-300 ring-opacity-50';
              } else if (node.priority === 2) {
                nodeClasses = 'bg-gradient-to-br from-orange-500 to-orange-700 border-4 border-orange-900 shadow-xl hover:shadow-2xl';
                glowClass = 'ring-4 ring-orange-300 ring-opacity-50';
              } else {
                nodeClasses = 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-4 border-yellow-900 shadow-xl hover:shadow-2xl';
                glowClass = 'ring-4 ring-yellow-300 ring-opacity-50';
              }
            } else {
              nodeClasses = 'bg-gradient-to-br from-gray-400 to-gray-600 border-4 border-gray-700 shadow-md opacity-50';
            }
          }

          // Bepaal grootte op basis van node.size
          if (node.size === 'large') {
            nodeSize = 'w-24 h-24 md:w-28 md:h-28';
          } else if (node.size === 'small') {
            nodeSize = 'w-18 h-18 md:w-20 md:h-20';
          }

          // Bepaal of info box boven of onder moet komen (boven als node onderaan scherm)
          const showInfoAbove = node.y > 65;

          return (
            <div 
              key={node.id} 
              className="absolute z-20" 
              style={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`, 
                transform: 'translate(-50%, -50%)',
                minWidth: '80px',
                minHeight: '80px'
              }}
            >
              <button
                onClick={() => handleNodeClick(node.id)}
                disabled={!canClick}
                className={`${nodeSize} ${nodeClasses} ${glowClass} rounded-full transition-all duration-300 transform ${
                  node.type === 'depot' ? 'rounded-xl' : 'rounded-full'
                } ${canClick ? 'cursor-pointer active:scale-90 hover:scale-110' : 'cursor-not-allowed'} relative`}
              >
                <div className="flex flex-col items-center justify-center h-full text-white font-bold">
                  {node.type === 'depot' ? (
                    <>
                      <div className="text-2xl md:text-3xl mb-1">🏭</div>
                      <div className="text-xs md:text-sm text-center leading-tight font-extrabold">{node.label}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg md:text-xl mb-1">{node.icon || '📦'}</div>
                      <div className="text-base md:text-lg font-extrabold">{node.label}</div>
                      <div className="text-xs mt-1">
                        {node.priority === 3 && '⭐⭐⭐'}
                        {node.priority === 2 && '⭐⭐'}
                        {node.priority === 1 && '⭐'}
                      </div>
                    </>
                  )}
                </div>
              </button>
              
              {/* Info label - dynamisch boven of onder node om overlap te voorkomen */}
              {node.type === 'customer' && !visited && canClick && (
                <div 
                  className={`absolute left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1.5 rounded-lg shadow-xl border-2 border-white whitespace-nowrap z-30 ${
                    showInfoAbove ? 'bottom-full mb-2' : 'top-full mt-2'
                  }`}
                  style={{
                    maxWidth: '140px',
                    pointerEvents: 'none'
                  }}
                >
                  <div className="font-bold mb-0.5 text-center">Klant {node.label}</div>
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <span>📦</span>
                    <span>{node.capacity}%</span>
                    <span className="mx-1">|</span>
                    <span>⏰</span>
                    <span>≤{node.timeWindow}m</span>
                  </div>
                </div>
              )}
              
              {status?.visited && status.isLate && (
                <div 
                  className={`absolute left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded-lg shadow-xl border-2 border-red-800 whitespace-nowrap z-30 animate-pulse ${
                    showInfoAbove ? 'bottom-full mb-2' : 'top-full mt-2'
                  }`}
                  style={{ pointerEvents: 'none' }}
                >
                  ⚠️ Te laat!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resultaat Overlay - Visueel verbeterd */}
      {gameComplete && score && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30 backdrop-blur-sm">
          <Card className="max-w-3xl w-full mx-4 text-center border-4 border-logistics-blue shadow-2xl">
            <div className="text-7xl mb-4 animate-bounce">
              {score.stars === 3 && '⭐⭐⭐'}
              {score.stars === 2 && '⭐⭐'}
              {score.stars === 1 && '⭐'}
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-logistics-blue to-logistics-orange bg-clip-text text-transparent">
              Route Voltooid! 🎉
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 border-2 border-blue-300">
                <div className="text-3xl md:text-4xl font-bold text-logistics-blue">{totalDistance.toFixed(1)}</div>
                <div className="text-sm text-gray-600 font-semibold">km afstand</div>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-4 border-2 border-orange-300">
                <div className="text-3xl md:text-4xl font-bold text-logistics-orange">{totalTime}</div>
                <div className="text-sm text-gray-600 font-semibold">minuten</div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 border-2 border-purple-300">
                <div className="text-3xl md:text-4xl font-bold text-purple-600">{score.score}</div>
                <div className="text-sm text-gray-600 font-semibold">punten</div>
              </div>
            </div>
            
            {violations.length > 0 && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-bold text-red-800 mb-2 flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  Violations ({violations.length}):
                </h3>
                <ul className="space-y-1 text-sm text-red-700">
                  {violations.map((v, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{v.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 font-semibold">
              {score.message}
            </p>
            <Button onClick={resetGame} variant="primary" className="text-xl px-10 py-5 shadow-xl hover:scale-105 transition-transform">
              🔄 Opnieuw Spelen
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RoutePlannerGame;
