import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp } from 'lucide-react';

interface CrashProps {
  credits: number;
  setCredits: (credits: number) => void;
  updateWageredAmount: (amount: number) => void;
}

const Crash: React.FC<CrashProps> = ({ credits, setCredits, updateWageredAmount }) => {
  const [multiplier, setMultiplier] = useState(1);
  const [bet, setBet] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCrashed, setHasCrashed] = useState(false);
  const [message, setMessage] = useState('');
  const [autoCashout, setAutoCashout] = useState(2);
  const [history, setHistory] = useState<number[]>([]);
  const gameInterval = useRef<number>();

  const startGame = () => {
    if (credits < bet) {
      setMessage('Not enough credits!');
      return;
    }

    setCredits(credits - bet);
    updateWageredAmount(bet);
    setIsPlaying(true);
    setHasCrashed(false);
    setMessage('');
    setMultiplier(1);

    const crashPoint = generateCrashPoint();
    let currentMultiplier = 1;

    gameInterval.current = window.setInterval(() => {
      currentMultiplier += 0.01;
      setMultiplier(currentMultiplier);

      if (currentMultiplier >= autoCashout) {
        cashout();
      }

      if (currentMultiplier >= crashPoint) {
        crash();
      }
    }, 50);
  };

  const generateCrashPoint = () => {
    const random = Math.random();
    return Math.max(1, Math.floor(100 / (random * 100)) / 100);
  };

  const cashout = () => {
    if (!isPlaying || hasCrashed) return;

    clearInterval(gameInterval.current);
    const winAmount = Math.floor(bet * multiplier);
    setCredits(credits + winAmount);
    setMessage(`Cashed out at ${multiplier.toFixed(2)}x! Won ${winAmount} credits!`);
    setIsPlaying(false);
    setHistory(prev => [multiplier, ...prev].slice(0, 10));
  };

  const crash = () => {
    clearInterval(gameInterval.current);
    setHasCrashed(true);
    setIsPlaying(false);
    setMessage('Crashed!');
    setHistory(prev => [multiplier, ...prev].slice(0, 10));
  };

  useEffect(() => {
    return () => {
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-full h-64 bg-gray-900/50 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-bold">
            {multiplier.toFixed(2)}x
          </div>
        </div>
        {isPlaying && !hasCrashed && (
          <motion.div
            className="absolute bottom-0 left-0 w-full h-1 bg-green-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: multiplier }}
            transition={{ duration: 0.05 }}
          />
        )}
        {hasCrashed && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <TrendingUp className="w-24 h-24 text-red-500" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Bet Amount</label>
            <input
              type="number"
              min="10"
              max={credits}
              value={bet}
              onChange={(e) => setBet(Math.max(10, Math.min(credits, Number(e.target.value))))}
              disabled={isPlaying}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50"
            />
          </div>
          <button
            onClick={startGame}
            disabled={isPlaying}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {isPlaying ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Playing...
              </span>
            ) : (
              'Start Game'
            )}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Auto Cashout</label>
            <input
              type="number"
              min="1.1"
              step="0.1"
              value={autoCashout}
              onChange={(e) => setAutoCashout(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50"
            />
          </div>
          <button
            onClick={cashout}
            disabled={!isPlaying || hasCrashed}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-3 rounded-lg font-bold disabled:opacity-50"
          >
            Cash Out
          </button>
        </div>
      </div>

      {message && (
        <div className="text-xl font-semibold text-center">
          {message}
        </div>
      )}

      <div className="w-full">
        <h3 className="text-lg font-semibold mb-2">Recent Crashes</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {history.map((point, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded ${
                point > 2 ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {point.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Crash;