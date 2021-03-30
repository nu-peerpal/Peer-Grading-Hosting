import { useStore } from "./store";

export const useUserData = () => {
  const {state, dispatch} = useStore();

  return {
    userId: state.user_id,
    courseId: state.context_id,
    courseName: state.context_name,
    roles: state.roles,
    assignment: state.assignment,
    createUser: (user) => dispatch({type: "createUser",
      user_id: user.user_id,
      context_id: user.context_id,
      context_name: user.context_name,
      instructor: user.instructor,
      ta: user.ta,
      student: user.student,
      admin: user.admin,
      assignment: user.assignment}),
    reset: () => dispatch({type: "reset"})
  }
}