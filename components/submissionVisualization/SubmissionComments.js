import React from 'react'
import styles from "../styles/submissionview.module.scss";

const SubmissionComments = ({peerReview, taReview, selectedComment, rubric}) => {
    const peerComments = peerReview ? peerReview.scores.map(score => score[1]) : []
    const taComments = taReview && taReview.instructorGrades ? taReview.instructorGrades.map(score => score.comment) : []
  
    const peerGrades = peerReview ? peerReview.scores.map(score => score[0]) : []
    const taGrades = taReview && taReview.instructorGrades ? taReview.instructorGrades.map(score => score.points) : []
    const maxPoints = rubric ? rubric.map(category => category.points) : []
  
    const labels = rubric ? rubric.map(category => category.description) : []
  
    // dynamically add/remove className based on current selectedComment
    return peerComments.map((peerComment, i) => (
      <SubmissionComment 
        peerGrade={peerGrades[i]} 
        taGrade={taGrades[i]}
        maxPoints={maxPoints[i]}
        peerComment={peerComment}
        taComment={taComments[i]}
        label={labels[i]}   
        selectedComment={selectedComment}
        index={i}     
      /> 
    ))
}

const SubmissionComment = ({peerGrade, taGrade, maxPoints, peerComment, taComment, label, selectedComment, index}) => {
  return (
    <div>
      <h3 className={styles.commentLabel}>{label}</h3>
      <div className={styles.contentContainer} key={`comment-${index}`}>
        <div className={`${styles.peerComment} ${selectedComment[0]==0 && selectedComment[1]==index ? styles.selectedComment : styles.unselectedComment}`} id={`peer-comment-${index}`}>
          <p style={{ 'font-size': "x-large" }}>{peerComment}</p>
          <p className={styles.scoreField}>YOUR SCORE: {peerGrade} / {maxPoints}</p>
        </div>
        <div className={`${styles.taComment} ${selectedComment[0]==1 && selectedComment[1]==index ? styles.selectedComment : styles.unselectedComment}`} id={`ta-comment-${index}`}>
          <p style={{ 'font-size': "x-large" }}>{taComment}</p>
          <p className={styles.scoreField}>TA SCORE: {taGrade} / {maxPoints}</p>
        </div>
      </div>
    </div>
  )

}

export default SubmissionComments