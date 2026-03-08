import type { Transaction } from "../components/TransactionItem";
export function sortTransactions(
  items: Transaction[],
  sortBy: "date" | "amount",
  sortDir: "asc" | "desc",
): Transaction[] {
  const copy = items.slice();
  copy.sort((a, b) => {
    if (sortBy === "date") {
      const ta = Date.parse(a.date);
      const tb = Date.parse(b.date);
      return sortDir === "asc" ? ta - tb : tb - ta;
    } else {
      return sortDir === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
  });
  return copy;
}
