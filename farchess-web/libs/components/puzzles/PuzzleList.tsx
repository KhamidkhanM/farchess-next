import { Puzzle } from '../../types/api';

export type PuzzleResult = 'solved' | 'missed';

interface PuzzleListProps {
	puzzles: Puzzle[];
	current: number;
	results: Record<string, PuzzleResult>;
	onPick: (index: number) => void;
}

// Every puzzle, with a mark for the ones you already tried this visit
const PuzzleList = ({ puzzles, current, results, onPick }: PuzzleListProps) => {
	return (
		<section aria-labelledby="all-puzzles" className="flex flex-col gap-2 rounded-2xl bg-panel p-4">
			<h2 id="all-puzzles" className="text-sm font-bold text-muted">
				All puzzles
			</h2>
			<ol className="flex flex-col gap-1">
				{puzzles.map((puzzle, index) => {
					const result = results[puzzle._id];
					return (
						<li key={puzzle._id}>
							<button
								type="button"
								aria-current={index === current ? 'true' : undefined}
								onClick={() => onPick(index)}
								className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left ${
									index === current ? 'bg-panel-raised text-cream' : 'text-soft hover:bg-panel-raised'
								}`}
							>
								<span
									aria-hidden="true"
									className={`w-4 font-bold ${result === 'solved' ? 'text-win' : result === 'missed' ? 'text-loss' : 'text-faint'}`}
								>
									{result === 'solved' ? '✓' : result === 'missed' ? '✗' : '·'}
								</span>
								<span className="flex-grow font-semibold">{puzzle.title}</span>
								{result && <span className="sr-only">{result}</span>}
								<span className="font-mono text-[13px] text-muted">{puzzle.rating}</span>
							</button>
						</li>
					);
				})}
			</ol>
		</section>
	);
};

export default PuzzleList;
