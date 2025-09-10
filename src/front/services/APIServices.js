//API EXTERNA PARA OBTENER LA UBICACION
export const getLocation = async () => {
  const response = await fetch(
    `https://ipgeolocation.abstractapi.com/v1/?api_key=${os.getenv("API_KEY")}`
  );

  const data = await response.json();

  console.log(data);

  return data;
};
//PETICIONES A LA API DESDE EL LOGIN
//LOGIN
export const login = async (email, password) => {
  const response = await fetch(`${os.getenv("API_URL")}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Error en login");
  }

  return await response.json();
};

// CREAR USUARIO
export const crearUsuario = async (usuario) => {
  const response = await fetch(
    `https://orange-robot-44wgw96ppgghjjx-3001.app.github.dev/api/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    }
  );

  if (!response.ok) {
    throw new Error("Error al crear usuario");
  }

  return await response.json();
};

// OBTENER USUARIOS
export const getUsuarios = async (dispatch) => {
  const response = await fetch(
    `https://orange-robot-44wgw96ppgghjjx-3001.app.github.dev/api/users`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener usuarios");
  }
  const data = await response.json();

  dispatch({ type: "GET_USERS", payload: data });

  return data;
};

// ACTUALIZAR USUARIO
export const actualizarUsuario = async (id, data) => {
  const response = await fetch(`${os.getenv("API_URL")}/usuario/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar usuario");
  }

  return await response.json();
};

// ELIMINAR USUARIO
export const borrarUsuario = async (id) => {
  const response = await fetch(`${os.getenv("API_URL")}/usuario/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al borrar usuario");
  }

  return await response.json();
};

export const signUp = async (newUser, dispatch) => {
  const response = await fetch(
    `https://orange-robot-44wgw96ppgghjjx-3001.app.github.dev/api/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: newUser.firstName,
        surname: newUser.surname,
        last_name: newUser.lastName,
        email: newUser.email,
        DNI: newUser.dni_nie,
        iban: newUser.iban,
        address: newUser.address,
        birth_date: newUser.birthDate,
        rol: newUser.rol,
        is_admin: true,
        password: newUser.password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("No se ha podido registrar el usuario");
  }

  data = await response.json();

  getUsuarios(dispatch);

  dispatch({ type: "GET_USERS", payload: data });

  return data;
};
