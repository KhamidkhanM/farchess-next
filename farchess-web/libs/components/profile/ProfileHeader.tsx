import Link from 'next/link';
import Avatar from '../common/Avatar';
import { Member } from '../../types/api';

interface ProfileHeaderProps {
	member: Member;
}

const ProfileHeader = ({ member }: ProfileHeaderProps) => {
	// "2026-03-04T10:00:00Z" → "March 2026"
	const joined = new Date(member.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

	return (
		<section className="flex flex-wrap items-end gap-6 border-b border-line pb-7">
			<Avatar name={member.username} size="xl" />
			<div className="flex flex-[999_1_360px] flex-col gap-1.5">
				<h1 className="font-display text-[56px] font-extrabold leading-none tracking-[-1.5px]">{member.username}</h1>
				<p className="text-muted">
					{member.city} · joined {joined} · {member.gamesPlayed.toLocaleString('en-US')} games ·{' '}
					{member.favoriteOpenings}
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
