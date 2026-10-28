// The shapes of the JSON that farchess-api sends back

export type RatingKind = 'Bullet' | 'Blitz' | 'Rapid' | 'Puzzles';

export interface Rating {
	kind: RatingKind;
	value: number;
	change: number;
	count: number; // games played, or puzzles solved
}

export interface CoachTip {
	title: string;
	text: string;
	action: string;
}

export interface Member {
	_id: string;
	username: string;
	city: string;
	gamesPlayed: number;
	favoriteOpenings: string;
	ratings: Rating[];
	blitzHistory: number[];
	coachTip?: CoachTip;
	createdAt: string; // the date they joined, as an ISO string
}

export interface GamePlayer {
	username: string;
	rating: number;
	ratingChange: number;
	clock: number; // seconds left
}

export interface ChatMessage {
	_id: string;
	from: string;
	text: string;
}

export type GameResult = '1-0' | '0-1' | '1/2-1/2';

// What game lists send: no position or chat
export interface GameSummary {
	_id: string;
	white: GamePlayer;
	black: GamePlayer;
	status: 'live' | 'finished';
	result?: GameResult;
	timeControl: string;
	opening: string;
	moves: string[];
}

export interface Game extends GameSummary {
	rated: boolean;
	fen: string;
	lastMove: string[];
	evaluation: number;
	watching: number;
	chat: ChatMessage[];
}

export interface Tournament {
	_id: string;
	name: string;
	startsAt: string;
	timeControl: string;
	rounds: number;
	format: string;
	joined: number;
	capacity: number;
	players: string[]; // usernames of members who joined
}

export interface TimeControl {
	time: string; // like "3+2"
	kind: string; // like "Blitz"
}

export interface Lobby {
	online: number;
	liveGames: number;
	timeControls: TimeControl[];
	nextTournament: Tournament | null;
}
