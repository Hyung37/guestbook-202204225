import EntryCard from "@/components/EntryCard";
import EntryForm from "@/components/EntryForm";
import { listEntries } from "@/lib/entries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const entries = await listEntries();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">미니 방명록</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          개발자: 소재형 (202204225)
        </p>
      </header>

      <EntryForm />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          글 목록{" "}
          <span className="text-sm font-normal text-zinc-500">
            ({entries.length})
          </span>
        </h2>
        {entries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            아직 남겨진 글이 없어요. 첫 번째 글을 남겨 보세요!
          </p>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-auto border-t border-zinc-200 pt-4 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        개발자 소재형 · 학번 202204225
      </footer>
    </div>
  );
}
