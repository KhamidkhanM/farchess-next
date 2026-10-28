import { useState } from 'react';
import LayoutSidebar from '@/libs/components/layout/LayoutSidebar';
import ApiStatus from '@/libs/components/common/ApiStatus';
import TournamentRow from '@/libs/components/tournaments/TournamentRow';
import useApi from '@/libs/hooks/useApi';
import { Tournament } from '@/libs/types/api';

export default function Tournaments() {
	const list = useApi<Tournament[]>('/tournaments');
	// After you join or leave, the server sends the changed tournament back. We keep those
	// here by id, so the page updates without loading the whole list again.
	const [changed, setChanged] = useState<Record<string, Tournament>>({});

	const tournaments = (list.data ?? []).map((tournament) => changed[tournament._id] ?? tournament);
	const changeHandler = (tournament: Tournament) => setChanged({ ...changed, [tournament._id]: tournament });

	return (
		<LayoutSidebar title="Tournaments">
			<div className="flex flex-col gap-2">
				<h1 className="font-display text-[40px] font-extrabold tracking-tight">Tournaments</h1>
				<p className="max-w-xl text-muted">
					Join an event and you will be paired when it starts. Swiss events have a set number of rounds, arenas pair you
					again as soon as your game ends.
				</p>
			</div>

			{list.data ? (
				<section aria-label="Upcoming tournaments" className="flex flex-col gap-4">
					{tournaments.length === 0 && (
						<p className="rounded-[18px] bg-panel p-5 text-muted">No tournaments are planned right now.</p>
					)}
					{tournaments.map((tournament, index) => (
						<TournamentRow
							key={tournament._id}
							tournament={tournament}
							featured={index === 0}
							onChange={changeHandler}
						/>
					))}
				</section>
			) : (
				<ApiStatus {...list} />
			)}
		</LayoutSidebar>
	);
}
