import Link from 'next/link';

interface LogoProps {
	size?: 'md' | 'lg';
}

const Logo = ({ size = 'lg' }: LogoProps) => {
	const textSize = size === 'lg' ? 'text-[30px]' : 'text-[26px]';

	return (
		<Link href="/" className={`flex items-baseline font-display tracking-tight text-cream hover:text-cream ${textSize}`}>
			<span className="font-extrabold">far</span>
			<span className="font-medium text-brass">chess</span>
		</Link>
	);
};

export default Logo;
