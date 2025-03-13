import React from 'react';
import { X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface BettingHistoryProps {
  onClose: () => void;
  history: Array<{
    id: string;
    game: string;
    amount: number;
    result: 'win' | 'loss';
    timestamp: Date;
    profit: number;
  }>;
}

const BettingHistory: React.FC<BettingHistoryProps> = ({ onClose, history }) => {
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
        className="bg-gray-900 rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Betting History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {history.map(bet => (
            <div
              key={bet.id}
              className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {bet.result === 'win' ? (
                  <ArrowUpRight className="w-6 h-6 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-6 h-6 text-red-400" />
                )}
                <div>
                  <div className="font-medium">{bet.game}</div>
                  <div className="text-sm text-gray-400">
                    {format(bet.timestamp, 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={
                    bet.result === 'win'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {bet.result === 'win' ? '+' : '-'}{Math.abs(bet.profit)}
                </div>
                <div className="text-sm text-gray-400">
                  Bet Amount: {bet.amount}
                </div>
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No betting history available
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BettingHistory;