import React, { cloneElement } from 'react';
import styles from './styles/selectreviewaccordian.module.scss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Link from 'next/link'
import { Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from '@material-ui/core/Typography';
import PeerReview from '../pages/peer_reviews/peerreview';

function Info(props) { // Display list item description
  const dueDate = props.dueDate;
  const info = props.info;
  if (dueDate) {
    let newDate = new Date(dueDate);
    let dateText = props.type + " Due: " + (newDate.getMonth()+1)+'-' + newDate.getDate()+'-' + newDate.getFullYear();
    // return <TableCell className={styles.info} > {dateText} </TableCell>
    return <div className={styles.info}>{dateText}</div>
  }
  else {
    // return <TableCell className={styles.info}>{info}</TableCell>;
    return <div className={styles.info}>{info}</div>
  }
}

function SelectReviewAccordian(props) {
  console.log("props", props);
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
          if (!x.actionItem) x.actionItem='';
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
          // console.log(x.name);
          // console.log(x.canvasID);
          console.log("canvas matching id", x.canvasId);
          console.log("should render", !!x.data.id);
          return (
            <Accordion key={JSON.stringify(x)} className={styles.accordion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} disableGutters="true">
                {/* <Link key={JSON.stringify(x)} href={{pathname: link, query: { name: x.name, id: x.canvasId, dueDate: date, rubricId: x.rubricId, submissionId: x.data.submissionId, matchingId: x.data.id, subId: x.submissionAlias, reviewStatus: x.reviewStatus}}} className={styles.hov}> */}
                <div className={styles.name}>{x.name}</div>
                {/* </Link> */}
                <div className={styles.actionItem}>{x.actionItem}</div>
                <Info dueDate={date} info={x.info} actionItem={x.actionItem} type={type} />

                {/* <TableRow className={styles.row}>
                    {/* <TableCell className={styles.name}>{x.name} <div className={styles.actionItem}> {x.actionItem} </div></TableCell> */}

                    
                {/* </TableRow> */}
                </AccordionSummary>
                <AccordionDetails>
                  {!!x.data.id && <props.children isStudent={x.isStudent} name={x.name} id={x.canvasId} dueDate={date} rubricId={x.rubricId} submissionId={x.data.submissionId} matchingId={x.data.id} subId={x.submissionAlias} reviewStatus={x.reviewStatus}/>}
                  {/* <props.children isStudent={x.isStudent} name={x.name} id={x.canvasId} dueDate={date} rubricId={x.rubricId} submissionId={x.data.submissionId} matchingId={x.data.id} subId={x.submissionAlias} reviewStatus={x.reviewStatus}/> */}

                </AccordionDetails>
            </Accordion>
            )
          }
          )
        )
            // <Accordion>
            //   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            //     <Typography>"Test"</Typography>
            //   </AccordionSummary>
            //   <AccordionDetails>
            //     <Typography>"Inner test"</Typography>
            //   </AccordionDetails>
            // </Accordion>
            // <PeerReview isStudent={x.isStudent} name={x.name} id={x.canvasId} dueDate={date} rubricId={x.rubricId} submissionId={x.data.submissionId} matchingId={x.data.id} subId={x.submissionAlias} reviewStatus={x.reviewStatus}/>

            
            
            // {/* </Link> */}
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

      {/* <TableBody> */}
        {getData()}
      {/* </TableBody> */}
    </Table>
  )
}


export default SelectReviewAccordian;
