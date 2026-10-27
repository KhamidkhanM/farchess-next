interface ApiStatusProps {
	loading: boolean;
	error: string | null;
	status?: number | null;
}

export const SeedHint = () => (
	<p className="text-sm text-muted">
		If the database is empty, fill it with sample data: run <code className="font-mono text-cream">npm run seed</code> in
		the farchess (backend) folder, then reload this page.
	</p>
);

// What to show while data is on its way, or when the server could not be reached
const ApiStatus = ({ loading, error, status }: ApiStatusProps) => {
	if (loading) {
		return (
			<p role="status" className="font-mono text-sm text-muted">
				Loading…
			</p>
		);
	}
	if (error) {
		return (
			<div role="alert" className="flex flex-col gap-1 self-start rounded-[18px] bg-panel p-5">
				<p className="font-bold text-loss">Could not load this from the server.</p>
				<p className="text-sm text-muted">
					{error === 'Failed to fetch' ? 'Is farchess-api running? Start it with npm run start:dev.' : error}
				</p>
				{/* 404 almost always means the database is still empty */}
				{status === 404 && <SeedHint />}
			</div>
		);
	}
	return null;
};

export default ApiStatus;
