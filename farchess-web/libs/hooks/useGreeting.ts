import { useEffect, useState } from 'react';

// Says "Good morning / afternoon / evening" based on the visitor's clock.
// It starts as "Welcome back" because the server can't know the
// visitor's time, and updates once the page loads in the browser.
const useGreeting = () => {
	const [greeting, setGreeting] = useState<string>('Welcome back');

	useEffect(() => {
		const hour = new Date().getHours();
		if (hour < 12) setGreeting('Good morning');
		else if (hour < 18) setGreeting('Good afternoon');
		else setGreeting('Good evening');
	}, []);

	return greeting;
};

export default useGreeting;
