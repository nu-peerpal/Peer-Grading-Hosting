import React, { useState } from "react";
import ExpandingTableRow from "./ExpandingTableRow.js";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ReviewGradingTable from "./ReviewGradingTable";

const useStyles = makeStyles({
  tooltip: {
    fontSize: "14px",
    fontWeight: "normal",
  },
});

const ReviewDisplayTable = ({
  assignmentRubric,
  reviewRubric,
  peerMatchings,
  values,
  errors,
  state,
}) => {
  const [upvotedGrades, setUpvotedGrades] = state;
  const classes = useStyles();

  const reviewAverages = assignmentRubric.map(({ element }) => {
    const totalPoints = peerMatchings.reduce((acc, { review }) => {
      const section = review.find((section) => section.element === element);
      return section.points + acc;
    }, 0);
    const average = totalPoints / peerMatchings.length;
    return parseFloat(average.toFixed(1));
  });

  const getReviewTotalPoints = (review) =>
    review.reduce((acc, section) => acc + section.points, 0);

  const totalPointsAvg = parseFloat(
    (
      peerMatchings.reduce(
        (acc, { review }) => acc + getReviewTotalPoints(review),
        0
      ) / peerMatchings.length
    ).toFixed(1)
  );

  return (
    <>
      {peerMatchings.map(({ firstName, lastName, review, user_id }) => {
        const [expandDisabled, setExpandDisabled] = useState(false);
        return (
          <ExpandingTableRow
            key={user_id}
            numCols={review.length + 2}
            details={
              <ReviewGradingTable
                reviewRubric={reviewRubric}
                values={values}
                errors={errors}
                userId={user_id}
              />
            }
            disabled={expandDisabled}
          >
            <TableCell>
              {firstName} {lastName}
            </TableCell>

            {/* show points per section */}
            {assignmentRubric.map(({ element }) => {
              const section = review.find(
                (section) => section.element === element
              );

              // will only be different if grade is already upvoted
              const filteredGrades = upvotedGrades[element].filter(
                (grade) => grade.userId !== user_id
              );

              const toggleUpvote = () => {
                if (filteredGrades.length === upvotedGrades[element].length) {
                  // not already added, so add
                  setUpvotedGrades({
                    ...upvotedGrades,
                    [element]: [
                      ...upvotedGrades[element],
                      { ...section, userId: user_id },
                    ],
                  });
                } else {
                  // remove the added grade
                  setUpvotedGrades({
                    ...upvotedGrades,
                    [element]: filteredGrades,
                  });
                }
              };

              return (
                <TableCell>
                  {section.points}
                  <Tooltip
                    classes={{ tooltip: classes.tooltip }}
                    title={section.comment}
                    arrow
                  >
                    <Button style={{ padding: 0 }}>[?]</Button>
                  </Tooltip>
                  <IconButton
                    size='small'
                    onMouseEnter={() => setExpandDisabled(true)}
                    onMouseLeave={() => setExpandDisabled(false)}
                    onClick={toggleUpvote}
                  >
                    {filteredGrades.length !== upvotedGrades[element].length ? (
                      <ThumbUpIcon fontSize='small' />
                    ) : (
                      <ThumbUpOutlinedIcon fontSize='small' />
                    )}
                  </IconButton>
                </TableCell>
              );
            })}

            {/* display total grade */}
            <TableCell>{getReviewTotalPoints(review)}</TableCell>
          </ExpandingTableRow>
        );
      })}

      <TableRow>
        <TableCell style={{ fontWeight: 500 }}>Average</TableCell>
        {reviewAverages.map((avg) => (
          <TableCell style={{ fontWeight: 500 }}>{avg}</TableCell>
        ))}
        <TableCell style={{ fontWeight: 500 }}>{totalPointsAvg}</TableCell>
      </TableRow>
    </>
  );
};

export default ReviewDisplayTable;
