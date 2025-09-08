
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
  const response = await fetch(`${API_URL}/login`, {
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
  const response = await fetch(`${API_URL}/usuario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });

  if (!response.ok) {
    throw new Error("Error al crear usuario");
  }

  return await response.json();
};

// OBTENER USUARIOS
export const getUsuarios = async () => {
  const response = await fetch(`${API_URL}/usuario`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener usuarios");
  }

  return await response.json();
};

// ACTUALIZAR USUARIO
export const actualizarUsuario = async (id, data) => {
  const response = await fetch(`${API_URL}/usuario/${id}`, {
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
  const response = await fetch(`${API_URL}/usuario/${id}`, {
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
