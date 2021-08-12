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
import { CopyToClipboard } from "react-copy-to-clipboard";
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';

const useStyles = makeStyles({
  tooltip: {
    fontSize: "14px",
    fontWeight: "normal"
  }
});

const ReviewDisplayTable = ({
  assignmentRubric,
  reviewRubric,
  peerMatchings,
  values,
  errors,
  state,
  presetComments,
  setPresetComments
}) => {
  const [upvotedGrades, setUpvotedGrades] = state;
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
    <>
      {peerMatchings.map(({ firstName, lastName, review, userId }) => {
        const [expandDisabled, setExpandDisabled] = useState(false);
        const [isRowOpen, setIsRowOpen] = useState(false);
        const [doneGrading, setDoneGrading] = useState(false);

        return (
          <ExpandingTableRow
            key={userId}
            numCols={review.length + 2}
            details={
              <ReviewGradingTable
                reviewRubric={reviewRubric}
                values={values}
                errors={errors}
                userId={userId}
                setIsRowOpen={setIsRowOpen}
                setDoneGrading={setDoneGrading}
                doneGrading={doneGrading}
                presetComments={presetComments}
                setPresetComments={setPresetComments}
              />
            }
            disabled={expandDisabled}
            isRowOpen={isRowOpen}
            setIsRowOpen={setIsRowOpen}
            doneGrading={doneGrading}
          >
            <TableCell>
              {firstName} {lastName} {doneGrading && <CheckCircleOutlinedIcon style={{fill: "green"}}/>}
            </TableCell>

            {/* show points per section */}
            {assignmentRubric.map(({ element }) => {
              const section = review.find(
                section => section.element === element
              );

              // will only be different if grade is already upvoted
              const filteredGrades = upvotedGrades[element].filter(
                grade => grade.userId !== userId
              );

              const toggleUpvote = () => {
                if (filteredGrades.length === upvotedGrades[element].length) {
                  // not already added, so add
                  setUpvotedGrades({
                    ...upvotedGrades,
                    [element]: [
                      ...upvotedGrades[element],
                      { ...section, userId }
                    ]
                  });
                } else {
                  // remove the added grade
                  setUpvotedGrades({
                    ...upvotedGrades,
                    [element]: filteredGrades
                  });
                }
              };
              const onCopyText = () => {
                setTextCopied(true);
                setTimeout(() => {
                  setTextCopied(false);
                }, 1500);
              };
              return (
                <TableCell>
                  {section.points}
                  <Tooltip
                    classes={{ tooltip: classes.tooltip }}
                    title={section.comment}
                    arrow
                  >
                    <CopyToClipboard text={section.comment} onCopy={onCopyText}>
                    <Button style={{ padding: 0}} onClick={(e) => e.stopPropagation()} >[?]</Button>
                      </CopyToClipboard>
                  </Tooltip>
                  <IconButton
                    size="small"
                    onMouseEnter={() => setExpandDisabled(true)}
                    onMouseLeave={() => setExpandDisabled(false)}
                    onClick={toggleUpvote}
                  >
                    {filteredGrades.length !== upvotedGrades[element].length ? (
                      <ThumbUpIcon fontSize="small" />
                    ) : (
                      <ThumbUpOutlinedIcon fontSize="small" />
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
        {reviewAverages.map(avg => (
          <TableCell style={{ fontWeight: 500 }}>{avg}</TableCell>
        ))}
        <TableCell style={{ fontWeight: 500 }}>{totalPointsAvg}</TableCell>
      </TableRow>
      <div style={{position: 'fixed', bottom: '5px', right: '5px', backgroundColor: 'green', color: 'white', padding: '5px', display: textCopied ? 'block' : 'none'}}>Text Copied</div>
    </>
  );
};

export default ReviewDisplayTable;
