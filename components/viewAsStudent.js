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
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import StudentViewOutline from './studentViewOutline';

function ViewAsStudent() {
    const [currentUserId, setCurrentUserId] = useState('');
    const { userId, courseId, courseName, assignment, actAsStudent, revertFromStudent, savedStudentId } = useUserData();

    // ! change this to actual data formatted this way / as a map (see below)
    let mockData = [
        { name: 'Bradley Ramos', id: '7' },
        { name: 'Chelly Compendio', id: '8' },
        { name: 'Jonathan Liu', id: '9' }
    ]

    // change function for the dropdown
    const handleChange = (event) => {
        setCurrentUserId(event.target.value);
    };
    useEffect(() => {
        console.log('user id changed! now:', userId);
        console.log('saved id: ', savedStudentId);
    }, [userId])

    return (
        <Table className={styles.tables}>
            <TableHead className={styles.header}>
                <TableRow>
                    <TableCell className={styles.hcell}>View as Student</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                <Link href={{ pathname: '/', query: { name: 'name', id: 'userId' } }} className={styles.hov}>
                    <TableRow className={styles.row}>
                        <TableCell className={styles.name} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                View as Student
                            <FormControl variant="outlined" style={{marginLeft: '15px'}}>
                                    <InputLabel >Student</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        style={{ width: '200px'}}
                                        value={currentUserId}
                                        onChange={handleChange}
                                        label="UserID"
                                    >
                                        {mockData.map(student =>
                                            <MenuItem value={student.id}>{student.name}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                        </TableCell>

                        <TableCell className={styles.info}><Button onClick={currentUserId != '' ? () => actAsStudent(currentUserId) : null}>View</Button></TableCell>
                    </TableRow>
                </Link>

                <StudentViewOutline />

            </TableBody>
        </Table>
    )
};

export default ViewAsStudent;