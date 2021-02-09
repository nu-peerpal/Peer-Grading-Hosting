import React, { useState } from 'react';
import { useStore } from "./store";

export default function Canvas_Data() {
  const {state, dispatch} = useStore();
  
  return (
      <div>
        admin: {state.admin},
        alumni: {state.alumni},
        content_developer: {state.content_developer},
        guest: {state.guest},
        instructor: {state.instructor},
        manager: {state.manager},
        member: {state.member},
        mentor: {state.mentor},
        none: {state.none},
        observer: {state.observer},
        other: {state.other},
        prospective_student: {state.prospective_student},
        student: {state.student},
        ta: {state.ta},
        launch_request: {state.launch_request},
        username: {state.username},
        userId: {state.userId},
        context_id: {state.context_id},
        context_label: {state.context_label},
        context_title: {state.context_title},
        ext_content: {state.ext_content},
        outcome_service: {state.outcome_service}
      </div>
  )
}