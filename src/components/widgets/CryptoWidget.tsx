import { useState, useEffect } from 'react';
import { FiRefreshCw, FiTrendingUp, FiTrendingDown, FiPlus, FiX, FiDollarSign } from 'react-icons/fi';
import { useDashboardStore } from '../../store/dashboardStore';
import { fetchCryptoPrices } from '../../services/cryptoAPI';
import type { CryptoConfig, CryptoPrice } from '../../types';

interface CryptoWidgetProps {
  widgetId: string;
  config: CryptoConfig;
}

const CryptoWidget = ({ widgetId, config }: CryptoWidgetProps) => {
  const { updateWidgetConfig } = useDashboardStore();
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

  const loadPrices = async () => {
    if (config.symbols.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchCryptoPrices(config.symbols, config.currency);
      setPrices(data);
    } catch (err) {
      setError('Failed to load crypto prices');
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPrices();
    // Refresh every 60 seconds
    const interval = setInterval(loadPrices, 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.symbols, config.currency]);

  const handleAddSymbol = () => {
    const symbol = newSymbol.trim().toUpperCase();
    if (symbol && !config.symbols.includes(symbol)) {
      updateWidgetConfig(widgetId, {
        symbols: [...config.symbols, symbol],
      });
      setNewSymbol('');
      setIsAdding(false);
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    updateWidgetConfig(widgetId, {
      symbols: config.symbols.filter((s) => s !== symbol),
    });
  };

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return price.toFixed(2);
    } else {
      return price.toFixed(4);
    }
  };

  const formatChange = (change: number): string => {
    return change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
  };

  if (config.symbols.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <FiDollarSign className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
            No crypto symbols added
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Add your first cryptocurrency to track
          </p>
          <button onClick={() => setIsAdding(true)} className="btn-primary text-sm">
            <FiPlus className="inline mr-2" />
            Add Symbol
          </button>
        </div>

        {isAdding && (
          <div className="mt-4 w-full">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSymbol()}
                className="input-field text-sm"
                placeholder="e.g., BTC, ETH, SOL"
                autoFocus
              />
              <button onClick={handleAddSymbol} className="btn-primary text-sm">
                Add
              </button>
              <button onClick={() => setIsAdding(false)} className="btn-ghost text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading && prices.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Loading prices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={loadPrices} className="btn-primary text-sm">
          <FiRefreshCw className="inline mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Crypto Prices ({config.currency.toUpperCase()})
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-slate-400 hover:text-primary-500"
            title="Add symbol"
          >
            <FiPlus className="w-4 h-4" />
          </button>
          <button
            onClick={loadPrices}
            className="text-slate-400 hover:text-primary-500"
            disabled={loading}
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Add Symbol Input */}
      {isAdding && (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSymbol()}
              className="input-field text-sm py-1"
              placeholder="e.g., BTC, ETH, SOL"
              autoFocus
            />
            <button onClick={handleAddSymbol} className="btn-primary text-sm py-1">
              Add
            </button>
          </div>
        </div>
      )}

      {/* Price List */}
      <div className="flex-1 overflow-auto scrollbar-thin space-y-3">
        {prices.map((crypto) => {
          const isPositive = crypto.changePercent24h >= 0;

          return (
            <div
              key={crypto.symbol}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {crypto.symbol}
                  </div>
                  <div className="text-xs text-slate-500">{crypto.name}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    ${formatPrice(crypto.price)}
                  </div>
                  <div
                    className={`text-xs flex items-center justify-end ${
                      isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {isPositive ? (
                      <FiTrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <FiTrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {formatChange(crypto.changePercent24h)}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveSymbol(crypto.symbol)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                  title="Remove"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoWidget;
