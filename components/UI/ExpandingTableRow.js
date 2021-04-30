import React, { useState } from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Collapse from "@material-ui/core/Collapse";

const ExpandingTableRow = ({ details, children, numCols, disabled, doneGrading, isRowOpen, setIsRowOpen }) => {

  return (
    <>
      <TableRow style={{background: doneGrading ? 'lightgray' : 'white'}}
        hover
        onClick={() => {
          if (!disabled) {
            setIsRowOpen(!isRowOpen);
          }
        }}
      >
        {children}
      </TableRow>

      <TableRow>
        <TableCell colSpan={numCols} style={{ padding: 0}}>
          <Collapse in={isRowOpen}>{details}</Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
export default ExpandingTableRow;
