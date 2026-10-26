// Sample data used until the pages are connected to the farchess API.

export const currentUser = {
	username: 'khamid',
	city: 'Tashkent',
	joined: 'March 2026',
	gamesPlayed: 1462,
	favoriteOpenings: 'Italian with white, Caro-Kann with black',
	ratings: { bullet: 1488, blitz: 1612, rapid: 1705, puzzles: 1840 },
};

export const lobbyStats = { online: 1284, games: 412 };

export const timeControls = [
	{ time: '1+0', kind: 'Bullet' },
	{ time: '2+1', kind: 'Bullet' },
	{ time: '3+0', kind: 'Blitz' },
	{ time: '3+2', kind: 'Blitz' },
	{ time: '5+0', kind: 'Blitz' },
	{ time: '5+3', kind: 'Blitz' },
	{ time: '10+0', kind: 'Rapid' },
	{ time: '15+10', kind: 'Rapid' },
	{ time: '30+0', kind: 'Classical' },
];

export const liveGames = [
	{ id: 1, time: '3+2', white: 'player_one', whiteRating: 2214, black: 'player_two', blackRating: 2190, move: 24 },
	{ id: 2, time: '5+0', white: 'player_three', whiteRating: 1876, black: 'player_four', blackRating: 1902, move: 11 },
	{ id: 3, time: '10+0', white: 'player_five', whiteRating: 1640, black: 'player_six', blackRating: 1655, move: 31 },
	{ id: 4, time: '1+0', white: 'player_seven', whiteRating: 2041, black: 'player_eight', blackRating: 1998, move: 42 },
];

export const upcomingEvent = {
	when: 'SAT · 18:00 TASHKENT',
	name: 'farchess Weekend Arena',
	details: '3+2 · 7 rounds Swiss · 64 of 128 joined',
};

export const demoGame = {
	title: 'Rated blitz 3+2 · Italian Game · 14 watching',
	// Position after 9...h6, white to move
	fen: 'r1bq1rk1/bpp2pp1/p1np1n1p/4p3/2B1P3/2PP1N1P/PP3PP1/RNBQR1K1',
	lastMove: ['h7', 'h6'],
	moves: [
		['e4', 'e5'],
		['Nf3', 'Nc6'],
		['Bc4', 'Nf6'],
		['d3', 'Bc5'],
		['O-O', 'd6'],
		['c3', 'O-O'],
		['Re1', 'a6'],
		['Bb3', 'Ba7'],
		['h3', 'h6'],
	],
	evaluation: 0.6, // positive means white is better
	white: { username: 'khamid', rating: 1612, clock: '1:58', captured: '♟' },
	black: { username: 'opponent', rating: 1638, clock: '2:41', captured: '♙♙' },
	chat: [
		{ id: 1, from: 'opponent', text: 'gl hf' },
		{ id: 2, from: 'khamid', text: 'you too!' },
	],
};

export const ratingCards = [
	{ kind: 'Bullet', value: 1488, change: -12, note: '214 games' },
	{ kind: 'Blitz', value: 1612, change: 34, note: '1,092 games' },
	{ kind: 'Rapid', value: 1705, change: 8, note: '156 games' },
	{ kind: 'Puzzles', value: 1840, change: 21, note: '2,310 solved' },
];

// Blitz rating at the end of each of the last 12 weeks
export const blitzHistory = [1480, 1492, 1475, 1510, 1534, 1521, 1549, 1566, 1590, 1640, 1578, 1612];

export const coachTip = {
	title: 'Strong openings, leaky endgames.',
	text: 'In 7 of your 11 losses you were equal or better at move 30. Most slips came in king-and-pawn endings where your king stayed back too long.',
	action: 'Practice 10 endgames',
};

export const recentGames = [
	{ id: 1, result: 'win', opponent: 'player_one', opponentRating: 1638, opening: 'Italian Game', time: '3+2', change: 9 },
	{ id: 2, result: 'loss', opponent: 'player_two', opponentRating: 1701, opening: 'Caro-Kann, Advance', time: '3+2', change: -6 },
	{ id: 3, result: 'draw', opponent: 'player_three', opponentRating: 1594, opening: 'Queen’s Gambit Declined', time: '5+0', change: 1 },
	{ id: 4, result: 'win', opponent: 'player_four', opponentRating: 1622, opening: 'Italian Game', time: '3+2', change: 8 },
	{ id: 5, result: 'win', opponent: 'player_five', opponentRating: 1580, opening: 'Sicilian, Alapin', time: '10+0', change: 6 },
] as const;
