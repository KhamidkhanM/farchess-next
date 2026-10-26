import Link from 'next/link';
import { GameSummary } from '../../types/api';
import { changeColor, formatChange } from '../../utils';

const badges = {
	win: { label: 'Win', className: 'bg-win text-espresso' },
	loss: { label: 'Loss', className: 'bg-loss text-espresso' },
	draw: { label: 'Draw', className: 'bg-line-strong text-cream' },
};

interface RecentGamesProps {
	games: GameSummary[];
	username: string; // whose games these are, so we know which side was theirs
}

// Turns a game into one table row, seen from this player's side of the board
const toRow = (game: GameSummary, username: string) => {
	const mySide = game.white.username === username ? 'white' : 'black';
	const me = game[mySide];
	const opponent = mySide === 'white' ? game.black : game.white;
	const winner = game.result === '1-0' ? 'white' : game.result === '0-1' ? 'black' : null;
	const result: keyof typeof badges = !winner ? 'draw' : winner === mySide ? 'win' : 'loss';
	return { id: game._id, result, opponent, opening: game.opening, time: game.timeControl, change: me.ratingChange };
};

const RecentGames = ({ games, username }: RecentGamesProps) => {
	return (
		<section aria-labelledby="recent-games" className="flex flex-col gap-3">
			<h2 id="recent-games" className="font-display text-2xl font-bold">
				Recent games
			</h2>
			{/* On narrow screens the table scrolls sideways inside this box */}
			<div className="relative overflow-x-auto rounded-[18px] bg-panel">
				<table className="w-full min-w-[620px] border-collapse text-[15px]">
					<thead>
						<tr className="text-left text-[13px] text-muted">
							<th className="px-[18px] py-3.5 font-semibold">Result</th>
							<th className="px-[18px] py-3.5 font-semibold">Opponent</th>
							<th className="px-[18px] py-3.5 font-semibold">Opening</th>
							<th className="px-[18px] py-3.5 font-semibold">Time</th>
							<th className="px-[18px] py-3.5 font-semibold">Rating</th>
							<th className="px-[18px] py-3.5">
								<span className="sr-only">Review</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{games.map((game) => toRow(game, username)).map((game) => (
							<tr key={game.id} className="border-t border-line">
								<td className="px-[18px] py-3.5">
									<span
										className={`inline-block min-w-[54px] rounded-lg px-2.5 py-1 text-center text-[13px] font-extrabold ${badges[game.result].className}`}
									>
										{badges[game.result].label}
									</span>
								</td>
								<td className="px-[18px] py-3.5 font-semibold">
									{game.opponent.username}{' '}
									<span className="font-mono text-[13px] font-normal text-muted">{game.opponent.rating}</span>
								</td>
								<td className="px-[18px] py-3.5 text-soft">{game.opening}</td>
								<td className="px-[18px] py-3.5 font-mono text-soft">{game.time}</td>
								<td className={`px-[18px] py-3.5 font-mono font-bold ${changeColor(game.change)}`}>
									{formatChange(game.change)}
								</td>
								<td className="px-[18px] py-3.5 text-right">
									<Link href={`/game?id=${game.id}`} className="font-bold">
										Review
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default RecentGames;
