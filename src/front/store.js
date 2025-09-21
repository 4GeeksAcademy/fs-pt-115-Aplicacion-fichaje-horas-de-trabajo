export const initialStore = () => {
  return {
    signings: [],
    users: [],
<<<<<<< HEAD
    user: {},
    firstUserExist: false,
    userSchedule: [],
  };
};
=======
    user: {
    },
    firstUserExist: false,
    userContracts:[],
    payrolls: []
  }
}
>>>>>>> develop

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

<<<<<<< HEAD
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
=======
      case 'GET_CONTRACTS':
      return {
        ...store,
        userContracts: action.payload
      };

      case 'GET_PAYROLLS':
      return {
        ...store,
        payrolls: action.payload
      };

      default:
      throw Error('Unknown action.');
  }    
>>>>>>> develop
}
