"use client";

import { useState, useTransition, type FormEvent } from "react";
import {
  deleteEntryAction,
  updateEntryAction,
  type MutationResult,
} from "@/app/actions";
import type { Entry } from "@/lib/entries";
import { formatKst } from "@/lib/format";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-indigo-900";
const errorClass = "text-sm text-red-600 dark:text-red-400";
const subtleButton =
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800";

type Mode = "view" | "edit" | "delete";

export default function EntryCard({ entry }: { entry: Entry }) {
  const [mode, setMode] = useState<Mode>("view");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function open(next: Mode) {
    setError(null);
    setMode(next);
  }

  function submit(
    e: FormEvent<HTMLFormElement>,
    action: (id: string, formData: FormData) => Promise<MutationResult>,
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(entry.id, formData);
      if (result.ok) open("view");
      else setError(result.error);
    });
  }

  return (
    <li className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
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

      {mode === "view" && (
        <>
          <p className="whitespace-pre-wrap break-words">{entry.message}</p>
          <div className="flex gap-2">
            <button type="button" className={subtleButton} onClick={() => open("edit")}>
              수정
            </button>
            <button type="button" className={subtleButton} onClick={() => open("delete")}>
              삭제
            </button>
          </div>
        </>
      )}

      {mode === "edit" && (
        <form onSubmit={(e) => submit(e, updateEntryAction)} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor={`message-${entry.id}`} className="text-sm font-medium">
              메시지 수정
            </label>
            <textarea
              id={`message-${entry.id}`}
              name="message"
              defaultValue={entry.message}
              rows={4}
              className={fieldClass}
            />
          </div>
          <PasswordField id={`password-${entry.id}`} />
          {error && (
            <p role="alert" className={errorClass}>
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {pending ? "저장 중..." : "저장"}
            </button>
            <button
              type="button"
              className={subtleButton}
              onClick={() => open("view")}
              disabled={pending}
            >
              취소
            </button>
          </div>
        </form>
      )}

      {mode === "delete" && (
        <form onSubmit={(e) => submit(e, deleteEntryAction)} className="space-y-3">
          <p className="whitespace-pre-wrap break-words">{entry.message}</p>
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            정말 삭제할까요? 삭제한 글은 되돌릴 수 없습니다.
          </p>
          <PasswordField id={`password-${entry.id}`} />
          {error && (
            <p role="alert" className={errorClass}>
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {pending ? "삭제 중..." : "삭제"}
            </button>
            <button
              type="button"
              className={subtleButton}
              onClick={() => open("view")}
              disabled={pending}
            >
              취소
            </button>
          </div>
        </form>
      )}
    </li>
  );
}

function PasswordField({ id }: { id: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        비밀번호
      </label>
      <input
        id={id}
        name="password"
        type="password"
        className={fieldClass}
        placeholder="글을 쓸 때 정한 비밀번호"
        autoComplete="off"
      />
    </div>
  );
}
