export function validateSuggestions(
  raw: string,
): { name: string; reason: string }[] {
  const data = JSON.parse(raw);
  if (!Array.isArray(data.items) || data.items.length > 24)
    throw new Error("AI returned an invalid checklist.");
  const seen = new Set<string>();
  return data.items.map((i: unknown) => {
    if (
      !i ||
      typeof i !== "object" ||
      !("name" in i) ||
      !("reason" in i) ||
      typeof i.name !== "string" ||
      typeof i.reason !== "string" ||
      !i.name.trim() ||
      !i.reason.trim() ||
      i.name.length > 80 ||
      i.reason.length > 240
    )
      throw new Error("AI returned invalid item details.");
    const name = i.name.trim(),
      key = name.toLowerCase();
    if (seen.has(key)) throw new Error("AI returned duplicate items.");
    seen.add(key);
    return { name, reason: i.reason.trim() };
  });
}
