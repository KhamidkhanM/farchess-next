// Small chess helpers for drawing positions.

export type PieceColor = 'white' | 'black';

export interface Square {
	name: string; // like "e4"
	dark: boolean;
	piece: { color: PieceColor; type: string; glyph: string } | null;
}

export const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

// We always draw the solid glyphs and color them ourselves, so white
// pieces look as big and bold as black ones.
const glyphs: Record<string, string> = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
const names: Record<string, string> = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };

// U+FE0E asks the browser to show the symbol as text, not as an emoji
const TEXT_STYLE = '︎';

const FILES = 'abcdefgh';

/**
 * Turns the board part of a FEN string into 64 squares, from a8 to h1.
 * FEN lists ranks top to bottom, split by "/". Letters are pieces
 * (uppercase = white, lowercase = black) and digits are empty squares.
 */
export const parseFen = (fen: string): Square[] => {
	const ranks = fen.split(' ')[0].split('/');
	const squares: Square[] = [];

	ranks.forEach((rank, row) => {
		let col = 0;
		for (const char of rank) {
			const empty = Number(char);
			if (empty) {
				for (let i = 0; i < empty; i++) squares.push(makeSquare(row, col++, null));
			} else {
				const color: PieceColor = char === char.toUpperCase() ? 'white' : 'black';
				const glyph = glyphs[char.toLowerCase()] + TEXT_STYLE;
				squares.push(makeSquare(row, col++, { color, type: names[char.toLowerCase()], glyph }));
			}
		}
	});

	return squares;
};

const makeSquare = (row: number, col: number, piece: Square['piece']): Square => ({
	name: FILES[col] + (8 - row),
	dark: (row + col) % 2 === 1,
	piece,
});

const START_COUNT: Record<string, number> = { q: 1, r: 2, b: 2, n: 2, p: 8 };
const SOLID: Record<string, string> = { q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
const OUTLINE: Record<string, string> = { q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' };

/**
 * The pieces a player has taken, worked out from what is missing on the board.
 * White takes black pieces (drawn solid), black takes white pieces (drawn outlined).
 */
export const capturedBy = (fen: string, side: PieceColor): string => {
	const board = fen.split(' ')[0];
	return Object.keys(START_COUNT)
		.map((type) => {
			const letter = side === 'white' ? type : type.toUpperCase();
			const onBoard = board.split('').filter((char) => char === letter).length;
			const missing = Math.max(0, START_COUNT[type] - onBoard);
			return (side === 'white' ? SOLID : OUTLINE)[type].repeat(missing);
		})
		.join('');
};

// ['e4', 'e5', 'Nf3'] → [['e4', 'e5'], ['Nf3', '']]
export const pairMoves = (moves: string[]): string[][] => {
	const pairs: string[][] = [];
	for (let i = 0; i < moves.length; i += 2) pairs.push([moves[i], moves[i + 1] ?? '']);
	return pairs;
};
