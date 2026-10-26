// Small chess helpers for drawing positions.

export type PieceColor = 'white' | 'black';

export interface Square {
	name: string; // like "e4"
	dark: boolean;
	piece: { color: PieceColor; glyph: string } | null;
}

export const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

// We always draw the solid glyphs and color them ourselves, so white
// pieces look as big and bold as black ones.
const glyphs: Record<string, string> = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };

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
				squares.push(makeSquare(row, col++, { color, glyph }));
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
