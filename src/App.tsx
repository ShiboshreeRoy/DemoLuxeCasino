import React, { useState, useEffect } from 'react';
import { 
  Dice1, Car, Trophy, Coins, Joystick, Wallet, 
  History, Settings, User, LogOut, Crown, Target,
  Rocket, CircleDollarSign
} from 'lucide-react';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Slots from './components/Slots';
import Roulette from './components/Roulette';
import DiceGame from './components/DiceGame';
import BlackJack from './components/BlackJack';
import WheelOfFortune from './components/WheelOfFortune';
import Keno from './components/Keno';
import Crash from './components/Crash';
import DepositModal from './components/DepositModal';
import ProfileModal from './components/ProfileModal';
import BettingHistory from './components/BettingHistory';
import { cn } from './utils/cn';

type GameCategory = 'all' | 'slots' | 'table' | 'instant' | 'lottery';
type GameInfo = {
  id: string;
  name: string;
  description: string;
  category: GameCategory[];
  icon: React.ElementType;
  color: string;
  minBet: number;
  maxBet: number;
  component: React.ComponentType<any>;
  isNew?: boolean;
  isHot?: boolean;
};

const GAMES: GameInfo[] = [
  {
    id: 'slots',
    name: 'Slots',
    description: 'Try your luck at our exciting slot machine!',
    category: ['slots'],
    icon: Car,
    color: 'from-purple-600 to-purple-800',
    minBet: 10,
    maxBet: 1000,
    component: Slots,
    isHot: true
  },
  {
    id: 'roulette',
    name: 'Roulette',
    description: 'Place your bets on the roulette wheel!',
    category: ['table'],
    icon: Trophy,
    color: 'from-red-600 to-red-800',
    minBet: 50,
    maxBet: 5000,
    component: Roulette
  },
  {
    id: 'dice',
    name: 'Dice',
    description: 'Roll the dice and test your fortune!',
    category: ['instant'],
    icon: Dice1,
    color: 'from-blue-600 to-blue-800',
    minBet: 10,
    maxBet: 1000,
    component: DiceGame
  },
  {
    id: 'blackjack',
    name: 'Blackjack',
    description: 'Play against the dealer in this classic card game!',
    category: ['table'],
    icon: Joystick,
    color: 'from-green-600 to-green-800',
    minBet: 50,
    maxBet: 5000,
    component: BlackJack
  },
  {
    id: 'wheel',
    name: 'Wheel of Fortune',
    description: 'Spin the wheel for massive multipliers!',
    category: ['instant'],
    icon: Target,
    color: 'from-yellow-600 to-orange-800',
    minBet: 10,
    maxBet: 1000,
    component: WheelOfFortune,
    isNew: true
  },
  {
    id: 'keno',
    name: 'Keno',
    description: 'Pick your lucky numbers and win big!',
    category: ['lottery'],
    icon: CircleDollarSign,
    color: 'from-pink-600 to-purple-800',
    minBet: 10,
    maxBet: 1000,
    component: Keno,
    isNew: true
  },
  {
    id: 'crash',
    name: 'Crash Game',
    description: 'Cash out before the multiplier crashes!',
    category: ['instant'],
    icon: Rocket,
    color: 'from-cyan-600 to-blue-800',
    minBet: 10,
    maxBet: 5000,
    component: Crash,
    isHot: true,
    isNew: true
  }
];

