import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '@/libs/components/common/Logo';
import ChessBoard from '@/libs/components/board/ChessBoard';
import EvalBar from '@/libs/components/game/EvalBar';
import PlayerCard from '@/libs/components/game/PlayerCard';
import MoveList from '@/libs/components/game/MoveList';
import GameChat from '@/libs/components/game/GameChat';
import ApiStatus from '@/libs/components/common/ApiStatus';
import useApi from '@/libs/hooks/useApi';
import { CURRENT_USERNAME } from '@/libs/config';
import { capturedBy, pairMoves } from '@/libs/chess';
import { formatClock } from '@/libs/utils';
import { Game as GameData } from '@/libs/types/api';

// The game page has no sidebar so the board can be as big as possible
export default function Game() {
	const router = useRouter();
	const id = router.query.id;
	// /game?id=... opens that game. Plain /game opens the most watched live game.
	// router.isReady is false for a moment while Next.js reads the ?id= part
	const path = !router.isReady ? null : typeof id === 'string' ? `/games/${id}` : '/games/featured';
	const { data: game, loading, error } = useApi<GameData>(path);

	if (!game) {
		return (
			<main className="mx-auto flex max-w-xl flex-col gap-4 px-5 py-12">
				<ApiStatus loading={loading} error={error} />
				{error && (
					<Link href="/" className="font-bold">
						Back to the lobby
					</Link>
				)}
			</main>
		);
	}

	const title = `${game.rated ? 'Rated' : 'Casual'} ${game.timeControl} · ${game.opening} · ${game.watching} watching`;
	const [from, to] = game.lastMove;
	const player = (side: 'white' | 'black') => ({
		username: game[side].username,
		rating: game[side].rating,
		clock: formatClock(game[side].clock),
		captured: capturedBy(game.fen, side),
		isYou: game[side].username === CURRENT_USERNAME,
	});

	return (
		<>
			<Head>
				<title>Live game · farchess</title>
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
							fen={game.fen}
							highlight={game.lastMove}
							label={from ? `Game position. Last move ${from} to ${to} highlighted.` : 'Starting position.'}
						/>
					</div>
				</div>

				<aside className="flex min-w-0 max-w-[440px] flex-[1_1_360px] flex-col gap-3">
					<PlayerCard {...player('black')} side="black" />
					<MoveList key={`moves-${game._id}`} moves={pairMoves(game.moves)} />

					<div className="grid grid-cols-3 gap-2">
						<button
							type="button"
							className="min-h-12 rounded-xl border border-line-strong font-bold text-cream hover:bg-panel"
						>
							Draw
						</button>
						<button
							type="button"
							className="min-h-12 rounded-xl border border-line-strong font-bold text-cream hover:bg-panel"
						>
							Takeback
						</button>
						<button type="button" className="min-h-12 rounded-xl bg-resign font-extrabold text-espresso hover:brightness-110">
							Resign
						</button>
					</div>

					<PlayerCard {...player('white')} side="white" />
					<GameChat
						key={`chat-${game._id}`}
						me={CURRENT_USERNAME}
						initialMessages={game.chat.map((message) => ({ id: message._id, from: message.from, text: message.text }))}
					/>
				</aside>
			</main>
		</>
	);
}
