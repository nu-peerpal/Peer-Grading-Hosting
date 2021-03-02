import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import SelectAssignmentForm from '../../components/selectAssignmentForm';
const canvasCalls = require("../../canvasCalls")

function CanvasSelect() {
  const taUserId = 1;
  const first_name = 'brad';
  const last_name = 'ramos';

  useEffect(() => {
    console.log('time to select course and assignment data')
    canvasCalls.getAssignments(canvasCalls.token, 1).then(response => console.log(response))
  }, []); //only run if user Id is changed?
  return (
      <div className="Content">
        <SelectAssignmentForm></SelectAssignmentForm>

      </div>
  )
}

export default CanvasSelect;