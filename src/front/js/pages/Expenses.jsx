import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";
import CreateDebtModal from "../component/CreateDebtModal.jsx";
import LiquidateDebtModal from "../component/LiquidateDebtModal.jsx";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [debtsPayer, setDebtsPayer] = useState([]);
  const [debtsDebtor, setDebtsDebtor] = useState([]);
  const [debtors, setDebtors] = useState([]);
  const [payers, setPayers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLiquidateModalOpen, setIsLiquidateModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [selectedDebtId, setSelectedDebtId] = useState("");
  const [selectedDebtAmount, setSelectedDebtAmount] = useState(0);
  const { actions, store } = useAppContext();

  useEffect(() => {
    const roomie_id = localStorage.getItem("roomie_id");
    const fetchData = async () => {
      try {
        const expensesData = await actions.getExpensesByRoomieId(roomie_id);
        setExpenses(expensesData);
        const debtsData = await actions.getDebtsByRoomieId(roomie_id);
        const debtsPendientesCobro = debtsData.filter(
          (debt) => debt.roomie_paying_id == roomie_id
        );
        setDebtsPayer(debtsPendientesCobro);
        const debtsPendientesPago = debtsData.filter(
          (debt) => debt.roomie_debtor_id == roomie_id
        );
        setDebtsDebtor(debtsPendientesPago);
        const debtorsTemp = [];
        for (const debt of debtsPendientesCobro) {
          const debtor = await actions.getRoomieById(debt.roomie_debtor_id);
          debtorsTemp.push(debtor);
        }
        setDebtors(debtorsTemp);
        const payersTemp = [];
        for (const debt of debtsPendientesPago) {
          const payer = await actions.getRoomieById(debt.roomie_paying_id);
          payersTemp.push(payer);
        }
        setPayers(payersTemp);
      } catch (error) {
        console.error("Error al obtener los gastos y deudas:", error);
      }
    };
    fetchData();
  }, [actions]);

  const handleOpenModalCreateDebt = (expenseId) => {
    setSelectedExpenseId(expenseId);
    store.setFilesInfo([]);
    setIsCreateModalOpen(true);
  };

  const handleCloseModalCreateDebt = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenModalLiquidateDebt = (debtId, debtAmount) => {
    setSelectedDebtId(debtId);
    setSelectedDebtAmount(debtAmount);
    setIsLiquidateModalOpen(true);
  };

  const handleCloseModalLiquidateDebt = () => {
    setIsLiquidateModalOpen(false);
  };

  const handleCreateDebtUpdate = async () => {
    const roomie_id = localStorage.getItem("roomie_id");
    const updatedDebts = await actions.getDebtsByRoomieId(roomie_id);
    setDebtsPayer(
      updatedDebts.filter((debt) => debt.roomie_paying_id == roomie_id)
    );
    const updatedExpenses = await actions.getExpensesByRoomieId(roomie_id);
    setExpenses(updatedExpenses);
  };

  const handleDebtPaid = async () => {
    const roomie_id = localStorage.getItem("roomie_id");
    const updatedDebts = await actions.getDebtsByRoomieId(roomie_id);
    setDebtsDebtor(
      updatedDebts.filter((debt) => debt.roomie_debtor_id == roomie_id)
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-10 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl p-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white rounded-[50px] overflow-hidden shadow-xl transition-all mx-2 sm:mx-4 mb-4 p-12 md:p-8 w-full max-h-70vh overflow-y-auto"
          >
            <h1 className="text-xl md:text-2xl text-gray-700 font-bold mb-6 text-center">
              {expense.name}
            </h1>
            <div className="flex justify-center">
              <button
                type="button"
                className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
                onClick={() => handleOpenModalCreateDebt(expense.id)}
              >
                Crear Deuda
              </button>
            </div>
          </div>
        ))}
        {debtsDebtor.map((debt) => (
          <div
            key={debt.id}
            className="bg-white rounded-[50px] overflow-hidden shadow-xl transition-all mx-2 sm:mx-4 mb-4 p-12 md:p-8 w-full"
          >
            <h1 className="text-xl md:text-2xl text-gray-700 font-bold mb-6 text-center">
              {debt.name}
            </h1>
            <div className="flex flex-col items-center">
              <p className="border border-gray-300 rounded-lg p-3 w-11/12">
                Debes {parseFloat(debt.amount).toFixed(2)}€ a{" "}
                {
                  payers.find((payer) => payer.id === debt.roomie_paying_id)
                    ?.first_name
                }
              </p>
            </div>
            <div className="flex justify-center pt-4">
              <button
                type="button"
                className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
                onClick={() =>
                  handleOpenModalLiquidateDebt(debt.id, debt.amount)
                }
              >
                Liquidar Deuda
              </button>
            </div>
          </div>
        ))}
        {debtsPayer.map((debt) => (
          <div
            key={debt.id}
            className="bg-white rounded-[50px] overflow-hidden shadow-xl transition-all mx-2 sm:mx-4 mb-4 p-12 md:p-8 w-full"
          >
            <h1 className="text-xl md:text-2xl text-gray-700 font-bold mb-6 text-center">
              {debt.name}
            </h1>
            <div className="flex flex-col items-center">
              <p className="border border-indigo-300 rounded-lg p-3 w-11/12">
                {
                  debtors.find((debtor) => debtor.id === debt.roomie_debtor_id)
                    ?.first_name
                }{" "}
                te debe {parseFloat(debt.amount).toFixed(2)}€
              </p>
            </div>
          </div>
        ))}
      </div>
      {isCreateModalOpen && (
        <CreateDebtModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModalCreateDebt}
          selectedExpenseId={selectedExpenseId}
          handleCreateDebtUpdate={handleCreateDebtUpdate}
        />
      )}

      {isLiquidateModalOpen && (
        <LiquidateDebtModal
          isOpen={isLiquidateModalOpen}
          onClose={handleCloseModalLiquidateDebt}
          selectedDebtId={selectedDebtId}
          debtAmount={selectedDebtAmount}
          handleDebtPaidUpdate={handleDebtPaid}
        />
      )}
    </div>
  );
};

export default Expenses;
