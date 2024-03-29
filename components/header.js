import React, { useState } from 'react';
import Link from 'next/link'
import styles from "./styles/header.module.scss";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { flexbox } from '@material-ui/system';
import axios from 'axios';
import { useUserData } from "./storeAPI";

const helpButtonStyle = {
    color: "black",
    backgroundColor: "lightgreen",
    padding: "10px",
    fontFamily: "Roboto",
    float: "right",
    position: "absolute",
    right: "10px",
    top: "10px"
};


function Header(props) {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState({
        value: ''
    });
    const handleClickOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };
    const { userId, courseId, courseName, assignment } = useUserData();
    async function handleSubmit(e) {
        setOpen(false);
        e.preventDefault()
        let res = await axios.post(`/api/sendemail?type=bug`, {
            userId: userId,
            message: text.value
        })
        console.log('res:',res);
    };
       
    const inputProps = {
        step: 300,
    };

    function updateText(e) {
        setText({value: e.target.value});
    };

    return (

        <div className={styles.header}>
            <Link href={"/"}>
                <h1 className={styles.header__name}>PeerPal</h1>
            </Link>
            <div>
                <Button style={helpButtonStyle} onClick={handleClickOpen}>Report Bug</Button>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Bugs/Issues</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Please describe any issues you are experiencing on this page.
                    </DialogContentText>
                    <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Brief description"
                    type="text"
                    inputProps={inputProps}
                    fullWidth
                    value={text.value}
                    onChange={updateText}
                    />
                </DialogContent>
                <DialogActions>
                    <Button label="Cancel" onClick={handleClose} color="primary">
                    Cancel
                    </Button>
                    <Button label="Submit" type="submit" onChange={updateText} onClick={handleSubmit} color="primary">
                    Submit Bug
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
        </div>
    )

};


export default Header;