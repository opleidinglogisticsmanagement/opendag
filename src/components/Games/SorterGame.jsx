import { useState, useEffect, useRef } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const SorterGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [packages, setPackages] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [feedbackFading, setFeedbackFading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [stats, setStats] = useState({
    totalSorted: 0,
    correct: 0,
    incorrect: 0,
    missed: 0,
    maxCombo: 0
  });
  const animationFrameRef = useRef(null);
  const lastSpawnTime = useRef(0);
  const packageIdCounter = useRef(0);

  const PACKAGE_TYPES = {
    DANGEROUS: { type: 'dangerous', icon: '🔥', color: 'bg-red-500', label: 'Gevaarlijk', borderColor: 'border-red-600' },
    FRAGILE: { type: 'fragile', icon: '⚠️', color: 'bg-yellow-500', label: 'Breekbaar', borderColor: 'border-yellow-600' },
    COLD: { type: 'cold', icon: '❄️', color: 'bg-cyan-500', label: 'Koel', borderColor: 'border-cyan-600' },
    EXPRESS: { type: 'express', icon: '⚡', color: 'bg-purple-500', label: 'Express', borderColor: 'border-purple-600' },
    STANDARD: { type: 'standard', icon: '📦', color: 'bg-blue-500', label: 'Standaard', borderColor: 'border-blue-600' }
  };

  const SPAWN_INTERVAL = 2000; // Spawn een pakketje elke 2 seconden
  const PACKAGE_SPEED = 0.3; // Percentage van container hoogte per frame
  const CONVEYOR_HEIGHT = 65; // Percentage van schermhoogte voor de lopende band

  const getAccuracy = () => {
    if (stats.totalSorted === 0) return 0;
    return Math.round((stats.correct / stats.totalSorted) * 100);
  };

  const getRating = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/85e56d97-3dfa-471e-b450-c12c1da0d227',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SorterGame.jsx:41',message:'getRating called',data:{score,statsTotalSorted:stats.totalSorted,statsCorrect:stats.correct},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const accuracy = getAccuracy();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/85e56d97-3dfa-471e-b450-c12c1da0d227',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SorterGame.jsx:43',message:'getRating accuracy calculated',data:{accuracy,score},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (score >= 200 && accuracy >= 90) return { emoji: '🏆', text: 'Logistiek Meester!', color: 'text-yellow-500' };
    if (score >= 150 && accuracy >= 80) return { emoji: '⭐', text: 'Uitstekend!', color: 'text-purple-500' };
    if (score >= 100 && accuracy >= 70) return { emoji: '👍', text: 'Goed gedaan!', color: 'text-blue-500' };
    if (score >= 50) return { emoji: '📦', text: 'Niet slecht!', color: 'text-green-500' };
    return { emoji: '💪', text: 'Blijf oefenen!', color: 'text-gray-500' };
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/85e56d97-3dfa-471e-b450-c12c1da0d227',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SorterGame.jsx:60',message:'Timer tick',data:{prev,gameStarted,gameOver,score,statsTotalSorted:stats.totalSorted},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
          // #endregion
          if (prev <= 1) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/85e56d97-3dfa-471e-b450-c12c1da0d227',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SorterGame.jsx:64',message:'Time up detected',data:{score,statsTotalSorted:stats.totalSorted,statsCorrect:stats.correct},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            // Tijd is op - stop game direct en toon eindscherm
            setGameOver(true);
            setGameStarted(false);
            
            // Toon feedback notificatie kort (optioneel)
            const accuracy = getAccuracy();
            const rating = getRating();
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/85e56d97-3dfa-471e-b450-c12c1da0d227',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SorterGame.jsx:71',message:'Game over set, showing end screen',data:{accuracy,ratingText:rating.text,score},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver, score, stats]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const spawnPackage = () => {
        const now = Date.now();
        if (now - lastSpawnTime.current >= SPAWN_INTERVAL) {
          // Willekeurig pakkettype kiezen uit alle 5 mogelijkheden
          const types = Object.values(PACKAGE_TYPES);
          const packageType = types[Math.floor(Math.random() * types.length)];
          const newPackage = {
            id: packageIdCounter.current++,
            type: packageType.type,
            icon: packageType.icon,
            color: packageType.color,
            borderColor: packageType.borderColor,
            y: 0,
            x: 15 + Math.random() * 70, // Willekeurige positie tussen 15% en 85% van de breedte
            rotation: Math.random() * 360 // Willekeurige rotatie voor animatie
          };
          setPackages(prev => [...prev, newPackage]);
          lastSpawnTime.current = now;
        }
      };

      const gameLoop = () => {
        spawnPackage();
        
        setPackages(prev => {
          return prev.map(pkg => ({
            ...pkg,
            y: pkg.y + PACKAGE_SPEED,
            rotation: pkg.rotation + 0.5 // Langzame rotatie animatie
          })).filter(pkg => {
            // Verwijder pakketjes die onderaan zijn (y > 100 betekent buiten container)
            if (pkg.y > 100) {
              // Pakketje gemist = straf
              setTimeLeft(prev => Math.max(0, prev - 3));
              setStats(prev => ({ ...prev, missed: prev.missed + 1 }));
              setCombo(0); // Reset combo bij gemist pakketje
              return false;
            }
            return true;
          });
        });

        animationFrameRef.current = requestAnimationFrame(gameLoop);
      };

      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [gameStarted, gameOver]);

  const handleSort = (selectedType) => {
    if (!gameStarted || gameOver || packages.length === 0) return;

    // Pak het eerste pakketje dat dichtbij de knoppen is (tussen 70% en 95% van de container)
    const activePackage = packages.find(pkg => pkg.y > 70 && pkg.y < 95);
    
    if (!activePackage) return;

    const isCorrect = selectedType === activePackage.type;

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      // Score berekenen met combo multiplier (max 3x)
      const comboMultiplier = Math.min(1 + (newCombo - 1) * 0.1, 3);
      const pointsEarned = Math.floor(10 * comboMultiplier);
      
      setScore(prev => prev + pointsEarned);
      setStats(prev => ({
        ...prev,
        totalSorted: prev.totalSorted + 1,
        correct: prev.correct + 1,
        maxCombo: Math.max(prev.maxCombo, newCombo)
      }));
      
      const comboText = newCombo > 1 ? ` x${newCombo} COMBO!` : '';
      setFeedback({ 
        type: 'success', 
        message: `+${pointsEarned} punten!${comboText}`,
        combo: newCombo
      });
      setPackages(prev => prev.filter(pkg => pkg.id !== activePackage.id));
    } else {
      setCombo(0); // Reset combo bij fout
      setTimeLeft(prev => Math.max(0, prev - 5));
      setStats(prev => ({
        ...prev,
        totalSorted: prev.totalSorted + 1,
        incorrect: prev.incorrect + 1
      }));
      const correctType = Object.values(PACKAGE_TYPES).find(t => t.type === activePackage.type);
      setFeedback({ type: 'error', message: `Fout! Moest naar: ${correctType?.label}` });
    }

    // Fade out animatie starten en dan verwijderen (niet voor timeup feedback)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/85e56d97-3dfa-471e-b450-c12c1da0d227',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SorterGame.jsx:184',message:'handleSort checking feedback type',data:{feedbackType:feedback?.type,feedbackExists:!!feedback},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (feedback && feedback.type !== 'timeup') {
      const fadeDuration = feedback.combo && feedback.combo > 1 ? 2000 : 1500;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/85e56d97-3dfa-471e-b450-c12c1da0d227',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SorterGame.jsx:187',message:'Setting feedback timeout',data:{fadeDuration,feedbackType:feedback.type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      setTimeout(() => {
        setFeedbackFading(true);
        setTimeout(() => {
          setFeedback(null);
          setFeedbackFading(false);
        }, 300); // Fade out duur
      }, fadeDuration - 300);
    }
  };

  const startGame = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/85e56d97-3dfa-471e-b450-c12c1da0d227',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SorterGame.jsx:196',message:'startGame called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setPackages([]);
    setFeedback(null);
    setFeedbackFading(false);
    setGameOver(false);
    setCombo(0);
    setStats({
      totalSorted: 0,
      correct: 0,
      incorrect: 0,
      missed: 0,
      maxCombo: 0
    });
    lastSpawnTime.current = Date.now();
    packageIdCounter.current = 0;
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setTimeLeft(60);
    setPackages([]);
    setFeedback(null);
    setFeedbackFading(false);
    setGameOver(false);
    setCombo(0);
    setStats({
      totalSorted: 0,
      correct: 0,
      incorrect: 0,
      missed: 0,
      maxCombo: 0
    });
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  if (!gameStarted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-logistics-blue to-logistics-orange p-4">
        <Card className="max-w-2xl w-full text-center">
          <div className="text-7xl mb-6">📋</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            De Logistieke Sorteerder
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Sorteer de pakketjes naar de juiste container!<br />
            <div className="mt-4 space-y-2 text-lg">
              <div>🔥 = Gevaarlijk</div>
              <div>⚠️ = Breekbaar</div>
              <div>❄️ = Koel</div>
              <div>⚡ = Express</div>
              <div>📦 = Standaard</div>
            </div>
          </p>
          <Button onClick={startGame} variant="primary" className="text-2xl px-12 py-6">
            Start Game
          </Button>
        </Card>
      </div>
    );
  }

  if (gameOver) {
    const rating = getRating();
    const accuracy = getAccuracy();
    
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-logistics-blue to-logistics-orange p-4 overflow-y-auto">
        <Card className="max-w-3xl w-full text-center animate-fadeIn">
          <div className="text-8xl mb-6 animate-bounce">{rating.emoji}</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Game Over!
          </h2>
          <p className={`text-2xl md:text-3xl font-bold mb-8 ${rating.color}`}>
            {rating.text}
          </p>
          
          {/* Hoofdscore */}
          <div className="bg-gradient-to-r from-logistics-blue to-logistics-orange rounded-2xl p-6 mb-6 shadow-xl">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">Totaal Score</div>
            <div className="text-6xl md:text-7xl font-bold text-white">{score}</div>
          </div>

          {/* Statistieken Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{stats.totalSorted}</div>
              <div className="text-sm md:text-base text-gray-600 mt-1">Totaal Gesorteerd</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <div className="text-2xl md:text-3xl font-bold text-green-600">{stats.correct}</div>
              <div className="text-sm md:text-base text-gray-600 mt-1">Correct</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
              <div className="text-2xl md:text-3xl font-bold text-red-600">{stats.incorrect + stats.missed}</div>
              <div className="text-sm md:text-base text-gray-600 mt-1">Fouten</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">{accuracy}%</div>
              <div className="text-sm md:text-base text-gray-600 mt-1">Nauwkeurigheid</div>
            </div>
          </div>

          {/* Extra Statistieken */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
              <div className="text-xl md:text-2xl font-bold text-yellow-600">{stats.maxCombo}</div>
              <div className="text-sm md:text-base text-gray-600 mt-1">Max Combo</div>
            </div>
            <div className="bg-cyan-50 rounded-xl p-4 border-2 border-cyan-200">
              <div className="text-xl md:text-2xl font-bold text-cyan-600">{60 - timeLeft}s</div>
              <div className="text-sm md:text-base text-gray-600 mt-1">Gespeelde Tijd</div>
            </div>
          </div>

          {/* Actieknoppen */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={resetGame} variant="primary" className="text-xl px-8 py-4">
              Opnieuw Spelen
            </Button>
            <Button 
              onClick={() => {
                resetGame();
                setGameStarted(false);
              }} 
              variant="secondary" 
              className="text-xl px-8 py-4"
            >
              Terug naar Menu
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Score en Tijd Bovenin */}
      <div className="bg-white shadow-lg z-10 flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <div className="text-2xl md:text-3xl font-bold">
              Score: <span className="text-logistics-blue">{score}</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold">
              Tijd: <span className={`${timeLeft <= 10 ? 'text-red-600' : 'text-logistics-orange'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          {/* Combo indicator */}
          {combo > 0 && (
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-lg md:text-xl font-bold animate-pulse">
                🔥 {combo}x COMBO! 🔥
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtiele Feedback Notificatie */}
      {feedback && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none ${
          feedbackFading ? 'animate-fadeOut' : 'animate-slideDown'
        }`}>
          <div className={`${
            feedback.type === 'success' 
              ? 'bg-green-500 border-green-600' 
              : feedback.type === 'timeup'
              ? 'bg-blue-600 border-blue-700'
              : 'bg-red-500 border-red-600'
          } border-2 rounded-2xl px-6 py-4 shadow-2xl backdrop-blur-sm max-w-md`}>
            {feedback.type === 'timeup' ? (
              <div className="text-center">
                <div className="text-3xl md:text-4xl mb-2 animate-pulse">⏰</div>
                <div className="text-xl md:text-2xl font-bold text-white mb-2">
                  {feedback.message}
                </div>
                <div className="text-base md:text-lg text-white/90 mb-1">
                  {feedback.details}
                </div>
                {feedback.rating && (
                  <div className="text-sm md:text-base font-semibold text-yellow-200 mt-2">
                    {feedback.rating}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className={`text-3xl md:text-4xl ${
                  feedback.type === 'success' ? 'animate-bounce' : 'animate-pulse'
                }`}>
                  {feedback.type === 'success' ? '✓' : '✗'}
                </div>
                <div>
                  <div className={`text-xl md:text-2xl font-bold text-white ${
                    feedback.combo && feedback.combo > 1 ? 'text-yellow-200' : ''
                  }`}>
                    {feedback.message}
                  </div>
                  {feedback.combo && feedback.combo > 1 && (
                    <div className="text-sm md:text-base font-semibold text-yellow-200 mt-1">
                      🔥 {feedback.combo}x COMBO STREAK! 🔥
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lopende Band (Midden) */}
      <div 
        className="flex-1 relative bg-gradient-to-b from-gray-200 to-gray-300 overflow-hidden min-h-0"
      >
        {/* Lopende band patroon */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full bg-repeat-y" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 40px)',
            animation: 'moveBand 1s linear infinite'
          }}></div>
        </div>

        {/* Pakketjes */}
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`absolute ${pkg.color} ${pkg.borderColor} border-4 text-white rounded-xl shadow-2xl flex items-center justify-center transform transition-transform hover:scale-110`}
            style={{
              left: `${pkg.x}%`,
              top: `${pkg.y}%`,
              transform: `translate(-50%, -50%) rotate(${pkg.rotation}deg)`,
              width: '100px',
              height: '100px',
              fontSize: '50px',
              zIndex: 10,
              animation: 'packageFloat 2s ease-in-out infinite'
            }}
          >
            <div className="text-center" style={{ transform: `rotate(${-pkg.rotation}deg)` }}>
              <div className="text-4xl">{pkg.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grote Knoppen Onderaan - 5 Sorteer Containers */}
      <div className="bg-white shadow-2xl flex-shrink-0">
        <div className="grid grid-cols-5 gap-0">
          {/* Gevaarlijk */}
          <button
            onClick={() => handleSort('dangerous')}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 active:scale-95 text-white h-28 md:h-36 flex flex-col items-center justify-center transition-all duration-150 shadow-lg hover:shadow-xl border-r-2 border-gray-300"
          >
            <div className="text-4xl md:text-6xl mb-1">🔥</div>
            <div className="text-lg md:text-2xl font-bold">Gevaarlijk</div>
          </button>

          {/* Breekbaar */}
          <button
            onClick={() => handleSort('fragile')}
            className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 active:scale-95 text-white h-28 md:h-36 flex flex-col items-center justify-center transition-all duration-150 shadow-lg hover:shadow-xl border-r-2 border-gray-300"
          >
            <div className="text-4xl md:text-6xl mb-1">⚠️</div>
            <div className="text-lg md:text-2xl font-bold">Breekbaar</div>
          </button>

          {/* Koel */}
          <button
            onClick={() => handleSort('cold')}
            className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 active:scale-95 text-white h-28 md:h-36 flex flex-col items-center justify-center transition-all duration-150 shadow-lg hover:shadow-xl border-r-2 border-gray-300"
          >
            <div className="text-4xl md:text-6xl mb-1">❄️</div>
            <div className="text-lg md:text-2xl font-bold">Koel</div>
          </button>

          {/* Express */}
          <button
            onClick={() => handleSort('express')}
            className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 active:scale-95 text-white h-28 md:h-36 flex flex-col items-center justify-center transition-all duration-150 shadow-lg hover:shadow-xl border-r-2 border-gray-300"
          >
            <div className="text-4xl md:text-6xl mb-1">⚡</div>
            <div className="text-lg md:text-2xl font-bold">Express</div>
          </button>

          {/* Standaard */}
          <button
            onClick={() => handleSort('standard')}
            className="bg-logistics-blue hover:bg-blue-700 active:bg-blue-800 active:scale-95 text-white h-28 md:h-36 flex flex-col items-center justify-center transition-all duration-150 shadow-lg hover:shadow-xl"
          >
            <div className="text-4xl md:text-6xl mb-1">📦</div>
            <div className="text-lg md:text-2xl font-bold">Standaard</div>
          </button>
        </div>
        {/* Stop Knop */}
        <div className="bg-gray-800 text-white py-1">
          <div className="container mx-auto text-center">
            <button
              onClick={resetGame}
              className="text-base md:text-lg font-semibold hover:text-gray-300 transition-colors"
            >
              Stop Game
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animaties */}
      <style>{`
        @keyframes moveBand {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
        @keyframes packageFloat {
          0%, 100% { transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(0px); }
          50% { transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-5px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translate(-50%, -20px) scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, 0) scale(1); 
          }
        }
        @keyframes fadeOut {
          from { 
            opacity: 1; 
            transform: translate(-50%, 0) scale(1); 
          }
          to { 
            opacity: 0; 
            transform: translate(-50%, -10px) scale(0.95); 
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

export default SorterGame;
