import { useEffect, useState } from 'react';
import LayoutSidebar from '@/libs/components/layout/LayoutSidebar';
import ApiStatus from '@/libs/components/common/ApiStatus';
import PlayerRow from '@/libs/components/friends/PlayerRow';
import useApi from '@/libs/hooks/useApi';
import { apiSend } from '@/libs/api';
import { CURRENT_USERNAME } from '@/libs/config';
import { PlayerSummary } from '@/libs/types/api';

// Wait this long after the last key press before searching, so we don't ask the server on every letter
const SEARCH_DELAY_MS = 300;

const FRIENDS_PATH = `/members/${CURRENT_USERNAME}/friends`;

export default function Friends() {
	const loaded = useApi<PlayerSummary[]>(FRIENDS_PATH);
	// After you add or remove someone, the server sends the new list. Until then we use the loaded one.
	const [updated, setUpdated] = useState<PlayerSummary[] | null>(null);
	const [busy, setBusy] = useState<string | null>(null); // the username being added or removed
	const [error, setError] = useState<string | null>(null);

	const [text, setText] = useState<string>('');
	const [search, setSearch] = useState<string>('');
	const results = useApi<PlayerSummary[]>(`/members?search=${encodeURIComponent(search)}`);

	useEffect(() => {
		const timer = setTimeout(() => setSearch(text), SEARCH_DELAY_MS);
		return () => clearTimeout(timer);
	}, [text]);

	const friends = updated ?? loaded.data;
	const friendNames = (friends ?? []).map((friend) => friend.username);

	const changeFriend = async (username: string, add: boolean) => {
		setBusy(username);
		setError(null);
		try {
			const list = add
				? await apiSend<PlayerSummary[]>('POST', FRIENDS_PATH, { friend: username })
				: await apiSend<PlayerSummary[]>('DELETE', `${FRIENDS_PATH}/${username}`);
			setUpdated(list);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setBusy(null);
		}
	};

	const others = (results.data ?? []).filter((player) => player.username !== CURRENT_USERNAME);

	return (
		<LayoutSidebar title="Friends">
			<h1 className="font-display text-[40px] font-extrabold tracking-tight">Friends</h1>

			{error && (
				<p role="alert" className="self-start rounded-2xl bg-panel px-4 py-3 font-bold text-loss">
					{error}
				</p>
			)}

			<div className="flex flex-wrap items-start gap-7">
				<section aria-labelledby="your-friends" className="flex min-w-0 flex-[1_1_380px] flex-col gap-3.5">
					<h2 id="your-friends" className="font-display text-2xl font-bold">
						Your friends {friends && <span className="font-mono text-lg text-muted">{friends.length}</span>}
					</h2>
					{friends ? (
						<ul className="flex flex-col overflow-hidden rounded-[18px] bg-panel">
							{friends.length === 0 && (
								<li className="px-[18px] py-3.5 text-muted">No friends yet. Find players on the right and add them.</li>
							)}
							{friends.map((friend) => (
								<PlayerRow key={friend._id} player={friend}>
									<button
										type="button"
										onClick={() => changeFriend(friend.username, false)}
										disabled={busy === friend.username}
										aria-label={`Remove ${friend.username}`}
										className="min-h-11 rounded-xl border border-line-strong px-4 font-bold text-cream hover:bg-panel-raised disabled:opacity-40"
									>
										Remove
									</button>
								</PlayerRow>
							))}
						</ul>
					) : (
						<ApiStatus {...loaded} />
					)}
				</section>

				<section aria-labelledby="find-players" className="flex min-w-0 flex-[1_1_380px] flex-col gap-3.5">
					<h2 id="find-players" className="font-display text-2xl font-bold">
						Find players
					</h2>
					<label className="flex flex-col gap-1.5">
						<span className="text-sm font-bold text-muted">Username</span>
						<input
							type="search"
							value={text}
							onChange={(event) => setText(event.target.value)}
							placeholder="Type a name, like player"
							className="min-h-12 rounded-xl border border-line-strong bg-panel px-4 text-cream placeholder:text-faint focus:border-brass focus:outline-none"
						/>
					</label>
					{results.data ? (
						<ul className="flex flex-col overflow-hidden rounded-[18px] bg-panel">
							{others.length === 0 && <li className="px-[18px] py-3.5 text-muted">Nobody found with that name.</li>}
							{others.map((player) => {
								const isFriend = friendNames.includes(player.username);
								return (
									<PlayerRow key={player._id} player={player}>
										{isFriend ? (
											<span className="min-w-[88px] text-center text-sm font-bold text-win">Friend ✓</span>
										) : (
											<button
												type="button"
												onClick={() => changeFriend(player.username, true)}
												disabled={busy === player.username}
												aria-label={`Add ${player.username}`}
												className="min-h-11 min-w-[88px] rounded-xl bg-brass px-4 font-extrabold text-espresso hover:bg-brass-light disabled:opacity-40"
											>
												Add
											</button>
										)}
									</PlayerRow>
								);
							})}
						</ul>
					) : (
						<ApiStatus {...results} />
					)}
				</section>
			</div>
		</LayoutSidebar>
	);
}
