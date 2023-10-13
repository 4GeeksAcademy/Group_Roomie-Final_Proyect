const signup = (email, password, first_name) => {
  return fetch(
    "https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        first_name: first_name,
      }),
    }
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Network response was not ok");
    }
  });
};

const login = (email, password) => {
  return fetch(
    "https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }
  ).then((response) => {
    if (response.ok) {
      return response.json().then((data) => {
        if (data.access_token) {
          localStorage.setItem("roomie", JSON.stringify(data));
        }
        return data;
      });
    } else {
      throw new Error("Network response was not ok");
    }
  });
};

const getCurrentRoomie = () => {
  return JSON.parse(localStorage.getItem("roomie"));
};

const authProfile = {
  signup,
  login,
  getCurrentRoomie,
};

export default authProfile;
