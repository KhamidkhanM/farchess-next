// Shows a rating change with a sign, using a real minus sign: +34, −12
export const formatChange = (change: number) => (change < 0 ? `−${Math.abs(change)}` : `+${change}`);

// Green for gains, red for losses
export const changeColor = (change: number) => (change < 0 ? 'text-loss' : 'text-win');
