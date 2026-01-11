import { useState, useEffect } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const PackingGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [boxes, setBoxes] = useState([]);
  const [container, setContainer] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);

  const boxTypes = [
    { id: 1, size: 'small', width: 2, height: 2, color: 'bg-blue-400' },
    { id: 2, size: 'medium', width: 3, height: 2, color: 'bg-orange-400' },
    { id: 3, size: 'large', width: 3, height: 3, color: 'bg-green-400' },
  ];

  const containerSize = { width: 10, height: 8 };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStarted(false);
    }
  }, [gameStarted, timeLeft]);

  useEffect(() => {
    if (gameStarted && boxes.length < 3) {
      const newBox = boxTypes[Math.floor(Math.random() * boxTypes.length)];
      setBoxes([...boxes, { ...newBox, id: Date.now() }]);
    }
  }, [gameStarted, boxes.length]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setBoxes([]);
    setContainer([]);
    setSelectedBox(null);
  };

  const canPlaceBox = (x, y, box) => {
    if (x + box.width > containerSize.width || y + box.height > containerSize.height) {
      return false;
    }
    for (let placed of container) {
      if (
        x < placed.x + placed.width &&
        x + box.width > placed.x &&
        y < placed.y + placed.height &&
        y + box.height > placed.y
      ) {
        return false;
      }
    }
    return true;
  };

  const handleCellClick = (x, y) => {
    if (!selectedBox || !gameStarted) return;

    if (canPlaceBox(x, y, selectedBox)) {
      setContainer([...container, { ...selectedBox, x, y }]);
      setBoxes(boxes.filter(b => b.id !== selectedBox.id));
      setSelectedBox(null);
      setScore(score + 10);
    }
  };

  if (!gameStarted) {
    return (
      <Card className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Packing Game</h2>
        <p className="text-gray-600 mb-4 text-sm">
          Pak de dozen zo efficiënt mogelijk in de container. Klik op een doos en dan op een plek in de container.
        </p>
        <Button onClick={startGame} variant="primary">
          Start Game
        </Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-bold">
          Score: <span className="text-logistics-blue">{score}</span>
        </div>
        <div className="text-lg font-bold">
          Tijd: <span className="text-logistics-orange">{timeLeft}s</span>
        </div>
      </div>

      <div className="mb-3 flex gap-4 items-start">
        <div className="flex-none" style={{ width: '200px' }}>
          <h3 className="text-base font-semibold mb-2">Te plaatsen dozen:</h3>
          <div className="flex flex-col space-y-3">
            {boxes.map((box) => (
              <button
                key={box.id}
                onClick={() => setSelectedBox(box)}
                className={`${box.color} p-3 rounded border-2 ${
                  selectedBox?.id === box.id ? 'border-logistics-blue' : 'border-transparent'
                } hover:border-logistics-blue transition-all`}
                style={{ width: `${box.width * 30}px`, height: `${box.height * 30}px` }}
              >
                <span className="text-white text-xs font-bold">{box.size}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold mb-2">Container:</h3>
          <div className="grid gap-0.5 bg-gray-200 p-1.5 rounded" style={{ gridTemplateColumns: `repeat(${containerSize.width}, 1fr)`, width: 'fit-content' }}>
            {Array.from({ length: containerSize.height * containerSize.width }).map((_, index) => {
              const x = index % containerSize.width;
              const y = Math.floor(index / containerSize.width);
              const placedBox = container.find(
                (b) =>
                  x >= b.x &&
                  x < b.x + b.width &&
                  y >= b.y &&
                  y < b.y + b.height
              );

              return (
                <div
                  key={index}
                  onClick={() => handleCellClick(x, y)}
                  className={`aspect-square border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors ${
                    placedBox ? `${placedBox.color} border-gray-500` : 'bg-white'
                  }`}
                  style={{ width: '30px', height: '30px' }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button onClick={() => setGameStarted(false)} variant="secondary">
          Stop Game
        </Button>
      </div>
    </Card>
  );
};

export default PackingGame;
