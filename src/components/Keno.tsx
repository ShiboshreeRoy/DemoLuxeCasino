import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface KenoProps {
  credits: number;
  setCredits: (credits: number) => void;
  updateWageredAmount: (amount: number) => void;
}

const GRID_SIZE = 40;
const MAX_SELECTIONS = 10;
const DRAWS = 20;
const PAYTABLE = {
  3: 1,
  4: 2,
  5: 10,
  6: 50,
  7: 100,
  8: 500,
  9: 1000,
  10: 10000
};

const Keno: React.FC<KenoProps> = ({ credits, setCredits, updateWageredAmount }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [bet, setBet] = useState(10);
  const [drawing, setDrawing] = useState(false);
  const [message, setMessage] = useState('');

  const toggleNumber = (number: number) => {
    if (drawing) return;

    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < MAX_SELECTIONS) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const draw = () => {
    if (selectedNumbers.length === 0) {
      setMessage('Please select some numbers');
      return;
    }

    if (credits < bet) {
      setMessage('Not enough credits!');
      return;
    }

    setCredits(credits - bet);
    updateWageredAmount(bet);
    setDrawing(true);
    setMessage('');
    setDrawnNumbers([]);

    const numbers = Array.from({ length: GRID_SIZE }, (_, i) => i + 1);
    const drawn: number[] = [];

    const drawInterval = setInterval(() => {
      if (drawn.length < DRAWS) {
        const index = Math.floor(Math.random() * numbers.length);
        const number = numbers.splice(index, 1)[0];
        drawn.push(number);
        setDrawnNumbers([...drawn]);
      } else {
        clearInterval(drawInterval);
        const matches = selectedNumbers.filter(n => drawn.includes(n)).length;
        const multiplier = PAYTABLE[matches as keyof typeof PAYTABLE] || 0;
        const winAmount = bet * multiplier;

        if (winAmount > 0) {
          setCredits(credits + winAmount);
          setMessage(`Matched ${matches} numbers! You won ${winAmount} credits!`);
        } else {
          setMessage('Better luck next time!');
        }
        setDrawing(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-8 gap-2 bg-gray-900/50 p-6 rounded-xl">
        {Array.from({ length: GRID_SIZE }, (_, i) => i + 1).map(number => (
          <motion.button
            key={number}
            onClick={() => toggleNumber(number)}
            className={`w-12 h-12 rounded-lg font-bold transition-colors ${
              selectedNumbers.includes(number)
                ? 'bg-purple-600'
                : drawnNumbers.includes(number)
                ? 'bg-green-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {number}
          </motion.button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="10"
            max={credits}
            value={bet}
            onChange={(e) => setBet(Math.max(10, Math.min(credits, Number(e.target.value))))}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg w-32 text-center"
          />
          <button
            onClick={draw}
            disabled={drawing || selectedNumbers.length === 0}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 px-8 py-4 rounded-full text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {drawing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Drawing...
              </span>
            ) : (
              `Draw (${bet} credits)`
            )}
          </button>
        </div>

        <div className="text-center space-y-2">
          <div className="text-sm text-gray-400">
            Select up to {MAX_SELECTIONS} numbers
          </div>
          <div className="text-sm text-gray-400">
            Selected: {selectedNumbers.length}
          </div>
        </div>

        {message && (
          <div className="text-xl font-semibold text-center">
            {message}
          </div>
        )}

        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Paytable</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(PAYTABLE).map(([matches, multiplier]) => (
              <div key={matches} className="flex justify-between">
                <span>{matches} matches:</span>
                <span>{multiplier}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keno;