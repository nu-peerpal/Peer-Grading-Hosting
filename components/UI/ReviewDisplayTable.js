import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

const ReviewDisplayTable = ({ rubric, peerMatchings }) => (
  <>
    {rubric.map(({ element }, i) => (
      <TableRow key={element}>
        <TableCell>{element}</TableCell>
        {peerMatchings.map(({ review }) => (
          <TableCell>{review[i].points}</TableCell>
        ))}
      </TableRow>
    ))}

    {/* Display peer review's total grade */}
    <TableRow>
      <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
      {peerMatchings.map(({ review }) => (
        <TableCell style={{ fontWeight: "bold" }}>
          {review.reduce((acc, section) => acc + section.points, 0)}
        </TableCell>
      ))}
    </TableRow>
  </>
);

export default ReviewDisplayTable;
