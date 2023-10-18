import React, { useState } from "react";

const LiquidateDebtModal = ({ isOpen, onClose, selectedExpenseId }) => {
  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePayment = () => {
    // Lógica para realizar el pago
    // Actualizar el estado de la deuda a "Pagada"
    updateDebtStatus(selectedExpenseId, "Pagada");
    onClose();
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        isOpen ? "flex" : "hidden"
      } items-center justify-center`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-[50px] p-8 m-2 max-w-2xl w-full">
          <h2 className="text-2xl font-bold text-center mb-4">
            Liquidar Deuda
          </h2>
          {/* Detalles de la deuda y roomies involucrados */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={onClose}
              type="button"
              className="bg-gray-100 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-xl"
            >
              Cerrar
            </button>
            <button
              type="button"
              className="bg-indigo-100 hover:bg-indigo-300 text-gray-600 font-bold py-2 px-4 rounded-xl"
              onClick={handlePayment}
            >
              Pago con PayPal
            </button>
            <button
              type="button"
              className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
              onClick={handlePayment}
            >
              Pago en Efectivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidateDebtModal;
