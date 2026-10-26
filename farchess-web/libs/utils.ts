// Shows a rating change with a sign, using a real minus sign: +34, −12
export const formatChange = (change: number) => (change < 0 ? `−${Math.abs(change)}` : `+${change}`);

// Green for gains, red for losses
export const changeColor = (change: number) => (change < 0 ? 'text-loss' : 'text-win');

// 118 seconds → "1:58"
export const formatClock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

// Two moves (white then black) make one full move: 18 moves → move 9
export const moveNumber = (moves: string[]) => Math.ceil(moves.length / 2);
