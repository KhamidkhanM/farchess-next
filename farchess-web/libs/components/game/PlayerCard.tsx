import Avatar from '../common/Avatar';

interface PlayerCardProps {
	username: string;
	rating: number;
	side: 'white' | 'black';
	clock: string; // like "1:58"
	captured: string;
	isYou?: boolean;
}

// The bar above or below the board with a player's name and clock.
// Your own card is brass so you can always find it quickly.
const PlayerCard = ({ username, rating, side, clock, captured, isYou = false }: PlayerCardProps) => {
	const [minutes, seconds] = clock.split(':');

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
					{isYou && ' · your move'}
				</span>
				<span className={`font-mono text-[13px] ${isYou ? '' : 'text-muted'}`}>
					{rating} · {side} · captured {captured}
				</span>
			</span>
			<span
				aria-label={`${side} clock ${Number(minutes)} minutes ${Number(seconds)} seconds`}
				className={`font-mono text-[34px] font-bold ${isYou ? '' : 'text-muted'}`}
			>
				{clock}
			</span>
		</div>
	);
};

export default PlayerCard;
