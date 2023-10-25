const getShopList = (home_id) => {
    return fetch(`${process.env.REACT_APP_URL}/api/list/home/${home_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
        return null;
      });
  };
  
  const getAllItems = async (list_id) => {
    return fetch(`${process.env.REACT_APP_URL}/api/item/list/${list_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error al obtener todos los items:", error);
      });
  };
  
  const createNewItem = async (name, shopping_list_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, shopping_list_id }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al añadir nuevo item:", error);
    }
  };
  
  const deleteItem = async (item_id) => {
    const token = localStorage.getItem("token");
    return fetch(`${process.env.REACT_APP_URL}/api/item/${item_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error al eliminar el item:", error);
      });
  };
  
  const authShop = {
    getShopList,
    getAllItems,
    createNewItem,
    deleteItem,
  };
  
  export default authShop;
