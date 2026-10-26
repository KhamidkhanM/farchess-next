import { useEffect, useRef, useState } from 'react';

interface MoveListProps {
	moves: string[][]; // each item is [white move, black move]
}

const MoveList = ({ moves }: MoveListProps) => {
	// Which move pair is selected. Starts on the latest one.
	const last = moves.length - 1;
	const [current, setCurrent] = useState<number>(last);
	const listRef = useRef<HTMLOListElement>(null);

	// Keep the selected move visible inside the scrolling list
	useEffect(() => {
		const list = listRef.current;
		const row = list?.children[current] as HTMLElement | undefined;
		if (!list || !row) return;
		if (row.offsetTop < list.scrollTop) list.scrollTop = row.offsetTop;
		else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight)
			list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
	}, [current]);

	const controls = [
		{ label: 'First move', symbol: '«', go: () => setCurrent(0) },
		{ label: 'Previous move', symbol: '‹', go: () => setCurrent(Math.max(0, current - 1)) },
		{ label: 'Next move', symbol: '›', go: () => setCurrent(Math.min(last, current + 1)) },
		{ label: 'Last move', symbol: '»', go: () => setCurrent(last) },
	];

	return (
		<section aria-label="Moves" className="overflow-hidden rounded-2xl bg-panel">
			<ol ref={listRef} className="relative max-h-[280px] overflow-y-auto py-1.5 font-mono text-[15px]">
				{moves.map(([white, black], index) => (
					<li
						key={index}
						aria-current={index === current ? 'step' : undefined}
						className={`grid grid-cols-[44px_1fr_1fr] px-4 py-[7px] ${
							index === current ? 'bg-line font-bold text-brass' : index % 2 ? 'bg-panel-raised' : ''
						}`}
					>
						<span className="text-faint">{index + 1}</span>
						<span>{white}</span>
						<span>{black}</span>
					</li>
				))}
			</ol>
			<div className="grid grid-cols-4 border-t border-line">
				{controls.map((control) => (
					<button
						key={control.label}
						type="button"
						aria-label={control.label}
						onClick={control.go}
						className="min-h-[46px] text-lg text-soft hover:bg-panel-raised hover:text-cream"
					>
						{control.symbol}
					</button>
				))}
			</div>
		</section>
	);
};

export default MoveList;
