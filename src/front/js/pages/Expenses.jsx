import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";
import CreateDebtModal from "../component/CreateDebtModal.jsx";
import LiquidateDebtModal from "../component/LiquidateDebtModal.jsx";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [debts, setDebts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLiquidateModalOpen, setIsLiquidateModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const { actions } = useAppContext();

  useEffect(() => {
    const roomie_id = localStorage.getItem("roomie_id");
    const fetchData = async () => {
      try {
        const expensesData = await actions.getExpensesByRoomieId(roomie_id);
        setExpenses(expensesData);
        const debtsData = await actions.getDebtsByRoomieId(roomie_id);
        setDebts(debtsData);
      } catch (error) {
        console.error("Error al obtener los gastos y deudas:", error);
      }
    };
    fetchData();
  }, [actions]);

  const handleOpenModalCreateDebt = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setIsCreateModalOpen(true);
  };

  const handleCloseModalCreateDebt = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenModalLiquidateDebt = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setIsLiquidateModalOpen(true);
  };

  const handleCloseModalLiquidateDebt = () => {
    setIsLiquidateModalOpen(false);
  };

  return (
    <div className="w-screen flex justify-center items-center h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 max-w-screen-md p-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white rounded-[50px] overflow-hidden shadow-xl transition-all mx-2 sm:mx-4 mb-4 p-12 md:p-8 w-full"
          >
            <h1 className="text-xl md:text-2xl text-gray-700 font-bold mb-6 text-center">
              {expense.name}
            </h1>
            <div className="flex justify-center">
              <button
                type="button"
                className="bg-indigo-100 hover:bg-indigo-300 text-gray-600 font-bold py-2 px-4 rounded-xl mr-2"
                onClick={() => handleOpenModalLiquidateDebt(expense.id)}
              >
                Liquidar Deuda
              </button>
              <button
                type="button"
                className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl mr-2"
                onClick={() => handleOpenModalCreateDebt(expense.id)}
              >
                Crear Deuda
              </button>
            </div>
          </div>
        ))}
      </div>
      {isCreateModalOpen && (
        <CreateDebtModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModalCreateDebt}
          selectedExpenseId={selectedExpenseId}
        />
      )}

      {isLiquidateModalOpen && (
        <LiquidateDebtModal
          isOpen={isLiquidateModalOpen}
          onClose={handleCloseModalLiquidateDebt}
          selectedExpenseId={selectedExpenseId}
        />
      )}
    </div>
  );
};

export default Expenses;
