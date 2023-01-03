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
  if (dueDate) {
    let newDate = new Date(dueDate);
    let dateText = props.type + " Due: " + (newDate.getMonth()+1)+'-' + newDate.getDate()+'-' + newDate.getFullYear();
    return <TableCell className={styles.info} > {dateText} </TableCell>
  }
  else {
    return <TableCell className={styles.info}>{info}</TableCell>;
  }
}

function ListContainer(props) {
  function getData() {
    var information = props;
    var link = "";
    if (information.data && information.data.length) {
      return (
        information.data.map(x => {
          if (!x.data) x.data={};
          if (!x.submissionAlias) x.submissionAlias={};
          if (!information.link && x.link) link = x.link;
          if (information.link) link = information.link;
          if (!x.actionItem) {
            x.actionItem=[
              ... (!x.rubricId) ? ["no rubric set in canvas"] : [],
              ... (!x.assignmentDueDate) ? ["no due date set in canvas"] : []
            ].join("; ");

          }
          let date = '';
          let type = '';
          // console.log({x})

          // note: new assignments have no reviewStatus and should be stage 1 (enable for peer pal)
          switch(x.reviewStatus || 1) {
            case 1:
            case 2:
              date = x.assignmentDueDate;
              type = 'Assignment';
              break;

            case 3:
              date = x.reviewDueDate;
              type = 'Review';
              console.log("listing as review");
              break;

            case 4:
            case 5:
            case 6:
              type = 'Reviewed';
              date = '';
              break;

            case 7:
            case 8:
              type = 'Appeal';
              date = x.appealsDueDate;
              break;

            case 9:
            default:
              type = 'Completed';
              date = '';
          }

//        if (date)
//          console.log(`found date ${new Date(date)}`);

          const queryData = {
            name: x.name,
            id: x.canvasId,
            dueDate: date,
            rubricId: x.rubricId,
            submissionId: x.submissionId || x.data.submissionId,
            matchingId: x.matchingId || x.data.matchingId,
            subId: x.submissionAlias,
            reviewStatus: x.reviewStatus
          };


          return (
            <Link key={JSON.stringify(x)} href={{pathname: link, query: queryData}} className={styles.hov}>
              <TableRow className={styles.row}>
                <TableCell className={styles.name}>{x.name} <div className={styles.actionItem}> {x.actionItem} </div></TableCell>

                <Info dueDate={props.hideDueDate ? "" : date} info={x.info} actionItem={x.actionItem} type={type} />
              </TableRow>
            </Link>
          )
        }
        )
      )
    } else {
      return (
        <TableRow className={styles.row}>
          <TableCell className={styles.name}>
            {props.textIfEmpty || "nothing to see here"}
            </TableCell>
        </TableRow>
      );
    }
  }



  return (
    <Table className={styles.tables}>
      <TableHead className={props.alert ? styles.alertheader : styles.header}>
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
