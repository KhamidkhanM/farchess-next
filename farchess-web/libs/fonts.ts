import { Bricolage_Grotesque, Figtree, Space_Mono } from 'next/font/google';

// Bricolage Grotesque: headings and the logo
export const displayFont = Bricolage_Grotesque({
	subsets: ['latin'],
	weight: ['500', '700', '800'],
	variable: '--font-display',
});

// Figtree: body text
export const bodyFont = Figtree({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800'],
	variable: '--font-body',
});

// Space Mono: ratings, clocks, moves and other numbers
export const monoFont = Space_Mono({
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-mono',
});

export const fontVariables = [displayFont.variable, bodyFont.variable, monoFont.variable].join(' ');
