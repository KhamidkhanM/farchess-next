import { useState } from 'react';
import Link from 'next/link';
import { TimeControl } from '../../types/api';

interface NewGamePanelProps {
	timeControls: TimeControl[];
}

const NewGamePanel = ({ timeControls }: NewGamePanelProps) => {
	const [picked, setPicked] = useState<string>('3+2');

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

			<Link
				href="/game"
				className="flex min-h-[60px] items-center justify-center rounded-2xl bg-brass font-display text-[22px] font-extrabold text-espresso hover:bg-brass-light hover:text-espresso"
			>
				Play {picked}
			</Link>

			<div className="grid grid-cols-2 gap-2.5">
				<Link
					href="/game"
					className="flex min-h-12 items-center justify-center rounded-[14px] border border-line-strong font-bold text-cream hover:bg-panel hover:text-cream"
				>
					Invite a friend
				</Link>
				<Link
					href="/game"
					className="flex min-h-12 items-center justify-center rounded-[14px] border border-line-strong font-bold text-cream hover:bg-panel hover:text-cream"
				>
					vs computer
				</Link>
			</div>
		</div>
	);
};

export default NewGamePanel;
