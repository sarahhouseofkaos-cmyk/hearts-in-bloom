import type { PoolOptions, SslOptions } from "mysql2";

// mysql2 hands these options straight to Node's TLS layer, which understands
// checkServerIdentity even though mysql2's own type does not declare it.
type TlsOptions = SslOptions & { checkServerIdentity?: () => undefined };

function verifyAgainstCa(ca: string, checkHostName: boolean): TlsOptions {
  const options: TlsOptions = { ca, rejectUnauthorized: true };
  if (!checkHostName) options.checkServerIdentity = () => undefined;
  return options;
}

/**
 * Turns a mysql:// connection URL into mysql2 pool options.
 *
 * Managed MySQL hosts (for example DigitalOcean) append `?ssl-mode=REQUIRED` to
 * their URLs. mysql2 does not understand that parameter, so it is translated
 * here into mysql2's `ssl` option instead of being passed through.
 *
 * - no ssl-mode, or DISABLED: plain connection (local development)
 * - REQUIRED / PREFERRED: encrypted. The server certificate is verified only
 *   against the CA when a certificate is supplied (DATABASE_CA_CERT; the host name
 *   is not checked, as managed hosts reach the database by internal names);
 *   otherwise the link is
 *   encrypted but the server is not authenticated, matching MySQL's own meaning
 *   of REQUIRED. Use the host's private network connection for that case.
 * - VERIFY_CA / VERIFY_IDENTITY: encrypted and verified; a CA certificate is
 *   mandatory.
 */
export function parseDatabaseUrl(rawUrl: string, caCert?: string): PoolOptions {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("DATABASE_URL is not a valid URL");
  }
  if (url.protocol !== "mysql:") {
    throw new Error("DATABASE_URL must start with mysql://");
  }

  const options: PoolOptions = {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\//, "")),
    enableKeepAlive: true,
  };

  const mode = (url.searchParams.get("ssl-mode") ?? url.searchParams.get("sslmode") ?? "")
    .trim()
    .toUpperCase();
  const ca = caCert?.trim() ? caCert : undefined;

  switch (mode) {
    case "":
    case "DISABLED":
    case "DISABLE":
      break;
    case "REQUIRED":
    case "REQUIRE":
    case "PREFERRED":
      options.ssl = ca ? verifyAgainstCa(ca, false) : { rejectUnauthorized: false };
      break;
    case "VERIFY_CA":
    case "VERIFY_IDENTITY":
      if (!ca) {
        throw new Error(`DATABASE_URL asks for ssl-mode=${mode}, so DATABASE_CA_CERT must be set`);
      }
      options.ssl = verifyAgainstCa(ca, mode === "VERIFY_IDENTITY");
      break;
    default:
      throw new Error(`Unsupported ssl-mode in DATABASE_URL: ${mode}`);
  }

  return options;
}
