import React from "react";
import ExpandingTableRow from "./ExpandingTableRow.js";
import TableCell from "@material-ui/core/TableCell";
import ReviewGradingTable from "./ReviewGradingTable";

const ReviewDisplayTable = ({
  assignmentRubric,
  reviewRubric,
  peerMatchings,
  values,
}) => (
  <>
    {peerMatchings.map(({ firstName, lastName, review, user_id }) => (
      <ExpandingTableRow
        key={user_id}
        numCols={review.length + 2}
        details={
          <ReviewGradingTable
            reviewRubric={reviewRubric}
            values={values}
            userId={user_id}
          />
        }
      >
        <TableCell>
          {firstName} {lastName}
        </TableCell>

        {/* show points per section */}
        {assignmentRubric.map(({ element }) => (
          <TableCell>
            {review.find((section) => section.element === element).points}{" "}
            <div
              style={{
                display: "inline",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              [?]
            </div>
          </TableCell>
        ))}

        {/* display total grade */}
        <TableCell style={{ fontWeight: "bold" }}>
          {review.reduce((acc, section) => acc + section.points, 0)}
        </TableCell>
      </ExpandingTableRow>
    ))}
  </>
);

export default ReviewDisplayTable;
