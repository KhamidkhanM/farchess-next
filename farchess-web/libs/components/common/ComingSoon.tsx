import Link from 'next/link';
import LayoutSidebar from '../layout/LayoutSidebar';

interface ComingSoonProps {
	title: string;
	text: string;
}

// A simple page for sidebar sections that are not built yet, so the links do not 404
const ComingSoon = ({ title, text }: ComingSoonProps) => {
	return (
		<LayoutSidebar title={title}>
			<section className="flex max-w-xl flex-col gap-3">
				<p className="font-mono text-[13px] font-bold text-brass">COMING SOON</p>
				<h1 className="font-display text-[40px] font-extrabold tracking-tight">{title}</h1>
				<p className="text-muted">{text}</p>
				<Link href="/" className="font-bold">
					Back to the lobby
				</Link>
			</section>
		</LayoutSidebar>
	);
};

export default ComingSoon;
