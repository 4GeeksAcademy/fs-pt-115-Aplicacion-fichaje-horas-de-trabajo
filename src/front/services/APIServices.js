//API EXTERNA PARA OBTENER LA UBICACION
export const getLocation = async () => {
  const response = await fetch(`${import.meta.env.EXTERNAL_API}`);

  const data = await response.json();

  console.log(data);

  return data;
};
//PETICIONES A LA API DESDE EL LOGIN
//LOGIN
export const login = async (email, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!response.ok) {
    throw new Error("Error en login");
  }
  const data = await response.json();

  localStorage.setItem("token", data.token);

  return data;
};

// CREAR USUARIO
export const crearUsuario = async (usuario) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    `${import.meta.env.VITE_BACKEND_URL}/api/users`,
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

export const getUserByToken = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No se encontró un token válido en localStorage.");
    throw new Error("No hay token disponible");
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Error del backend:", data);
    throw new Error(data.msg || "Error al obtener el perfil del usuario");
  }

  console.log("✅ Usuario logueado:", data.user);
  return data.user;
};

// ACTUALIZAR USUARIO
export const actualizarUsuario = async (id, data) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/usuario/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Error al actualizar usuario");
  }

  return await response.json();
};

// ELIMINAR USUARIO
export const borrarUsuario = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/usuario/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al borrar usuario");
  }

  return await response.json();
};

export const signUp = async (newUser) => {
  console.log(newUser);

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: newUser.first_name,
        surname: newUser.surname,
        last_name: newUser.last_name,
        email: newUser.email,
        DNI: newUser.dni_nie,
        iban: newUser.iban,
        address: newUser.address,
        birth_date: new Date(newUser.birth_date).toISOString(),
        rol: newUser.rol,
        is_admin: true,
        password: newUser.password,
        status: "Inactivo",
      }),
    }
  );

  if (!response.ok) {
    throw new Error("No se ha podido registrar el usuario");
  }

  const data = await response.json();

  return data;
};

export const checkUsuarios = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/exists`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al comprobar usuarios", 400);
  }
  const data = await response.json();

  return data.user_created;
};


// Crear solicitud vacaciones
export const createSolicitud = async (solicitudData) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/solicitudes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(solicitudData),
  });
  return response.json();
};

// Obtener todas las solicitudes
export const getSolicitudes = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/solicitudes`);
  return response.json();
};

// Obtener una solicitud por ID
export const getSolicitudById = async (id) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/${id}`);
  return response.json();
};

// Actualizar solicitud (PUT)
export const updateSolicitud = async (id, solicitudData) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(solicitudData),
  });
  return response.json();
};

// Eliminar solicitud (DELETE)
export const deleteSolicitud = async (id) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/solicitudes/${id}`, {
    method: "DELETE",
  });
  return response.json();
};


export const getSignings = async (userId, token) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/signings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const getContracts = async (userId, token) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/documents/contracts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const getPayrolls = async (userId, token) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/documents/payrolls`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const getDocumentTypes = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/document_types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const uploadDocument = async (userId, token, file, typeId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type_id", typeId);

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/documents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.msg || "Error subiendo documento");
  }

  return response.json();
};

export const toggleBreak = async (userId, token) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: "toggle_break" }),
  });
  return response.json();
};