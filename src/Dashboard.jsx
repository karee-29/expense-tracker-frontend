
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";

function Dashboard({ setIsLoggedIn }) {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [filterCategory,
    setFilterCategory] =
    useState("All");

  const token =
    localStorage.getItem("token");

  // =====================
  // TOTAL
  // =====================

  const total = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
  );

  const today = new Date();

const todayExpenses = expenses.filter(
  (expense) => {
    const expenseDate =
      new Date(expense.createdAt);

    return (
      expenseDate.toDateString() ===
      today.toDateString()
    );
  }
);

const todayTotal =
  todayExpenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
  );

const expenseCount =
  expenses.length;

  const [budget, setBudget] =
  useState(
    Number(
      localStorage.getItem("budget")
    ) || 0
  );

const remaining =
  budget - total;

  // =====================
  // PIE CHART DATA
  // =====================

  const categoryData = Object.values(
    expenses.reduce((acc, expense) => {
      const category =
        expense.category ||
        "Uncategorized";

      if (!acc[category]) {
        acc[category] = {
          name: category,
          value: 0,
        };
      }

      acc[category].value += Number(
        expense.amount
      );

      

      return acc;
    }, {})
  );

  const topCategory =
  categoryData.length > 0
    ? categoryData.reduce(
        (max, category) =>
          category.value > max.value
            ? category
            : max
      )
    : null;

    const categoryBarData = Object.values(
  expenses.reduce((acc, expense) => {
    const category =
      expense.category || "Uncategorized";

    if (!acc[category]) {
      acc[category] = {
        category,
        amount: 0,
      };
    }

    acc[category].amount += Number(
      expense.amount
    );

    return acc;
  }, {})
);

console.log(categoryBarData);

