import React, { useState } from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Collapse from "@material-ui/core/Collapse";

const ExpandingTableRow = ({ details, children, numCols }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover onClick={() => setOpen(!open)}>
        {children}
      </TableRow>

      <TableRow>
        <TableCell colSpan={numCols} style={{ padding: 0 }}>
          <Collapse in={open}>{details}</Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
export default ExpandingTableRow;
