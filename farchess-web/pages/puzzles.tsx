import { useEffect, useMemo, useState } from 'react';
import { Chess, Square } from 'chess.js';
import LayoutSidebar from '@/libs/components/layout/LayoutSidebar';
import ChessBoard from '@/libs/components/board/ChessBoard';
import ApiStatus from '@/libs/components/common/ApiStatus';
import PuzzleList, { PuzzleResult } from '@/libs/components/puzzles/PuzzleList';
import useApi from '@/libs/hooks/useApi';
import useCurrentMember from '@/libs/hooks/useCurrentMember';
import { apiSend } from '@/libs/api';
import { CURRENT_USERNAME } from '@/libs/config';
import { Puzzle, Rating } from '@/libs/types/api';
import { changeColor, formatChange } from '@/libs/utils';

// How long the opponent waits before replying, so you can see your move land
const REPLY_DELAY_MS = 450;

type Status = 'solving' | 'wrong' | 'solved' | 'shown';

export default function Puzzles() {
	const list = useApi<Puzzle[]>('/puzzles');
	const member = useCurrentMember();

	const [index, setIndex] = useState<number>(0);
	// The moves played so far, starting from the puzzle position
	const [played, setPlayed] = useState<string[]>([]);
	const [status, setStatus] = useState<Status>('solving');
	const [selected, setSelected] = useState<string | null>(null);
	const [hint, setHint] = useState<boolean>(false);
	// What happened to each puzzle this visit, by puzzle id
	const [results, setResults] = useState<Record<string, PuzzleResult>>({});
	// The rating the server sent back after the last puzzle
	const [rating, setRating] = useState<Rating | null>(null);

	const puzzles = list.data ?? [];
	const puzzle = puzzles[index];

	const chess = useMemo(() => {
		const game = new Chess(puzzle?.fen);
		played.forEach((move) => game.move(move));
		return game;
	}, [puzzle, played]);

	// The side that moves first in the FEN is the side you play
	const yourColor = puzzle?.fen.split(' ')[1] === 'b' ? 'black' : 'white';
	const yourTurn = chess.turn() === yourColor[0];
	const finished = status === 'solved' || status === 'shown';
	const expected = puzzle?.solution[played.length];
	const lastMove = chess.history({ verbose: true }).at(-1);

	// After each of your right moves, the opponent plays the next move from the answer.
	// "Show answer" uses the same effect for both sides.
	useEffect(() => {
		if (!puzzle || !expected || status === 'solved') return;
		if (yourTurn && status !== 'shown') return;
		const timer = setTimeout(() => setPlayed((current) => [...current, expected]), REPLY_DELAY_MS);
		return () => clearTimeout(timer);
	}, [puzzle, expected, yourTurn, status]);

	// Tell the server how it went, once per puzzle, and show the new rating
	const saveResult = (result: PuzzleResult) => {
		if (!puzzle || results[puzzle._id]) return;
		setResults({ ...results, [puzzle._id]: result });
		apiSend<Rating>('POST', `/puzzles/${puzzle._id}/result`, { username: CURRENT_USERNAME, solved: result === 'solved' })
			.then(setRating)
			.catch(() => setRating(null));
	};

	const targets = selected ? chess.moves({ square: selected as Square, verbose: true }).map((move) => move.to) : [];

	const squareClickHandler = (square: string) => {
		if (!puzzle || finished || !yourTurn) return;

		if (selected && targets.includes(square as Square)) {
			// Try the move on a copy, so a wrong move never lands on the board
			const attempt = new Chess(chess.fen());
			const move = attempt.move({ from: selected, to: square, promotion: 'q' });
			setSelected(null);
			setHint(false);
			// Any checkmate counts, even if it is not the move we stored
			const right = move.san === expected || attempt.isCheckmate();
			if (!right) {
				setStatus('wrong');
				saveResult('missed');
				return;
			}
			const next = [...played, move.san];
			setPlayed(next);
			if (next.length >= puzzle.solution.length || attempt.isCheckmate()) {
				setStatus('solved');
				saveResult('solved');
			} else {
				setStatus('solving');
			}
			return;
		}

		const piece = chess.get(square as Square);
		const yours = piece && piece.color === yourColor[0];
		setSelected(yours && square !== selected ? square : null);
	};

	const openPuzzle = (next: number) => {
		setIndex(next);
		setPlayed([]);
		setStatus('solving');
		setSelected(null);
		setHint(false);
	};

	const showAnswerHandler = () => {
		saveResult('missed');
		setSelected(null);
		setStatus('shown');
	};

	// The square of the piece you should move next, worked out from the stored answer
	const hintSquare = (() => {
		if (!hint || !expected || !yourTurn) return null;
		try {
			return new Chess(chess.fen()).move(expected).from;
		} catch {
			return null;
		}
	})();

	const message = {
		solving: played.length === 0 ? `Find the best move for ${yourColor}.` : 'Right! Keep going.',
		wrong: 'Not that one. Try another move.',
		solved: 'Solved! Well done.',
		shown: expected ? 'Here is the answer…' : 'That was the answer.',
	}[status];

	const puzzleRating = rating ?? member.data?.ratings.find((item) => item.kind === 'Puzzles');

	if (!list.data || !puzzle) {
		return (
			<LayoutSidebar title="Puzzles">
				<h1 className="font-display text-[40px] font-extrabold tracking-tight">Puzzles</h1>
				{list.data ? (
					<p className="rounded-[18px] bg-panel p-5 text-muted">There are no puzzles yet. Run npm run seed in the backend.</p>
				) : (
					<ApiStatus {...list} />
				)}
			</LayoutSidebar>
		);
	}

	return (
		<LayoutSidebar title="Puzzles">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h1 className="font-display text-[40px] font-extrabold tracking-tight">Puzzles</h1>
				{puzzleRating && (
					<p className="font-mono text-sm text-muted">
						Your puzzle rating <span className="text-lg font-bold text-cream">{puzzleRating.value}</span>{' '}
						<span className={changeColor(puzzleRating.change)}>{formatChange(puzzleRating.change)}</span>
					</p>
				)}
			</div>

			<div className="flex flex-wrap items-start gap-7">
				<div className="min-w-0 max-w-[620px] flex-[1_1_420px]">
					<ChessBoard
						fen={chess.fen()}
						flipped={yourColor === 'black'}
						highlight={lastMove ? [lastMove.from, lastMove.to] : hintSquare ? [hintSquare] : []}
						selected={selected ?? hintSquare}
						targets={targets}
						onSquareClick={squareClickHandler}
						label={`Puzzle: ${puzzle.title}. You play ${yourColor}. ${message}`}
					/>
				</div>

				<aside className="flex min-w-0 max-w-[420px] flex-[1_1_320px] flex-col gap-3">
					<section aria-labelledby="puzzle-title" className="flex flex-col gap-2 rounded-[18px] bg-sand p-6 text-ink">
						<p className="font-mono text-[13px] font-bold uppercase text-rust">
							{puzzle.theme} · rated {puzzle.rating}
						</p>
						<h2 id="puzzle-title" className="font-display text-[28px] font-extrabold leading-[1.05]">
							{puzzle.title}
						</h2>
						<p className="text-[15px] text-ink-soft">
							You play <strong className="capitalize">{yourColor}</strong>. Puzzle {index + 1} of {puzzles.length}.
						</p>
					</section>

					<p
						role="status"
						className={`rounded-2xl px-4 py-3 font-bold ${
							status === 'solved'
								? 'bg-win text-espresso'
								: status === 'wrong'
								? 'bg-resign text-espresso'
								: 'bg-panel text-cream'
						}`}
					>
						{message}
					</p>

					<div className="grid grid-cols-2 gap-2">
						{finished ? (
							<button
								type="button"
								onClick={() => openPuzzle((index + 1) % puzzles.length)}
								className="col-span-2 min-h-12 rounded-xl bg-brass font-extrabold text-espresso hover:bg-brass-light"
							>
								Next puzzle
							</button>
						) : (
							<>
								<button
									type="button"
									onClick={() => setHint(true)}
									disabled={hint || !yourTurn}
									className="min-h-12 rounded-xl border border-line-strong font-bold text-cream hover:bg-panel disabled:opacity-40"
								>
									Hint
								</button>
								<button
									type="button"
									onClick={showAnswerHandler}
									className="min-h-12 rounded-xl border border-line-strong font-bold text-cream hover:bg-panel"
								>
									Show answer
								</button>
							</>
						)}
					</div>

					<PuzzleList puzzles={puzzles} current={index} results={results} onPick={openPuzzle} />
				</aside>
			</div>
		</LayoutSidebar>
	);
}
