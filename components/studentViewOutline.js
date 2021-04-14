import React, { useState, useEffect } from 'react';
import Button from "@material-ui/core/Button";
import { useUserData } from "./storeAPI";
import styles from "./styles/studentViewOutline.module.scss";
import Link from "next/link";
const canvasCalls = require("../canvasCalls");
const axios = require("axios");


function StudentViewOutline(props) {
    const { userId, courseId, revertFromStudent, savedStudentId } = useUserData();
    const [ canvasUsers, setCanvasUsers ] = useState(new Map());
    // console.log('studentview props',props);

    useEffect(() => {
        axios.get(`/api/canvas/users?courseId=${courseId}`).then(res => {
            let users = res.data.data;
            let peers = users.filter(user => user.enrollment == "StudentEnrollment");
            let customUsers = [];
            peers.forEach(obj => {
                customUsers.push({
                    name: obj["firstName"] + " " + obj["lastName"],
                    id: obj["canvasId"]
                });
            });
            // change data (array of objects) to a Map object
            let dataMap = new Map();
            for (var student of customUsers){
                dataMap.set(student.id, student.name)
            }
            setCanvasUsers(dataMap);
        });
    }, [])

    return (
        <div>
            <div className={savedStudentId ? styles.outline : styles.outline_invisible}>
                <div className={styles.outline__tag}>Viewing as {canvasUsers.get(userId)}</div>
            </div>
            <div className={savedStudentId ? styles.outline__revertButton : styles.outline__revertButton_invisible}>
            <Link href={"/"}>
                <Button onClick={() => {
                    revertFromStudent()
                    props.SetIsStudent(false);}}>Revert to TA</Button>
            </Link>
            </div>
        </div>
    )
};

export default StudentViewOutline;