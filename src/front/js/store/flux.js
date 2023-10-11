const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			login: async () => {
				try{
					const resp = await fetch(process.env.BACKEND_URL + "/api/login")
					const data = await resp.json()
					setStore({ message: data.message })
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			syncTokenFromSessionStore: () => {
				const token = sessionStorage.getItem("token");
				if(token && token !="" && token != undefined) setStore({ token: token})
			},
	
			signup: async (email,password,firstName,lastName) => {
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						first_name: firstName,
						last_name: lastName,
						email: email,
						password: password,
					})
				};
			try{	
				const resp = await fetch(process.env.BACKEND_URL + "/api/signup",opts)
					if(resp.status !== 200  !== 201){ alert("Ha ocurrido un error");
					return false;
				}
				const data = await resp.json();
					console.log("this came from backend",data)
					sessionStorage.setItem("token", data.access_token);
				}	
			catch(error){
					console.log("Ha ocurrido un error",error);
	
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
