// A small chess "brain" for playing against the computer.
// It looks a few moves ahead (minimax with alpha-beta pruning) and scores
// positions by counting material and rewarding pieces on good squares.

import { Chess, Square } from 'chess.js';

export interface Level {
	id: number;
	name: string;
	depth: number; // how many half-moves the computer looks ahead
	noise: number; // random points added to each move, so weak levels make mistakes
}

export const LEVELS: Level[] = [
	{ id: 1, name: 'Beginner', depth: 1, noise: 300 },
	{ id: 2, name: 'Casual', depth: 1, noise: 60 },
	{ id: 3, name: 'Club', depth: 2, noise: 15 },
	{ id: 4, name: 'Strong', depth: 3, noise: 0 },
];

// Points for each piece. 100 = one pawn.
const VALUE: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

// Bonus for standing on each square, written from white's side (a8 first, h1 last).
// Black reads the same table upside down. Numbers from the "simplified evaluation function".
const SQUARE_BONUS: Record<string, number[]> = {
	p: [
		0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0,
		0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	n: [
		-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20,
		20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50,
		-40, -30, -30, -30, -30, -40, -50,
	],
	b: [
		-20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5,
		5, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10, -10,
		-10, -10, -10, -10, -20,
	],
	r: [
		0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0,
		0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
	],
	q: [
		-20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5,
		0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10, -20,
	],
	k: [
		-30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30,
		-30, -40, -40, -50, -50, -40, -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20, -20, -20, -10,
		20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20,
	],
};

const MATE = 100000;

/** Scores the position for white: positive means white is better (in points, 100 = a pawn). */
export const evaluate = (chess: Chess): number => {
	let score = 0;
	chess.board().forEach((rank, row) => {
		rank.forEach((piece, col) => {
			if (!piece) return;
			// Black looks at the table from the other side of the board
			const index = piece.color === 'w' ? row * 8 + col : (7 - row) * 8 + col;
			const points = VALUE[piece.type] + SQUARE_BONUS[piece.type][index];
			score += piece.color === 'w' ? points : -points;
		});
	});
	return score;
};

// Moves are kept as short text like "Nf3" or "exd5" (SAN), because asking
// chess.js for full move objects is about 15 times slower.

// Points a move might win: the piece it takes, plus a little for checks and promotions
const guess = (chess: Chess, san: string): number => {
	let points = 0;
	if (san.includes('x')) {
		const squares = san.match(/[a-h][1-8]/g) ?? [];
		const victim = chess.get(squares[squares.length - 1] as Square);
		points += victim ? VALUE[victim.type] : VALUE.p; // no piece there means en passant
	}
	if (san.includes('=')) points += VALUE.q;
	if (san.includes('+')) points += 50;
	return points;
};

// Try the most promising moves first. Good moves early means more pruning.
const ordered = (chess: Chess, moves: string[]): string[] =>
	moves
		.map((san) => ({ san, points: guess(chess, san) }))
		.sort((a, b) => b.points - a.points)
		.map((move) => move.san);

/**
 * Negamax with alpha-beta: the best score the side to move can force,
 * looking `depth` half-moves ahead. alpha/beta skip lines that can't matter.
 */
const search = (chess: Chess, depth: number, alpha: number, beta: number, ply: number): number => {
	if (depth === 0) return chess.turn() === 'w' ? evaluate(chess) : -evaluate(chess);

	const moves = chess.moves();
	if (moves.length === 0) {
		// Checkmate is the worst result. Prefer quicker mates by subtracting ply.
		return chess.isCheck() ? -MATE + ply : 0;
	}

	for (const san of ordered(chess, moves)) {
		chess.move(san);
		const score = -search(chess, depth - 1, -beta, -alpha, ply + 1);
		chess.undo();
		if (score >= beta) return beta;
		if (score > alpha) alpha = score;
	}
	return alpha;
};

/** Picks the computer's move (like "Nf3") for the position in `fen`, or null if the game is over. */
export const pickMove = (fen: string, level: Level): string | null => {
	const chess = new Chess(fen);
	const moves = chess.moves();
	if (moves.length === 0) return null;

	let best = moves[0];
	let bestScore = -Infinity;
	for (const san of ordered(chess, moves)) {
		chess.move(san);
		// A move can only win if its score gets near the best so far, so anything
		// below (best - noise) needs no exact score: that lets alpha-beta skip work.
		const floor = bestScore - level.noise;
		const score = -search(chess, level.depth - 1, -Infinity, -floor, 1) + Math.random() * level.noise;
		chess.undo();
		if (score > bestScore) {
			bestScore = score;
			best = san;
		}
	}
	return best;
};
