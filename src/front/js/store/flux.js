const getState = ({ setStore }) => {
  return {
    store: {
      message: null,
      token: null,
    },
    actions: {
      login: async (email, password) => {
        try {
          const opts = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          };
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/login",
            opts
          );

          if (resp.status === 200) {
            const data = await resp.json();
            sessionStorage.setItem("token", data.access_token);
            setStore({ token: data.access_token });
            return true;
          } else {
            const data = await resp.json();
            setStore({ message: data.message });
            return false;
          }
        } catch (error) {
          console.log("Error loading message from backend", error);
          return false;
        }
      },

      signup: async (email, password, firstName, lastName) => {
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
          }),
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/signup",
            opts
          );

          if (resp.status === 201) {
            const data = await resp.json();
            sessionStorage.setItem("token", data.access_token);
            setStore({ token: data.access_token });
            return true;
          } else {
            const data = await resp.json();
            setStore({ message: "Ha ocurrido un error: " + data.message });
            return false;
          }
        } catch (error) {
          console.log("Ha ocurrido un error", error);
          return false;
        }
      },
    },
  };
};

export default getState;
