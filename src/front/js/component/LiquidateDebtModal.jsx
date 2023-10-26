import React, { useState } from "react";

import useAppContext from "../contexts/AppContext.jsx";
import Paypal from "./Paypal.jsx";

const LiquidateDebtModal = ({
  isOpen,
  onClose,
  selectedDebtId,
  debtAmount,
  handleDebtPaidUpdate,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { actions } = useAppContext();
  const [checkout, setCheckout] = useState(false);

  const handlePaymentCash = async () => {
    try {
      await actions.payDebt(selectedDebtId);
      handleDebtPaidUpdate();
      onClose();
    } catch (error) {
      console.error("Error al realizar el pago de la deuda:", error);
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[50px] p-8 m-2 max-w-xl w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Liquidar Deuda</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-base md:text-lg lg:text-base mb-2">
            Importe
          </label>
          <p className="border border-gray-300 rounded-lg p-3 w-full">
            {parseFloat(debtAmount).toFixed(2)}€
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-base md:text-lg lg:text-base mb-2">
            Fecha
          </label>
          <p className="border border-gray-300 rounded-lg p-3 w-full">
            {formatDate(selectedDate)}
          </p>
        </div>
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={onClose}
            type="button"
            className="bg-gray-100 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-xl"
          >
            Cerrar
          </button>
          <Paypal amountToPay={debtAmount} />
          <button
            type="button"
            className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
            onClick={handlePaymentCash}
          >
            Pago en Efectivo
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiquidateDebtModal;
