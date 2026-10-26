import { parseFen, STARTING_FEN } from '../../chess';

interface ChessBoardProps {
	fen?: string;
	label: string; // read out by screen readers, e.g. "Starting position"
	highlight?: string[]; // squares to mark as the last move, e.g. ['h7', 'h6']
}

// A walnut & maple board with big bold pieces. It scales to the width
// of its container: piece size uses "cqw", a percent of the board width.
const ChessBoard = ({ fen = STARTING_FEN, label, highlight = [] }: ChessBoardProps) => {
	const squares = parseFen(fen);

	return (
		<div className="rounded-[22px] bg-panel-raised p-3.5 shadow-board">
			<div
				role="img"
				aria-label={label}
				className="grid aspect-square grid-cols-8 grid-rows-8 overflow-hidden rounded-[10px] [container-type:inline-size]"
			>
				{squares.map((square) => {
					const marked = highlight.includes(square.name);
					const background = marked
						? square.dark
							? 'bg-lastmove-dark'
							: 'bg-lastmove-light'
						: square.dark
						? 'bg-walnut'
						: 'bg-sand';

					return (
						<span
							key={square.name}
							className={`grid place-items-center font-pieces text-[11cqw] leading-none ${background}`}
						>
							{square.piece && (
								<span
									className={
										square.piece.color === 'white'
											? 'text-[#fffdf8] [-webkit-text-stroke:1.4px_#1a1512] [text-shadow:0_2px_2px_rgba(0,0,0,0.35)]'
											: 'text-espresso [text-shadow:0_2px_2px_rgba(0,0,0,0.3)]'
									}
								>
									{square.piece.glyph}
								</span>
							)}
						</span>
					);
				})}
			</div>
		</div>
	);
};

export default ChessBoard;
