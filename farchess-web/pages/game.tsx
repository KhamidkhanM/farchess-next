import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Chess, Square } from 'chess.js';
import Logo from '@/libs/components/common/Logo';
import ChessBoard from '@/libs/components/board/ChessBoard';
import EvalBar from '@/libs/components/game/EvalBar';
import PlayerCard from '@/libs/components/game/PlayerCard';
import MoveList from '@/libs/components/game/MoveList';
import GameChat from '@/libs/components/game/GameChat';
import WaitingPanel from '@/libs/components/game/WaitingPanel';
import ApiStatus from '@/libs/components/common/ApiStatus';
import useApi from '@/libs/hooks/useApi';
import usePlayingAs from '@/libs/hooks/usePlayingAs';
import { apiSend } from '@/libs/api';
import { capturedBy, pairMoves } from '@/libs/chess';
import { formatChange, formatClock } from '@/libs/utils';
import { Game as GameData } from '@/libs/types/api';

type Side = 'white' | 'black';

// How often to ask the server for the other player's moves
const REFRESH_MS = 1000;

// "checkmate" → "White wins by checkmate"
const describeResult = (game: GameData) => {
	if (game.endReason === 'cancelled') return 'This game was cancelled.';
	const reason = game.endReason ? ` by ${game.endReason}` : '';
	if (game.result === '1-0') return `White wins${reason}.`;
	if (game.result === '0-1') return `Black wins${reason}.`;
	return `Draw${reason}.`;
};

