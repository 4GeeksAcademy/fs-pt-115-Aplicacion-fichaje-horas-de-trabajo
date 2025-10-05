//API EXTERNA PARA OBTENER LA UBICACION
export const getLocation = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_EXTERNAL_API}?api_key=${
      import.meta.env.VITE_API_KEY
    }`
  );

  const data = response.json();

  console.log(data);

  return data;
};

export const getToken = () => localStorage.getItem("token");

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
export const crearUsuario = async (newUser) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        first_name: newUser.first_name,
        surname: newUser.surname,
        last_name: newUser.last_name,
        email: newUser.email,
        DNI: newUser.DNI,
        iban: newUser.iban,
        address: newUser.address,
        birth_date: newUser.birth_date,
        rol: newUser.rol,
        is_admin: newUser.is_admin,
        password: newUser.password,
        status: "Inactivo",
      }),
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

  console.log("Usuario logueado:", data.user);
  return data.user;
};

export const getUsuarioById = async (id, token) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!resp.ok) {
      throw new Error(`Error obteniendo usuario ${id}: ${resp.status}`);
    }

    const data = await resp.json();
    return data;
  } catch (err) {
    console.error("Error en getUsuarioById:", err);
    throw err;
  }
};

// ACTUALIZAR USUARIO
export const actualizarUsuario = async (id, data) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
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
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
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

//SOLICITUDES DE VACACIONES
export const createHoliday = async (data) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/holidays`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const respuesta = await res.json();
  console.log(respuesta);
  return respuesta;
};

export const getHolidays = async () => {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/holidays`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener las solicitudes");
  return res.json();
};

export const updateHoliday = async (id, data) => {
  const token = getToken();
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/holidays/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) throw new Error("Error al actualizar la solicitud");
  return res.json();
};

export const deleteHoliday = async (id) => {
  const token = getToken();
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/holidays/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error("Error al eliminar la solicitud");
  return res.json();
};

//FICHAJES

export const addsigning = async (id, newSigning) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/signings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: id,
        sign_type_id: newSigning.sign_type_id,
        datetime: new Date(newSigning.datetime).toISOString(),
        lat: newSigning.lat,
        long: newSigning.long,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("No se ha podido registrar el fichaje");
  }

  return await response.json();
};

export const deleteSigning = async (signing_id, user_id, dispatch) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/users/${user_id}/signings/${signing_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  getSignings(user_id, dispatch);
  if (!res.ok) throw new Error("Error al eliminar el fichaje");
  return res.json();
};

//HORARIOS

export const addschedule = async (id, start_datetime, end_datetime) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/schedules/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: id,
        start_datetime: start_datetime,
        end_datetime: end_datetime,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("No se ha podido registrar el horario");
  }

  return await response.json();
};

export const deleteSchedule = async (userId, scheduleId, dispatch) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/users/${userId}/schedules/${scheduleId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al eliminar el schedule");
  }
  dispatch({ type: "DELETE_SCHEDULE", payload: scheduleId });

  await getschedule(userId, dispatch);

  return true;
};

export const getschedule = async (id, dispatch) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/schedules`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  console.log("Respuesta cruda del backend:", data);
  dispatch({ type: "SET_SCHEDULES", payload: data });
  if (!response.ok) {
    throw new Error("Error al obtener fichajes");
  }

  return data;
};

export const updateSchedule = async (userId, scheduleId, updates) => {
  const token = localStorage.getItem("token");
  const url = `${
    import.meta.env.VITE_BACKEND_URL
  }/api/users/${userId}/schedules/${scheduleId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Update failed:", response.status, text);
    throw new Error(`Error al actualizar: ${response.status} - ${text}`);
  }
  return response.json();
};

export const getSignings = async (userId, dispatch) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/signings`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await response.json();
  console.log("dispatch:", dispatch);

  const historicSignings = data.filter((signing) => signing.is_historic);
  console.log("historicSignings:", historicSignings);

  const signings = data.filter((signing) => signing.is_historic == false);
  console.log("signings:", signings);

  dispatch({ type: "GET_HISTORIC_SIGNINGS", payload: historicSignings });
  dispatch({ type: "GET_SIGNINGS", payload: signings });

  return data;
};

export const getContracts = async (userId, token) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/users/${userId}/documents/contracts`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.json();
};

export const getPayrolls = async (userId, token) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/users/${userId}/documents/payrolls`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.json();
};

export const getDocumentTypes = async (token) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/document_types`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.json();
};

export const uploadDocument = async (userId, token, file, typeId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type_id", typeId);

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/documents`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );

  const text = await response.text();
  if (!response.ok) {
    try {
      const err = JSON.parse(text);
      throw new Error(err.msg || "Error subiendo documento");
    } catch {
      throw new Error(`Error subiendo documento: ${text}`);
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta no es JSON válido");
  }
};


export const deleteDocument = async (userId, docId, token) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/documents/${docId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || "Error al eliminar documento");
  }

  return await response.json();
};

export const toggleStatus = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "toggle_work" }),
    }
  );
  return response.json();
};

export const getSignType = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/signtypes`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al comprobar usuarios", 400);
  }
  const data = await response.json();

  return data;
};

export const getAllSignTypes = async (dispatch) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/signtypes`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al comprobar fichajes", 400);
  }
  const data = await response.json();

  dispatch({ type: "SET_SIGNTYPES", payload: data });

  return data;
};

export const updateSigning = async (userId, signId, updates) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/users/${userId}/signings/${signId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) throw new Error("Error al actualizar el fichaje");
  return response.json();
};

export const uploadProfileImage = async (userId, token, file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/profile_image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.msg || "Error subiendo imagen");
  }

  return response.json();
};

export const getprofileimage = async (user_id, dispatch) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${user_id}/profile_image`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al recuperar foto de perfil", 400);
  }

  const data = await response.json();
  console.log("profile_image:", data);
  dispatch({ type: "UPDATE_PROFILE_IMAGE", payload: { profile_image: data } });

  return data;
};
