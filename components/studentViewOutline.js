import React, { useState, useEffect } from 'react';
import Button from "@material-ui/core/Button";
import { useUserData } from "./storeAPI";
import styles from "./styles/studentViewOutline.module.scss";


function StudentViewOutline(props) {
    const { revertFromStudent, savedStudentId } = useUserData();

    return (
        <div>
            <div className={savedStudentId ? styles.outline : styles.outline_invisible}>
                <div className={styles.outline__tag}>Viewing as {props.name}</div>
            </div>
            <div className={savedStudentId ? styles.outline__revertButton : styles.outline__revertButton_invisible}>
                <Button onClick={() => revertFromStudent()}>Revert to TA</Button>
            </div>
        </div>
    )
};

export default StudentViewOutline;