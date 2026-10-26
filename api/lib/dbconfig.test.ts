import { describe, expect, it } from "vitest";
import { parseDatabaseUrl } from "./dbconfig";

describe("parseDatabaseUrl", () => {
  it("parses a plain local URL without TLS", () => {
    const o = parseDatabaseUrl("mysql://root:secret@127.0.0.1:3306/hib");
    expect(o).toMatchObject({ host: "127.0.0.1", port: 3306, user: "root", password: "secret", database: "hib" });
    expect(o.ssl).toBeUndefined();
  });

  it("defaults the port to 3306", () => {
    expect(parseDatabaseUrl("mysql://u:p@db.internal/hib").port).toBe(3306);
  });

  it("decodes percent-encoded credentials", () => {
    const o = parseDatabaseUrl("mysql://us%40er:p%23ss%2Fword@db:25060/hib");
    expect(o.user).toBe("us@er");
    expect(o.password).toBe("p#ss/word");
    expect(o.port).toBe(25060);
  });

  it("translates ssl-mode=REQUIRED into an encrypted, unverified connection", () => {
    const o = parseDatabaseUrl("mysql://u:p@db:25060/defaultdb?ssl-mode=REQUIRED");
    expect(o.ssl).toEqual({ rejectUnauthorized: false });
    expect(o.database).toBe("defaultdb");
  });

  it("verifies the server when a CA certificate accompanies REQUIRED", () => {
    const o = parseDatabaseUrl("mysql://u:p@db/x?ssl-mode=REQUIRED", "-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----");
    expect(o.ssl).toMatchObject({ rejectUnauthorized: true });
    expect((o.ssl as { ca?: string }).ca).toContain("BEGIN CERTIFICATE");
    // Managed hosts connect by internal names, so only the CA is checked.
    expect(typeof (o.ssl as { checkServerIdentity?: unknown }).checkServerIdentity).toBe("function");
  });

  it("checks the host name only for VERIFY_IDENTITY", () => {
    const ca = "-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----";
    const verifyCa = parseDatabaseUrl("mysql://u:p@db/x?ssl-mode=VERIFY_CA", ca).ssl as Record<string, unknown>;
    const verifyId = parseDatabaseUrl("mysql://u:p@db/x?ssl-mode=VERIFY_IDENTITY", ca).ssl as Record<string, unknown>;
    expect(typeof verifyCa.checkServerIdentity).toBe("function");
    expect(verifyId.checkServerIdentity).toBeUndefined();
  });

  it("requires a CA certificate for VERIFY_CA and VERIFY_IDENTITY", () => {
    expect(() => parseDatabaseUrl("mysql://u:p@db/x?ssl-mode=VERIFY_CA")).toThrow(/DATABASE_CA_CERT/);
    expect(() => parseDatabaseUrl("mysql://u:p@db/x?ssl-mode=VERIFY_IDENTITY", "  ")).toThrow(/DATABASE_CA_CERT/);
  });

  it("accepts the sslmode spelling and is case-insensitive", () => {
    expect(parseDatabaseUrl("mysql://u:p@db/x?sslmode=required").ssl).toEqual({ rejectUnauthorized: false });
  });

  it("treats ssl-mode=DISABLED as no TLS", () => {
    expect(parseDatabaseUrl("mysql://u:p@db/x?ssl-mode=DISABLED").ssl).toBeUndefined();
  });

  it("rejects unknown modes and non-mysql URLs without echoing the URL", () => {
    expect(() => parseDatabaseUrl("mysql://u:topsecret@db/x?ssl-mode=BOGUS")).toThrow(/Unsupported ssl-mode/);
    try {
      parseDatabaseUrl("postgres://u:topsecret@db/x");
    } catch (e) {
      expect((e as Error).message).not.toContain("topsecret");
    }
    expect(() => parseDatabaseUrl("postgres://u:p@db/x")).toThrow(/mysql:\/\//);
    expect(() => parseDatabaseUrl("not a url")).toThrow(/not a valid URL/);
  });
});
