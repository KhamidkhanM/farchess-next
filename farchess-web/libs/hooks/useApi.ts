import { useEffect, useState } from 'react';
import { ApiError, apiGet } from '../api';

interface ApiState<T> {
	data: T | null;
	error: string | null;
	status: number | null; // HTTP status of a failed request, like 404
	loading: boolean;
}

/**
 * Loads data from farchess-api when the component appears, and again when the path changes.
 * Pass null as the path to wait, for example until the page knows which id to load.
 * Pass refreshMs to load it again every few milliseconds, for things that change, like a live game.
 * setData replaces the data right away, for example with what the server sent back after a move.
 */
const useApi = <T>(path: string | null, refreshMs?: number) => {
	const [state, setState] = useState<ApiState<T>>({ data: null, error: null, status: null, loading: true });

	useEffect(() => {
		if (!path) return;
		// If the path changes before the answer comes back, ignore the old answer
		let ignore = false;
		setState({ data: null, error: null, status: null, loading: true });

		const load = () =>
			apiGet<T>(path)
				.then((data) => !ignore && setState({ data, error: null, status: null, loading: false }))
				.catch((err: Error) => {
					const status = err instanceof ApiError ? err.status : null;
					// While refreshing, keep showing the last good data if one request fails
					if (!ignore) setState((old) => ({ data: old.data, error: err.message, status, loading: false }));
				});

		load();
		const timer = refreshMs ? setInterval(load, refreshMs) : undefined;
		return () => {
			ignore = true;
			clearInterval(timer);
		};
	}, [path, refreshMs]);

	const setData = (data: T) => setState({ data, error: null, status: null, loading: false });

	return { ...state, setData };
};

export default useApi;
