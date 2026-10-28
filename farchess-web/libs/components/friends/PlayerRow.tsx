import { ReactNode } from 'react';
import Avatar from '../common/Avatar';
import { PlayerSummary } from '../../types/api';

interface PlayerRowProps {
	player: PlayerSummary;
	children?: ReactNode; // the button on the right
}

// One player in a list: letter avatar, name, city and blitz rating
const PlayerRow = ({ player, children }: PlayerRowProps) => {
	const blitz = player.ratings.find((rating) => rating.kind === 'Blitz')?.value;
	return (
		<li className="flex items-center gap-3.5 border-t border-line px-[18px] py-3 first:border-t-0">
			<Avatar name={player.username} tone="plain" />
			<span className="flex min-w-0 flex-1 flex-col">
				<span className="truncate font-bold">{player.username}</span>
				<span className="truncate text-sm text-muted">
					{player.city || 'Somewhere'} · {player.gamesPlayed.toLocaleString('en-US')} games
				</span>
			</span>
			<span className="shrink-0 font-mono text-sm text-soft">blitz {blitz ?? '—'}</span>
			{children}
		</li>
	);
};

export default PlayerRow;
