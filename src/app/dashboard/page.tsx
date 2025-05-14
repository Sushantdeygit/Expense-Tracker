// eslint-disable-next-line @typescript-eslint/no-explicit-any
"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { CalendarIcon, HomeIcon, PlusIcon, WalletIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

type Expense = {
  _id: string;
  label: string;
  amount: number;
  date: string;
  direction: string;
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("Rapido");
  const [direction, setDirection] = useState("HomeToOffice");
  const [total, setTotal] = useState(0);
  const [limit] = useState(5000); // default limit

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    async function fetchExpenses() {
      const res = await fetch(`/api/user-expenses?userId=${userId}`);
      const data = await res.json();
      setExpenses(data);
      const totalSpent = data.reduce(
        (acc: number, exp: Expense) => acc + exp.amount,
        0
      );
      setTotal(totalSpent);
    }

    if (userId) fetchExpenses();
  }, [userId]);

  const addExpense = async () => {
    if (!amount || Number(amount) <= 0) return;

    const res = await fetch("/api/expenses", {
      method: "POST",
      body: JSON.stringify({
        userId,
        label,
        direction,
        amount: Number(amount),
        date: new Date(),
      }),
    });
    const newExp = await res.json();
    setExpenses((prev) => [...prev, newExp]);
    setTotal((prev) => prev + newExp.amount);
    setAmount("");
  };

  // Prepare chart data - group expenses by date
  const chartData = expenses.reduce((acc: any[], expense: Expense) => {
    const date = new Date(expense.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const existingDate = acc.find((item) => item.date === date);

    if (existingDate) {
      existingDate.amount += expense.amount;
    } else {
      acc.push({ date, amount: expense.amount });
    }

    return acc;
  }, []);

  // Sort chart data by date
  chartData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate percentage of limit used
  const percentUsed = Math.min(Math.round((total / limit) * 100), 100);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Travel Allowance Tracker
          </h1>
          <Button size="sm">
            <WalletIcon className="mr-2 h-4 w-4" />
            Set Budget
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <WalletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{total.toLocaleString()}
              </div>
              <Progress className="mt-2" value={percentUsed} />
              <p className="text-xs text-muted-foreground mt-2">
                {percentUsed}% of ₹{limit.toLocaleString()} limit used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Remaining Budget
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{Math.max(0, limit - total).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                For the current month
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
              <CardDescription>Record your travel expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                <Select value={label} onValueChange={setLabel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Transport Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rapido">Rapido</SelectItem>
                    <SelectItem value="Metro">Metro</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HomeToOffice">Home to Office</SelectItem>
                    <SelectItem value="OfficeToHome">Office to Home</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Button onClick={addExpense}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Expense History</CardTitle>
              <CardDescription>Your recent travel expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transport</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground"
                      >
                        No expenses recorded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.slice(0, 5).map((exp) => (
                      <TableRow key={exp._id}>
                        <TableCell className="font-medium">
                          {exp.label}
                        </TableCell>
                        <TableCell>
                          {exp.direction === "HomeToOffice" ? (
                            <div className="flex items-center">
                              <HomeIcon className="mr-1 h-3 w-3" /> → Office
                            </div>
                          ) : (
                            <div className="flex items-center">
                              Office → <HomeIcon className="ml-1 h-3 w-3" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(exp.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{exp.amount}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {expenses.length > 5 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Spending Overview</CardTitle>
              <CardDescription>Daily expense breakdown</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px]">
                <div className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis
                        tickFormatter={(value) => `₹${value}`}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <Bar
                        dataKey="amount"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
