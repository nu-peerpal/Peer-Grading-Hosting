import React, { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext();
const initialState = {  // example state info, launched from admin acct (user@example.com)
  admin: true,
  alumni: false,
  content_developer: false,
  guest: false,
  instructor: true,
  manager: false,
  member: false,
  mentor: false,
  none: false,
  observer: false,
  other: false,
  prospective_student: false,
  student: false,
  ta: false,
  launch_request: true,
  username: 'user@example.com',
  userId: '7a88fd787115cdc5ea4f9f2f6de9831084c669c7',
  context_id: 'f2a4b9abe5c4d258c3b3874e46af07eca4cad901',
  context_label: 'Hartline',
  context_title: 'Hartline Testing',
  ext_content: false,
  outcome_service: false
}

const reducer = (state, action) => {
  switch(action.type) {
    case "create":
      return {
        admin: action.admin,
        alumni: action.alumni,
        content_developer: action.content_developer,
        guest: action.guest,
        instructor: action.instructor,
        manager: action.manager,
        member: action.member,
        mentor: action.mentor,
        none: action.none,
        observer: action.observer,
        other: action.other,
        prospective_student: action.prospective_student,
        student: action.student,
        ta: action.ta,
        launch_request: action.launch_request,
        username: action.username,
        userId: action.userId,
        context_id: action.context_id,
        context_label: action.context_label,
        context_title: action.context_title,
        ext_content: action.ext_content,
        outcome_service: action.outcome_service
      }
    case "update":
      return {
        admin: action.admin,
        alumni: action.alumni,
        content_developer: action.content_developer,
        guest: action.guest,
        instructor: action.instructor,
        manager: action.manager,
        member: action.member,
        mentor: action.mentor,
        none: action.none,
        observer: action.observer,
        other: action.other,
        prospective_student: action.prospective_student,
        student: action.student,
        ta: action.ta,
        launch_request: action.launch_request,
        username: action.username,
        userId: action.userId,
        context_id: action.context_id,
        context_label: action.context_label,
        context_title: action.context_title,
        ext_content: action.ext_content,
        outcome_service: action.outcome_service
      }
      case "reset":
        return {
          admin: '',
          alumni: '',
          content_developer: '',
          guest: '',
          instructor: '',
          manager: '',
          member: '',
          mentor: '',
          none: '',
          observer: '',
          other: '',
          prospective_student: '',
          student: '',
          ta: '',
          launch_request: '',
          username: '',
          userId: '',
          context_id: '',
          context_label: '',
          context_title: '',
          ext_content: '',
          outcome_service: ''
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