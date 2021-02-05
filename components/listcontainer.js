import React from 'react';
import styles from './styles/listcontainer.module.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Link from 'next/link'


class ListContainer extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props)
    this.getData = this.getData.bind(this);
  }

  getData = function () {
    var information = this.props;
    //console.log('hi', information)
    var list = "";
    var assignname = "";
    var student = information.student;
    return (
      information.data.map(x => {
        return (
          <Link href={information.link} className={styles.hov}>
          <TableRow className={styles.row}>
            <TableCell className={styles.name}>{x.name}</TableCell>
            <TableCell className={styles.info}>{x.info}</TableCell>
          </TableRow>
          </Link>
        )
      }
      )
    )
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