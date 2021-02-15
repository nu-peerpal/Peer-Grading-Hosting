import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import styles from "./canvas.module.scss";
import SelectAssignmentForm from '../../components/selectAssignmentForm';

function CanvasSelect() {
  const taUserId = 1;
  const first_name = 'brad';
  const last_name = 'ramos';

  useEffect(() => {
    console.log('time to select course and assignment data')
  }, [taUserId]); //only run if user Id is changed?
  return (
      <div className="Content">
        <SelectAssignmentForm></SelectAssignmentForm>

      </div>
  )
}

export default CanvasSelect;