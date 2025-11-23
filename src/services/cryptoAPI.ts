/**
 * Crypto API Service using CoinGecko
 * https://www.coingecko.com/en/api - Free tier available, no API key required for basic usage
 */

import type { CryptoPrice } from '../types';

// Map common crypto symbols to CoinGecko IDs
const SYMBOL_TO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  BNB: 'binancecoin',
  SOL: 'solana',
  USDC: 'usd-coin',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  TRX: 'tron',
  TON: 'the-open-network',
  LINK: 'chainlink',
  MATIC: 'matic-network',
  DOT: 'polkadot',
  AVAX: 'avalanche-2',
  UNI: 'uniswap',
  ATOM: 'cosmos',
  LTC: 'litecoin',
  BCH: 'bitcoin-cash',
  XLM: 'stellar',
};

export const fetchCryptoPrices = async (
  symbols: string[],
  currency: string = 'usd'
): Promise<CryptoPrice[]> => {
  try {
    // Convert symbols to CoinGecko IDs
    const ids = symbols
      .map((symbol) => SYMBOL_TO_ID[symbol.toUpperCase()] || symbol.toLowerCase())
      .join(',');

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?` +
        `ids=${ids}` +
        `&vs_currencies=${currency.toLowerCase()}` +
        `&include_24hr_change=true` +
        `&include_24hr_vol=false`
    );

    if (!response.ok) {
      throw new Error('CoinGecko API request failed');
    }

    const data = await response.json();

    // Transform response to our format
    const prices: CryptoPrice[] = [];

    for (const symbol of symbols) {
      const id = SYMBOL_TO_ID[symbol.toUpperCase()] || symbol.toLowerCase();
      const coinData = data[id];

      if (coinData) {
        const price = coinData[currency.toLowerCase()];
        const change24h = coinData[`${currency.toLowerCase()}_24h_change`];

        prices.push({
          symbol: symbol.toUpperCase(),
          name: symbol.toUpperCase(),
          price: price,
          change24h: price * (change24h / 100), // Convert percentage to absolute change
          changePercent24h: change24h,
        });
      }
    }

    return prices;
  } catch (error) {
    console.error('Crypto API error:', error);
    throw error;
  }
};

/**
 * Search for crypto by name or symbol
 * Useful for future autocomplete feature
 */
export const searchCrypto = async (query: string): Promise<{ id: string; symbol: string; name: string }[]> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/search?query=' + encodeURIComponent(query));

    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();

    return data.coins.slice(0, 10).map((coin: { id: string; symbol: string; name: string }) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
    }));
  } catch (error) {
    console.error('Crypto search error:', error);
    return [];
  }
};
