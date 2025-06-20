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
