import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";
import ExpensesModal from "../component/ExpensesModal.jsx";
import Loader from "../component/Loader.jsx";

import toast from "react-hot-toast";

const ShopList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [shopList, setShopList] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNoHomeId, setHasNoHomeId] = useState(false);
  const [loading, setLoading] = useState(true);
  const { actions, store } = useAppContext();

  useEffect(() => {
    if (store.home_id === "null") {
      setHasNoHomeId(true);
      setLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const shopListResponse = await actions.getShopList();
          if (shopListResponse != null) {
            setShopList(shopListResponse);

            const itemsResponse = await actions.getAllItems(
              shopListResponse.id
            );
            setItems(itemsResponse);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error al obtener los datos", error);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [actions]);

  const handleAddItem = async () => {
    if (newItem.trim() !== "") {
      const isDuplicate = items.some((item) => item.name === newItem.trim());
      if (!isDuplicate) {
        try {
          const newItemObject = await actions.createNewItem(
            newItem.trim(),
            shopList.id
          );
          const updatedItems = [...items, newItemObject];
          setItems(updatedItems);
          setNewItem("");
        } catch (error) {
          console.error("Error al añadir nuevo item:", error);
        }
      } else {
        console.log("El item ya está en la lista.");
        toast.error("El item ya está en la lista", {
          duration: 3000,
        });
      }
    }
  };

  const handleDeleteItem = async () => {
    try {
      const completedItems = items.filter((item) => item.completed);
      for (const completedItem of completedItems) {
        if (completedItem.id) {
          await actions.deleteItem(completedItem.id);
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

  const handleOpenModal = () => {
    const hasSelectedItem = items.some((item) => item.completed);
    if (hasSelectedItem) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : !hasNoHomeId ? (
        <div className="flex items-center justify-center mt-5 sm:mt-20 md:mt-20 mx-2">
          <div className="bg-white rounded-[50px] p-6 md:p-12 w-full md:max-w-xl max-h-70vh overflow-y-auto">
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
                    <span className="text-white text-4xl font-bold pb-2">
                      +
                    </span>
                  </button>
                </div>
              </div>
            </form>

            <ul>
              {items.map((item, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center p-2 ${
                    item.completed ? "bg-indigo-100 rounded-xl" : ""
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
              <button
                className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
                onClick={handleOpenModal}
              >
                Crear Gasto
              </button>
            </div>
            <ExpensesModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              selectedItems={items.filter((item) => item.completed == true)}
            />
          </div>
        </div>
      ) : (
        <h1 className="min-h-screen flex items-center justify-center text-center text-2xl font-bold tracking-tight text-gray-600 sm:text-4xl sm:p-4">
          No estás vinculado a ninguna vivienda.
          <br />
          Crea una o pide a un administrador que te añada
        </h1>
      )}
    </>
  );
};

export default ShopList;
