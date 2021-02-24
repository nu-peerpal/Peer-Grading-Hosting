import React, { useEffect } from 'react';
import CanvasForm from './../../components/canvasForm';

function Canvas() {
  const taUserId = 1;
  const first_name = 'brad';
  const last_name = 'ramos';

  useEffect(() => {
    (async () => {
      console.log('Creating new user...')
      const res = await fetch(
        '/api/users',
        {
          body: JSON.stringify({
            canvasId: taUserId,
            lastName: last_name,
            firstName: first_name
          }),
          method: 'POST'
        });
      const result = await res.json()
      console.log(result);
      // result.user => 'brad ramos'
    })();
  }, [taUserId]); //only run if user Id is changed?
  return (
      <div className="Content">
        <CanvasForm></CanvasForm>

      </div>
  )
}

export default Canvas;