import React, { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext();
const initialState = {
    user_id: '1',
    context_id: '1',
    instructor: '',
    ta: '',
    student: '',
    admin: '',
    assignment: ''};

const reducer = (state, action) => {
  switch(action.type) {
    case "createUser":
      return {
        user_id: action.user_id,
        context_id: action.context_id,
        instructor: action.instructor,
        ta: action.ta,
        student: action.student,
        admin: action.admin,
        assignment: action.assignment
      }
      case "reset":
        return {
          user_id: '',
          context_id: '',
          instructor: '',
          ta: '',
          student: '',
          admin: '',
          assignment: ''
        }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext);