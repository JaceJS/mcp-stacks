const categoryClass: Record<string, string> = {
  docs: "pill-docs",
  documentation: "pill-docs",
  dev: "pill-dev",
  "dev-tools": "pill-dev",
  "dev tools": "pill-dev",
  development: "pill-dev",
  database: "pill-database",
  db: "pill-database",
  search: "pill-search",
  monitoring: "pill-monitoring",
  observability: "pill-monitoring",
  ai: "pill-ai",
  cloud: "pill-cloud",
  infrastructure: "pill-cloud",
};

export function getPillClass(category: string | null): string {
  if (!category) return "pill-default";
  return categoryClass[category.toLowerCase()] ?? "pill-default";
}
