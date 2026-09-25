import { useState } from 'react';
import { Select } from '../../snippets/react-typing/Select';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

const CURRENCIES: readonly Currency[] = [
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
];

export function SelectDemo() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]!);
  return (
    <div className="demo-row">
      <Select
        label="Currency"
        options={CURRENCIES}
        value={currency}
        onChange={setCurrency}
        getLabel={(c) => `${c.symbol} ${c.name}`}
        getValue={(c) => c.code}
      />
      <span className="mono" aria-live="polite">
        onChange received: {JSON.stringify(currency)}
      </span>
    </div>
  );
}
