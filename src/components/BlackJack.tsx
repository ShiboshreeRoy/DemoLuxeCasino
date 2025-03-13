import React, { useState, useEffect } from 'react';
import { PlayCircle, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BlackJackProps {
  credits: number;
  setCredits: (credits: number) => void;
  vipLevel: number;
  updateWageredAmount: (amount: number) => void;
}

type Card = {
  suit: '♠' | '♣' | '♥' | '♦';
  value: string;
  numericValue: number;
};

const SUITS: Card['suit'][] = ['♠', '♣', '♥', '♦'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const BlackJack: React.FC<BlackJackProps> = ({ credits, setCredits, vipLevel, updateWageredAmount }) => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'gameOver'>('betting');
  const [bet, setBet] = useState(50);
  const [message, setMessage] = useState('');

  const createDeck = () => {
    const newDeck: Card[] = [];
    SUITS.forEach(suit => {
      VALUES.forEach(value => {
        const numericValue = value === 'A' ? 11 : ['J', 'Q', 'K'].includes(value) ? 10 : parseInt(value);
        newDeck.push({ suit, value, numericValue });
      });
    });
    return shuffle(newDeck);
  };

  const shuffle = (cards: Card[]) => {
    const newCards = [...cards];
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }
    return newCards;
  };

  const drawCard = () => {
    const newDeck = [...deck];
    if (newDeck.length === 0) {
      const freshDeck = createDeck();
      setDeck(freshDeck.slice(1));
      return freshDeck[0];
    }
    const card = newDeck.pop();
    setDeck(newDeck);
    return card;
  };

  const calculateHand = (hand: Card[]) => {
    let sum = 0;
    let aces = 0;

    hand.forEach(card => {
      if (card.value === 'A') {
        aces += 1;
      }
      sum += card.numericValue;
    });

    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces -= 1;
    }

    return sum;
  };

  const startGame = () => {
    if (credits < bet) {
      toast.error('Not enough credits!');
      return;
    }

    setCredits(credits - bet);
    updateWageredAmount(bet);

    const newDeck = createDeck();
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    const dealerCards = [newDeck.pop()!];

    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameState('playing');
    setMessage('');
  };

  const hit = () => {
    const card = drawCard();
    if (card) {
      const newHand = [...playerHand, card];
      setPlayerHand(newHand);

      const total = calculateHand(newHand);
      if (total > 21) {
        setGameState('gameOver');
        setMessage('Bust! You lose!');
      }
    }
  };

  const stand = () => {
    setGameState('dealerTurn');
  };

  useEffect(() => {
    if (gameState === 'dealerTurn') {
      const dealerPlay = () => {
        let currentHand = [...dealerHand];
        let total = calculateHand(currentHand);

        while (total < 17) {
          const card = drawCard();
          if (card) {
            currentHand.push(card);
            total = calculateHand(currentHand);
          }
        }

        setDealerHand(currentHand);
        const playerTotal = calculateHand(playerHand);
        const dealerTotal = calculateHand(currentHand);

        if (dealerTotal > 21 || playerTotal > dealerTotal) {
          const winAmount = bet * 2;
          setCredits(credits + winAmount);
          setMessage(`You win ${winAmount} credits!`);
        } else if (dealerTotal > playerTotal) {
          setMessage('Dealer wins!');
        } else {
          setCredits(credits + bet);
          setMessage('Push! Bet returned.');
        }
        setGameState('gameOver');
      };

      setTimeout(dealerPlay, 1000);
    }
  }, [gameState]);

  const renderHand = (hand: Card[], hideFirst = false) => (
    <div className="flex gap-2">
      {hand.map((card, index) => (
        <div
          key={index}
          className={`w-16 h-24 flex items-center justify-center rounded-lg ${
            ['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-white'
          } ${
            hideFirst && index === 0
              ? 'bg-purple-900'
              : 'bg-white text-black'
          }`}
        >
          {hideFirst && index === 0 ? (
            '?'
          ) : (
            <div className="text-center">
              <div className="text-xl font-bold">{card.value}</div>
              <div className="text-2xl">{card.suit}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-8">
      {gameState === 'betting' ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="50"
              max={credits}
              value={bet}
              onChange={(e) => setBet(Math.max(50, Math.min(credits, Number(e.target.value))))}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg w-32 text-center"
            />
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 px-8 py-4 rounded-full text-xl font-bold flex items-center gap-2"
            >
              <PlayCircle className="w-6 h-6" />
              Deal
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Dealer's Hand</div>
              {dealerHand.length > 0 && renderHand(dealerHand, gameState === 'playing')}
              {gameState !== 'playing' && dealerHand.length > 0 && (
                <div className="mt-2">Total: {calculateHand(dealerHand)}</div>
              )}
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Your Hand</div>
              {playerHand.length > 0 && renderHand(playerHand)}
              {playerHand.length > 0 && (
                <div className="mt-2">Total: {calculateHand(playerHand)}</div>
              )}
            </div>
          </div>

          {gameState === 'playing' && (
            <div className="flex gap-4">
              <button
                onClick={hit}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-bold"
              >
                Hit
              </button>
              <button
                onClick={stand}
                className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-bold flex items-center gap-2"
              >
                <StopCircle className="w-5 h-5" />
                Stand
              </button>
            </div>
          )}

          {message && (
            <div className="text-xl font-semibold text-center">
              {message}
            </div>
          )}

          {gameState === 'gameOver' && (
            <button
              onClick={() => {
                setGameState('betting');
                setPlayerHand([]);
                setDealerHand([]);
              }}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-bold"
            >
              Play Again
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default BlackJack;