import { useMemo, useState, useEffect, useRef } from "react";
import type { Transaction } from "./TransactionItem";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatSmart } from "../utils/formatters";
interface Props {
  transactions: Transaction[];
}

const COLORS = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
];

export const AnalyticsChart: React.FC<Props> = ({ transactions }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isFullChart, setIsFullChart] = useState(false);
  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        setDimensions({
          width: chartContainerRef.current.offsetWidth,
          height: chartContainerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [transactions]);

  const chartData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");


    const grouped = expenses.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    let processedData = Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    }));
    processedData.sort((a, b) => b.value - a.value);
    if (!isFullChart && processedData.length > 3) {
      const topCategories = processedData.slice(0, 2);
      const otherValue = processedData
        .slice(2)
        .reduce((sum, item) => sum + item.value, 0);
      if (otherValue > 0) {
        processedData = [
          ...topCategories,
          { name: "Другое", value: otherValue },
        ];
      } else {
        processedData = topCategories;
      }
    }
    return processedData;
  }, [transactions, isFullChart]);

  if (
    chartData.length === 0 ||
    dimensions.width === 0 ||
    dimensions.height === 0
  )
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Аналитика расходов
        </h3>
        <div
          ref={chartContainerRef}
          className="h-64 w-full flex items-center justify-center text-gray-400"
        >
          {chartData.length === 0
            ? "Добавьте расходы для отображения графика"
            : "Загрузка графика..."}
        </div>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg text-center font-bold text-gray-800 mb-4">
        Аналитика расходов
      </h3>
      <div ref={chartContainerRef} className="h-64 w-full">
        <ResponsiveContainer
          width={dimensions.width}
          height={dimensions.height}
          debounce={1}
        >
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: unknown) => [
                `${formatSmart(Number(value))} ₽`,
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: "14px" }}
              formatter={(value) =>
                value.length > 15 ? `${value.substring(0, 12)}...` : value
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {transactions.filter((t) => t.type === "expense").length > 3 && (
        <button
          onClick={() => setIsFullChart(!isFullChart)}
          className="w-full mt-4 text-xs text-indigo-800 border-t pt-2 hover:underline"
        >
          {isFullChart ? "Свернуть все категории" : "Показать все категории"}
        </button>
      )}
    </div>
  );
};
