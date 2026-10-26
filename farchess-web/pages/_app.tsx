import type { AppProps } from 'next/app';
import { fontVariables } from '@/libs/fonts';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<div className={`${fontVariables} font-sans`}>
			<Component {...pageProps} />
		</div>
	);
}
