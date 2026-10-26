import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./pages/**/*.{ts,tsx}', './libs/**/*.{ts,tsx}'],
	theme: {
		extend: {
			// "Walnut & brass" palette from the approved farchess design
			colors: {
				espresso: '#1a1512', // page background
				panel: {
					DEFAULT: '#251e19', // cards and lists
					raised: '#2b221c', // board frame, striped rows
				},
				line: {
					DEFAULT: '#3a2f27', // dividers
					strong: '#4a3d33', // outlined buttons
				},
				cream: '#f3ebe0', // main text
				muted: '#b9a998', // secondary text
				soft: '#d6cabb', // nav links, table text
				faint: '#8c7c6c', // move numbers, captions
				brass: {
					DEFAULT: '#e0b05a', // accent: buttons, active nav
					light: '#f3cd84', // link hover
				},
				sand: '#e8d2ad', // light squares, highlight cards
				walnut: '#a8794f', // dark squares
				ink: {
					DEFAULT: '#2a1f17', // text on sand cards
					soft: '#4a3a2c',
				},
				rust: '#7a4a22', // small labels on sand cards
				win: '#9cc596',
				loss: '#e98d75',
				online: '#8fb08a',
				resign: '#d0644a',
				lastmove: {
					light: '#ecc56f',
					dark: '#c79a3a',
				},
			},
			fontFamily: {
				display: ['var(--font-display)', 'sans-serif'],
				sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
				mono: ['var(--font-mono)', 'monospace'],
				pieces: ['"Segoe UI Symbol"', '"Apple Symbols"', '"DejaVu Sans"', '"Noto Sans Symbols 2"', 'serif'],
			},
			boxShadow: {
				board: '0 30px 60px rgba(0, 0, 0, 0.35)',
			},
		},
	},
	plugins: [],
};

export default config;
