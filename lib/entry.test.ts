import { describe, expect, it } from "vitest";
import {
  hashPassword,
  validateMessageEdit,
  validateNewEntry,
  verifyPassword,
} from "./entry";

const valid = { name: "소재형", message: "안녕하세요", password: "1234" };

describe("validateNewEntry - 이름", () => {
  it("1자 이름은 통과한다", () => {
    const r = validateNewEntry({ ...valid, name: "가" });
    expect(r.ok).toBe(true);
  });

  it("20자 이름은 통과한다", () => {
    const r = validateNewEntry({ ...valid, name: "가".repeat(20) });
    expect(r.ok).toBe(true);
  });

  it("빈 이름은 거부한다", () => {
    const r = validateNewEntry({ ...valid, name: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.name).toBeTruthy();
  });

  it("공백뿐인 이름은 거부한다", () => {
    const r = validateNewEntry({ ...valid, name: "   " });
    expect(r.ok).toBe(false);
  });

  it("21자 이름은 거부한다", () => {
    const r = validateNewEntry({ ...valid, name: "가".repeat(21) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.name).toBeTruthy();
  });

  it("앞뒤 공백은 잘라낸 값을 돌려준다", () => {
    const r = validateNewEntry({ ...valid, name: "  소재형  " });
    expect(r.ok && r.value.name).toBe("소재형");
  });

  it("공백을 자른 뒤 20자면 통과한다", () => {
    const r = validateNewEntry({ ...valid, name: ` ${"가".repeat(20)} ` });
    expect(r.ok).toBe(true);
  });
});

describe("validateNewEntry - 메시지", () => {
  it("1자 메시지는 통과한다", () => {
    expect(validateNewEntry({ ...valid, message: "a" }).ok).toBe(true);
  });

  it("500자 메시지는 통과한다", () => {
    expect(validateNewEntry({ ...valid, message: "a".repeat(500) }).ok).toBe(true);
  });

  it("501자 메시지는 거부한다", () => {
    const r = validateNewEntry({ ...valid, message: "a".repeat(501) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.message).toBeTruthy();
  });

  it("빈 메시지는 거부한다", () => {
    const r = validateNewEntry({ ...valid, message: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.message).toBeTruthy();
  });

  it("공백과 줄바꿈뿐인 메시지는 거부한다", () => {
    expect(validateNewEntry({ ...valid, message: " \n\t " }).ok).toBe(false);
  });

  it("중간의 줄바꿈은 유지하고 앞뒤 공백만 자른다", () => {
    const r = validateNewEntry({ ...valid, message: "  첫째 줄\n둘째 줄  " });
    expect(r.ok && r.value.message).toBe("첫째 줄\n둘째 줄");
  });

  it("이름과 메시지가 모두 틀리면 오류를 둘 다 돌려준다", () => {
    const r = validateNewEntry({ ...valid, name: "", message: "" });
    expect(!r.ok && Object.keys(r.errors).sort()).toEqual(["message", "name"]);
  });
});

describe("validateNewEntry - 비밀번호", () => {
  it("4자 비밀번호는 통과한다", () => {
    expect(validateNewEntry({ ...valid, password: "abcd" }).ok).toBe(true);
  });

  it("72자 비밀번호는 통과한다", () => {
    expect(validateNewEntry({ ...valid, password: "a".repeat(72) }).ok).toBe(true);
  });

  it("3자 비밀번호는 거부한다", () => {
    const r = validateNewEntry({ ...valid, password: "abc" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.password).toBeTruthy();
  });

  it("73자 비밀번호는 거부한다", () => {
    const r = validateNewEntry({ ...valid, password: "a".repeat(73) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.password).toBeTruthy();
  });

  it("비밀번호는 공백을 자르지 않고 그대로 돌려준다", () => {
    const r = validateNewEntry({ ...valid, password: " ab c " });
    expect(r.ok && r.value.password).toBe(" ab c ");
  });

  it("바이트 기준 72를 넘는 한글 비밀번호는 거부한다", () => {
    // 한글 1자는 UTF-8 3바이트: 25자 = 75바이트 (bcrypt는 72바이트까지만 읽는다)
    const r = validateNewEntry({ ...valid, password: "가".repeat(25) });
    expect(r.ok).toBe(false);
  });
});

describe("validateMessageEdit", () => {
  it("앞뒤 공백을 자른 메시지를 돌려준다", () => {
    const r = validateMessageEdit("  고친 글  ");
    expect(r.ok && r.value).toBe("고친 글");
  });

  it("빈 메시지와 501자 메시지는 거부한다", () => {
    expect(validateMessageEdit("   ").ok).toBe(false);
    expect(validateMessageEdit("a".repeat(501)).ok).toBe(false);
  });

  it("500자 메시지는 통과한다", () => {
    expect(validateMessageEdit("a".repeat(500)).ok).toBe(true);
  });
});

describe("비밀번호 해시", () => {
  it("해시는 평문과 다르다", async () => {
    const hash = await hashPassword("1234");
    expect(hash).not.toContain("1234");
  });

  it("올바른 비밀번호만 검증을 통과한다", async () => {
    const hash = await hashPassword("비밀번호!");
    expect(await verifyPassword("비밀번호!", hash)).toBe(true);
    expect(await verifyPassword("다른비밀번호", hash)).toBe(false);
  });

  it("같은 비밀번호도 매번 다른 해시가 만들어진다", async () => {
    expect(await hashPassword("1234")).not.toBe(await hashPassword("1234"));
  });
});
