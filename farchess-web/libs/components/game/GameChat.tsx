import { FormEvent, useState } from 'react';

interface ChatMessage {
	id: number;
	from: string;
	text: string;
}

interface GameChatProps {
	me: string;
	initialMessages: ChatMessage[];
}

const GameChat = ({ me, initialMessages }: GameChatProps) => {
	const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
	const [draft, setDraft] = useState<string>('');

	// For now new messages only live in this page. Later they will be sent to the server.
	const sendHandler = (e: FormEvent) => {
		e.preventDefault();
		const text = draft.trim();
		if (!text) return;
		setMessages([...messages, { id: Date.now(), from: me, text }]);
		setDraft('');
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
