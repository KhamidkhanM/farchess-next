import Head from 'next/head';
import Link from 'next/link';
import Logo from '@/libs/components/common/Logo';
import ChessBoard from '@/libs/components/board/ChessBoard';
import EvalBar from '@/libs/components/game/EvalBar';
import PlayerCard from '@/libs/components/game/PlayerCard';
import MoveList from '@/libs/components/game/MoveList';
import GameChat from '@/libs/components/game/GameChat';
import { demoGame } from '@/libs/data/demo';

// The game page has no sidebar so the board can be as big as possible
export default function Game() {
	const { white, black } = demoGame;

	return (
		<>
			<Head>
				<title>Live game · farchess</title>
			</Head>

			<header className="border-b border-line">
				<div className="flex flex-wrap items-center gap-5 px-5 py-4 md:px-8">
					<Logo size="md" />
					<span className="flex-grow" />
					<span className="font-mono text-sm text-muted">{demoGame.title}</span>
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
					<EvalBar evaluation={demoGame.evaluation} />
					<div className="flex-grow">
						<ChessBoard
							fen={demoGame.fen}
							highlight={demoGame.lastMove}
							label="Middlegame position, white to move. Last move h7 to h6 highlighted."
						/>
					</div>
				</div>

				<aside className="flex min-w-0 max-w-[440px] flex-[1_1_360px] flex-col gap-3">
					<PlayerCard {...black} side="black" />
					<MoveList moves={demoGame.moves} />

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

					<PlayerCard {...white} side="white" isYou />
					<GameChat me={white.username} initialMessages={demoGame.chat} />
				</aside>
			</main>
		</>
	);
}
