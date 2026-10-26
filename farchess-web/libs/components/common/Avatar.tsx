interface AvatarProps {
	name: string;
	size?: 'sm' | 'md' | 'xl';
	tone?: 'brass' | 'dark' | 'plain';
}

const sizes = {
	sm: 'h-[38px] w-[38px] rounded-xl text-base',
	md: 'h-10 w-10 rounded-xl text-base',
	xl: 'h-[104px] w-[104px] rounded-[28px] font-display text-[52px]',
};

const tones = {
	brass: 'bg-brass text-espresso', // the signed-in player
	dark: 'bg-espresso text-brass', // on top of a brass background
	plain: 'bg-line text-cream', // other players
};

// A rounded square with the first letter of the player's name
const Avatar = ({ name, size = 'md', tone = 'brass' }: AvatarProps) => {
	return (
		<span aria-hidden="true" className={`grid shrink-0 place-items-center font-extrabold ${sizes[size]} ${tones[tone]}`}>
			{name.charAt(0).toUpperCase()}
		</span>
	);
};

export default Avatar;
