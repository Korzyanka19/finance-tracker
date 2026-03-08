import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatSmart } from "../utils/formatters";
export interface Transaction {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
}

interface Props {
  data: Transaction;
  isExpanded: boolean;
  onToggle: () => void;
}

export function TransactionItem({ data, isExpanded, onToggle }: Props) {
  const isIncome = data.type === "income";
  const sign = data.type === "income" ? "+" : "-";
  const colorClass = isIncome ? "text-green-600" : "text-red-600";
  const bgColorClass = isIncome ? "bg-green-50" : "bg-red-50";
  const Icon = isIncome ? ArrowUpRight : ArrowDownLeft;
  const displayAmount = `${sign}${formatSmart(data.amount)} ₽`;
  const date = new Date(data.date).toLocaleDateString("ru-RU");
  const displayDate = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "numeric",
  }).format(new Date(data.date));

  return (
    <div
      className="bg-white py-4 px-2 rounded-2xl shadow-sm border border-gray-200 items-center hover:shadow-md transition-all group
        cursor-pointer "
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className={`p-2.5 rounded-xl ${bgColorClass} ${colorClass}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate max-w-25 sm:max-w-45">
              {data.title}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1 truncate max-w-30">
              <Wallet size={12} />
              <span className="truncate max-w-25 sm:max-w-37.5">
                {data.category}
              </span>{" "}
              · {displayDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 mb-3">
          <div className={`font-bold ${colorClass} ml-4`}>{displayAmount}</div>
          <div className="text-gray-300">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 pl-4 border-t border-dashed border-gray-100 animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="min-w-0 grid grid-cols-2 gap-y-3 gap-x-1 text-[11px]">
            <div>
              <span className="text-gray-400 block uppercase text-[9px] font-bold">
                Полное название
              </span>
              <span className="text-gray-700 wrap-break-word whitespace-normal">
                {data.title}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block uppercase text-[9px] font-bold">
                Точная сумма
              </span>
              <span className="text-gray-700">
                {data.amount.toLocaleString("ru-RU")} ₽
              </span>
            </div>
            <div>
              <span className="text-gray-400 block uppercase text-[9px] font-bold">
                Дата операции
              </span>
              <span className="text-gray-700">{date}</span>
            </div>
            <div>
              <span className="text-gray-400 block uppercase text-[9px] font-bold ">
                Категория
              </span>
              <span className="text-gray-700 wrap-break-word whitespace-normal">
                {data.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
