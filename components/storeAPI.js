import { useStore } from "./store";

export const handleState = () => {
  const {state, dispatch} = useStore();
  return {
    userId: state.userId,
    student: state.student,
    ta: state.ta,
    instructor: state.instructor,
    context_id: state.context_id, // aka the course id
    createUserState: (user) => dispatch({type: "create", admin: user.admin,
      alumni: user.alumni,
      content_developer: user.content_developer,
      guest: user.guest,
      instructor: user.instructor,
      manager: user.manager,
      member: user.member,
      mentor: user.mentor,
      none: user.none,
      observer: user.observer,
      other: user.other,
      prospective_student: user.prospective_student,
      student: user.student,
      ta: user.ta,
      launch_request: user.launch_request,
      username: user.username,
      userId: user.userId,
      context_id: user.context_id,
      context_label: user.context_label,
      context_title: user.context_title,
      ext_content: user.ext_content,
      outcome_service: user.outcome_service}),
    updateState: (updates) => {
      if (updates.length > 0) {
        for (key in updates[0].data) {
          state[key] = action[key]
        }
        dispatch({type: "update", admin: state.admin,
        alumni: state.alumni,
        content_developer: state.content_developer,
        guest: state.guest,
        instructor: state.instructor,
        manager: state.manager,
        member: state.member,
        mentor: state.mentor,
        none: state.none,
        observer: state.observer,
        other: state.other,
        prospective_student: state.prospective_student,
        student: state.student,
        ta: state.ta,
        launch_request: state.launch_request,
        username: state.username,
        userId: state.userId,
        context_id: state.context_id,
        context_label: state.context_label,
        context_title: state.context_title,
        ext_content: state.ext_content,
        outcome_service: state.outcome_service});
    } else return;
    },
    resetState: () => dispatch({type: "reset"})
  }
}