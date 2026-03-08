import React from "react";

export type Filter = "all" | "income" | "expense";
export type SortBy = "date" | "amount";
export type SortDir = "asc" | "desc";

type Props = {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  query: string;
  onQueryChange: (q: string) => void;
  sortBy: SortBy;
  onSortByChange: (s: SortBy) => void;
  sortDir: SortDir;
  onSortDirToggle: () => void;
};

export const TransactionFilter: React.FC<Props> = React.memo(
  ({
    filter,
    onFilterChange,
    query,
    onQueryChange,
    sortBy,
    onSortByChange,
    sortDir,
    onSortDirToggle,
  }) => {
    return (
      <div className="mb-4">
        <div
          className="flex gap-2 mb-3 justify-between"
          role="toolbar"
          aria-label="Фильтры транзакций"
        >
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            aria-pressed={filter === "all"}
            className={`px-3 py-1 rounded-md cursor-pointer hover:opacity-80 ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 border"}`}
          >
            Все
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("income")}
            aria-pressed={filter === "income"}
            className={`px-3 py-1 rounded-md cursor-pointer hover:opacity-80 ${filter === "income" ? "bg-green-600 text-white" : "bg-white text-green-700"}`}
          >
            Доход
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("expense")}
            aria-pressed={filter === "expense"}
            className={`px-3 py-1 rounded-md cursor-pointer hover:opacity-80 ${filter === "expense" ? "bg-red-600 text-white" : "bg-white text-red-700"}`}
          >
            Расход
          </button>
        </div>
        <div className="flex gap-2 items-center justify-between flex-wrap">
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Поиск по названию или категории"
            aria-label="Поиск по транзакциям"
            className="flex-1 p-2 border rounded-md"
          />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortBy)}
            aria-label="Сортировка"
            className="p-2 border rounded-md cursor-pointer"
          >
            <option value="date">По дате</option>
            <option value="amount">По сумме</option>
          </select>
          <button
            type="button"
            onClick={onSortDirToggle}
            title="Переключить направление сортировки"
            className="px-3 py-1 rounded-md bg-gray-100 cursor-pointer"
            aria-label="Переключить направление сортировки"
          >
            {sortDir === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
    );
  },
);
TransactionFilter.displayName = "TransactionFilter";
