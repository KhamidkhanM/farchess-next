interface RatingChartProps {
	title: string;
	values: number[];
}

// Chart area inside the SVG, in SVG units (the SVG stretches to fit)
const WIDTH = 440;
const HEIGHT = 180;
const PADDING = 10;

// A simple line chart drawn with SVG, no chart library needed
const RatingChart = ({ title, values }: RatingChartProps) => {
	const min = Math.min(...values) - 20;
	const max = Math.max(...values) + 20;
	const first = values[0];
	const last = values[values.length - 1];
	const peak = Math.max(...values);

	// Turn a rating into a y position: higher rating = closer to the top
	const toY = (value: number) => Math.round(HEIGHT - PADDING - ((value - min) / (max - min)) * (HEIGHT - 2 * PADDING));
	const toX = (index: number) => Math.round((index / (values.length - 1)) * WIDTH);
	const points = values.map((value, index) => `${toX(index)},${toY(value)}`).join(' ');

	return (
		<section aria-labelledby="rating-trend" className="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5 rounded-[18px] bg-panel p-6">
			<div className="flex items-baseline justify-between">
				<h2 id="rating-trend" className="font-display text-[22px] font-bold">
					{title}
				</h2>
				<span className="font-mono text-[13px] text-muted">peak {peak}</span>
			</div>
			<svg
				role="img"
				aria-label={`Rating went from ${first} to ${last} over ${values.length} weeks`}
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
				preserveAspectRatio="none"
				className="h-[200px] w-full overflow-visible"
			>
				<g className="stroke-line" strokeWidth="1" vectorEffect="non-scaling-stroke">
					<line x1="0" y1="45" x2={WIDTH} y2="45" vectorEffect="non-scaling-stroke" />
					<line x1="0" y1="90" x2={WIDTH} y2="90" vectorEffect="non-scaling-stroke" />
					<line x1="0" y1="135" x2={WIDTH} y2="135" vectorEffect="non-scaling-stroke" />
				</g>
				<polyline
					points={points}
					fill="none"
					className="stroke-brass"
					strokeWidth="3"
					strokeLinejoin="round"
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
			<div className="flex justify-between font-mono text-[13px] text-faint">
				<span>{values.length} weeks ago</span>
				<span>now · {last}</span>
			</div>
		</section>
	);
};

export default RatingChart;
