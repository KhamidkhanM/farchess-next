import LayoutSidebar from '@/libs/components/layout/LayoutSidebar';
import ChessBoard from '@/libs/components/board/ChessBoard';
import NewGamePanel from '@/libs/components/homepage/NewGamePanel';
import LiveGames from '@/libs/components/homepage/LiveGames';
import EventCard from '@/libs/components/homepage/EventCard';
import ApiStatus from '@/libs/components/common/ApiStatus';
import useGreeting from '@/libs/hooks/useGreeting';
import useApi from '@/libs/hooks/useApi';
import { CURRENT_USERNAME } from '@/libs/config';
import { GameSummary, Lobby as LobbyData } from '@/libs/types/api';

export default function Lobby() {
	const greeting = useGreeting();
	const lobby = useApi<LobbyData>('/lobby');
	const live = useApi<GameSummary[]>('/games/live');

	return (
		<LayoutSidebar title="Play">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h1 className="font-display text-[40px] font-extrabold tracking-tight">
					{greeting}, {CURRENT_USERNAME}
				</h1>
				{lobby.data && (
					<p className="font-mono text-sm text-muted">
						<span aria-hidden="true" className="text-online">
							●
						</span>{' '}
						{lobby.data.online.toLocaleString('en-US')} online · {lobby.data.liveGames} games
					</p>
				)}
			</div>

			<section aria-label="Play" className="flex flex-wrap items-stretch gap-7">
				<div className="max-w-[520px] flex-[1_1_420px]">
					<ChessBoard label="Starting position on a walnut board" />
				</div>
				{lobby.data ? <NewGamePanel timeControls={lobby.data.timeControls} /> : <ApiStatus {...lobby} />}
			</section>

			<div className="flex flex-wrap gap-7">
				{live.data ? <LiveGames games={live.data} /> : <ApiStatus {...live} />}
				{lobby.data?.nextTournament && <EventCard tournament={lobby.data.nextTournament} />}
			</div>
		</LayoutSidebar>
	);
}
