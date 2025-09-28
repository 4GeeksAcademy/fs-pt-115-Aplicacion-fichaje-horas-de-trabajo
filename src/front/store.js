export const initialStore = () => {
  return {
    signings: [],
    users: [],
    user: {},
    firstUserExist: false,
    userSchedule: [],
    userContracts: [],
    payrolls: [],
    signtypes: [],
    hoursToday: 0,
    hoursMonth: 0,
    lastMonth: null,
    history: [],
    historicSignings: [],
    profile_image: null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "GET_SIGNINGS":
      return {
        ...store,
        signings: action.payload,
      };
    case "GET_HISTORIC_SIGNINGS":
      return {
        ...store,
        historicSignings: action.payload,
      };
    case "SET_HOURS_DATA":
      return {
        ...store,
        hoursToday: action.payload.hoursToday,
        hoursMonth: action.payload.hoursMonth,
        lastMonth: action.payload.lastMonth,
        history: action.payload.history,
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
        userSchedule: action.payload,
      };
    case "SET_SIGNTYPE":
      return {
        ...store,
        signtypes: action.payload,
      };
    case "ADD_SCHEDULES":
      return {
        ...store,
        userSchedule: [...store.userSchedule, action.payload],
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
    case "DELETE_SIGNING":
      return {
        ...store,
        signings: store.signings.filter((sign) => sign.id !== action.payload),
      };
    case "EDIT_SIGNING":
      return {
        ...store,
        signings: store.signings.map((sign) =>
          sign.id === action.payload.id ? { ...sign, ...action.payload } : sign
        ),
      };
    case "DELETE_SCHEDULE":
      return {
        ...store,
        userSchedule: store.userSchedule.filter((e) => e.id !== action.payload),
      };
    case "UPDATE_SCHEDULE":
      return {
        ...store,
        userSchedule: store.userSchedule.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      };

    case "UPDATE_PROFILE_IMAGE":
      return {
        ...store,
        user: { ...store.user, ...action.payload },
        profile_image: action.payload.profile_image || store.profile_image,
      };
    default:
      throw Error("Unknown action.");
  }
}
