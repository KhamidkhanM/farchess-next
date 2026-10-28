import { useEffect, useState } from 'react';
import useApi from '../../hooks/useApi';
import { PlayerSummary } from '../../types/api';

interface WaitingPanelProps {
	creator: string; // the player who opened the game
	isCreator: boolean; // true when this tab plays as the creator
	onJoin: (username: string) => void;
	onCancel: () => void;
}

// Shown while a game waits for its second player: a link to share, and a way to join
const WaitingPanel = ({ creator, isCreator, onJoin, onCancel }: WaitingPanelProps) => {
	const [link, setLink] = useState<string>('');
	const [copied, setCopied] = useState<boolean>(false);
	const members = useApi<PlayerSummary[]>('/members');
	const others = (members.data ?? []).filter((member) => member.username !== creator);
	const [joinAs, setJoinAs] = useState<string>('');

	// window only exists in the browser, so read the address after the page loads
	useEffect(() => setLink(window.location.href), []);

	const copyHandler = async () => {
		try {
			await navigator.clipboard.writeText(link);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	};

	const name = joinAs || others[0]?.username || '';

	return (
		<section aria-labelledby="waiting" className="flex flex-col gap-3 rounded-[18px] bg-sand p-5 text-ink">
			<h2 id="waiting" className="font-display text-2xl font-extrabold">
				{isCreator ? 'Waiting for an opponent' : `${creator} wants to play`}
			</h2>

			{isCreator && (
				<>
					<p className="text-[15px] text-ink-soft">Send this link to a friend. The clocks start when they join.</p>
					<div className="flex gap-2">
						<input
							readOnly
							value={link}
							aria-label="Game link"
							onFocus={(event) => event.target.select()}
							className="min-w-0 flex-grow rounded-xl border border-ink/20 bg-cream px-3 font-mono text-sm text-ink"
						/>
						<button
							type="button"
							onClick={copyHandler}
							className="min-h-11 rounded-xl bg-ink px-4 font-extrabold text-sand hover:text-cream"
						>
							{copied ? 'Copied' : 'Copy'}
						</button>
					</div>
				</>
			)}

			<p className="text-[15px] text-ink-soft">
				{isCreator
					? 'No friend nearby? Open the link in a new tab, and there pick another player below and join.'
					: 'Pick who you are, then take the free seat.'}
			</p>
			{others.length > 0 && (
				<div className="flex flex-wrap gap-2">
					<label className="flex flex-grow flex-col gap-1">
						<span className="text-sm font-bold">Play as</span>
						<select
							value={name}
							onChange={(event) => setJoinAs(event.target.value)}
							className="min-h-11 rounded-xl border border-ink/20 bg-cream px-3 font-bold text-ink"
						>
							{others.map((member) => (
								<option key={member._id} value={member.username}>
									{member.username}
								</option>
							))}
						</select>
					</label>
					<button
						type="button"
						onClick={() => onJoin(name)}
						disabled={!name}
						className="min-h-11 self-end rounded-xl bg-ink px-5 font-extrabold text-sand hover:text-cream disabled:opacity-50"
					>
						Join game
					</button>
				</div>
			)}

			{isCreator && (
				<button type="button" onClick={onCancel} className="self-start text-sm font-bold text-rust underline">
					Cancel this game
				</button>
			)}
		</section>
	);
};

export default WaitingPanel;
