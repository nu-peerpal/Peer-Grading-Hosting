import React, { useState } from 'react';
import styles from "canvas.module.scss";
import ListContainer from '../../components/listcontainer';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useSWR from 'swr';
import { useStore } from "../components/store";
import Canvas_Data from "../components/Canvas_Data"
import {handleState} from "../components/storeAPI";
var bcrypt = require('bcryptjs');

const fetcher = url => fetch(url, { method: 'GET' }).then(r => r.json())

function savedCanvasKey() {
    var info = []
    const { data: all } = useSWR('/api/canvas/key', fetcher)
    console.log(all)
}

function handleSubmit(key) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(key, salt);
    console.log( 'hashed key:', hash); 
   // ..code to submit form to backend here...
}

function Canvas() {
  const { state, dispatch } = useStore();
  const { userId, student, ta, instructor, context_id, createUserState, updateState, resetState } = handleState();
  const [canvasKey, setCanvasKey] = useState('');
  const [stateVal, setStateVal] = useState('{}');
  const [hashedKey, setHashedKey] = useState('No key in DB');
  function handleStateUpdate(uid) {
    var new_uid = uid + 'brad_was_here'
    updateState(new_uid);
  }
  return (
      <div className="Content">
        <Canvas_Data></Canvas_Data>
        <br/>
        <div>
          userId: {userId}
          <br/>
            <div className={styles.canvasButton}>
              <div >
                  Update State
              </div>
            </div>
        </div>
        <br/>
        <form className={styles.canvasForm} onSubmit={handleSubmit(canvasKey)}>
            <TextField value={canvasKey} onInput={ e => setCanvasKey(e.target.value)} label="Enter Canvas API key"></TextField>
            <div className={styles.canvasButton}>
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </div>
        </form>
        <div className={styles.canvasForm}>
            Key:{canvasKey}, Hashed key: {hashedKey}
        </div>
      </div>
  )
}

export default Canvas;