// The game page has no sidebar so the board can be as big as possible
export default function Game() {
	const router = useRouter();
	const id = router.query.id;
	// /game?id=... opens that game. Plain /game opens the most watched live game.
	// router.isReady is false for a moment while Next.js reads the ?id= part
	const path = !router.isReady ? null : typeof id === 'string' ? `/games/${id}` : '/games/featured';
	const { data: game, loading, error, status, setData } = useApi<GameData>(path, REFRESH_MS);
	const [me, setMe] = usePlayingAs();

	const [selected, setSelected] = useState<string | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);
	// Ticks four times a second so the running clock counts down smoothly
	const [now, setNow] = useState<number>(Date.now());
	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), 250);
		return () => clearInterval(timer);
	}, []);

	const moves = game?.moves ?? [];
	const chess = useMemo(() => {
		const board = new Chess();
		moves.forEach((move) => board.move(move));
		return board;
		// moves.join makes a new list with the same moves count as "no change"
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [moves.join(' ')]);

	if (!game) {
		return (
			<main className="mx-auto flex max-w-xl flex-col gap-4 px-5 py-12">
				<ApiStatus loading={loading} error={error} status={status} />
				{error && (
					<Link href="/" className="font-bold">
						Back to the lobby
					</Link>
				)}
			</main>
		);
	}

	const mySide: Side | null = game.white.username === me ? 'white' : game.black.username === me ? 'black' : null;
	const toMove: Side = chess.turn() === 'w' ? 'white' : 'black';
	const live = game.status === 'live';
	const myTurn = live && mySide === toMove;
	const opponent: Side = mySide === 'black' ? 'white' : 'black';

	// Sends an action to the server and shows the game it sends back
	const act = async (action: string, body: object) => {
		setActionError(null);
		try {
			setData(await apiSend<GameData>('POST', `/games/${game._id}/${action}`, body));
		} catch (err) {
			setActionError((err as Error).message);
		}
	};

	const targets = selected ? chess.moves({ square: selected as Square, verbose: true }).map((move) => move.to) : [];

	const squareClickHandler = (square: string) => {
		if (!myTurn) return;
		if (selected && targets.includes(square as Square)) {
			// Try it on a copy to get the move's name, like "Nf3". Pawns that reach the end become queens.
			const move = new Chess(chess.fen()).move({ from: selected, to: square, promotion: 'q' });
			setSelected(null);
			act('move', { username: me, move: move.san });
			return;
		}
		const piece = chess.get(square as Square);
		const yours = piece && piece.color === toMove[0];
		setSelected(yours && square !== selected ? square : null);
	};

	// The running clock loses the time since the player started thinking
	const clockOf = (side: Side) => {
		let seconds = game[side].clock;
		if (live && side === toMove && game.turnStartedAt) {
			seconds -= (now - new Date(game.turnStartedAt).getTime()) / 1000;
		}
		return formatClock(Math.max(0, Math.ceil(seconds)));
	};

	const player = (side: Side) => {
		const seat = game[side];
		const change = game.status === 'finished' && game.rated && seat.username ? ` (${formatChange(seat.ratingChange)})` : '';
		return {
			username: seat.username || 'Waiting…',
			rating: seat.username ? `${seat.rating}${change}` : '—',
			clock: clockOf(side),
			captured: capturedBy(chess.fen(), side),
			isYou: side === mySide,
			toMove: live && side === toMove,
			side,
		};
	};

	const parts = [`${game.rated ? 'Rated' : 'Casual'} ${game.timeControl}`, game.opening, game.watching ? `${game.watching} watching` : ''];
	const title = parts.filter(Boolean).join(' · ');
	const lastMove = chess.history({ verbose: true }).at(-1);
	const creator = game.white.username || game.black.username;
	const drawOfferedToMe = live && mySide && game.drawOffer && game.drawOffer !== me;

	const statusText =
		game.status === 'finished'
			? describeResult(game)
			: game.status === 'waiting'
			? 'Waiting for the second player.'
			: drawOfferedToMe
			? `${game.drawOffer} offers a draw.`
			: myTurn
			? chess.isCheck()
				? 'Check! Your move.'
				: 'Your move.'
			: mySide
			? `Waiting for ${game[opponent].username}…`
			: `${game[toMove].username} to move.`;

	// You see the board from your own side. Watchers see it from white's side.
	const bottom: Side = mySide ?? 'white';
	const top: Side = bottom === 'white' ? 'black' : 'white';

	return (
		<>
			<Head>
				<title>{`${game.status === 'live' ? 'Live game' : 'Game'} · farchess`}</title>
			</Head>

			<header className="border-b border-line">
				<div className="flex flex-wrap items-center gap-5 px-5 py-4 md:px-8">
					<Logo size="md" />
					<span className="flex-grow" />
					<span className="font-mono text-sm text-muted">{title}</span>
					<Link
						href="/"
						className="rounded-xl border border-line-strong px-4 py-2.5 font-bold text-cream hover:bg-panel hover:text-cream"
					>
						Leave
					</Link>
				</div>
			</header>

			<main className="flex flex-wrap items-start justify-center gap-7 px-5 pb-12 pt-7 md:px-8">
				<div className="flex min-w-0 flex-[0_1_700px] gap-3">
					<EvalBar evaluation={game.evaluation} />
					<div className="flex-grow">
						<ChessBoard
							fen={chess.fen()}
							flipped={bottom === 'black'}
							highlight={lastMove ? [lastMove.from, lastMove.to] : game.lastMove}
							selected={selected}
							targets={targets}
							onSquareClick={mySide && live ? squareClickHandler : undefined}
							label={`${title}. ${mySide ? `You play ${mySide}.` : ''} ${statusText}`}
						/>
					</div>
				</div>

				<aside className="flex min-w-0 max-w-[440px] flex-[1_1_360px] flex-col gap-3">
					<PlayerCard {...player(top)} />

					<p
						role="status"
						className={`rounded-2xl px-4 py-3 font-bold ${
							game.status === 'finished' || drawOfferedToMe ? 'bg-sand text-ink' : 'bg-panel text-cream'
						}`}
					>
						{statusText}
					</p>
					{actionError && (
						<p role="alert" className="rounded-2xl bg-panel px-4 py-3 font-bold text-loss">
							{actionError}
						</p>
					)}

					{game.status === 'waiting' && (
						<WaitingPanel
							creator={creator}
							isCreator={mySide !== null}
							onJoin={(username) => {
								setMe(username);
								act('join', { username });
							}}
							onCancel={() => act('resign', { username: me })}
						/>
					)}

					{moves.length > 0 && <MoveList key={`moves-${game._id}-${moves.length}`} moves={pairMoves(moves)} />}

					{live && mySide && (
						<div className="grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => act('draw', { username: me })}
								disabled={game.drawOffer === me}
								className={`min-h-12 rounded-xl font-bold disabled:opacity-50 ${
									drawOfferedToMe
										? 'bg-brass text-espresso hover:bg-brass-light'
										: 'border border-line-strong text-cream hover:bg-panel'
								}`}
							>
								{drawOfferedToMe ? 'Accept draw' : game.drawOffer === me ? 'Draw offered' : 'Offer draw'}
							</button>
							<button
								type="button"
								onClick={() => act('resign', { username: me })}
								className="min-h-12 rounded-xl bg-resign font-extrabold text-espresso hover:brightness-110"
							>
								Resign
							</button>
						</div>
					)}

					{game.status === 'finished' && (
						<Link
							href="/"
							className="flex min-h-12 items-center justify-center rounded-xl bg-brass font-extrabold text-espresso hover:bg-brass-light hover:text-espresso"
						>
							New game
						</Link>
					)}

					<PlayerCard {...player(bottom)} />
					<GameChat
						key={`chat-${game._id}`}
						gameId={game._id}
						me={me}
						initialMessages={game.chat.map((message) => ({ id: message._id, from: message.from, text: message.text }))}
					/>
				</aside>
			</main>
		</>
	);
}
