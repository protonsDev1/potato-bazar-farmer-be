export function parseFilters(query: Record<string, any>): Record<string, any> {
  const filters: Record<string, any> = {};

  for (const key in query) {
    if (!key.startsWith("filter[")) continue;

    const match = key.match(/^filter\[([^\]]+)](?:\[(\d+)])?$/);
    if (!match) continue;

    const [, filterKey, index] = match;

    if (index !== undefined) {
      if (!filters[filterKey]) filters[filterKey] = [];
      filters[filterKey][Number(index)] = query[key];
    } else {
      filters[filterKey] = query[key];
    }
  }

  return filters;
}

export const hasValue = (val: any) =>
  val !== undefined && val !== "" && val !== null;

export const buildDate = (dateISO: string | Date, time: string) => {
  const dateStr =
    dateISO instanceof Date
      ? dateISO.toISOString().split("T")[0]
      : dateISO.split("T")[0];

  const [hh, mm, ss] = (time ?? "00:00:00").split(":").map(Number);
  const [y, m, d] = dateStr.split("-").map(Number);

  return new Date(Date.UTC(y, m - 1, d, hh, mm, ss || 0));
};
