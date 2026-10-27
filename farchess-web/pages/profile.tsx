import LayoutSidebar from '@/libs/components/layout/LayoutSidebar';
import ProfileHeader from '@/libs/components/profile/ProfileHeader';
import RatingCards from '@/libs/components/profile/RatingCards';
import RatingChart from '@/libs/components/profile/RatingChart';
import CoachCard from '@/libs/components/profile/CoachCard';
import RecentGames from '@/libs/components/profile/RecentGames';
import ApiStatus from '@/libs/components/common/ApiStatus';
import useApi from '@/libs/hooks/useApi';
import useCurrentMember from '@/libs/hooks/useCurrentMember';
import { CURRENT_USERNAME } from '@/libs/config';
import { GameSummary } from '@/libs/types/api';

export default function Profile() {
	const { data: member, loading, error, status } = useCurrentMember();
	const recent = useApi<GameSummary[]>(`/games?player=${CURRENT_USERNAME}&limit=5`);

	return (
		<LayoutSidebar title={CURRENT_USERNAME}>
			{member ? (
				<>
					<ProfileHeader member={member} />
					<RatingCards ratings={member.ratings} />
					<div className="flex flex-wrap gap-6">
						{member.blitzHistory.length > 1 && (
							<RatingChart title={`Blitz · ${member.blitzHistory.length} weeks`} values={member.blitzHistory} />
						)}
						{member.coachTip && <CoachCard tip={member.coachTip} />}
					</div>
				</>
			) : (
				<ApiStatus loading={loading} error={error} status={status} />
			)}
			{recent.data ? <RecentGames games={recent.data} username={CURRENT_USERNAME} /> : <ApiStatus {...recent} />}
		</LayoutSidebar>
	);
}
