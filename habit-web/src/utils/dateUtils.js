export function getLast7Days(baseDate = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}
