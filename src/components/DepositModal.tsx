import React, { useState, useCallback } from 'react';
import { X, CreditCard, Copy, CheckCircle, Upload, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';

interface DepositModalProps {
  onClose: () => void;
  onDeposit: (amount: number) => void;
  vipLevel: number;
}

type PaymentMethod = {
  name: 'bkash' | 'nagad' | 'rocket';
  number: string;
  logo: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    name: 'bkash',
    number: '01810395960',
    logo: 'https://raw.githubusercontent.com/mir-hussain/payment-gateway/main/public/bkash.png'
  },
  {
    name: 'nagad',
    number: '01810395960',
    logo: 'https://raw.githubusercontent.com/mir-hussain/payment-gateway/main/public/nagad.png'
  },
  {
    name: 'rocket',
    number: '01810395960',
    logo: 'https://raw.githubusercontent.com/mir-hussain/payment-gateway/main/public/rocket.png'
  }
];

const DepositModal: React.FC<DepositModalProps> = ({ onClose, onDeposit, vipLevel }) => {
  const [amount, setAmount] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod['name']>('bkash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    maxSize: 5242880 // 5MB
  });

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopied(true);
    toast.success('Number copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!transactionId) {
      toast.error('Please enter the transaction ID');
      return;
    }

    if (!proofImage) {
      toast.error('Please upload payment proof');
      return;
    }

    if (amount < 100) {
      toast.error('Minimum deposit amount is 100 credits');
      return;
    }

    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onDeposit(amount);
      toast.success(`Successfully deposited ${amount} credits!`);
    }, 2000);
  };

  const selectedMethod = PAYMENT_METHODS.find(m => m.name === paymentMethod);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-8 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Deposit Credits</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              min="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="grid grid-cols-3 gap-4">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.name}
                  onClick={() => setPaymentMethod(method.name)}
                  className={`p-4 rounded-lg border-2 ${
                    paymentMethod === method.name
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="h-8 object-contain mx-auto"
                  />
                </button>
              ))}
            </div>
          </div>

          {selectedMethod && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-400">Send money to:</div>
                  <div className="text-xl font-mono mt-1">{selectedMethod.number}</div>
                </div>
                <button
                  onClick={() => copyNumber(selectedMethod.number)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Your Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Transaction ID</label>
            <input
              type="text"
              placeholder="Enter transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Proof</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <input {...getInputProps()} />
              {proofImage ? (
                <div className="relative">
                  <img
                    src={proofImage}
                    alt="Payment proof"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProofImage(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-400">
                    Drag & drop or click to upload payment proof
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: PNG, JPG, JPEG (max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleDeposit}
            disabled={processing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <CreditCard className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Deposit {amount} Credits
              </>
            )}
          </button>

          <div className="text-sm text-gray-400">
            <p>Important Notes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Minimum deposit amount is 100 credits</li>
              <li>Transaction may take up to 5 minutes to process</li>
              <li>Keep your transaction ID safe</li>
              <li>VIP {vipLevel} members get {vipLevel * 5}% bonus on deposits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;