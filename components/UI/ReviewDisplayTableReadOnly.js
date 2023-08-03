import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ReviewGradingTable from "./ReviewGradingTable";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles({
  tooltip: {
    fontSize: "14px",
    fontWeight: "normal"
  }
});

const sum = (lst,identity=0) => {
  return lst.reduce((a, b) => a + b, identity)
}

const prod = (lst,identity=1) => {
  return lst.reduce((a, b) => a * b, identity)
}

const ReviewDisplayTableReadOnly = ({
  assignmentRubric,
  peerMatchings,
  reviewerColumnTitle="Peer Reviews",
  pseudonymBase = "Peer"
}) => {

  const classes = useStyles();
  const reviewAverages = assignmentRubric.map(({ element }) => {
    const totalPoints = peerMatchings.reduce((acc, { review }) => {
      const section = review.find(section => section.element === element);
      return section.points + acc;
    }, 0);
    const average = totalPoints / peerMatchings.length;
    return parseFloat(average.toFixed(1));
  });

  const getReviewTotalPoints = review =>
    review.reduce((acc, section) => acc + section.points, 0);

  const totalPointsAvg = parseFloat(
    (
      peerMatchings.reduce(
        (acc, { review }) => acc + getReviewTotalPoints(review),
        0
      ) / peerMatchings.length
    ).toFixed(1)
  );
  const [textCopied, setTextCopied] = useState(false);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{reviewerColumnTitle}</TableCell>
          {assignmentRubric.map(({ element },i) => (
            <TableCell key={`rubric-element-${i}`}>{element}</TableCell>
          ))}
          <TableCell>Total</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {peerMatchings.map(({ firstName, lastName, review, userId }, index) => {
          return (
            <TableRow key={`submission-review-row-${index}`}>
              <TableCell>
                {`${pseudonymBase} ${index+1}`}
              </TableCell>

              {/* show points per section */}
              {assignmentRubric.map(({ element },i) => {
                const section = review.find(
                  section => section.element === element
                );

                return (
                  <TableCell key={`grade-cell-row-${index}-col-${i}`}>
                    {section.points}
                    <Tooltip
                      classes={{ tooltip: classes.tooltip }}
                      title={
                        <div style={{whiteSpace: "pre-wrap"}}>
                          {section.comment}
                        </div>
                      }
                      arrow
                    >
                    <div>[?]</div>
                    </Tooltip>
                  </TableCell>
                );
              })}

              {/* display total grade */}
              <TableCell>{getReviewTotalPoints(review)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ReviewDisplayTableReadOnly;
