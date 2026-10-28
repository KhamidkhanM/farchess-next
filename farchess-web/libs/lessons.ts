import { Chess } from 'chess.js';

// A move the learner has to play to finish a step, or any checkmate
export type LessonGoal = { from: string; to: string } | 'mate';

export interface LessonStep {
	text: string;
	fen: string;
	goal?: LessonGoal;
	highlight?: string[]; // squares to point at while reading
}

export interface Lesson {
	id: string;
	title: string;
	level: 'Beginner' | 'Improver';
	summary: string;
	steps: LessonStep[];
}

// The position after some moves from the start, like afterMoves('e4 e5 Nf3')
const afterMoves = (moves: string) => {
	const chess = new Chess();
	moves.split(' ').forEach((move) => chess.move(move));
	return chess.fen();
};

// One piece on d4 with both kings tucked in the corners, white to move
const alone = (piece: string) => `8/8/8/8/3${piece}4/8/8/K6k w - - 0 1`;

export const LESSONS: Lesson[] = [
	{
		id: 'pieces',
		title: 'How the pieces move',
		level: 'Beginner',
		summary: 'Six pieces, six ways to move. Try each one on the board.',
		steps: [
			{
				text: 'The rook moves in straight lines: up, down, left or right, as far as it likes. Move the rook to d8.',
				fen: alone('R'),
				goal: { from: 'd4', to: 'd8' },
			},
			{
				text: 'The bishop moves diagonally, as far as it likes. It stays on one square colour all game. Move it to h8.',
				fen: alone('B'),
				goal: { from: 'd4', to: 'h8' },
			},
			{
				text: 'The queen moves like a rook and a bishop together. It is the strongest piece. Move it to a7.',
				fen: alone('Q'),
				goal: { from: 'd4', to: 'a7' },
			},
			{
				text: 'The knight jumps in an L: two squares one way, then one square to the side. It can jump over pieces. Jump to e6.',
				fen: alone('N'),
				goal: { from: 'd4', to: 'e6' },
			},
			{
				text: 'The king moves one square in any direction. Keep it safe: if it is trapped, you lose. Step it to b2.',
				fen: 'k7/8/8/8/8/8/8/K7 w - - 0 1',
				goal: { from: 'a1', to: 'b2' },
			},
			{
				text: 'Pawns move straight forward, one square, or two on their first move. They take diagonally. Push the e-pawn two squares.',
				fen: '7k/8/8/8/8/8/4P3/K7 w - - 0 1',
				goal: { from: 'e2', to: 'e4' },
			},
		],
	},
	{
		id: 'checkmate',
		title: 'Check and checkmate',
		level: 'Beginner',
		summary: 'Attack the king so it has nowhere to go, and the game is yours.',
		steps: [
			{
				text: 'When a piece attacks the king, that is check. Here the white rook on e1 checks the black king on e8. Black must move the king, block, or take the rook.',
				fen: '4k3/8/8/8/8/8/8/4R1K1 b - - 0 1',
				highlight: ['e1', 'e8'],
			},
			{
				text: 'Checkmate is a check with no way out. The black king is boxed in by its own pawns. Find the move that mates on the back rank.',
				fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',
				goal: 'mate',
			},
			{
				text: 'Your king can help. It guards a7 and b7, so the queen only needs to cover the last squares. Give checkmate with the queen.',
				fen: 'k7/8/1K6/8/8/8/8/7Q w - - 0 1',
				goal: 'mate',
			},
		],
	},
	{
		id: 'opening',
		title: 'A good start',
		level: 'Beginner',
		summary: 'Take the centre, bring out your pieces, then castle your king to safety.',
		steps: [
			{
				text: 'Start by taking the centre. Push your king’s pawn two squares: e2 to e4.',
				fen: new Chess().fen(),
				goal: { from: 'e2', to: 'e4' },
			},
			{
				text: 'Black did the same. Now bring a knight out towards the centre, where it attacks the e5 pawn. Play the knight from g1 to f3.',
				fen: afterMoves('e4 e5'),
				goal: { from: 'g1', to: 'f3' },
			},
			{
				text: 'Black defended with a knight. Bring out the bishop next, aiming at f7, the weakest square near Black’s king. Play it to c4.',
				fen: afterMoves('e4 e5 Nf3 Nc6'),
				goal: { from: 'f1', to: 'c4' },
			},
			{
				text: 'The squares between your king and rook are empty, so you can castle: the king jumps two squares and the rook hops over it. Move your king from e1 to g1.',
				fen: afterMoves('e4 e5 Nf3 Nc6 Bc4 Bc5'),
				goal: { from: 'e1', to: 'g1' },
			},
			{
				text: 'Centre taken, two pieces out, king safe in under ten moves. That is a great start to any game.',
				fen: afterMoves('e4 e5 Nf3 Nc6 Bc4 Bc5 O-O'),
				highlight: ['g1', 'f1'],
			},
		],
	},
	{
		id: 'endgame',
		title: 'King and pawn endings',
		level: 'Improver',
		summary: 'In the endgame your king becomes a fighter. Use it to walk your pawn home.',
		steps: [
			{
				text: 'With few pieces left, the king is safe enough to fight. If the enemy king stands in front of your pawn like this, it is usually a draw.',
				fen: '8/8/8/8/8/4k3/4P3/4K3 w - - 0 1',
				highlight: ['e3', 'e2'],
			},
			{
				text: 'So lead with your king, not the pawn. Step the king up to d2, so it can walk in front of the pawn next.',
				fen: '8/8/4k3/8/8/8/4P3/4K3 w - - 0 1',
				goal: { from: 'e1', to: 'd2' },
				highlight: ['e1'],
			},
			{
				text: 'Your king guards the queening square, so nothing can stop the pawn. Push it to e8 to make a new queen.',
				fen: '8/3KP3/8/8/8/8/8/k7 w - - 0 1',
				goal: { from: 'e7', to: 'e8' },
			},
		],
	},
];
