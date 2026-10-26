import LayoutSidebar from '@/libs/components/layout/LayoutSidebar';
import ProfileHeader from '@/libs/components/profile/ProfileHeader';
import RatingCards from '@/libs/components/profile/RatingCards';
import RatingChart from '@/libs/components/profile/RatingChart';
import CoachCard from '@/libs/components/profile/CoachCard';
import RecentGames from '@/libs/components/profile/RecentGames';
import { blitzHistory, currentUser } from '@/libs/data/demo';

export default function Profile() {
	return (
		<LayoutSidebar title={currentUser.username}>
			<ProfileHeader />
			<RatingCards />
			<div className="flex flex-wrap gap-6">
				<RatingChart title={`Blitz · ${blitzHistory.length} weeks`} values={blitzHistory} />
				<CoachCard />
			</div>
			<RecentGames />
		</LayoutSidebar>
	);
}
