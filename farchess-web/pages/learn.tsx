import { useState } from 'react';
import LayoutSidebar from '@/libs/components/layout/LayoutSidebar';
import LessonPlayer from '@/libs/components/learn/LessonPlayer';
import { LESSONS } from '@/libs/lessons';

// Lessons live in the frontend (libs/lessons.ts), so this page works without the server
export default function Learn() {
	const [lessonId, setLessonId] = useState<string>(LESSONS[0].id);
	// Lessons you finished this visit
	const [done, setDone] = useState<string[]>([]);

	const lesson = LESSONS.find((item) => item.id === lessonId) ?? LESSONS[0];

	const finishHandler = () => {
		if (!done.includes(lesson.id)) setDone([...done, lesson.id]);
		const next = LESSONS[LESSONS.indexOf(lesson) + 1];
		if (next) setLessonId(next.id);
	};

	return (
		<LayoutSidebar title="Learn">
			<div className="flex flex-col gap-2">
				<h1 className="font-display text-[40px] font-extrabold tracking-tight">Learn</h1>
				<p className="max-w-xl text-muted">Short lessons you play on the board. Read the step, then make the move.</p>
			</div>

			<nav aria-label="Lessons" className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
				{LESSONS.map((item, index) => {
					const picked = item.id === lesson.id;
					const finished = done.includes(item.id);
					return (
						<button
							key={item.id}
							type="button"
							aria-current={picked ? 'true' : undefined}
							onClick={() => setLessonId(item.id)}
							className={`flex flex-col gap-1.5 rounded-[18px] p-5 text-left ${
								picked ? 'bg-sand text-ink' : 'bg-panel text-cream hover:bg-panel-raised'
							}`}
						>
							<span className={`font-mono text-[13px] font-bold ${picked ? 'text-rust' : 'text-brass'}`}>
								{index + 1} · {item.level.toUpperCase()}
								{finished && ' · DONE ✓'}
							</span>
							<span className="font-display text-xl font-extrabold leading-tight">{item.title}</span>
							<span className={`text-sm ${picked ? 'text-ink-soft' : 'text-muted'}`}>{item.summary}</span>
						</button>
					);
				})}
			</nav>

			{/* key starts the player again from step 1 when you pick another lesson */}
			<LessonPlayer key={lesson.id} lesson={lesson} isLast={lesson === LESSONS.at(-1)} onFinish={finishHandler} />
		</LayoutSidebar>
	);
}
