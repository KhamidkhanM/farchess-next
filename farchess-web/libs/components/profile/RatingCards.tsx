import { Rating } from '../../types/api';
import { changeColor, formatChange } from '../../utils';

interface RatingCardsProps {
	ratings: Rating[];
}

const RatingCards = ({ ratings }: RatingCardsProps) => {
	return (
		<section aria-label="Ratings" className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
			{ratings.map((card) => (
				<div key={card.kind} className="flex flex-col gap-2 rounded-[18px] bg-panel p-5">
					<span className="text-sm font-bold text-muted">{card.kind}</span>
					<span className="flex items-baseline gap-2.5">
						<span className="font-mono text-[38px] font-bold leading-none">{card.value}</span>
						<span className={`font-mono text-sm font-bold ${changeColor(card.change)}`}>{formatChange(card.change)}</span>
					</span>
					<span className="text-sm text-muted">{card.count.toLocaleString('en-US')} {card.kind === 'Puzzles' ? 'solved' : 'games'}</span>
				</div>
			))}
		</section>
	);
};

export default RatingCards;
