import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface WheelOfFortuneProps {
  credits: number;
  setCredits: (credits: number) => void;
  updateWageredAmount: (amount: number) => void;
}

const SEGMENTS = [
  { value: 2, color: 'bg-red-500', probability: 0.3 },
  { value: 3, color: 'bg-blue-500', probability: 0.25 },
  { value: 5, color: 'bg-green-500', probability: 0.2 },
  { value: 10, color: 'bg-yellow-500', probability: 0.15 },
  { value: 20, color: 'bg-purple-500', probability: 0.07 },
  { value: 50, color: 'bg-pink-500', probability: 0.03 }
];

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ credits, setCredits, updateWageredAmount }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState('');

  const spin = () => {
    if (credits < bet) {
      setMessage('Not enough credits!');
      return;
    }

    setCredits(credits - bet);
    updateWageredAmount(bet);
    setSpinning(true);
    setMessage('');

    // Calculate result based on probabilities
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedSegment = SEGMENTS[0];

    for (const segment of SEGMENTS) {
      cumulativeProbability += segment.probability;
      if (random <= cumulativeProbability) {
        selectedSegment = segment;
        break;
      }
    }

    // Calculate rotation to land on the selected segment
    const segmentAngle = 360 / SEGMENTS.length;
    const segmentIndex = SEGMENTS.indexOf(selectedSegment);
    const targetRotation = 360 * 5 + segmentIndex * segmentAngle;
    
    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      const winAmount = bet * selectedSegment.value;
      setCredits(credits + winAmount);
      setMessage(`You won ${winAmount} credits!`);
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-80 h-80">
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: "easeOut" }}
        >
          {SEGMENTS.map((segment, index) => (
            <div
              key={index}
              className={`absolute w-1/2 h-1/2 origin-bottom-right ${segment.color} flex items-start justify-center p-4 text-white font-bold`}
              style={{
                transform: `rotate(${index * (360 / SEGMENTS.length)}deg)`
              }}
            >
              {segment.value}x
            </div>
          ))}
        </motion.div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-8 bg-white"></div>
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
            onClick={spin}
            disabled={spinning}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-full text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {spinning ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Spinning...
              </span>
            ) : (
              `Spin (${bet} credits)`
            )}
          </button>
        </div>

        {message && (
          <div className="text-xl font-semibold text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelOfFortune;