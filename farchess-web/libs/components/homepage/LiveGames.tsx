import Link from 'next/link';
import { liveGames } from '../../data/demo';

const LiveGames = () => {
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
				{liveGames.map((game) => (
					<Link
						key={game.id}
						href="/game"
						className="flex flex-wrap items-center gap-3.5 border-t border-line px-[18px] py-3.5 text-cream first:border-t-0 hover:bg-panel-raised hover:text-cream"
					>
						<span className="min-w-16 rounded-lg bg-line px-2.5 py-1 text-center font-mono text-[13px]">{game.time}</span>
						<span className="flex-[1_1_260px] font-semibold">
							{game.white} <span className="font-mono text-[13px] text-muted">{game.whiteRating}</span>
							&nbsp; vs &nbsp;
							{game.black} <span className="font-mono text-[13px] text-muted">{game.blackRating}</span>
						</span>
						<span className="font-mono text-[13px] text-muted">move {game.move}</span>
					</Link>
				))}
			</div>
		</section>
	);
};

export default LiveGames;
