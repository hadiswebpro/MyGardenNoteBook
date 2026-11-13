export const gardenColors = [
  // Soft, readable colors for notes and journals
  "#e8d8d3",
  "#f0d9dc",
  "#f1e1d2",
  "#e4e8d5",
  "#dce8df",
  "#e5e0ef",
  "#dce7ed",
  "#eee8d8",
  // Keep the original deeper project colors available
  "#702b35",
  "#a8323e",
  "#a66a3f",
  "#68734a",
  "#394b35",
  "#b8a27b",
];

const darkSwatches = new Set(["#702b35", "#a8323e", "#a66a3f", "#68734a", "#394b35"]);

export function getGardenTextColor(background: string): string {
  return darkSwatches.has(background.toLowerCase()) ? "#fff8ef" : "#39352f";
}
