

const getRoomiesByHomeId = async (home_id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/roomie/home/${home_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Request failed with status " + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los roomies:", error);
    return null;
  }
};

const getDebtsByRoomieId = async (roomie_id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/debts/roomie/${roomie_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener las deudas:", error);
    return null;
  }
};

const createDebt = async (expense_id, debtor_ids, total_amount) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/debts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expense_id: expense_id,
          debtor_ids: debtor_ids,
          total_amount: total_amount,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Ha habido un error al crear la deuda"
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error(error.message || "Ha habido un error al crear la deuda");
  }
};

const payDebt = async (debt_id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/debts/${debt_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al realizar el pago de la deuda:", error);
    return null;
  }
};

const authDebts = {
  getRoomiesByHomeId,
  createDebt,
  getDebtsByRoomieId,
  payDebt,
};

export default authDebts;
