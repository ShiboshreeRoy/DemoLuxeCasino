import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SlotsProps {
  credits: number;
  setCredits: (credits: number) => void;
}

const SYMBOLS = ['🍒', '🍊', '🍇', '💎', '7️⃣', '🎰'];
const BET_AMOUNT = 10;

const Slots: React.FC<SlotsProps> = ({ credits, setCredits }) => {
  const [reels, setReels] = useState(['🎰', '🎰', '🎰']);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState('');

  const spin = () => {
    if (credits < BET_AMOUNT) {
      setMessage('Not enough credits!');
      return;
    }

    setSpinning(true);
    setCredits(credits - BET_AMOUNT);
    setMessage('');

    // Simulate spinning animation
    const intervalId = setInterval(() => {
      setReels(reels.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]));
    }, 100);

    // Stop spinning after 2 seconds
    setTimeout(() => {
      clearInterval(intervalId);
      const finalReels = reels.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      setReels(finalReels);
      setSpinning(false);

      // Check for wins
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        const winAmount = BET_AMOUNT * 50;
        setCredits(credits + winAmount);
        setMessage(`Jackpot! You won ${winAmount} credits!`);
      } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2]) {
        const winAmount = BET_AMOUNT * 2;
        setCredits(credits + winAmount);
        setMessage(`You won ${winAmount} credits!`);
      } else {
        setMessage('Try again!');
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-4 text-6xl bg-black/30 p-8 rounded-xl">
        {reels.map((symbol, index) => (
          <div
            key={index}
            className="w-24 h-24 flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900 rounded-lg shadow-lg"
          >
            {symbol}
          </div>
        ))}
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-full text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {spinning ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            Spinning...
          </span>
        ) : (
          `Spin (${BET_AMOUNT} credits)`
        )}
      </button>

      {message && (
        <div className="text-xl font-semibold text-center">
          {message}
        </div>
      )}
    </div>
  );
};

export default Slots;