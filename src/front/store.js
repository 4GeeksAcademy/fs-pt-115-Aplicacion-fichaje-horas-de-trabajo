export const initialStore = () => {
  return {
    signings: [],
    users: [],
    user: {},
    firstUserExist: false,
    userSchedule: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "GET_SIGNINGS":
      return {
        ...store,
        signings: action.payload,
      };
    case "GET_USERS":
      return {
        ...store,
        users: action.payload,
      };

    case "SET_USER":
      return {
        ...store,
        user: action.payload,
      };

    case "SET_FIRST_USER_EXIST":
      return {
        ...store,
        firstUserExist: action.payload,
      };

    case "SET_SCHEDULES":
      return {
        ...store,
        firstUserExist: action.payload,
      };
    default:
      throw Error("Unknown action.");
  }
}
