import React, { useState, useEffect } from "react";
import styles from "./styles/submitButton.module.scss";
import Button from "@material-ui/core/Button";
import Alert from '@material-ui/lab/Alert';

const CanvasForm = (props) => {
    const [showAlert, setShowAlert] = useState(false);
    console.log('canvasform props:',props);
    let alert = (
        <Alert style={{marginLeft: '5px'}} severity={props.submitSuccess ? "success" : "error"}>{props.submitAlert}</Alert>
    )

    return (
        <>
      <Button color="primary" variant="outlined" onClick={()=>{
          props.onClick().then(()=>setShowAlert(true));
        }}>
        {props.title}
      </Button>
        {showAlert ? alert : null}
      </>
    );
  };
  
  export default CanvasForm;