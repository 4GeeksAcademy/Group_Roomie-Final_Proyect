const getNameShopList = (home_id) => {
  return fetch(
    `https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/list/home/${home_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data[0].name;
    })
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};

const getAllItems = async (list_id) => {
  try {
    const response = await fetch(
      `https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/item/list/${list_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error while fetching all items:", error);
  }
};

const createNewItem = async (name, shopping_list_id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      "https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/item",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, shopping_list_id }),
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error while creating a new item:", error);
  }
};

const deleteItem = async (item_id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/item/${item_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error while deleting the item:", error);
  }
};

const authShop = {
  getNameShopList,
  getAllItems,
  createNewItem,
  deleteItem,
};

export default authShop;
