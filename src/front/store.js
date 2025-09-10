export const initialStore=()=>{
  return{
    signings: [],
    users: [],
    user: {
      firstName: "FirstName",
      lastName: "LastName",
      email: "mail@mail.com",
      address: "Address",
      dni_nie: "DNI/NIE",
      iban: "IBAN",
      rol: "ROL",
      isActive: false,
      isAdmin: false
    },
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'GET_SIGNINGS':
      return {
        ...store,
        signings: action.payload
      };
      
    case 'GET_USERS':
      return {
        ...store,
        users: action.payload
      };
   
      default:
      throw Error('Unknown action.');
  }    
}
