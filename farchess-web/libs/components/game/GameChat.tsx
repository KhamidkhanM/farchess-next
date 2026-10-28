import { FormEvent, useEffect, useState } from 'react';
import { apiSend } from '../../api';
import { ChatMessage as SavedMessage } from '../../types/api';

interface ChatMessage {
	id: string;
	from: string;
	text: string;
}

interface GameChatProps {
	gameId: string;
	me: string;
	initialMessages: ChatMessage[];
}

const GameChat = ({ gameId, me, initialMessages }: GameChatProps) => {
	const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
	const [draft, setDraft] = useState<string>('');
	const [error, setError] = useState<string | null>(null);

	// The game page loads the game again every second. Show messages the other player sent.
	useEffect(() => {
		setMessages(initialMessages);
		// Only when the number of messages changes, not on every reload of the same chat
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialMessages.length]);

	// Show the message straight away, then save it. The server answers with the whole chat.
	const sendHandler = async (e: FormEvent) => {
		e.preventDefault();
		const text = draft.trim();
		if (!text) return;
		setMessages([...messages, { id: String(Date.now()), from: me, text }]);
		setDraft('');
		setError(null);
		try {
			const saved = await apiSend<SavedMessage[]>('POST', `/games/${gameId}/chat`, { from: me, text });
			setMessages(saved.map((message) => ({ id: message._id, from: message.from, text: message.text })));
		} catch (err) {
			setError(`Not saved: ${(err as Error).message}`);
		}
	};

	return (
		<section aria-labelledby="chat" className="flex flex-col rounded-2xl bg-panel">
			<h2 id="chat" className="px-4 pb-1 pt-3 text-sm font-bold text-muted">
				Chat
			</h2>
			<div className="flex flex-col gap-1.5 px-4 pb-3 pt-1.5 text-[15px]">
				{messages.map((message) => (
					<p key={message.id}>
						<b className={message.from === me ? 'text-brass' : ''}>{message.from}</b> {message.text}
					</p>
				))}
			</div>
			{error && (
				<p role="alert" className="px-4 pb-2 text-sm font-bold text-loss">
					{error}
				</p>
			)}
			<form onSubmit={sendHandler} className="flex gap-2 border-t border-line p-2.5">
				<label htmlFor="game-chat-message" className="sr-only">
					Message
				</label>
				<input
					id="game-chat-message"
					type="text"
					placeholder="Message"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					className="min-w-0 flex-grow rounded-[10px] border border-line bg-espresso px-3.5 py-2.5 text-[15px] text-cream placeholder:text-faint focus:border-brass focus:outline-none"
				/>
				<button
					type="submit"
					className="min-h-11 min-w-[72px] rounded-[10px] bg-brass font-extrabold text-espresso hover:bg-brass-light"
				>
					Send
				</button>
			</form>
		</section>
	);
};

export default GameChat;
