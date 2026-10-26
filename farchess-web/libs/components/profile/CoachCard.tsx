import Link from 'next/link';
import { coachTip } from '../../data/demo';

const CoachCard = () => {
	return (
		<section aria-labelledby="coach" className="flex min-w-0 flex-[1_1_340px] flex-col gap-3 rounded-[18px] bg-sand p-[26px] text-ink">
			<p className="font-mono text-[13px] font-bold text-rust">AI COACH · THIS WEEK</p>
			<h2 id="coach" className="font-display text-[28px] font-extrabold leading-[1.1]">
				{coachTip.title}
			</h2>
			<p className="leading-relaxed text-ink-soft">{coachTip.text}</p>
			<Link href="/puzzles" className="self-start rounded-xl bg-ink px-[18px] py-3 font-extrabold text-sand hover:text-cream">
				{coachTip.action}
			</Link>
		</section>
	);
};

export default CoachCard;
