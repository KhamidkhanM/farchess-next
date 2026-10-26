import LayoutSidebar from '@/libs/components/layout/LayoutSidebar';
import ChessBoard from '@/libs/components/board/ChessBoard';
import NewGamePanel from '@/libs/components/homepage/NewGamePanel';
import LiveGames from '@/libs/components/homepage/LiveGames';
import EventCard from '@/libs/components/homepage/EventCard';
import useGreeting from '@/libs/hooks/useGreeting';
import { currentUser, lobbyStats } from '@/libs/data/demo';

export default function Lobby() {
	const greeting = useGreeting();

	return (
		<LayoutSidebar title="Play">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h1 className="font-display text-[40px] font-extrabold tracking-tight">
					{greeting}, {currentUser.username}
				</h1>
				<p className="font-mono text-sm text-muted">
					<span aria-hidden="true" className="text-online">
						●
					</span>{' '}
					{lobbyStats.online.toLocaleString('en-US')} online · {lobbyStats.games} games
				</p>
			</div>

			<section aria-label="Play" className="flex flex-wrap items-stretch gap-7">
				<div className="max-w-[520px] flex-[1_1_420px]">
					<ChessBoard label="Starting position on a walnut board" />
				</div>
				<NewGamePanel />
			</section>

			<div className="flex flex-wrap gap-7">
				<LiveGames />
				<EventCard />
			</div>
		</LayoutSidebar>
	);
}
