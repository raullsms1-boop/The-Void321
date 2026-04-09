import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import { checkForBannedContent, isContentClean, BANNED_WORDS } from "../shared/moderation";
import type { TrpcContext } from "./_core/context";

type CookieCall = {
  name: string;
  options: Record<string, unknown>;
};

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "testuser@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// ─── Auth Tests ───────────────────────────────────────────────

describe("auth.me", () => {
  it("returns user data when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeTruthy();
    expect(result?.email).toBe("testuser@example.com");
    expect(result?.name).toBe("Test User");
    expect(result?.openId).toBe("test-user-123");
    expect(result?.role).toBe("user");
  });

  it("returns null when not authenticated", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeNull();
  });
});

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({ maxAge: -1 });
  });
});

// ─── Content Moderation Tests (shared module) ─────────────────

describe("shared/moderation - checkForBannedContent", () => {
  it("detects each banned word", () => {
    for (const word of BANNED_WORDS) {
      const result = checkForBannedContent(`This comment mentions ${word} which is bad`);
      expect(result).toBe(word);
    }
  });

  it("returns null for clean comments", () => {
    const cleanComments = [
      "Great movie! I loved the storyline.",
      "Anyone want to play chess together?",
      "Just uploaded my first short film!",
      "The graphics in this game are amazing.",
      "What a beautiful sunset scene in the documentary.",
    ];

    for (const comment of cleanComments) {
      expect(checkForBannedContent(comment)).toBeNull();
    }
  });

  it("is case-insensitive", () => {
    expect(checkForBannedContent("TERRORISM is wrong")).toBe("terrorism");
    expect(checkForBannedContent("Pedophilia content")).toBe("pedophil");
    expect(checkForBannedContent("CHILD ABUSE report")).toBe("child abuse");
  });

  it("detects banned words embedded in longer strings", () => {
    expect(checkForBannedContent("antiterrorism policy")).toBe("terrorism");
    expect(checkForBannedContent("pedophile ring")).toBe("pedophil");
  });
});

describe("shared/moderation - isContentClean", () => {
  it("returns true for clean content", () => {
    expect(isContentClean("This is a great movie!")).toBe(true);
    expect(isContentClean("Let's play some games")).toBe(true);
  });

  it("returns false for content with banned words", () => {
    expect(isContentClean("This promotes terrorism")).toBe(false);
    expect(isContentClean("Contains pedophile content")).toBe(false);
    expect(isContentClean("Mentions rape")).toBe(false);
  });

  it("returns true for empty string", () => {
    expect(isContentClean("")).toBe(true);
  });
});
