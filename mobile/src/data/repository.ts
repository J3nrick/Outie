import * as SQLite from "expo-sqlite";
import { decodeSnapshot, type Snapshot } from "./storage";
let database: Promise<SQLite.SQLiteDatabase> | undefined;
async function db() {
  database ??= SQLite.openDatabaseAsync("depart.db").then(async (d) => {
    const version = await d.getFirstAsync<{ user_version: number }>(
      "PRAGMA user_version",
    );
    if ((version?.user_version ?? 0) > 1)
      throw new Error("This data needs a newer Outie version.");
    await d.execAsync(
      "PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS preparation (scope TEXT PRIMARY KEY, value TEXT NOT NULL); PRAGMA user_version = 1;",
    );
    return d;
  });
  return database;
}
export async function loadSnapshot(): Promise<Snapshot | null> {
  const d = await db();
  // A single SELECT gives a consistent snapshot of both record scopes.
  const rows = await d.getAllAsync<{ scope: string; value: string }>(
    "SELECT scope, value FROM preparation",
  );
  if (!rows.length) return null;
  const settings = rows.find((r) => r.scope === "settings");
  if (!settings) throw new Error("Saved settings are missing.");
  const data = JSON.parse(settings.value);
  return decodeSnapshot(
    JSON.stringify({
      ...data,
      state: {
        ...data.state,
        personal: JSON.parse(
          rows.find((r) => r.scope === "personal")?.value ?? "null",
        ),
        sample: JSON.parse(
          rows.find((r) => r.scope === "demo")?.value ?? "null",
        ),
      },
    }),
  );
}
export async function saveSnapshot(
  snapshot: Snapshot,
  expectedRevision: number,
): Promise<void> {
  const d = await db();
  await d.withExclusiveTransactionAsync(async (tx) => {
    const old = await tx.getFirstAsync<{ value: string }>(
      "SELECT value FROM preparation WHERE scope = ?",
      "settings",
    );
    if ((old ? JSON.parse(old.value).revision : 0) !== expectedRevision)
      throw new Error("Data changed elsewhere. Retry your change.");
    const { personal, sample, ...settings } = snapshot.state;
    for (const [scope, value] of [
      ["settings", JSON.stringify({ ...snapshot, state: settings })],
      ["personal", JSON.stringify(personal)],
      ["demo", JSON.stringify(sample)],
    ])
      await tx.runAsync(
        "INSERT INTO preparation(scope,value) VALUES (?,?) ON CONFLICT(scope) DO UPDATE SET value=excluded.value",
        scope,
        value,
      );
  });
}
