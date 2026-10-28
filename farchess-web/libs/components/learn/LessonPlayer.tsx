import { useState } from 'react';
import { Chess, Square } from 'chess.js';
import ChessBoard from '../board/ChessBoard';
import { Lesson } from '../../lessons';

interface LessonPlayerProps {
	lesson: Lesson;
	isLast: boolean;
	onFinish: () => void;
}

// Shows one lesson step by step. Steps with a goal wait until you play the right move.
const LessonPlayer = ({ lesson, isLast, onFinish }: LessonPlayerProps) => {
	const [stepIndex, setStepIndex] = useState<number>(0);
	// The position after your move, once you made it
	const [fenAfter, setFenAfter] = useState<string | null>(null);
	const [lastMove, setLastMove] = useState<string[]>([]);
	const [selected, setSelected] = useState<string | null>(null);
	const [tip, setTip] = useState<string | null>(null);

	const step = lesson.steps[stepIndex];
	const chess = new Chess(fenAfter ?? step.fen);
	const solved = !step.goal || fenAfter !== null;
	const lastStep = stepIndex === lesson.steps.length - 1;

	const targets = selected ? chess.moves({ square: selected as Square, verbose: true }).map((move) => move.to) : [];

	const squareClickHandler = (square: string) => {
		if (solved) return;

		if (selected && targets.includes(square as Square)) {
			const move = chess.move({ from: selected, to: square, promotion: 'q' });
			setSelected(null);
			const right =
				step.goal === 'mate' ? chess.isCheckmate() : move.from === step.goal?.from && move.to === step.goal?.to;
			if (right) {
				setFenAfter(chess.fen());
				setLastMove([move.from, move.to]);
				setTip(null);
			} else {
				setTip(step.goal === 'mate' ? 'That is not checkmate yet. Try another move.' : 'Legal, but not the move this step asks for. Try again.');
			}
			return;
		}

		const piece = chess.get(square as Square);
		const yours = piece && piece.color === chess.turn();
		setSelected(yours && square !== selected ? square : null);
	};

	const goTo = (next: number) => {
		setStepIndex(next);
		setFenAfter(null);
		setLastMove([]);
		setSelected(null);
		setTip(null);
	};

	return (
		<section aria-labelledby="lesson-title" className="flex flex-wrap items-start gap-7">
			<div className="min-w-0 max-w-[560px] flex-[1_1_380px]">
				<ChessBoard
					fen={chess.fen()}
					highlight={lastMove.length ? lastMove : step.highlight}
					selected={selected}
					targets={targets}
					onSquareClick={solved ? undefined : squareClickHandler}
					label={`${lesson.title}, step ${stepIndex + 1}. ${step.text}`}
				/>
			</div>

			<div className="flex min-w-0 max-w-[440px] flex-[1_1_320px] flex-col gap-3">
				<h2 id="lesson-title" className="font-display text-[28px] font-extrabold leading-tight">
					{lesson.title}
				</h2>

				{/* One bar per step: brass for done, cream for the one you are on */}
				<ol aria-label={`Step ${stepIndex + 1} of ${lesson.steps.length}`} className="flex gap-1.5">
					{lesson.steps.map((_, index) => (
						<li
							key={index}
							className={`h-1.5 flex-1 rounded-full ${
								index < stepIndex ? 'bg-brass' : index === stepIndex ? 'bg-cream' : 'bg-line'
							}`}
						/>
					))}
				</ol>

				<p className="text-lg leading-relaxed text-soft">{step.text}</p>

				<p
					role="status"
					className={`rounded-2xl px-4 py-3 font-bold ${
						tip ? 'bg-resign text-espresso' : step.goal && solved ? 'bg-win text-espresso' : 'bg-panel text-cream'
					}`}
				>
					{tip ?? (step.goal ? (solved ? 'Well done!' : 'Your move: click a piece, then a square.') : 'Read, then go on.')}
				</p>

				<div className="grid grid-cols-2 gap-2">
					<button
						type="button"
						onClick={() => goTo(stepIndex - 1)}
						disabled={stepIndex === 0}
						className="min-h-12 rounded-xl border border-line-strong font-bold text-cream hover:bg-panel disabled:opacity-40"
					>
						Back
					</button>
					<button
						type="button"
						onClick={() => (lastStep ? onFinish() : goTo(stepIndex + 1))}
						disabled={!solved}
						className="min-h-12 rounded-xl bg-brass font-extrabold text-espresso hover:bg-brass-light disabled:opacity-40"
					>
						{lastStep ? (isLast ? 'Finish' : 'Next lesson') : 'Next'}
					</button>
				</div>
			</div>
		</section>
	);
};

export default LessonPlayer;
