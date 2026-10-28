import { API_URL } from './config';

// An error that also remembers the HTTP status, like 404
export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
	) {
		super(message);
	}
}

// Turns a failed response into an ApiError, or reads the JSON
const readResponse = async <T>(response: Response): Promise<T> => {
	if (!response.ok) {
		// Nest sends errors as { message: '...' }
		const body = await response.json().catch(() => null);
		throw new ApiError(body?.message ?? `Request failed with status ${response.status}`, response.status);
	}
	return response.json();
};

// GET a path from farchess-api, like apiGet<Member>('/members/khamid')
export const apiGet = async <T>(path: string): Promise<T> => readResponse<T>(await fetch(`${API_URL}${path}`));

// Send data to farchess-api, like apiSend('POST', '/tournaments/123/join', { username: 'khamid' })
export const apiSend = async <T>(method: 'POST' | 'DELETE', path: string, body?: object): Promise<T> => {
	const response = await fetch(`${API_URL}${path}`, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: body ? JSON.stringify(body) : undefined,
	});
	return readResponse<T>(response);
};
