import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";
import CreateDebtModal from "../component/CreateDebtModal.jsx";
import LiquidateDebtModal from "../component/LiquidateDebtModal.jsx";
import Loader from "../component/Loader.jsx";

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
  const [loading, setLoading] = useState(true);
  const { actions, store } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const expensesData = await actions.getExpensesByRoomieId(
          store.roomie_id
        );
        setExpenses(expensesData);
        const debtsData = await actions.getDebtsByRoomieId(store.roomie_id);
        const debtsPendientesCobro = debtsData.filter(
          (debt) => debt.roomie_paying_id == store.roomie_id
        );
        setDebtsPayer(debtsPendientesCobro);
        const debtsPendientesPago = debtsData.filter(
          (debt) => debt.roomie_debtor_id == store.roomie_id
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
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los gastos y deudas:", error);
        setLoading(false);
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
    const updatedDebts = await actions.getDebtsByRoomieId(store.roomie_id);
    setDebtsPayer(
      updatedDebts.filter((debt) => debt.roomie_paying_id == store.roomie_id)
    );
    const updatedExpenses = await actions.getExpensesByRoomieId(
      store.roomie_id
    );
    setExpenses(updatedExpenses);
  };

  const handleDebtPaid = async () => {
    const updatedDebts = await actions.getDebtsByRoomieId(store.roomie_id);
    setDebtsDebtor(
      updatedDebts.filter((debt) => debt.roomie_debtor_id == store.roomie_id)
    );
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : expenses.length > 0 ||
        debtsDebtor.length > 0 ||
        debtsPayer.length > 0 ? (
        <div className="masonry md:masonry-lg xl:masonry-xl z-0 mt-5 sm:mt-10 md:mt-10 lg:mt-20 lg:ms-72">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white rounded-[50px] shadow-xl transition-all mx-2 sm:mx-4 mb-4 p-6 sm:p-8 md:p-8 break-inside"
            >
              <h1 className="text-lg md:text-xl text-gray-700 font-bold mb-4 md:mb-6 text-center">
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
              className="bg-white rounded-[50px] overflow-hidden shadow-xl transition-all mx-2 sm:mx-4 mb-4 p-6 sm:p-8 md:p-8 break-inside"
            >
              <h1 className="text-lg md:text-xl text-gray-700 font-bold mb-4 md:mb-6 text-center">
                {debt.name}
              </h1>
              <div className="flex flex-col items-center">
                <p className="bg-red-200 rounded-lg p-2 md:p-3 w-full md:w-11/12">
                  Debes {parseFloat(debt.amount).toFixed(2)}€ a{" "}
                  {
                    payers.find((payer) => payer.id === debt.roomie_paying_id)
                      ?.first_name
                  }
                </p>
              </div>
              <div className="flex justify-center pt-3 md:pt-4">
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
              className="bg-white rounded-[50px] overflow-hidden shadow-xl transition-all mx-2 sm:mx-4 mb-4 p-6 sm:p-8 md:p-8 break-inside"
            >
              <h1 className="text-lg md:text-xl text-gray-700 font-bold mb-4 md:mb-6 text-center">
                {debt.name}
              </h1>
              <div className="flex flex-col items-center">
                <p className="bg-green-200 rounded-lg p-2 md:p-3 w-full md:w-11/12">
                  {
                    debtors.find(
                      (debtor) => debtor.id === debt.roomie_debtor_id
                    )?.first_name
                  }{" "}
                  te debe {parseFloat(debt.amount).toFixed(2)}€
                </p>
              </div>
            </div>
          ))}

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
      ) : (
        <h1 className="min-h-screen flex items-center justify-center text-center text-2xl font-bold tracking-tight text-gray-600 sm:text-4xl sm:p-4">
          Aún no hay gastos que mostrar
        </h1>
      )}
    </>
  );
};

export default Expenses;
