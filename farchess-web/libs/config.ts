// NEXT_PUBLIC_ variables are readable in the browser. Set it in .env.local.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

// There is no login yet, so every page acts as this player
export const CURRENT_USERNAME = 'khamid';
