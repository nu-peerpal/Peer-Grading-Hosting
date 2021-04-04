import React, { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext();
const initialState = {
    user_id: '1',
    context_id: '1',
    context_name: '',
    roles: [],
    assignment: '41', // Course Evaluation Essay
    saved_user_id: ''
};

const reducer = (state, action) => {
  switch(action.type) {
    case "createUser":
      state.roles = [];
      if (action.instructor) state.roles.push('instructor');
      if (action.ta) state.roles.push('ta');
      if (action.student) state.roles.push('student');
      if (action.admin) state.roles.push('admin');
      return {
        user_id: action.user_id,
        context_id: action.context_id,
        context_name: action.context_name,
        roles: state.roles,
        assignment: action.assignment,
        saved_user_id: '',
      }
      case "actAsStudent":
        state.roles.push('student');
        let save_user = state.user_id
        return {
          user_id: action.user_id,
          context_id: state.context_id,
          context_name: state.context_name,
          roles: state.roles,
          assignment: state.assignment,
          saved_user_id: save_user
        }
      case "revertFromStudent":
        let updated_roles = state.roles.filter(role => role != 'student');
        let saved_user = state.saved_user_id
        return {
          user_id: saved_user,
          context_id: state.context_id,
          context_name: state.context_name,
          roles: updated_roles,
          assignment: state.assignment,
          saved_user_id: ''
        }
      case "reset":
        return {
          user_id: '',
          context_id: '',
          context_name: '',
          roles: [],
          assignment: '',
          saved_user_id: ''
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