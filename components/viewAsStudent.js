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
const canvasCalls = require("../canvasCalls");

function ViewAsStudent(props) {
    const [currentUserId, setCurrentUserId] = useState('');
    const [canvasUsers, setCanvasUsers] = useState([]);
    const { userId, courseId, courseName, assignment, actAsStudent, revertFromStudent, savedStudentId } = useUserData();

    // change function for the dropdown
    const handleChange = (event) => {
        setCurrentUserId(event.target.value);
    };
    useEffect(() => {
        canvasCalls.getUsers(canvasCalls.token, courseId).then(users => {
            let peers = users.filter(user => user.enrollment == "StudentEnrollment");
            let customUsers = [];
            peers.forEach(obj => {
                customUsers.push({
                    name: obj["firstName"] + " " + obj["lastName"],
                    id: obj["canvasId"]
                });
            });
            // console.log('custom users:',customUsers);
            setCanvasUsers(customUsers)});
    }, [])
    useEffect(() => {
        console.log('user id is now:', userId);
        console.log('saved id: ', savedStudentId);
    }, [userId])

    return (
        <div>
            <Table className={styles.tables}>
                <TableHead className={styles.header}>
                    <TableRow>
                        <TableCell className={styles.hcell}>View as Student</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    
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
                                            {canvasUsers.map(student =>
                                                <MenuItem key={JSON.stringify(student)} value={student.id}>{student.name}</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                            </TableCell>

                            <TableCell className={styles.info}>
                                <Link href={{ pathname: '/'}} className={styles.hov}>
                                    <Button onClick={currentUserId != '' ? () => {actAsStudent(currentUserId); props.SetIsStudent(true)} : null}>View</Button>
                                </Link>
                            </TableCell>
                        </TableRow>

                    

                </TableBody>
                
            </Table>
            <StudentViewOutline users={canvasUsers} />
        </div>
    )
};

export default ViewAsStudent;