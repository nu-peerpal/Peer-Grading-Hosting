import React, { cloneElement } from 'react';
import styles from './styles/accordioncontainer.module.scss';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';
// import StylesEngineProvider from "@material-ui/core/StylesEngineProvider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function Info(props) { // Display list item description
  const dueDate = props.dueDate;
  const info = props.info;
  if (dueDate) {
    let newDate = new Date(dueDate);
    let dateText = props.type + " Due: " + (newDate.getMonth()+1)+'-' + newDate.getDate()+'-' + newDate.getFullYear();
    return <div className={styles.info}>{dateText}</div>
  }
  else {
    return <div className={styles.info}>{info}</div>
  }
}

function AccordionContainer(props) {
  console.log("Styles " + JSON.stringify(styles));
  function getData() {
    var information = props;

    if (information.data && information.data.length) {
      return (
        information.data.map(x => {
          if (!x.data) x.data={};
          if (!x.submissionAlias) x.submissionAlias={};
          if (!x.actionItem) x.actionItem='';
          let date = '';
          let type = '';

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
          
          return (
            <Accordion key={JSON.stringify(x)} className={styles.accordion} disableGutters
            // <Accordion key={JSON.stringify(x)} className={styles.accordion} disableGutters
                elevation={0}
                sx={{
                  border: `10px solid #ff0000`,
                  '&:not(:last-child)': {
                    borderBottom: 0,
                  },
                  '&:before': {
                    display: 'none',
                  },}
                  }>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} className={styles.accordionsummary}>
                  <div className={styles.name}>{x.name}</div>
                  <div className={styles.actionItem}>{x.actionItem}</div>
                  <Info dueDate={date} info={x.info} actionItem={x.actionItem} type={type} className={styles.info}/>

                </AccordionSummary>
                <AccordionDetails className={styles.accordiondetails}>
                  {<props.children isStudent={information.student} name={x.name} id={x.canvasId} dueDate={date} rubricId={x.rubricId} submissionId={x.data.submissionId} matchingId={x.data.id} subId={x.submissionAlias} reviewStatus={x.reviewStatus}/>}
                </AccordionDetails>
            </Accordion>
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
    // <StyledEngineProvider injectFirst>
      <Table className={styles.tables}>
      {/* <Table> */}
        <TableHead className={props.alert ? styles.alertheader : styles.header}>
          <TableRow>
            <TableCell className={styles.hcell}>{props.name}</TableCell>
          </TableRow>
        </TableHead>

        {getData()}
      </Table>
    // </StyledEngineProvider>

  )
}


export default AccordionContainer;
