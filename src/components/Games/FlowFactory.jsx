import { useState, useEffect } from 'react';
import { Factory } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Button from '../UI/Button';

const FlowFactory = () => {
  const [gameState, setGameState] = useState('intro'); // 'intro' or 'game'
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  // Progress bars (0-100%)
  const [grondstoffen, setGrondstoffen] = useState(50);
  const [productie, setProductie] = useState(50);
  const [klant, setKlant] = useState(50);

  // Timer voor het spel
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

  // Autonome drain: Klant zakt automatisch met 5% per seconde
  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const interval = setInterval(() => {
        setKlant(prev => Math.max(0, prev - 5));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, timeLeft]);

  // Scoring: +100 punten per seconde als alle bars groen zijn (20-80%)
  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const interval = setInterval(() => {
        const allGreen = 
          grondstoffen >= 20 && grondstoffen <= 80 &&
          productie >= 20 && productie <= 80 &&
          klant >= 20 && klant <= 80;
        
        if (allGreen) {
          setScore(prev => prev + 100);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, timeLeft, grondstoffen, productie, klant]);

  const startGame = () => {
    setGameState('game');
    setGameStarted(true);
    setTimeLeft(60);
    setScore(0);
    setGrondstoffen(50);
    setProductie(50);
    setKlant(50);
    setGameOver(false);
  };

  const resetGame = () => {
    setGameStarted(false);
    setTimeLeft(60);
    setScore(0);
    setGrondstoffen(50);
    setProductie(50);
    setKlant(50);
    setGameOver(false);
  };

  const handleBestel = () => {
    setGrondstoffen(prev => Math.min(100, prev + 10));
  };

  const handleProduceer = () => {
    if (grondstoffen > 10) {
      setGrondstoffen(prev => Math.max(0, prev - 10));
      setProductie(prev => Math.min(100, prev + 10));
    }
  };

  const handleVerstuur = () => {
    if (productie > 10) {
      setProductie(prev => Math.max(0, prev - 10));
      setKlant(prev => Math.min(100, prev + 10));
    }
  };

  const getBarColor = (value) => {
    if (value < 20) return 'bg-red-500';
    if (value > 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-logistics-blue via-blue-600 to-logistics-orange p-4">
        <Card className="max-w-2xl w-full text-center">
          <div className="flex justify-center mb-6">
            <Factory size={80} className="text-logistics-blue" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-logistics-blue mb-6">
            Flow Factory
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 px-4">
            Houd de logistieke flow op gang tussen drie stations: Grondstoffen, Productie en Klant. 
            Leer hoe je processen soepel laat verlopen en optimaliseer je Flow Score!
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full text-lg font-semibold">
              ⏱️ 60 seconden
            </span>
            <span className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full text-lg font-semibold">
              📊 Flow Score
            </span>
            <span className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full text-lg font-semibold">
              🎯 Strategie
            </span>
          </div>

          <Button 
            onClick={startGame} 
            className="bg-purple-600 hover:bg-purple-700 text-white text-2xl px-16 py-6 w-full max-w-md mx-auto"
          >
            SPEEL NU
          </Button>
        </Card>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-white">
      {/* Header Section */}
      <div className="flex-shrink-0 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl md:text-4xl font-bold text-logistics-blue mb-1">
            Flow Factory
          </h1>
          <p className="text-lg text-gray-600 mb-3">
            Houd de logistieke flow op gang!
          </p>
          <div className="bg-gray-200 rounded-lg px-4 py-3">
            <p className="text-base text-gray-700">
              Je bent de producent van hoedjes... Houd alle voorraden tussen 20% en 80%.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Bar */}
      <div className="flex-shrink-0 bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Tijd */}
            <div className="bg-blue-500 rounded-xl shadow-md p-4 text-center">
              <div className="text-white text-sm font-semibold mb-1">Tijd</div>
              <div className="text-white text-3xl font-bold">{timeLeft}s</div>
            </div>
            
            {/* Score */}
            <div className="bg-green-500 rounded-xl shadow-md p-4 text-center">
              <div className="text-white text-sm font-semibold mb-1">Flow Score</div>
              <div className="text-white text-3xl font-bold">{score}</div>
            </div>
            
            {/* Actieknop */}
            <div className="flex items-center justify-center">
              <Button
                onClick={gameStarted ? resetGame : startGame}
                className={`${gameStarted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white text-lg px-6 py-3 w-full`}
              >
                {gameStarted ? 'RESET' : 'START SPEL'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Game Over!</h2>
            <div className="text-3xl font-bold text-logistics-blue mb-6">
              Finale Score: {score}
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

      {/* Speelveld - 3 Kolommen */}
      <div className="flex-1 min-h-0 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* Kolom 1: Grondstoffen */}
          <Card className="flex flex-col">
            <div className="text-2xl font-bold text-gray-800 mb-4 text-center">
              📦 Grondstoffen
            </div>
            <div className="flex-1 flex flex-col justify-center">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="bg-gray-200 rounded-full h-12 md:h-16 shadow-inner overflow-hidden">
                  <motion.div
                    className={`h-full ${getBarColor(grondstoffen)} rounded-full flex items-center justify-center`}
                    initial={{ width: '50%' }}
                    animate={{ width: `${grondstoffen}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <span className="text-white font-bold text-lg md:text-xl">
                      {Math.round(grondstoffen)}%
                    </span>
                  </motion.div>
                </div>
              </div>
              
              {/* Knop */}
              <Button
                onClick={handleBestel}
                disabled={!gameStarted || gameOver}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xl md:text-2xl px-6 py-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + BESTEL GRONDSTOFFEN
              </Button>
            </div>
          </Card>

          {/* Kolom 2: Productie */}
          <Card className="flex flex-col">
            <div className="text-2xl font-bold text-gray-800 mb-4 text-center">
              ⚙️ Productie
            </div>
            <div className="flex-1 flex flex-col justify-center">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="bg-gray-200 rounded-full h-12 md:h-16 shadow-inner overflow-hidden">
                  <motion.div
                    className={`h-full ${getBarColor(productie)} rounded-full flex items-center justify-center`}
                    initial={{ width: '50%' }}
                    animate={{ width: `${productie}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <span className="text-white font-bold text-lg md:text-xl">
                      {Math.round(productie)}%
                    </span>
                  </motion.div>
                </div>
              </div>
              
              {/* Knop */}
              <Button
                onClick={handleProduceer}
                disabled={!gameStarted || gameOver || grondstoffen <= 10}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xl md:text-2xl px-6 py-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔨 PRODUCEER
              </Button>
            </div>
          </Card>

          {/* Kolom 3: Klant */}
          <Card className="flex flex-col">
            <div className="text-2xl font-bold text-gray-800 mb-4 text-center">
              👥 Klant
            </div>
            <div className="flex-1 flex flex-col justify-center">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="bg-gray-200 rounded-full h-12 md:h-16 shadow-inner overflow-hidden">
                  <motion.div
                    className={`h-full ${getBarColor(klant)} rounded-full flex items-center justify-center`}
                    initial={{ width: '50%' }}
                    animate={{ width: `${klant}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <span className="text-white font-bold text-lg md:text-xl">
                      {Math.round(klant)}%
                    </span>
                  </motion.div>
                </div>
              </div>
              
              {/* Knop */}
              <Button
                onClick={handleVerstuur}
                disabled={!gameStarted || gameOver || productie <= 10}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xl md:text-2xl px-6 py-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚚 VERSTUUR
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer / Legenda */}
      <div className="flex-shrink-0 bg-gray-100 border-t border-gray-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <span className="text-gray-700 font-semibold">Rood = Tekort (0-19%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span className="text-gray-700 font-semibold">Groen = Goede flow (20-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
              <span className="text-gray-700 font-semibold">Geel = Overvoorraad (81-100%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowFactory;
