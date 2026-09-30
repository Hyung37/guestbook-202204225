"use server";

import { revalidatePath } from "next/cache";
import { hashPassword, validateNewEntry, type EntryErrors } from "@/lib/entry";
import { insertEntry } from "@/lib/entries";

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
