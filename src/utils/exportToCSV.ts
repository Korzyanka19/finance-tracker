import type { Transaction } from "../components/TransactionItem";

export function exportToCSV(transactions: Transaction[]) {
  const headers = ["ID", "Название", "Сумма", "Категория", "Тип", "Дата"];
  const rows = transactions.map((t) => [
    t.id,
    t.title,
    t.amount,
    t.category,
    t.type === "income" ? "Доход" : "Расход",
    t.date,
  ]);
  const csvContent =
    "\ufeff" +
    [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `finance_report_${new Date().toLocaleDateString()}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
