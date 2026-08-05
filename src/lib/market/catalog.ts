// src/lib/market/catalog.ts
import type { MarketCategory, MarketSymbol } from "@/lib/market/contracts";

export type MarketInstrument = {
  symbol: MarketSymbol;
  label: string;
  category: MarketCategory;
  description: string;
  sourceLabel: string;
  availability: "available" | "provider_required";
};

export const MARKET_INSTRUMENTS: MarketInstrument[] = [
  {
    symbol: "BTCUSD",
    label: "BTC/USD",
    category: "crypto",
    description: "بیت‌کوین در برابر دلار آمریکا",
    sourceLabel: "CoinGecko",
    availability: "available",
  },
  {
    symbol: "ETHUSD",
    label: "ETH/USD",
    category: "crypto",
    description: "اتریوم در برابر دلار آمریکا",
    sourceLabel: "CoinGecko",
    availability: "available",
  },
  {
    symbol: "EURUSD",
    label: "EUR/USD",
    category: "forex",
    description: "نرخ مرجع یورو در برابر دلار آمریکا",
    sourceLabel: "Frankfurter / ECB",
    availability: "available",
  },
  {
    symbol: "XAUUSD",
    label: "XAU/USD",
    category: "metals",
    description: "نمای مرجع طلای توکنیزه‌شده در برابر دلار",
    sourceLabel: "CoinGecko / PAXG proxy",
    availability: "available",
  },
  {
    symbol: "USDIRR",
    label: "USD/IRR",
    category: "currency",
    description: "دلار آمریکا در برابر ریال ایران",
    sourceLabel: "Iran market provider",
    availability: "provider_required",
  },
  {
    symbol: "TEDPIX",
    label: "TEDPIX",
    category: "iran_bourse",
    description: "شاخص کل بورس تهران",
    sourceLabel: "Iran market provider",
    availability: "provider_required",
  },
];

export const MARKET_CATEGORY_LABELS: Record<MarketCategory, string> = {
  crypto: "رمزارز",
  forex: "فارکس",
  metals: "فلزات",
  currency: "ارز ایران",
  iran_bourse: "بورس ایران",
};

export function getInstrument(symbol: string | null | undefined) {
  return MARKET_INSTRUMENTS.find((instrument) => instrument.symbol === symbol) ?? MARKET_INSTRUMENTS[0];
}
