import React, { useState } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Loader2 } from 'lucide-react';

interface DiceGameProps {
  credits: number;
  setCredits: (credits: number) => void;
}

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
const BET_AMOUNT = 10;

const DiceGame: React.FC<DiceGameProps> = ({ credits, setCredits }) => {
  const [dice, setDice] = useState<number[]>([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [prediction, setPrediction] = useState<'higher' | 'lower' | null>(null);
  const [message, setMessage] = useState('');

  const rollDice = () => {
    if (!prediction) {
      setMessage('Please make a prediction!');
      return;
    }

    if (credits < BET_AMOUNT) {
      setMessage('Not enough credits!');
      return;
    }

    setRolling(true);
    setCredits(credits - BET_AMOUNT);
    setMessage('');

    // Simulate rolling animation
    const intervalId = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
    }, 100);

    // Stop rolling after 2 seconds
    setTimeout(() => {
      clearInterval(intervalId);
      const finalDice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      setDice(finalDice);
      setRolling(false);

      const sum = finalDice[0] + finalDice[1];
      const isHigher = sum > 7;
      
      if ((prediction === 'higher' && isHigher) || (prediction === 'lower' && !isHigher)) {
        const winAmount = BET_AMOUNT * 2;
        setCredits(credits + winAmount);
        setMessage(`You won ${winAmount} credits!`);
      } else {
        setMessage('Better luck next time!');
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-8 text-6xl">
        {dice.map((value, index) => {
          const DiceIcon = DICE_ICONS[value - 1];
          return (
            <div
              key={index}
              className="w-24 h-24 flex items-center justify-center bg-white text-blue-900 rounded-xl shadow-lg"
            >
              <DiceIcon className="w-16 h-16" />
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setPrediction('lower')}
          className={`px-6 py-3 rounded-lg font-bold ${
            prediction === 'lower'
              ? 'bg-red-600'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Lower than 7
        </button>
        <button
          onClick={() => setPrediction('higher')}
          className={`px-6 py-3 rounded-lg font-bold ${
            prediction === 'higher'
              ? 'bg-green-600'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Higher than 7
        </button>
      </div>

      <button
        onClick={rollDice}
        disabled={rolling || !prediction}
        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 px-8 py-4 rounded-full text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {rolling ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            Rolling...
          </span>
        ) : (
          `Roll (${BET_AMOUNT} credits)`
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

export default DiceGame;