import React from 'react';
import { X, Trophy, Coins, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface ProfileModalProps {
  onClose: () => void;
  vipLevel: number;
  totalWagered: number;
  bettingHistory: Array<{
    id: string;
    game: string;
    amount: number;
    result: 'win' | 'loss';
    timestamp: Date;
    profit: number;
  }>;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  onClose,
  vipLevel,
  totalWagered,
  bettingHistory
}) => {
  const totalProfit = bettingHistory.reduce((acc, bet) => acc + bet.profit, 0);
  const winRate = bettingHistory.length
    ? (bettingHistory.filter(bet => bet.result === 'win').length / bettingHistory.length) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-900/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">VIP Level</span>
              </div>
              <div className="text-2xl font-bold">{vipLevel}</div>
            </div>

            <div className="bg-purple-900/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <Coins className="w-5 h-5" />
                <span className="font-medium">Total Wagered</span>
              </div>
              <div className="text-2xl font-bold">{totalWagered}</div>
            </div>

            <div className="bg-purple-900/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Win Rate</span>
              </div>
              <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
            </div>

            <div className="bg-purple-900/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-pink-400 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Total Profit</span>
              </div>
              <div className="text-2xl font-bold">{totalProfit}</div>
            </div>
          </div>

          <div className="bg-purple-900/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {bettingHistory.slice(0, 5).map(bet => (
                <div
                  key={bet.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <span className="font-medium">{bet.game}</span>
                    <span className="text-gray-400 ml-2">
                      {format(bet.timestamp, 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <span
                    className={
                      bet.result === 'win'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }
                  >
                    {bet.result === 'win' ? '+' : '-'}{bet.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileModal;