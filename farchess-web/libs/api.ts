import { API_URL } from './config';

// GET a path from farchess-api, like apiGet<Member>('/members/khamid')
export const apiGet = async <T>(path: string): Promise<T> => {
	const response = await fetch(`${API_URL}${path}`);
	if (!response.ok) {
		// Nest sends errors as { message: '...' }
		const body = await response.json().catch(() => null);
		throw new Error(body?.message ?? `Request failed with status ${response.status}`);
	}
	return response.json();
};
