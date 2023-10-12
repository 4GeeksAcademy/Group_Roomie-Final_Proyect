const BACKEND_URL =
  "https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/";

const signup = (email, password, first_name) => {
  return fetch(`${BACKEND_URL}api/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
      first_name: first_name,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Network response was not ok");
    }
  });
};

const login = (email, password) => {
  return fetch(`${BACKEND_URL}api/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).then((response) => {
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

const logout = () => {
  localStorage.removeItem("roomie");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("roomie"));
};

const authProfile = {
  signup,
  login,
  logout,
  getCurrentUser,
};

export default authProfile;