const monthlyData = Object.values(
  expenses.reduce((acc, expense) => {
    const month = new Date(
      expense.createdAt
    ).toLocaleString("default", {
      month: "short",
    });

    if (!acc[month]) {
      acc[month] = {
        month,
        amount: 0,
      };
    }

    acc[month].amount += Number(
      expense.amount
    );

    return acc;
  }, {})
);

  // =====================
  // CATEGORY FILTERS
  // =====================

  const categories = [
    "All",
    ...new Set(
      expenses.map(
        (expense) =>
          expense.category ||
          "Uncategorized"
      )
    ),
  ];

  // =====================
  // SEARCH + FILTER
  // =====================

  const filteredExpenses =
    expenses.filter((expense) => {
      const matchesSearch =
        expense.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        filterCategory === "All" ||
        (expense.category ||
          "Uncategorized") ===
          filterCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // =====================
  // FETCH EXPENSES
  // =====================

const fetchExpenses = async () => {
  try {
    const token =
      localStorage.getItem("token");

        console.log("TOKEN:", token);

    const res = await axios.get(
      "https://expense-tracker-backend-x4ur.onrender.com/expenses",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

console.log("DATA:", res.data);

    setExpenses(
      Array.isArray(res.data)
        ? res.data
        : []
    );
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchExpenses();
}, []);

  // =====================
  // ADD EXPENSE
  // =====================
const addExpense = async () => {
try {
const token = localStorage.getItem("token");

await axios.post(
  "https://expense-tracker-backend-x4ur.onrender.com/expenses",
  {
    name,
    amount,
    category,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

setName("");
setAmount("");
setCategory("");

fetchExpenses();

} catch (error) {
console.log(error);
}
};

  // =====================
  // UPDATE EXPENSE
  // =====================

const updateExpense = async () => {
try {
const token = localStorage.getItem("token");

await axios.put(
  `https://expense-tracker-backend-x4ur.onrender.com/expenses/${editingId}`,
  {
    name,
    amount,
    category,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

setEditingId(null);
setName("");
setAmount("");
setCategory("");

fetchExpenses();

} catch (error) {
console.log(error);
}
};

  // =====================
  // DELETE EXPENSE
  // =====================

const deleteExpense = async (id) => {
try {
const token = localStorage.getItem("token");

await axios.delete(
  `https://expense-tracker-backend-x4ur.onrender.com/expenses/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

fetchExpenses();

} catch (error) {
console.log(error);
}
};

  // =====================
  // EXPORT EXCEL
  // =====================

  const exportToExcel = () => {
    const data = expenses.map(
      (expense) => ({
        Name: expense.name,
        Amount: expense.amount,
        Category:
          expense.category ||
          "Uncategorized",
        Date: expense.createdAt
          ? new Date(
              expense.createdAt
            ).toLocaleString()
          : "",
      })
    );

    const COLORS = [
  "#00E676",
  "#2979FF",
  "#FF9100",
  "#E91E63",
  "#9C27B0",
  "#FFD600",
  "#F44336",
  "#00BCD4",
]

    const worksheet =
      XLSX.utils.json_to_sheet(
        data
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Expenses"
    );

    XLSX.writeFile(
      workbook,
      "expenses.xlsx"
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold">
            Expense Tracker
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");

              setIsLoggedIn(false);
            }}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
<div className="bg-slate-900 p-5 rounded-2xl mb-6 shadow-lg">
  <p className="text-slate-400 text-sm">
    Logged in as
  </p>

  <h2 className="text-3xl font-bold text-green-400">
    {
JSON.parse(
  localStorage.getItem("user") || "{}"
)?.name
    }
  </h2>

  <p className="text-slate-500">
    {
JSON.parse(
  localStorage.getItem("user") || "{}"
)?.email
    }
  </p>
</div>

<div className="bg-slate-900 p-6 rounded-2xl mb-6 shadow-lg">
  <h2 className="text-2xl font-bold mb-4">
    Monthly Budget
  </h2>

  <input
    type="number"
    placeholder="Enter Budget"
    value={budget}
    onChange={(e) => {
      setBudget(
        Number(e.target.value)
      );

      localStorage.setItem(
        "budget",
        e.target.value
      );
    }}
    className="bg-slate-800 p-3 rounded-lg border border-slate-700"
  />

  <div className="mt-4">
    <p>
      Budget: ₹
      {budget.toLocaleString()}
    </p>

    <p>
      Spent: ₹
      {total.toLocaleString()}
    </p>

    <p
      className={
        remaining >= 0
          ? "text-green-400"
          : "text-red-400"
      }
    >
      Remaining: ₹
      {remaining.toLocaleString()}
    </p>

    <div className="w-full bg-slate-700 rounded-full h-4 mt-4">
      <div
        className="bg-green-500 h-4 rounded-full"
        style={{
          width: `${
            budget > 0
              ? Math.min(
                  (total / budget) *
                    100,
                  100
                )
              : 0
          }%`,
        }}
      />
    </div>
  </div>
</div>

        {/* FORM */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Expense Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="bg-slate-800 p-3 rounded-lg border border-slate-700"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="bg-slate-800 p-3 rounded-lg border border-slate-700"
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="bg-slate-800 p-3 rounded-lg border border-slate-700"
            />
          </div>

          <div className="mt-5">
            {editingId ? (
              <button
                onClick={updateExpense}
                className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg font-semibold"
              >
                Update Expense
              </button>
            ) : (
              <button
                onClick={addExpense}
                className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-semibold"
              >
                Add Expense
              </button>
            )}
          </div>
        </div>

        {/* TOTAL CARD */}
        <div className="bg-slate-900 rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-3xl font-bold">
            Total: ₹
            {total.toLocaleString()}
          </h2>
        </div>

        {/* EXPORT */}
        <div className="mb-8">
          <button
            onClick={exportToExcel}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg font-semibold"
          >
            Export To Excel
          </button>
        </div>

<div className="bg-slate-900 rounded-2xl p-6 mb-8 shadow-lg">
  <h2 className="text-2xl font-bold mb-4">
    Category Spending
  </h2>

  <div className="h-80">
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <BarChart
  data={categoryBarData}
>
        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis dataKey="category" />

        <YAxis />

        <Tooltip />

        <Bar
  dataKey="amount"
  fill="#00ff88"
  radius={[8, 8, 0, 0]}
/>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

        {/* PIE CHART */}
        <div className="bg-slate-900 rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Category Breakdown
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
  data={categoryData}
  dataKey="value"
  nameKey="name"
  outerRadius={100}
>
  {categoryData.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={COLORS[index % COLORS.length]}
    />
  ))}
</Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-slate-900 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="bg-slate-800 p-3 rounded-lg border border-slate-700"
            />

            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(
                  e.target.value
                )
              }
              className="bg-slate-800 p-3 rounded-lg border border-slate-700"
            >
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* EXPENSE LIST */}
        <div className="grid gap-4">
          {filteredExpenses.map(
            (expense) => (
              <div
                key={expense._id}
                className="bg-slate-900 rounded-2xl p-5 shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:justify-between">

                  <div>
                    <h3 className="text-2xl font-bold">
                      {expense.name}
                    </h3>

                    <p className="text-green-400 text-xl">
                      ₹{expense.amount}
                    </p>

                    <p className="text-slate-400">
                      {expense.category ||
                        "Uncategorized"}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {expense.createdAt
                        ? new Date(
                            expense.createdAt
                          ).toLocaleString()
                        : "No Date Available"}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() => {
                        setEditingId(
                          expense._id
                        );

                        setName(
                          expense.name
                        );

                        setAmount(
                          expense.amount
                        );

                        setCategory(
                          expense.category ||
                            ""
                        );
                      }}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteExpense(
                          expense._id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;

