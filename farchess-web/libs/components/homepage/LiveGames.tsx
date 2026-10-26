import Link from 'next/link';
import { GameSummary } from '../../types/api';
import { moveNumber } from '../../utils';

interface LiveGamesProps {
	games: GameSummary[];
}

const LiveGames = ({ games }: LiveGamesProps) => {
	return (
		<section aria-labelledby="watch-live" className="flex min-w-0 flex-[999_1_480px] flex-col gap-3.5">
			<div className="flex items-baseline justify-between">
				<h2 id="watch-live" className="font-display text-2xl font-bold">
					Watch live
				</h2>
				<Link href="/game" className="font-bold">
					All games
				</Link>
			</div>

			<div className="flex flex-col overflow-hidden rounded-[18px] bg-panel">
				{games.length === 0 && <p className="px-[18px] py-3.5 text-muted">Nobody is playing right now.</p>}
				{games.map((game) => (
					<Link
						key={game._id}
						href={`/game?id=${game._id}`}
						className="flex flex-wrap items-center gap-3.5 border-t border-line px-[18px] py-3.5 text-cream first:border-t-0 hover:bg-panel-raised hover:text-cream"
					>
						<span className="min-w-16 rounded-lg bg-line px-2.5 py-1 text-center font-mono text-[13px]">{game.timeControl}</span>
						<span className="flex-[1_1_260px] font-semibold">
							{game.white.username} <span className="font-mono text-[13px] text-muted">{game.white.rating}</span>
							&nbsp; vs &nbsp;
							{game.black.username} <span className="font-mono text-[13px] text-muted">{game.black.rating}</span>
						</span>
						<span className="font-mono text-[13px] text-muted">move {moveNumber(game.moves)}</span>
					</Link>
				))}
			</div>
		</section>
	);
};

export default LiveGames;
