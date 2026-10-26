import LayoutSidebar from '@/libs/components/layout/LayoutSidebar';
import ChessBoard from '@/libs/components/board/ChessBoard';

export default function Lobby() {
	return (
		<LayoutSidebar title="Play">
			<h1 className="font-display text-[40px] font-extrabold tracking-tight">Lobby</h1>
			<div className="max-w-[520px]">
				<ChessBoard label="Starting position on a walnut board" />
			</div>
		</LayoutSidebar>
	);
}
