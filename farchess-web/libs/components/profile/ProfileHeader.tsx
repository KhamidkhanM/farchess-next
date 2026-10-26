import Link from 'next/link';
import Avatar from '../common/Avatar';
import { currentUser } from '../../data/demo';

const ProfileHeader = () => {
	return (
		<section className="flex flex-wrap items-end gap-6 border-b border-line pb-7">
			<Avatar name={currentUser.username} size="xl" />
			<div className="flex flex-[999_1_360px] flex-col gap-1.5">
				<h1 className="font-display text-[56px] font-extrabold leading-none tracking-[-1.5px]">{currentUser.username}</h1>
				<p className="text-muted">
					{currentUser.city} · joined {currentUser.joined} · {currentUser.gamesPlayed.toLocaleString('en-US')} games ·{' '}
					{currentUser.favoriteOpenings}
				</p>
			</div>
			<div className="flex gap-2.5">
				<Link
					href="/game"
					className="rounded-[14px] bg-brass px-[22px] py-3.5 font-extrabold text-espresso hover:bg-brass-light hover:text-espresso"
				>
					Challenge
				</Link>
				<button
					type="button"
					className="rounded-[14px] border border-line-strong px-[22px] py-3.5 font-bold text-cream hover:bg-panel"
				>
					Follow
				</button>
			</div>
		</section>
	);
};

export default ProfileHeader;
