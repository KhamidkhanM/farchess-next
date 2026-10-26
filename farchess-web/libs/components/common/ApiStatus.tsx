interface ApiStatusProps {
	loading: boolean;
	error: string | null;
}

// What to show while data is on its way, or when the server could not be reached
const ApiStatus = ({ loading, error }: ApiStatusProps) => {
	if (loading) {
		return (
			<p role="status" className="font-mono text-sm text-muted">
				Loading…
			</p>
		);
	}
	if (error) {
		return (
			<div role="alert" className="flex flex-col gap-1 rounded-[18px] bg-panel p-5">
				<p className="font-bold text-loss">Could not load this from the server.</p>
				<p className="text-sm text-muted">
					{error === 'Failed to fetch' ? 'Is farchess-api running? Start it with npm run start:dev.' : error}
				</p>
			</div>
		);
	}
	return null;
};

export default ApiStatus;
