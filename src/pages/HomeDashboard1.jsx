import React, { useEffect } from "react";
import Dashboard from "../layouts/Dashboard";
import { fetchEmployees } from "../features/employee/employeSlice";
import { fetchTransactions as fetchSells } from "../features/sell/sellSlice";
import { fetchTransactions } from "../features/transaction/transactionSlice";
import { fetchBudgets } from "../features/budget/budgetSlice";
import { useDispatch, useSelector } from "react-redux";
import GraphComponent from "../components/GraphComponent";
import PieChartComponent from "../components/pieChartComponent.jsx";


export const HomeDashboard1 = () => {
  const dispatch = useDispatch();
  const employeeList = useSelector((state) => state.employee.list);
  const employeeStatus = useSelector((state) => state.employee.status);
  const employeeError = useSelector((state) => state.employee.error);

  const sellList = useSelector((state) => state.sell.list);
  const sellStatus = useSelector((state) => state.sell.status);

  const transactionList = useSelector((state) => state.transaction.list);
  const transactionStatus = useSelector((state) => state.transaction.status);

  const budgetList = useSelector((state) => state.budget.list);
  const budgetStatus = useSelector((state) => state.budget.status);

  useEffect(() => {
    if (employeeStatus === "idle") {
      dispatch(fetchEmployees());
    }
    if (sellStatus === "idle") {
      dispatch(fetchSells());
    }
    if (transactionStatus === "idle") {
      dispatch(fetchTransactions());
    }
    if (budgetStatus === "idle") {
      dispatch(fetchBudgets());
    }
  }, [employeeStatus, sellStatus, transactionStatus, dispatch]);

  const calculateDifference = (sellList, transactionList) => {
    const sellTotal = sellList.reduce((sum, item) => sum + item.total_price, 0);
    const transactionTotal = transactionList.reduce(
      (sum, item) => sum + item.total_price,
      0
    );
    const difference = sellTotal - transactionTotal;
    return difference;
  };

  const sumBudget = (budgetList) => {
    const budgetTotal = budgetList.reduce(
      (sum, item) => sum + item.real_budget,
      0
    );
    return budgetTotal;
  };

  const sumPrevesion = (budgetList) => {
    const budgetTotal = budgetList.reduce(
      (sum, item) => sum + item.previsions,
      0
    );
    return budgetTotal;
  };

  return (
    <Dashboard>
      <div className="h-full col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-full p-4 rounded-lg shadow-md  dark:shadow-gray-700">
          <h2 className="text-sm">Nombre d'employés</h2>
          <p className="text-3xl">{employeeList.length}</p>
        </div>

        <div className=" p-4 rounded-lg shadow-md dark:shadow-gray-700">
          <h2 className="text-sm">Profit</h2>
          <p className="text-3xl">
            {calculateDifference(sellList, transactionList)} CFA
          </p>
        </div>

        <div className="p-4 rounded-lg shadow-md dark:shadow-gray-700">
          <h2 className="text-sm">Budget Total</h2>
          <p className="text-3xl">{sumBudget(budgetList)} CFA</p>
        </div>

        <div className=" p-4 rounded-lg shadow-md dark:shadow-gray-700">
          <h2 className="text-sm">Budget Prévensif</h2>
          <p className="text-3xl">{sumPrevesion(budgetList)} CFA</p>
        </div>

        <div className="col-span-1 md:col-span-1 p-4 rounded-lg shadow-md dark:shadow-gray-700">
          <GraphComponent
            sellList={sellList}
            transactionList={transactionList} />
        </div>

        <div className="col-span-1 md:col-span-1 rounded-lg shadow-md dark:shadow-gray-700 flex justify-center items-center w-full">
          <div className="max-h-full  max-w-full">
              <PieChartComponent budgetData={budgetList} />
            </div>
        </div>
      </div>
    </Dashboard>
  );
};
