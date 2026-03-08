import { useMemo, useState } from "react";
import type { Transaction } from "./components/TransactionItem";
import { TransactionItem } from "./components/TransactionItem";
import { TransactionForm } from "./components/TransactionForm";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { TransactionFilter } from "./components/TransactionFilter";
import { sortTransactions } from "./utils/sortTransactions";
import { type Filter } from "./components/TransactionFilter";
import { Wallet, Pencil, Trash2 } from "lucide-react";
import { AnalyticsChart } from "./components/AnalyticsChart";
import { exportToCSV } from "./utils/exportToCSV";
import { formatSmart } from "./utils/formatters";
const initialData: Transaction[] = [
  {
    id: 1,
    title: "Зарплата",
    amount: 5000,
    category: "Работа",
    type: "income",
    date: "2023-10-01",
  },
  {
    id: 2,
    title: "Продукты",
    amount: 2500,
    category: "Еда",
    type: "expense",
    date: "2023-10-02",
  },
  {
    id: 3,
    title: "Подписка Netflix",
    amount: 800,
    category: "Развлечения",
    type: "expense",
    date: "2023-10-03",
  },
  {
    id: 4,
    title: "Фриланс",
    amount: 15000,
    category: "Работа",
    type: "income",
    date: "2023-10-04",
  },
  {
    id: 5,
    title: "Акции",
    amount: 3000,
    category: "Работа",
    type: "income",
    date: "2023-10-05",
  },
];
function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "transactions",
    initialData,
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showFullBalance, setShowFullBalance] = useState(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const visibleTransactions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = transactions.filter((t) => {
      if (filter != "all" && t.type != filter) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });
    return sortTransactions(filtered, sortBy, sortDir);
  }, [transactions, filter, query, sortBy, sortDir]);

  function handleSave(t: Transaction) {
    setTransactions((prev) => {
      const exists = prev.find((p) => p.id === t.id);
      if (exists) return prev.map((p) => (p.id === t.id ? t : p));
      return [t, ...prev];
    });
    setShowForm(false);
    setEditingId(null);
  }
  function handleDelete(id: number) {
    if (!confirm("Улалить транзакцию?")) return;
    setTransactions((prev) => prev.filter((p) => p.id !== id));
  }
  function handleEdit(t: Transaction) {
    setEditingId(t.id);
    setShowForm(true);
  }
  function handleCancelEdit() {
    setShowForm(false);
    setEditingId(null);
  }
  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };
  const totalIncomeTransactions = useMemo(() => {
    return transactions.reduce(
      (acc, t) => (t.type === "income" ? acc + t.amount : acc),
      0,
    );
  }, [transactions]);

  const totalExpenseTransactions = useMemo(() => {
    return transactions.reduce(
      (acc, t) => (t.type === "expense" ? acc + t.amount : acc),
      0,
    );
  }, [transactions]);
  const totalTransactions = useMemo(
    () => totalIncomeTransactions - totalExpenseTransactions,
    [totalIncomeTransactions, totalExpenseTransactions],
  );
  return (
    <>
      <div className="min-h-screen bg-indigo-200 p-2 md:p-10 flex justify-center">
        <div className="w-full px-4 md:max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Мои финансы
          </h1>
          <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-2">
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="px-3 py-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full sm:w-auto transition-colors cursor-pointer"
            >
              {showForm ? "Закрыть" : "Добавить"}
            </button>
            <button
              onClick={() => {
                if (!confirm("Вернуть базовые транзакции?")) return;
                setTransactions(initialData);
              }}
              className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 w-full sm:w-auto transition-colors cursor-pointer"
            >
              К заводским
            </button>
            <button
              onClick={() => {
                if (!confirm("Сбросить все транзакции?")) return;
                setTransactions([]);
              }}
              className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 w-full sm:w-auto transition-colors cursor-pointer"
            >
              Сбросить
            </button>
            <button
              onClick={() => exportToCSV(transactions)}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full sm:w-auto cursor-pointer"
            >
              Экспорт
            </button>
            <div className="py-2 max-w-3xl">
              <TransactionFilter
                filter={filter}
                onFilterChange={setFilter}
                query={query}
                onQueryChange={setQuery}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortDir={sortDir}
                onSortDirToggle={() =>
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                }
              />
            </div>
          </div>
          {showForm && !editingId && (
            <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border-2 border-indigo-100">
              <h2 className="text-lg font-bold mb-3 text-indigo-600">
                Новая транзакция
              </h2>
              <TransactionForm
                key="new-transaction"
                onSave={handleSave}
                onCancel={() => {
                  setShowForm(false);
                }}
              />
            </div>
          )}
          <AnalyticsChart transactions={transactions} />
          {visibleTransactions.length > 0 && (
            <div className="flex justify-end mb-2">
              <button
                onClick={() => {
                  if (expandedIds.length === visibleTransactions.length) {
                    setExpandedIds([]);
                  } else {
                    setExpandedIds(visibleTransactions.map((t) => t.id));
                  }
                }}
                className="text-[12px] text-indigo-600 hover:text-indigo-900 uppercase font-bold tracking-widest"
              >
                {expandedIds.length === visibleTransactions.length
                  ? "Свернуть всё"
                  : "Развернуть всё"}
              </button>
            </div>
          )}
          <div className="space-y-3">
            {transactions.length === 0 && (
              <p className="text-center text-gray-500">Транзакций пока нет</p>
            )}
            {visibleTransactions.map((t) =>
              editingId === t.id ? (
                <div key={t.id} className="flex flex-col gap-3">
                  <TransactionForm
                    key={t.id}
                    initial={t}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                  />
                </div>
              ) : (
                <div key={t.id} className="flex items-start gap-3 flex-1 ">
                  <div className="flex-1 min-w-0">
                    <TransactionItem
                      data={t}
                      isExpanded={expandedIds.includes(t.id)}
                      onToggle={() => toggleExpand(t.id)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-sm text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                      title="Редактировать"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-sm text-red-300 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Удалить"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
          <div
            className="mt-8 p-6 bg-linear-to-br from-indigo-600 to-violet-700 rounded-3xl text-white shadow-xl shadow-indigo-200 
            cursor-pointer select-none hover:to-violet-800 transition-colors"
            onClick={() => setShowFullBalance(!showFullBalance)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-indigo-100 text-sm font-medium opacity-80">
                  Общий баланс
                </p>
                <p className="text-4xl font-black tracking-tight mt-1">
                  {showFullBalance
                    ? totalTransactions.toLocaleString("ru-RU")
                    : formatSmart(totalTransactions)}
                  <span className="text-3xl font-normal opacity-70 pl-1">
                    ₽
                  </span>
                </p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <Wallet size={24} className="text-white" />
              </div>
            </div>
            <div className="flex gap-4 border-t border-white/10 pt-4">
              <div className="flex-1">
                <p className="text-indigo-100 text-[10px] uppercase tracking-wider">
                  Доходы
                </p>
                <p className="text-lg font-bold text-green-300">
                  +
                  {showFullBalance
                    ? totalIncomeTransactions.toLocaleString("ru-RU")
                    : formatSmart(totalIncomeTransactions)}{" "}
                  ₽
                </p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex-1 text-right">
                <p className="text-indigo-100 text-[10px] uppercase tracking-wider">
                  Расходы
                </p>
                <p className="text-lg font-bold text-red-300">
                  -
                  {showFullBalance
                    ? totalExpenseTransactions.toLocaleString("ru-RU")
                    : formatSmart(totalExpenseTransactions)}{" "}
                  ₽
                </p>
              </div>
            </div>
            <p className="text-[10px] opacity-50 mt-1">
              {showFullBalance
                ? "Нажмите, чтобы скрыть"
                : "Нажмите, чтобы увидеть точно"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
