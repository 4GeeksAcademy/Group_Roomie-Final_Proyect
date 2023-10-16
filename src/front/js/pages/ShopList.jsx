import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";

const ShopList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [shopList, setShopList] = useState({});
  const { actions } = useAppContext();

  if (!localStorage.getItem("home_id")) {
    return (
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        No estás vinculado a ninguna vivienda. Crea una o pide a un
        administrador que te añada.
      </h1>
    );
  }

  const handleAddItem = async () => {
    if (newItem !== "") {
      const newItemObject = { name: newItem, completed: false };
      const updatedItems = [...items, newItemObject];
      setItems(updatedItems);
      setNewItem("");
      try {
        await actions.createNewItem(newItem, shopList.id);
      } catch (error) {
        console.error("Error al añadir nuevo item:", error);
      }
    }
  };

  const handleDeleteItem = async () => {
    try {
      for (const item of items) {
        if (item.completed) {
          await actions.deleteItem(item.id);
        }
      }
      const updatedItems = await actions.getAllItems(shopList.id);
      setItems(updatedItems);
    } catch (error) {
      console.error("Error al eliminar el item:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  const handleToggleComplete = (index) => {
    const updatedItems = [...items];
    updatedItems[index].completed = !updatedItems[index].completed;
    setItems(updatedItems);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopListResponse = await actions.getShopList();
        setShopList(shopListResponse);

        const itemsResponse = await actions.getAllItems(shopListResponse.id);
        setItems(itemsResponse);
        console.log(itemsResponse);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    fetchData();
  }, [actions]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-[50px] p-6 md:p-12 w-full md:max-w-xl">
        <h1 className="text-2xl text-gray-700 font-bold mb-6 text-center">
          {shopList.name}
        </h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4 flex">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Añadir nuevo elemento"
                className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full max-w-full text-center"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyUp={handleKeyPress}
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleAddItem}
                className="w-12 h-12 rounded-full bg-indigo-300 hover:bg-indigo-500 flex items-center justify-center ml-5"
              >
                <span className="text-white text-4xl font-bold pb-2">+</span>
              </button>
            </div>
          </div>
        </form>

        <ul>
          {items.map((item, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-2 ${
                item.completed ? "line-through" : ""
              }`}
              style={{ borderBottom: "1px solid #D1D5DB" }}
            >
              <span style={{ wordBreak: "break-all" }}>{item.name}</span>
              <button onClick={() => handleToggleComplete(index)}>
                {item.completed ? (
                  <i className="fa-regular fa-circle-check text-indigo-900"></i>
                ) : (
                  <i className="fa-regular fa-circle-check text-gray-400"></i>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-5">
          <button
            type="button"
            className="bg-indigo-100 hover:bg-indigo-300 text-gray-600 font-bold py-2 px-4 rounded-xl mr-2"
            onClick={handleDeleteItem}
          >
            Eliminar
          </button>
          <button className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl">
            Crear Gasto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopList;
