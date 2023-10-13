import React, { useState } from "react";

const ShopList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem !== "") {
      setItems([...items, { name: newItem, completed: false }]);
      setNewItem("");
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg p-6 md:p-12 w-full md:max-w-xl">
        <h1 className="text-2xl text-gray-700 font-bold mb-4 text-center">
          Lista de la compra
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
                className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center ml-5"
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
      </div>
    </div>
  );
};

export default ShopList;
