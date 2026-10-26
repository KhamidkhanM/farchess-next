import { useEffect, useState } from 'react';
import { apiGet } from '../api';

interface ApiState<T> {
	data: T | null;
	error: string | null;
	loading: boolean;
}

/**
 * Loads data from farchess-api when the component appears, and again when the path changes.
 * Pass null as the path to wait, for example until the page knows which id to load.
 */
const useApi = <T>(path: string | null): ApiState<T> => {
	const [state, setState] = useState<ApiState<T>>({ data: null, error: null, loading: true });

	useEffect(() => {
		if (!path) return;
		// If the path changes before the answer comes back, ignore the old answer
		let ignore = false;
		setState({ data: null, error: null, loading: true });
		apiGet<T>(path)
			.then((data) => !ignore && setState({ data, error: null, loading: false }))
			.catch((err: Error) => !ignore && setState({ data: null, error: err.message, loading: false }));
		return () => {
			ignore = true;
		};
	}, [path]);

	return state;
};

export default useApi;
