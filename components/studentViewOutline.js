import React, { useState, useEffect } from 'react';
import Button from "@material-ui/core/Button";
import { useUserData } from "./storeAPI";
import styles from "./styles/studentViewOutline.module.scss";
import Link from "next/link";


function StudentViewOutline() {
    const { userId, revertFromStudent, savedStudentId } = useUserData();

    // ! change this to actual data formatted this way / as a map (see below)
    let mockData = [
        {name: 'Bradley Ramos', id: '7'},
        {name: 'Chelly Compendio', id: '8'},
        {name: 'Jonathan Liu', id: '9'}
    ]

    // change mock data (array of objects) to a Map object
    let mockDataMap = new Map();
    for (var student of mockData){
        mockDataMap.set(student.id, student.name)
    }

    return (
        <div>
            <div className={savedStudentId ? styles.outline : styles.outline_invisible}>
                <div className={styles.outline__tag}>Viewing as {mockDataMap.get(userId)}</div>
            </div>
            <div className={savedStudentId ? styles.outline__revertButton : styles.outline__revertButton_invisible}>
            <Link href={"/"}>
                <Button onClick={() => revertFromStudent()}>Revert to TA</Button>
            </Link>
            </div>
        </div>
    )
};

export default StudentViewOutline;