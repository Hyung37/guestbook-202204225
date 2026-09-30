"use server";

import { revalidatePath } from "next/cache";
import {
  hashPassword,
  validateMessageEdit,
  validateNewEntry,
  verifyPassword,
  type EntryErrors,
} from "@/lib/entry";
import {
  getPasswordHash,
  insertEntry,
  removeEntry,
  updateMessage,
} from "@/lib/entries";

export type CreateEntryState = {
  errors?: EntryErrors;
  formError?: string;
  values: { name: string; message: string };
};

export async function createEntryAction(
  _prev: CreateEntryState,
  formData: FormData,
): Promise<CreateEntryState> {
  const input = {
    name: String(formData.get("name") ?? ""),
    message: String(formData.get("message") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const values = { name: input.name, message: input.message };

  const result = validateNewEntry(input);
  if (!result.ok) return { errors: result.errors, values };

  try {
    const passwordHash = await hashPassword(result.value.password);
    await insertEntry({
      name: result.value.name,
      message: result.value.message,
      passwordHash,
    });
  } catch {
    return {
      formError: "저장 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.",
      values,
    };
  }

  revalidatePath("/");
  return { values: { name: "", message: "" } };
}

export type MutationResult = { ok: true } | { ok: false; error: string };

const MISMATCH = "비밀번호가 일치하지 않습니다.";
const NOT_FOUND = "글을 찾을 수 없습니다. 이미 삭제되었을 수 있어요.";
const SERVER_ERROR = "처리 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.";

// 글이 있고 비밀번호가 맞으면 null, 아니면 거부 사유를 돌려준다.
// Server Action은 공개 엔드포인트이므로 요청마다 서버에서 다시 확인한다.
async function rejectUnlessAuthor(
  id: string,
  password: string,
): Promise<MutationResult | null> {
  if (!/^\d+$/.test(id)) return { ok: false, error: NOT_FOUND };
  const hash = await getPasswordHash(id);
  if (hash === null) return { ok: false, error: NOT_FOUND };
  if (!(await verifyPassword(password, hash))) return { ok: false, error: MISMATCH };
  return null;
}

export async function updateEntryAction(
  id: string,
  formData: FormData,
): Promise<MutationResult> {
  const message = validateMessageEdit(String(formData.get("message") ?? ""));
  if (!message.ok) return { ok: false, error: message.error };

  try {
    const rejected = await rejectUnlessAuthor(id, String(formData.get("password") ?? ""));
    if (rejected) return rejected;
    if (!(await updateMessage(id, message.value))) return { ok: false, error: NOT_FOUND };
  } catch {
    return { ok: false, error: SERVER_ERROR };
  }

  revalidatePath("/");
  return { ok: true };
}

export async function deleteEntryAction(
  id: string,
  formData: FormData,
): Promise<MutationResult> {
  try {
    const rejected = await rejectUnlessAuthor(id, String(formData.get("password") ?? ""));
    if (rejected) return rejected;
    if (!(await removeEntry(id))) return { ok: false, error: NOT_FOUND };
  } catch {
    return { ok: false, error: SERVER_ERROR };
  }

  revalidatePath("/");
  return { ok: true };
}
