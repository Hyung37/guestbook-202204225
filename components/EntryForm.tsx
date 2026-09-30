"use client";

import { useActionState } from "react";
import { createEntryAction, type CreateEntryState } from "@/app/actions";

const initial: CreateEntryState = { values: { name: "", message: "" } };

const fieldClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-indigo-900";

const errorClass = "text-sm text-red-600 dark:text-red-400";

export default function EntryForm() {
  const [state, formAction, pending] = useActionState(createEntryAction, initial);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h2 className="text-lg font-semibold">방명록 남기기</h2>

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          이름
        </label>
        <input
          id="name"
          name="name"
          defaultValue={state.values.name}
          className={fieldClass}
          placeholder="이름 (1~20자)"
          autoComplete="off"
        />
        {state.errors?.name && (
          <p role="alert" className={errorClass}>
            {state.errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium">
          메시지
        </label>
        <textarea
          id="message"
          name="message"
          defaultValue={state.values.message}
          rows={4}
          className={fieldClass}
          placeholder="메시지 (1~500자)"
        />
        {state.errors?.message && (
          <p role="alert" className={errorClass}>
            {state.errors.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={fieldClass}
          placeholder="수정·삭제할 때 사용합니다"
          autoComplete="new-password"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          비밀번호를 잊으면 수정·삭제할 수 없습니다.
        </p>
        {state.errors?.password && (
          <p role="alert" className={errorClass}>
            {state.errors.password}
          </p>
        )}
      </div>

      {state.formError && (
        <p role="alert" className={errorClass}>
          {state.formError}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? "남기는 중..." : "남기기"}
      </button>
    </form>
  );
}
