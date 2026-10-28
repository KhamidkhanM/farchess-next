import { useState } from 'react';
import { apiSend } from '../../api';
import { CURRENT_USERNAME } from '../../config';
import { Tournament } from '../../types/api';
import { formatStart } from '../../utils';

interface TournamentRowProps {
	tournament: Tournament;
	featured: boolean; // the next event gets the big sand card
	onChange: (tournament: Tournament) => void;
}

// One tournament with how full it is and a Join / Leave button
const TournamentRow = ({ tournament, featured, onChange }: TournamentRowProps) => {
	const [busy, setBusy] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const joined = tournament.players.includes(CURRENT_USERNAME);
	const full = tournament.joined >= tournament.capacity;
	const percent = Math.min(100, Math.round((tournament.joined / tournament.capacity) * 100));
	const headingId = `tournament-${tournament._id}`;

	const toggleHandler = async () => {
		setBusy(true);
		setError(null);
		try {
			const action = joined ? 'leave' : 'join';
			const updated = await apiSend<Tournament>('POST', `/tournaments/${tournament._id}/${action}`, {
				username: CURRENT_USERNAME,
			});
			onChange(updated);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setBusy(false);
		}
	};

	// Colors change on the sand card, so pick them once here
	const look = featured
		? { card: 'bg-sand text-ink', label: 'text-rust', soft: 'text-ink-soft', track: 'bg-ink/15', fill: 'bg-ink' }
		: { card: 'bg-panel text-cream', label: 'text-brass', soft: 'text-muted', track: 'bg-line', fill: 'bg-brass' };

	const buttonLabel = joined ? 'Leave' : full ? 'Full' : 'Join';
	const buttonClass = joined
		? featured
			? 'border-2 border-ink text-ink hover:bg-ink/10'
			: 'border border-line-strong text-cream hover:bg-panel-raised'
		: featured
		? 'bg-ink text-sand hover:text-cream'
		: 'bg-brass text-espresso hover:bg-brass-light';

	return (
		<article
			aria-labelledby={headingId}
			className={`flex flex-wrap items-center gap-x-8 gap-y-4 rounded-[18px] ${featured ? 'p-7' : 'p-5'} ${look.card}`}
		>
			<div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1.5">
				<p className={`font-mono text-[13px] font-bold ${look.label}`}>
					{featured && 'NEXT UP · '}
					{formatStart(tournament.startsAt)}
				</p>
				<h2
					id={headingId}
					className={`font-display font-extrabold leading-[1.05] ${featured ? 'text-[32px]' : 'text-2xl'}`}
				>
					{tournament.name}
				</h2>
				<p className={`text-[15px] ${look.soft}`}>
					{tournament.timeControl} · {tournament.rounds} rounds {tournament.format}
				</p>
			</div>

			<div className="flex flex-[0_1_220px] flex-col gap-2">
				<p className={`font-mono text-[13px] ${look.soft}`}>
					{tournament.joined} of {tournament.capacity} joined
				</p>
				<div
					role="progressbar"
					aria-label="Spots taken"
					aria-valuenow={tournament.joined}
					aria-valuemax={tournament.capacity}
					className={`h-2 overflow-hidden rounded-full ${look.track}`}
				>
					<div className={`h-full rounded-full ${look.fill}`} style={{ width: `${percent}%` }} />
				</div>
			</div>

			<div className="flex flex-col items-start gap-1">
				<button
					type="button"
					onClick={toggleHandler}
					disabled={busy || (full && !joined)}
					className={`min-h-12 min-w-28 rounded-xl px-5 font-extrabold disabled:opacity-50 ${buttonClass}`}
				>
					{busy ? '…' : buttonLabel}
				</button>
				{joined && <p className={`text-[13px] font-bold ${featured ? 'text-ink' : 'text-win'}`}>You’re in</p>}
				{error && (
					<p role="alert" className={`text-[13px] font-bold ${featured ? 'text-resign' : 'text-loss'}`}>
						{error}
					</p>
				)}
			</div>
		</article>
	);
};

export default TournamentRow;
