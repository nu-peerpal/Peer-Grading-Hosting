import React from 'react';
import styles from './styles/listcontainer.module.scss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Link from 'next/link'

function Info(props) {
  const dueDate = props.dueDate;
  const info = props.info;
  if (dueDate) {
    let newDate = new Date(dueDate);
    let dateText = "Due " + (newDate.getMonth()+1)+'-' + newDate.getDate()+'-' + newDate.getFullYear();
    return <TableCell className={styles.info}>{dateText}</TableCell>
  }
  else {
    return <TableCell className={styles.info}>{info}</TableCell>;
  }
}

class ListContainer extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props)
    this.getData = this.getData.bind(this);
  }

  getData = function () {
    var information = this.props;
    var list = "";
    var assignname = "";
    var student = information.student;
    // console.log({information});
    if (information.data) {
      return (
        information.data.map(x => {
          if (!x.data) x.data={};
          if (!x.submissionAlias) x.submissionAlias={};
          return (
            <Link key={JSON.stringify(x)} href={{pathname: information.link, query: { name: x.name, id: x.canvasId, dueDate: x.assignmentDueDate, rubricId: x.rubricId, submissionId: x.data.submissionId, matchingId: x.data.id, subId: x.submissionAlias }}} className={styles.hov}>
              <TableRow className={styles.row}>
                <TableCell className={styles.name}>{x.name}</TableCell>
                <Info dueDate={x.assignmentDueDate} info={x.info}/>
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

  render() {
    return (
      <Table className={styles.tables}>
        <TableHead className={styles.header}>
          <TableRow>
            <TableCell className={styles.hcell}>{this.props.name}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {this.getData()}
        </TableBody>
      </Table>
    )
  }
}


export default ListContainer;