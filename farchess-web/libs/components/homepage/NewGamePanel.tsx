import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { apiGet, apiSend } from '../../api';
import { CURRENT_USERNAME } from '../../config';
import { GameSummary, TimeControl } from '../../types/api';

interface NewGamePanelProps {
	timeControls: TimeControl[];
}

const NewGamePanel = ({ timeControls }: NewGamePanelProps) => {
	const router = useRouter();
	const [picked, setPicked] = useState<string>('3+2');
	const [busy, setBusy] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const openGame = async (findOpponent: boolean) => {
		setBusy(true);
		setError(null);
		try {
			// "Play": first look for someone already waiting with this time control
			if (findOpponent) {
				const open = await apiGet<GameSummary[]>(`/games/open?timeControl=${encodeURIComponent(picked)}`);
				const other = open.find((game) => ![game.white.username, game.black.username].includes(CURRENT_USERNAME));
				if (other) {
					await apiSend('POST', `/games/${other._id}/join`, { username: CURRENT_USERNAME });
					router.push(`/game?id=${other._id}`);
					return;
				}
			}
			// Nobody waiting, or "Invite a friend": open a new game and wait on its page
			const game = await apiSend<GameSummary>('POST', '/games', {
				username: CURRENT_USERNAME,
				timeControl: picked,
				color: 'random',
			});
			router.push(`/game?id=${game._id}`);
		} catch (err) {
			setError((err as Error).message);
			setBusy(false);
		}
	};

	return (
		<div className="flex flex-1 basis-[340px] flex-col gap-[18px]">
			<h2 className="font-display text-[28px] font-bold">New game</h2>

			<fieldset className="flex flex-col gap-2.5">
				<legend className="mb-2.5 text-sm font-semibold text-muted">Time control</legend>
				<div className="grid grid-cols-3 gap-2">
					{timeControls.map((control) => {
						const selected = picked === control.time;
						return (
							<button
								key={control.time}
								type="button"
								aria-pressed={selected}
								onClick={() => setPicked(control.time)}
								className={`flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-xl ${
									selected
										? 'border-2 border-brass bg-cream text-espresso'
										: 'border border-line bg-panel text-cream hover:border-line-strong'
								}`}
							>
								<span className="font-mono text-lg font-bold">{control.time}</span>
								<span className="text-xs font-semibold opacity-80">{control.kind}</span>
							</button>
						);
					})}
				</div>
			</fieldset>

			<button
				type="button"
				onClick={() => openGame(true)}
				disabled={busy}
				className="flex min-h-[60px] items-center justify-center rounded-2xl bg-brass font-display text-[22px] font-extrabold text-espresso hover:bg-brass-light disabled:opacity-60"
			>
				{busy ? 'Finding a game…' : `Play ${picked}`}
			</button>
			{error && (
				<p role="alert" className="font-bold text-loss">
					{error}
				</p>
			)}

			<div className="grid grid-cols-2 gap-2.5">
				<button
					type="button"
					onClick={() => openGame(false)}
					disabled={busy}
					className="flex min-h-12 items-center justify-center rounded-[14px] border border-line-strong font-bold text-cream hover:bg-panel disabled:opacity-60"
				>
					Invite a friend
				</button>
				<Link
					href="/computer"
					className="flex min-h-12 items-center justify-center rounded-[14px] border border-line-strong font-bold text-cream hover:bg-panel hover:text-cream"
				>
					vs computer
				</Link>
			</div>
		</div>
	);
};

export default NewGamePanel;
