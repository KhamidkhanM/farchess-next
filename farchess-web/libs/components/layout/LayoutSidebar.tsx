import { ReactNode } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';

interface LayoutSidebarProps {
	title: string;
	children: ReactNode;
}

// Page shell used by the lobby and profile: left sidebar + main content
const LayoutSidebar = ({ title, children }: LayoutSidebarProps) => {
	return (
		<>
			<Head>
				<title>{`${title} · farchess`}</title>
			</Head>
			<div className="flex min-h-screen flex-col md:flex-row">
				<Sidebar />
				<main className="flex min-w-0 flex-1 flex-col gap-8 px-5 pb-14 pt-8 md:px-10">{children}</main>
			</div>
		</>
	);
};

export default LayoutSidebar;
