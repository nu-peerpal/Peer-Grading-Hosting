import React from 'react';
import styles from './styles/listcontainer.module.scss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Link from 'next/link'

function Info(props) { // Display list item description
  const dueDate = props.dueDate;
  const info = props.info;
  console.log('props:',props)
  if (dueDate) {
    let newDate = new Date(dueDate);
    let nextActionItem = props.actionItem
    let dateText = "Due " + (newDate.getMonth()+1)+'-' + newDate.getDate()+'-' + newDate.getFullYear();
    return <TableCell className={styles.info} > {dateText} </TableCell> 
  }
  else {
    return <TableCell className={styles.info}>{info}</TableCell>;
  }
}

function ListContainer(props) {
  function getData() {
    //console.log('list props:', props);
    var information = props;
    var link = "";
    // console.log({information});
    if (information.data) {
      return (
        information.data.map(x => {
          if (!x.data) x.data={};
          if (!x.submissionAlias) x.submissionAlias={};
          if (!information.link && x.link) link = x.link;
          if (information.link) link = information.link;
          if (!x.actionItem) x.actionItem='';

          return (
            <Link key={JSON.stringify(x)} href={{pathname: link, query: { name: x.name, id: x.canvasId, dueDate: x.assignmentDueDate, rubricId: x.rubricId, submissionId: x.data.submissionId, matchingId: x.data.id, subId: x.submissionAlias }}} className={styles.hov}>
              <TableRow className={styles.row}>
                <TableCell className={styles.name}>{x.name} <div className={styles.actionItem}> {x.actionItem} </div></TableCell>
          
                <Info dueDate={x.assignmentDueDate} info={x.info} actionItem={x.actionItem} />
              </TableRow>
            </Link>
          )
        }
        )
      )
    } else {
      return null;
    }
  }



  return (
    <Table className={styles.tables}>
      <TableHead className={styles.header}>
        <TableRow>
          <TableCell className={styles.hcell}>{props.name}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {getData()}
      </TableBody>
    </Table>
  )
}


export default ListContainer;