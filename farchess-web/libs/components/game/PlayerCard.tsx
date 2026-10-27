import Avatar from '../common/Avatar';

interface PlayerCardProps {
	username: string;
	rating: number | string; // a number, or a word like "Casual" for the computer
	side: 'white' | 'black';
	clock?: string; // like "1:58". Games without a clock leave it out.
	captured: string;
	isYou?: boolean;
	toMove?: boolean; // whose turn it is. Defaults to you.
}

// The bar above or below the board with a player's name and clock.
// Your own card is brass so you can always find it quickly.
const PlayerCard = ({ username, rating, side, clock, captured, isYou = false, toMove = isYou }: PlayerCardProps) => {

	return (
		<div
			className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 ${
				isYou ? 'bg-brass text-espresso' : 'bg-panel text-cream'
			}`}
		>
			<Avatar name={username} tone={isYou ? 'dark' : 'plain'} />
			<span className="flex flex-grow flex-col">
				<span className={isYou ? 'font-extrabold' : 'font-bold'}>
					{username}
					{toMove && (isYou ? ' · your move' : ' · thinking…')}
				</span>
				<span className={`font-mono text-[13px] ${isYou ? '' : 'text-muted'}`}>
					{rating} · {side}
					{captured && ` · captured ${captured}`}
				</span>
			</span>
			{clock && (
				<span
					aria-label={`${side} clock ${Number(clock.split(':')[0])} minutes ${Number(clock.split(':')[1])} seconds`}
					className={`font-mono text-[34px] font-bold ${isYou ? '' : 'text-muted'}`}
				>
					{clock}
				</span>
			)}
		</div>
	);
};

export default PlayerCard;
