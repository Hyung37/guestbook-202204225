import bcrypt from "bcryptjs";

export type EntryInput = { name: string; message: string; password: string };

export type EntryErrors = Partial<Record<keyof EntryInput, string>>;

export type ValidationResult =
  | { ok: true; value: EntryInput }
  | { ok: false; errors: EntryErrors };

export type MessageEditResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

const NAME_MAX = 20;
const MESSAGE_MAX = 500;
const PASSWORD_MIN = 4;
// bcrypt는 입력의 앞 72바이트만 사용한다.
const PASSWORD_MAX_BYTES = 72;
const BCRYPT_COST = 10;

const MESSAGE_ERROR = `메시지는 1~${MESSAGE_MAX}자로 입력해 주세요.`;

function isValidMessage(message: string) {
  return message.length >= 1 && message.length <= MESSAGE_MAX;
}

export function validateNewEntry(input: EntryInput): ValidationResult {
  const errors: EntryErrors = {};
  const name = input.name.trim();
  const message = input.message.trim();

  if (name.length < 1 || name.length > NAME_MAX) {
    errors.name = `이름은 1~${NAME_MAX}자로 입력해 주세요.`;
  }

  if (!isValidMessage(message)) {
    errors.message = MESSAGE_ERROR;
  }

  if (
    input.password.length < PASSWORD_MIN ||
    new TextEncoder().encode(input.password).length > PASSWORD_MAX_BYTES
  ) {
    errors.password = `비밀번호는 ${PASSWORD_MIN}자 이상, ${PASSWORD_MAX_BYTES}바이트 이하(한글은 약 24자)로 입력해 주세요.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, message, password: input.password } };
}

export function validateMessageEdit(message: string): MessageEditResult {
  const trimmed = message.trim();
  if (!isValidMessage(trimmed)) return { ok: false, error: MESSAGE_ERROR };
  return { ok: true, value: trimmed };
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
