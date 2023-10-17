import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";
//import DebtsModal from '../components/DebtsModal.jsx';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { actions } = useAppContext();

  useEffect(() => {
    const home_id = localStorage.getItem("home_id");
    const fetchData = async () => {
      try {
        const expensesData = await actions.getExpensesByHomeId(home_id);
        setExpenses(expensesData);
      } catch (error) {
        console.error("Error al obtener los gastos:", error);
      }
    };
    fetchData();
  }, [actions]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 max-w-screen-md p-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white rounded-[50px] p-6 md:p-12 w-full md:max-w-xl"
          >
            <h1 className="text-xl md:text-2xl text-gray-700 font-bold mb-6 text-center">
              {expense.name}
            </h1>
            <div className="flex justify-center">
              <button
                type="button"
                className="bg-indigo-100 hover:bg-indigo-300 text-gray-600 font-bold py-2 px-4 rounded-xl mr-2"
                onClick={handleOpenModal}
              >
                Liquidar Deuda
              </button>
              <button
                type="button"
                className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
                onClick={handleOpenModal}
              >
                Crear Deuda
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* <ExpenseModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
    </div>
  );
};

export default Expenses;
