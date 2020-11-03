import React, { useState } from 'react';
import styles from "./styles/canvas.module.css";
import ListContainer from '../components/listcontainer';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useSWR from 'swr';
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



class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        key: '',
        hashedKey: ''
      };
    //console.log(props)
  }
  render() {
    // const PR = this.state.PR
    // console.log(this.state)
    return (
      <div className="Content">
        <form className={styles.canvasForm} onSubmit={handleSubmit(this.state.key)}>
            <TextField value={this.state.key} onInput={ e=>this.setState({key: e.target.value})} label="Enter Canvas API key"></TextField>
            <div className={styles.canvasButton}>
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </div>
        </form>
        <div className={styles.canvasForm}>
            Key:{this.state.key}, Hashed key: {this.state.hashedKey}
        </div>
      </div>
    )
  }
}


export default Canvas;