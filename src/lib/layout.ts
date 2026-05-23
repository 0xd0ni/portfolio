export function distributeIntoColumns(
  items: string[],
  columnCount: number,
): string[][] {
  const columns: string[][] = Array.from({ length: columnCount }, () => [])
  items.forEach((item, i) => columns[i % columnCount].push(item))
  return columns
}
