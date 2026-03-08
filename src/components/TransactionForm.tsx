import React, { useState } from "react";
import type { Transaction } from "./TransactionItem";
interface Props {
  onSave: (t: Transaction) => void;
  onCancel?: () => void;
  initial?: Partial<Transaction>;
}

export function TransactionForm({ onSave, onCancel, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [amount, setAmount] = useState<number>(initial?.amount ?? 0);
  const [category, setCategory] = useState(initial?.category ?? "");
  const [type, setType] = useState<"income" | "expense">(
    initial?.type ?? "expense",
  );
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().slice(0, 10),
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = initial?.id ?? Date.now();
    onSave({
      id,
      title: title.trim(),
      amount: Number(amount),
      category: category.trim(),
      type,
      date,
    });
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-2xl shadow-sm space-y-3"
    >
      <div>
        <label className="block text-sm text-gray-600">Название</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full mt-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Например: Зарплата"
        ></input>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm text-gray-600">Сумма</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            className="w-full mt-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
            min="0"
            step="0.01"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600">Категория</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-300"
            placeholder="Еда, Работа..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600">Тип</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="p-2 border-gray-200 rounded-md"
        >
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="ml-auto p-2 border border-gray-200 rounded-md"
        />
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Отмена
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}
