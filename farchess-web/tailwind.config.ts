import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./pages/**/*.{ts,tsx}', './libs/**/*.{ts,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [],
};

export default config;
