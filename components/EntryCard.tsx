import type { Entry } from "@/lib/entries";
import { formatKst } from "@/lib/format";

export default function EntryCard({ entry }: { entry: Entry }) {
  return (
    <li className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="font-semibold">{entry.name}</span>
        <time
          className="text-sm text-zinc-500 dark:text-zinc-400"
          dateTime={entry.createdAt}
        >
          {formatKst(entry.createdAt)}
          {entry.updatedAt && ` (수정됨 ${formatKst(entry.updatedAt)})`}
        </time>
      </div>
      <p className="whitespace-pre-wrap break-words">{entry.message}</p>
    </li>
  );
}
