import { describe, it, expect, beforeEach } from "vitest";
import { mockAuth, mockUsers, resetMockDatabase } from "./mock";

const SEED_EMAIL = "teacher@littlelearner.example";

beforeEach(() => {
  resetMockDatabase();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

describe("mockAuth", () => {
  it("login accepts valid credentials and stores token + user", async () => {
    const res = await mockAuth.login({ email: SEED_EMAIL, password: "anything" });

    expect(res.data.token).toBe(`mock-jwt-token-u2`);
    expect(res.data.user.email).toBe(SEED_EMAIL);
    expect(res.data.user.role).toBe("teacher");
    expect(localStorage.getItem("token")).toBe(`mock-jwt-token-u2`);
    expect(JSON.parse(localStorage.getItem("user")).email).toBe(SEED_EMAIL);
  });

  it("login rejects unknown email", async () => {
    await expect(
      mockAuth.login({ email: "noone@example.com", password: "x" })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("login rejects empty password", async () => {
    await expect(
      mockAuth.login({ email: SEED_EMAIL, password: "" })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("login rejects inactive user", async () => {
    await mockUsers.update("u2", { is_active: false });
    await expect(
      mockAuth.login({ email: SEED_EMAIL, password: "x" })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("tokenLogin accepts a valid student pin", async () => {
    const res = await mockAuth.tokenLogin({ token: "1234" });

    expect(res.data.user.role).toBe("student");
    expect(res.data.user.full_name).toBe("Sophal");
    expect(localStorage.getItem("token")).toBe(`mock-jwt-token-u3`);
  });

  it("tokenLogin rejects an invalid token", async () => {
    await expect(mockAuth.tokenLogin({ token: "0000" })).rejects.toMatchObject({
      response: { status: 401 },
    });
  });

  it("me returns the stored user after login", async () => {
    await mockAuth.login({ email: SEED_EMAIL, password: "x" });
    const res = await mockAuth.me();

    expect(res.data.email).toBe(SEED_EMAIL);
  });

  it("me throws 401 when no user is stored", async () => {
    await expect(mockAuth.me()).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("logout clears token and user", async () => {
    await mockAuth.login({ email: SEED_EMAIL, password: "x" });
    await mockAuth.logout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});
