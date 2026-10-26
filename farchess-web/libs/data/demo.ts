// Sample data used until the pages are connected to the farchess API.

export const currentUser = {
	username: 'khamid',
	city: 'Tashkent',
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
