import { parseFen, STARTING_FEN } from '../../chess';

interface ChessBoardProps {
	fen?: string;
	label: string; // read out by screen readers, e.g. "Starting position"
	highlight?: string[]; // squares to mark as the last move, e.g. ['h7', 'h6']
	flipped?: boolean; // true draws the board from black's side
	selected?: string | null; // the square of the piece you picked up
	targets?: string[]; // squares the picked-up piece can move to
	onSquareClick?: (square: string) => void; // makes the board playable
}

// A walnut & maple board with big bold pieces. It scales to the width
// of its container: piece size uses "cqw", a percent of the board width.
const ChessBoard = ({
	fen = STARTING_FEN,
	label,
	highlight = [],
	flipped = false,
	selected = null,
	targets = [],
	onSquareClick,
}: ChessBoardProps) => {
	// parseFen goes from a8 to h1. Reversing it puts h1 at the top left.
	const squares = flipped ? parseFen(fen).reverse() : parseFen(fen);
	const playable = Boolean(onSquareClick);

	return (
		<div className="rounded-[22px] bg-panel-raised p-3.5 shadow-board">
			<div
				role={playable ? 'group' : 'img'}
				aria-label={label}
				className="grid aspect-square grid-cols-8 grid-rows-8 overflow-hidden rounded-[10px] [container-type:inline-size]"
			>
				{squares.map((square) => {
					const marked = highlight.includes(square.name) || selected === square.name;
					const background = marked
						? square.dark
							? 'bg-lastmove-dark'
							: 'bg-lastmove-light'
						: square.dark
						? 'bg-walnut'
						: 'bg-sand';
					const isTarget = targets.includes(square.name);

					const piece = square.piece && (
						<span
							className={
								square.piece.color === 'white'
									? 'text-[#fffdf8] [-webkit-text-stroke:1.4px_#1a1512] [text-shadow:0_2px_2px_rgba(0,0,0,0.35)]'
									: 'text-espresso [text-shadow:0_2px_2px_rgba(0,0,0,0.3)]'
							}
						>
							{square.piece.glyph}
						</span>
					);

					// A dot shows an empty square you can move to, a ring shows a piece you can take
					const hint = isTarget && (
						<span
							aria-hidden="true"
							className={`pointer-events-none absolute rounded-full ${
								square.piece
									? 'inset-[4%] border-[0.9cqw] border-espresso/40'
									: 'h-[28%] w-[28%] bg-espresso/35'
							}`}
						/>
					);

					const className = `relative grid place-items-center font-pieces text-[11cqw] leading-none ${background}`;

					if (!onSquareClick) {
						return (
							<span key={square.name} className={className}>
								{piece}
							</span>
						);
					}

					const name = square.piece ? `${square.piece.color} ${square.piece.type} on ${square.name}` : square.name;
					return (
						<button
							key={square.name}
							type="button"
							aria-label={isTarget ? `${name}, can move here` : name}
							aria-pressed={selected === square.name}
							onClick={() => onSquareClick(square.name)}
							className={`${className} cursor-pointer`}
						>
							{piece}
							{hint}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default ChessBoard;
