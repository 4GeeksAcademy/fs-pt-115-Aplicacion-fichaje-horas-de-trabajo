export const initialStore = () => {
  return {
    signings: [],
    users: [],
    user: {},
    firstUserExist: false,
    userSchedule: [],
    userContracts: [],
    payrolls: [],
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
    case "ADD_SCHEDULES":
      return {
        ...store,
        userSchedule: [...store.userSchedule, ...action.payload],
      };
    case "GET_CONTRACTS":
      return {
        ...store,
        userContracts: action.payload,
      };

    case "GET_PAYROLLS":
      return {
        ...store,
        payrolls: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
