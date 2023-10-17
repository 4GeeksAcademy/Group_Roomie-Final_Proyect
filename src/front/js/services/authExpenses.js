const getExpensesByHomeId = async (home_id) => {
  try {
    const response = await fetch(
      `https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/expense/home/${home_id}`,
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
    console.error("Error al obtener los gastos por home_id:", error);
    return null;
  }
};

const createExpense = async (expense_name, item_ids) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      "https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/expense",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expense_name: expense_name,
          item_ids: item_ids,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Ha habido un error al crear el gasto"
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error(error.message || "Ha habido un error al crear el gasto");
  }
};

const authExpenses = {
  createExpense,
  getExpensesByHomeId,
};

export default authExpenses;
