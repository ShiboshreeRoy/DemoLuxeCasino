import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RouletteProps {
  credits: number;
  setCredits: (credits: number) => void;
}

const NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0-36
const MIN_BET = 10;

const Roulette: React.FC<RouletteProps> = ({ credits, setCredits }) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(MIN_BET);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const spin = () => {
    if (!selectedNumber) {
      setMessage('Please select a number');
      return;
    }

    if (credits < betAmount) {
      setMessage('Not enough credits!');
      return;
    }

    setSpinning(true);
    setCredits(credits - betAmount);
    setMessage('');

    // Simulate spinning
    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37);
      setResult(winningNumber);
      setSpinning(false);

      if (winningNumber === selectedNumber) {
        const winAmount = betAmount * 35;
        setCredits(credits + winAmount);
        setMessage(`Congratulations! You won ${winAmount} credits!`);
      } else {
        setMessage('Better luck next time!');
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-6 gap-2 bg-green-900/30 p-6 rounded-xl">
        {NUMBERS.map((number) => (
          <button
            key={number}
            onClick={() => setSelectedNumber(number)}
            className={`w-12 h-12 rounded-full font-bold ${
              selectedNumber === number
                ? 'bg-yellow-500 text-black'
                : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="number"
          min={MIN_BET}
          max={credits}
          value={betAmount}
          onChange={(e) => setBetAmount(Math.max(MIN_BET, Math.min(credits, Number(e.target.value))))}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg w-32 text-center"
        />
        <button
          onClick={spin}
          disabled={spinning || !selectedNumber}
          className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 px-8 py-4 rounded-full text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {spinning ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              Spinning...
            </span>
          ) : (
            'Spin'
          )}
        </button>
      </div>

      {result !== null && (
        <div className="text-2xl font-bold">
          Result: {result}
        </div>
      )}

      {message && (
        <div className="text-xl font-semibold text-center">
          {message}
        </div>
      )}
    </div>
  );
};

export default Roulette;