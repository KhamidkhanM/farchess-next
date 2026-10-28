import { useEffect, useState } from 'react';
import { CURRENT_USERNAME } from '../config';

const KEY = 'farchess-playing-as';

/**
 * Which player this browser tab plays as. There is no login yet, so it starts as
 * CURRENT_USERNAME, and a tab can switch to another player to test a game against yourself.
 * sessionStorage keeps the choice for this tab only, so two tabs can be two players.
 */
const usePlayingAs = () => {
	const [name, setName] = useState<string>(CURRENT_USERNAME);

	// Read it after the page loads: sessionStorage does not exist while Next.js renders on the server
	useEffect(() => {
		try {
			const saved = sessionStorage.getItem(KEY);
			if (saved) setName(saved);
		} catch {
			// Storage can be blocked, for example in private windows. Then we just keep the default.
		}
	}, []);

	const change = (next: string) => {
		setName(next);
		try {
			sessionStorage.setItem(KEY, next);
		} catch {
			// See above
		}
	};

	return [name, change] as const;
};

export default usePlayingAs;
