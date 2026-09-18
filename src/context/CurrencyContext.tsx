import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, CurrencyRate } from '../types';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  rates: Record<CurrencyCode, CurrencyRate>;
  formatPrice: (pricePhp: number) => string;
  convertPrice: (pricePhp: number) => number;
  currentRate: CurrencyRate;
}

const RATES: Record<CurrencyCode, CurrencyRate> = {
  PHP: {
    code: 'PHP',
    symbol: '₱',
    rateToPhp: 1.0,
    name: 'Philippine Peso'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rateToPhp: 0.0177, // 1 PHP ~ $0.0177
    name: 'US Dollar'
  }
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('PHP');

  useEffect(() => {
    const saved = localStorage.getItem('gpds_currency') as CurrencyCode;
    if (saved && RATES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('gpds_currency', code);
  };

  const convertPrice = (pricePhp: number): number => {
    const rate = RATES[currency].rateToPhp;
    return pricePhp * rate;
  };

  const formatPrice = (pricePhp: number): string => {
    const targetAmount = convertPrice(pricePhp);
    const curr = RATES[currency];

    if (currency === 'USD') {
      return `${curr.symbol}${targetAmount.toFixed(2)}`;
    }

    return `${curr.symbol}${targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates: RATES,
        formatPrice,
        convertPrice,
        currentRate: RATES[currency]
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
