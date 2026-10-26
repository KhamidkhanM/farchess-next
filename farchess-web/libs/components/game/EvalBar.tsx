interface EvalBarProps {
	evaluation: number; // in pawns, positive means white is better
}

// A thin bar beside the board: the more white it is, the better white stands
const EvalBar = ({ evaluation }: EvalBarProps) => {
	// Map -5..+5 pawns to 0..100% and keep a little of each color visible
	const whiteShare = Math.min(95, Math.max(5, 50 + evaluation * 10));
	const leader = evaluation >= 0 ? 'white' : 'black';
	const label = `Engine evaluation: ${leader} is better, ${evaluation >= 0 ? 'plus' : 'minus'} ${Math.abs(evaluation)}`;

	return (
		<div
			role="img"
			aria-label={label}
			className="flex w-3.5 shrink-0 flex-col overflow-hidden rounded-[7px] border border-line-strong"
		>
			<span className="bg-panel-raised" style={{ flex: 100 - whiteShare }} />
			<span className="bg-cream" style={{ flex: whiteShare }} />
		</div>
	);
};

export default EvalBar;
