import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Chess, Square } from 'chess.js';
import Logo from '@/libs/components/common/Logo';
import ChessBoard from '@/libs/components/board/ChessBoard';
import EvalBar from '@/libs/components/game/EvalBar';
import PlayerCard from '@/libs/components/game/PlayerCard';
import MoveList from '@/libs/components/game/MoveList';
import { CURRENT_USERNAME } from '@/libs/config';
import { capturedBy, pairMoves } from '@/libs/chess';
import { evaluate, LEVELS, pickMove } from '@/libs/engine';

type Side = 'white' | 'black';

// How long the computer waits before moving, so its reply doesn't feel instant
const THINK_DELAY_MS = 400;

// A game against the computer. Everything happens in the browser, no server needed.
export default function Computer() {
	// The whole game is just the list of moves. The position is rebuilt from it,
	// which makes "takeback" as easy as removing the last moves.
	const [moves, setMoves] = useState<string[]>([]);
	const [yourSide, setYourSide] = useState<Side>('white');
	const [levelId, setLevelId] = useState<number>(2);
	const [selected, setSelected] = useState<string | null>(null);
	const [resigned, setResigned] = useState<boolean>(false);

	const level = LEVELS.find((item) => item.id === levelId) ?? LEVELS[0];

	const chess = useMemo(() => {
		const game = new Chess();
		moves.forEach((move) => game.move(move));
		return game;
	}, [moves]);

	const fen = chess.fen();
	const turn: Side = chess.turn() === 'w' ? 'white' : 'black';
	const over = resigned || chess.isGameOver();
	const yourTurn = !over && turn === yourSide;
	const lastMove = chess.history({ verbose: true }).at(-1);

	// When it's the computer's turn, wait a moment and then play its move.
	// The cleanup cancels the move if the game changes first (takeback, new game).
	useEffect(() => {
		if (over || turn === yourSide) return;
		const timer = setTimeout(() => {
			const reply = pickMove(fen, level);
			if (reply) setMoves((current) => [...current, reply]);
		}, THINK_DELAY_MS);
		return () => clearTimeout(timer);
	}, [fen, over, turn, yourSide, level]);

	// The squares the picked-up piece can go to
	const targets = selected ? chess.moves({ square: selected as Square, verbose: true }).map((move) => move.to) : [];

	const squareClickHandler = (square: string) => {
		if (!yourTurn) return;

		// Clicking a highlighted square moves there. Pawns that reach the end become queens.
		if (selected && targets.includes(square as Square)) {
			const move = chess.move({ from: selected, to: square, promotion: 'q' });
			setMoves([...moves, move.san]);
			setSelected(null);
			return;
		}

		// Clicking one of your own pieces picks it up, clicking anything else puts it down
		const piece = chess.get(square as Square);
		const yours = piece && piece.color === yourSide[0];
		setSelected(yours && square !== selected ? square : null);
	};

	const newGameHandler = (side: Side | 'random') => {
		setYourSide(side === 'random' ? (Math.random() < 0.5 ? 'white' : 'black') : side);
		setMoves([]);
		setSelected(null);
		setResigned(false);
	};

	// Take back your last move, and the computer's reply if it already answered
	const takebackHandler = () => {
		const keep = turn === yourSide ? moves.length - 2 : moves.length - 1;
		if (keep < 0) return;
		setMoves(moves.slice(0, keep));
		setSelected(null);
		setResigned(false);
	};

	const result = (() => {
		if (resigned) return 'You resigned. The computer wins.';
		if (chess.isCheckmate()) return turn === yourSide ? 'Checkmate. The computer wins.' : 'Checkmate. You win!';
		if (chess.isStalemate()) return 'Stalemate. It’s a draw.';
		if (chess.isThreefoldRepetition()) return 'Same position three times. It’s a draw.';
		if (chess.isInsufficientMaterial()) return 'Not enough pieces to mate. It’s a draw.';
		if (chess.isDraw()) return 'Draw by the 50-move rule.';
		return null;
	})();

	const status = result ?? (yourTurn ? (chess.isCheck() ? 'Check! Your move.' : 'Your move.') : 'The computer is thinking…');

	const player = (side: Side) => {
		const isYou = side === yourSide;
		return {
			username: isYou ? CURRENT_USERNAME : 'computer',
			rating: isYou ? 'you' : level.name,
			captured: capturedBy(fen, side),
			isYou,
			toMove: !over && turn === side,
			side,
		};
	};
	const topSide: Side = yourSide === 'white' ? 'black' : 'white';

	return (
		<>
			<Head>
				<title>vs computer · farchess</title>
			</Head>

			<header className="border-b border-line">
				<div className="flex flex-wrap items-center gap-5 px-5 py-4 md:px-8">
					<Logo size="md" />
					<span className="flex-grow" />
					<span className="font-mono text-sm text-muted">Untimed · vs computer · {level.name}</span>
					<Link
						href="/"
						className="rounded-xl border border-line-strong px-4 py-2.5 font-bold text-cream hover:bg-panel hover:text-cream"
					>
						Leave
					</Link>
				</div>
			</header>

			<main className="flex flex-wrap items-start justify-center gap-7 px-5 pb-12 pt-7 md:px-8">
				<div className="flex min-w-0 flex-[0_1_700px] gap-3">
					{/* Score in pawns with one decimal, like +1.3 */}
					<EvalBar evaluation={Math.round(evaluate(chess) / 10) / 10} />
					<div className="flex-grow">
						<ChessBoard
							fen={fen}
							flipped={yourSide === 'black'}
							highlight={lastMove ? [lastMove.from, lastMove.to] : []}
							selected={selected}
							targets={targets}
							onSquareClick={squareClickHandler}
							label={`Your game against the computer. You play ${yourSide}. ${status}`}
						/>
					</div>
				</div>

				<aside className="flex min-w-0 max-w-[440px] flex-[1_1_360px] flex-col gap-3">
					<PlayerCard {...player(topSide)} />

					<p
						role="status"
						className={`rounded-2xl px-4 py-3 font-bold ${result ? 'bg-sand text-ink' : 'bg-panel text-cream'}`}
					>
						{status}
					</p>

					{/* key makes the list start again on the newest move each time a move is played */}
					{moves.length > 0 && <MoveList key={moves.length} moves={pairMoves(moves)} />}

					<div className="grid grid-cols-2 gap-2">
						<button
							type="button"
							onClick={takebackHandler}
							disabled={moves.length === 0 || (yourSide === 'black' && moves.length < 2)}
							className="min-h-12 rounded-xl border border-line-strong font-bold text-cream hover:bg-panel disabled:opacity-40"
						>
							Takeback
						</button>
						<button
							type="button"
							onClick={() => setResigned(true)}
							disabled={over}
							className="min-h-12 rounded-xl bg-resign font-extrabold text-espresso hover:brightness-110 disabled:opacity-40"
						>
							Resign
						</button>
					</div>

					<PlayerCard {...player(yourSide)} />

					<section aria-labelledby="settings" className="flex flex-col gap-3 rounded-2xl bg-panel p-4">
						<h2 id="settings" className="text-sm font-bold text-muted">
							Computer level
						</h2>
						<div className="grid grid-cols-4 gap-2">
							{LEVELS.map((item) => {
								const picked = item.id === levelId;
								return (
									<button
										key={item.id}
										type="button"
										aria-pressed={picked}
										onClick={() => setLevelId(item.id)}
										className={`min-h-11 rounded-xl text-sm font-bold ${
											picked
												? 'border-2 border-brass bg-cream text-espresso'
												: 'border border-line bg-panel-raised text-cream hover:border-line-strong'
										}`}
									>
										{item.name}
									</button>
								);
							})}
						</div>

						<h2 className="pt-1 text-sm font-bold text-muted">New game as</h2>
						<div className="grid grid-cols-3 gap-2">
							{(['white', 'random', 'black'] as const).map((side) => (
								<button
									key={side}
									type="button"
									onClick={() => newGameHandler(side)}
									className="min-h-11 rounded-xl bg-brass font-bold capitalize text-espresso hover:bg-brass-light"
								>
									{side}
								</button>
							))}
						</div>
					</section>
				</aside>
			</main>
		</>
	);
}
