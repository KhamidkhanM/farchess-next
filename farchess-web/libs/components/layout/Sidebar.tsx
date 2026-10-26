import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '../common/Logo';
import Avatar from '../common/Avatar';
import useCurrentMember from '../../hooks/useCurrentMember';
import { CURRENT_USERNAME } from '../../config';

// Each icon is a single SVG path, drawn with a 2px stroke
const menu = [
	{ href: '/', label: 'Play', icon: 'M6 4l14 8-14 8V4z' },
	{
		href: '/tournaments',
		label: 'Tournaments',
		icon: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 6h3v2a3 3 0 0 1-3 3M7 6H4v2a3 3 0 0 0 3 3',
	},
	{
		href: '/puzzles',
		label: 'Puzzles',
		icon: 'M4 4h6v3a2 2 0 1 0 4 0V4h6v6h-3a2 2 0 1 0 0 4h3v6h-6v-3a2 2 0 1 0-4 0v3H4V4z',
	},
	{ href: '/learn', label: 'Learn', icon: 'M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2V5zM4 19a2 2 0 0 1 2-2h14' },
	{
		href: '/friends',
		label: 'Friends',
		icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
	},
];

const Sidebar = () => {
	const router = useRouter();
	const onProfile = router.pathname === '/profile';
	const { data: member } = useCurrentMember();
	const blitz = member?.ratings.find((rating) => rating.kind === 'Blitz')?.value;

	return (
		<nav
			aria-label="Main"
			className="flex flex-col gap-1.5 border-line px-5 py-7 md:sticky md:top-0 md:h-screen md:w-[260px] md:shrink-0 md:border-r"
		>
			<div className="px-3 pb-6">
				<Logo />
			</div>

			<div className="flex flex-wrap gap-1.5 md:flex-col">
				{menu.map((item) => {
					const active = router.pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							aria-current={active ? 'page' : undefined}
							className={`flex items-center gap-3 rounded-xl p-3 font-semibold ${
								active ? 'bg-brass text-espresso hover:text-espresso' : 'text-soft hover:bg-panel hover:text-cream'
							}`}
						>
							<svg
								aria-hidden="true"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d={item.icon} />
							</svg>
							<span>{item.label}</span>
						</Link>
					);
				})}
			</div>

			<span className="hidden flex-grow md:block" />

			<Link
				href="/profile"
				aria-current={onProfile ? 'page' : undefined}
				className={`mt-4 flex items-center gap-3 rounded-[14px] p-3 ${
					onProfile ? 'bg-brass text-espresso hover:text-espresso' : 'bg-panel text-cream hover:text-cream'
				}`}
			>
				<Avatar name={CURRENT_USERNAME} size="sm" tone={onProfile ? 'dark' : 'brass'} />
				<span className="flex flex-col">
					<span className="font-bold">{CURRENT_USERNAME}</span>
					<span className={`font-mono text-[13px] ${onProfile ? '' : 'text-muted'}`}>
						blitz {blitz ?? '…'}
					</span>
				</span>
			</Link>
		</nav>
	);
};

export default Sidebar;