function App() {
  const [credits, setCredits] = useState(1000);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [vipLevel, setVipLevel] = useState(1);
  const [totalWagered, setTotalWagered] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [bettingHistory, setBettingHistory] = useState<Array<{
    id: string;
    game: string;
    amount: number;
    result: 'win' | 'loss';
    timestamp: Date;
    profit: number;
  }>>([]);

  const [lastLogin, setLastLogin] = useState<Date>(new Date());
  const [dailyBonus, setDailyBonus] = useState<boolean>(true);

  useEffect(() => {
    // Check for daily bonus
    const lastLoginDate = format(lastLogin, 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (lastLoginDate !== today && dailyBonus) {
      const bonus = Math.floor(100 + (vipLevel - 1) * 50);
      setCredits(prev => prev + bonus);
      setDailyBonus(false);
      setLastLogin(new Date());
    }
  }, []);

  const updateWageredAmount = (amount: number) => {
    const newTotal = totalWagered + amount;
    setTotalWagered(newTotal);
    
    // Update VIP level based on total wagered
    if (newTotal >= 50000) setVipLevel(5);
    else if (newTotal >= 25000) setVipLevel(4);
    else if (newTotal >= 10000) setVipLevel(3);
    else if (newTotal >= 5000) setVipLevel(2);

    // Add to betting history
    const historyEntry = {
      id: Math.random().toString(36).substr(2, 9),
      game: activeGame || 'unknown',
      amount: amount,
      result: Math.random() > 0.5 ? 'win' : 'loss',
      timestamp: new Date(),
      profit: amount * (Math.random() > 0.5 ? 1 : -1)
    };

    setBettingHistory(prev => [historyEntry, ...prev]);
  };

  const filteredGames = GAMES.filter(game => 
    selectedCategory === 'all' || game.category.includes(selectedCategory)
  );

  const renderGame = () => {
    const game = GAMES.find(g => g.id === activeGame);
    if (!game) return null;

    const GameComponent = game.component;
    return (
      <GameComponent
        credits={credits}
        setCredits={setCredits}
        vipLevel={vipLevel}
        updateWageredAmount={updateWageredAmount}
        minBet={game.minBet}
        maxBet={game.maxBet}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black text-white">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Car className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              LuxeCasino
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-900/50 px-4 py-2 rounded-full">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">VIP {vipLevel}</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-900/50 px-4 py-2 rounded-full">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">{credits}</span>
            </div>
            <button
              onClick={() => setShowHistory(true)}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowProfileModal(true)}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDepositModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors"
            >
              <Wallet className="w-5 h-5" />
              Deposit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Welcome to LuxeCasino</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Experience the thrill of casino gaming from the comfort of your home.
              Choose from our selection of exciting games and try your luck!
            </p>
            <div className="mt-6 flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map(level => (
                <div
                  key={level}
                  className={cn(
                    "px-6 py-3 rounded-lg",
                    level <= vipLevel
                      ? "bg-gradient-to-r from-purple-600 to-pink-600"
                      : "bg-purple-900/30"
                  )}
                >
                  <div className="text-xl font-bold text-yellow-400">VIP Level {level}</div>
                  <div className="text-sm text-gray-300">
                    {level === 1 && "0 - 4,999"}
                    {level === 2 && "5,000 - 9,999"}
                    {level === 3 && "10,000 - 24,999"}
                    {level === 4 && "25,000 - 49,999"}
                    {level === 5 && "50,000+"}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Game Categories */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {(['all', 'slots', 'table', 'instant', 'lottery'] as const).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full capitalize transition-colors whitespace-nowrap",
                selectedCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Game Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <AnimatePresence>
            {filteredGames.map(game => {
              const Icon = game.icon;
              return (
                <motion.button
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => {
                    setActiveGame(game.id);
                    setShowWelcome(false);
                  }}
                  className={cn(
                    "relative bg-gradient-to-br p-6 rounded-xl transition-all transform hover:scale-105",
                    game.color
                  )}
                >
                  {(game.isNew || game.isHot) && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      {game.isNew && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                      {game.isHot && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          HOT
                        </span>
                      )}
                    </div>
                  )}
                  <Icon className="w-12 h-12 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                  <p className="text-gray-200">{game.description}</p>
                  <div className="mt-4 text-sm text-gray-300">
                    Min Bet: {game.minBet} • Max Bet: {game.maxBet}
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Active Game */}
        <AnimatePresence mode="wait">
          {activeGame && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{GAMES.find(g => g.id === activeGame)?.name}</h2>
                <button
                  onClick={() => {
                    setActiveGame(null);
                    setShowWelcome(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Close Game
                </button>
              </div>
              {renderGame()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showDepositModal && (
          <DepositModal
            onClose={() => setShowDepositModal(false)}
            onDeposit={(amount) => {
              setCredits(credits + amount);
              setShowDepositModal(false);
            }}
            vipLevel={vipLevel}
          />
        )}

        {showProfileModal && (
          <ProfileModal
            onClose={() => setShowProfileModal(false)}
            vipLevel={vipLevel}
            totalWagered={totalWagered}
            bettingHistory={bettingHistory}
          />
        )}

        {showHistory && (
          <BettingHistory
            onClose={() => setShowHistory(false)}
            history={bettingHistory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;