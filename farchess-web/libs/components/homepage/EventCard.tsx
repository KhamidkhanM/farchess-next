import Link from 'next/link';
import { upcomingEvent } from '../../data/demo';

const EventCard = () => {
	return (
		<section aria-labelledby="event" className="flex flex-[1_1_300px] flex-col gap-2.5 rounded-[18px] bg-sand p-6 text-ink">
			<p className="font-mono text-[13px] font-bold text-rust">{upcomingEvent.when}</p>
			<h2 id="event" className="font-display text-[28px] font-extrabold leading-[1.05]">
				{upcomingEvent.name}
			</h2>
			<p className="text-[15px] text-ink-soft">{upcomingEvent.details}</p>
			<Link
				href="/tournaments"
				className="mt-1.5 self-start rounded-xl bg-ink px-5 py-3 font-extrabold text-sand hover:text-cream"
			>
				Join
			</Link>
		</section>
	);
};

export default EventCard;
