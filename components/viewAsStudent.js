import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Link from 'next/link'
import styles from './styles/listcontainer.module.scss';
import Button from "@material-ui/core/Button";
import { useUserData } from "./storeAPI";

function ViewAsStudent() {
    const [currentUserId, setCurrentUserId] = useState('');
    const { userId, courseId, courseName, assignment, actAsStudent, revertFromStudent, savedStudentId } = useUserData();
    
    useEffect(() => {
        console.log('user id changed! now:', userId);
        console.log('saved id: ', savedStudentId);
      },[userId])

    return (
    <Table className={styles.tables}>
        <TableHead className={styles.header}>
            <TableRow>
            <TableCell className={styles.hcell}>View as Student</TableCell>
            <TableCell></TableCell>
            </TableRow>
        </TableHead>

        <TableBody>
            <Link  href={{pathname: '/', query: { name: 'name', id: 'userId'}}} className={styles.hov}>
                <TableRow className={styles.row}>
                <TableCell className={styles.name}>View as Student</TableCell>
                <TableCell className={styles.info}>View</TableCell>
                </TableRow>
            </Link>
            <Button onClick={() => actAsStudent('10')}>Act as User 10</Button>
            <Button onClick={() => revertFromStudent()}>Revert to TA</Button>
        </TableBody>
    </Table>
    )};

export default ViewAsStudent;