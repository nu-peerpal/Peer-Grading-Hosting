const { CollectionsOutlined } = require("@material-ui/icons");
const axios = require("axios")
const { server } = require("./config/index.js");
// const { canvas, token } = require("./canvasConfig.js");

const canvas = "http://ec2-3-22-99-14.us-east-2.compute.amazonaws.com/api/v1/"
const token = "Z0yUTlhvaEPRnh0iuYdnZgI68qrluXPN5zgcQ2Ca47Xb5U5NO5cHy3lP882sRL7n"


// gets up to 300 users from a course given the courseId
const getUsers = async (token, courseId) => {
  const response = await axios.get(canvas + "courses/" + courseId + "/enrollments?per_page=300", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const users = response.data.map(user => {
    const name = user.user.short_name.split(' ');
    if (name.length==1) {
      name.push("")
    }
    return {
      canvasId: user.user_id,
      lastName: name[1],
      firstName: name[0],
      enrollment: user.type,
      courseId: user.course_id
    }
  });
  return users
}

// getUsers(token, 1).then(response => console.log(response))

// adds users to the db
const addUsers = (userData) => {
  const users = userData.map(user => {
    return {
      id: user.canvasId,
      canvasId: user.canvasId,
      lastName: user.lastName,
      firstName: user.firstName
    }
  })
  console.log("adding users", users);
  return axios.post(`${server}/api/users?type=multiple`, users)
}

// getUsers(token, 1).then(response => addUsers(response))

// gets assignments for a course given a courseid
const getAssignments = async (token, courseId) => {
  const response = await axios.get(canvas + "courses/" + courseId + "/assignments", {
    headers: { 'Authorization': `Bearer ${token}` } 
  })
  const assignments = response.data.map(assignment => {
    return {
      courseId: courseId,
      assignmentDueDate: assignment.due_at,
      canvasId: assignment.id,
      name: assignment.name,
      // assignmentGroup: assignment.assignment_group_id
    }
  })
  return assignments
}

// getAssignments(token, 1).then(response => console.log(response))

// axios.get(canvas + "courses/1/assignments/71", {
//   headers: { 'Authorization': `Bearer ${token}` } 
// }).then(res => console.log(res))


// gets list of courses associated with a user token
const getCourses = async (token) => {
  const response = await axios.get(canvas + "courses", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const courses = response.data.map(course => {
    if (!course.end_at) {
      var active = true
    } else {
      const today = new Date()
      const endDate = new Date(course.end_at)
      if (today > endDate) {
        var active = false;
      } else {
        var active = true;
      }
    }
    return {
      active: active,
      canvasId: course.id,
      courseName: course.name
    }
  })
  return courses
}

// getCourses(token).then(response => console.log(response))

// add courses to db
const addCourses = (courses) => {
  return axios.post(`${server}/api/courses?type=multiple`, courses)
}


// adds course enrollments to the db
const addCourseEnrollments = (userData) => {
  const enrollments = userData.map(user => {
    return {
      enrollment: user.enrollment,
      userId: user.canvasId,
      courseId: user.courseId
    }
  })
  return axios.post(`${server}/api/courseEnrollments?type=multiple`, enrollments)
}


// gets the groups for an assignment given couseId and assignmentId
const getGroups = async (token, courseId, assignmentId) => {
  const assignmentResponse = await axios.get(canvas + "courses/" + courseId + "/assignments/" + assignmentId, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  // console.log(assignmentResponse)
  const groupCategoryId = assignmentResponse.data.group_category_id
  const categoryResponse = await axios.get(canvas + "group_categories/" + groupCategoryId + "/groups", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const groups = await Promise.all(categoryResponse.data.map(async (group) => {
    const groupResponse = await axios.get(canvas + "groups/" + group.id + "/users", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const userIds = groupResponse.data.map(user => {
      return user.id
    })
    return {
      assignmentId: assignmentId,
      canvasId: group.id,
      userIds: userIds
    }
  }))
  return groups
}

// getGroups(token, 1, 6)

// adds groups to db
const addGroups = (groups) => {
  return axios.post(`${server}/api/groups?type=multiple`, groups)
}


// gets rubrics from a course given a courseId in raw format - used as input to create review assignment
const getAssignmentGroups = async (token, courseId) => {
  const response = await axios.get(canvas + "courses/" + courseId + "/assignment_groups", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const groups = response.data.map(groupObj => {
    return {
      id: groupObj.id,
      name: groupObj.name
    }
  })
  return groups
}

// getAssignmentGroups(token, 1).then(response => console.log(response))


// gets rubrics from a course given a courseId in raw format - used as input to create review assignment
const getRawRubrics = async (token, courseId) => {
  const response = await axios.get(canvas + "courses/" + courseId + "/rubrics", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

// getRawRubrics(token, 1).then(response => console.log(response))

// adds rubrics to db
const addRubrics = (rawRubrics) => {
  const rubrics = rawRubrics.map(rubricObj => {
    const rubric = rubricObj.data.map(rubricData => {
      return [rubricData.points, rubricData.description, rubricData.long_description]
    })
    // console.log({rubric: rubric});
    return {rubric: rubric}
  })
  // [{rubric: {rubricjson}}, {rubric 2: }]
  return axios.post(`${server}/api/rubrics?type=multiple`, rubrics);
}

// Gets submissions info for an assignment given a courseId and assignmentId
// If 'submissionType' is 'online_text_entry', the submission was submitted as text and the text will be under 'submission'
// If 'submissionType' is 'online_upload', the submission was submitted as pdf and the link to download will be under 'submission'
const getSubmissions = async (token, courseId, assignmentId) => {
  const response = await axios.get(canvas + "courses/" + courseId + "/assignments/" + assignmentId +"/submissions?include[]=group&per_page=300", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const filteredSubmissions = response.data.filter(submission => {
    return submission.workflow_state == 'submitted';
  })
  const submissions = filteredSubmissions.map(submission => {
    var submissionBody = submission.body
    if (submission.submission_type == 'online_upload') {
      submissionBody = submission.attachments[0].url
      // submissionBody = submission.preview_url; // possibly a way to get the document itself from this link
    }
    return {
      submissionType: submission.submission_type,
      submission: submissionBody,
      assignmentId: assignmentId,
      canvasId: submission.id,
      grade: submission.grade,
      groupId: submission.group.id,
      submitterId: submission.user_id,
    }
  })
  return submissions
}

// getSubmissions(token, 1, 6).then(response => console.log(response))


// posts a grade to a submission, given courseId, assignmentId, userId, grades array
const postGrades = (token, courseId, assignmentId, grades) => {
  const grade_data = {}
  var i = 0
  for (i = 0; i < grades.length; i++) {
    grade_data[grades[i][0]] = { posted_grade: grades[i][1] }
  }
  const data = {
    grade_data: grade_data
  }
  axios.post(canvas + "courses/" + courseId + "/assignments/" + assignmentId + "/submissions/update_grades", data, {
    headers: {'Authorization': `Bearer ${token}`}
  })
}

// postGrades(token, 1, 6, [[28, 8.5], [16, 9.5]])


// createReviewAssignment creates the review assignment in Canvas
// Arguments:
//  token: Canvas API token
//  courseId: Canvas ID of original assignment
//  assignmentId: Canvas ID of original assignment
//  assignmentName: Name of original assignment
//  dueDate: Due date for the new review assignment in ISO 8601 format, e.g. 2014-10-21T18:48:00Z
//  rubric: Rubric for the peer review
// 
// Additional notes:
//  - appealsDueDate not included because I have no idea what it is
//  - rubricId and reviewRubricId not included, because we currently have no use for them


async function createReviewAssignment(token, courseId, assignmentName, prName, prDueDate, prGroup, rubric) {
  console.log('pr due date: ',prDueDate)
  const data = {
    assignment: { 
      name: prName,
      due_at: prDueDate, //"2021-05-01T11:59:00Z"
      description: "Peer Review Assignment for " + assignmentName,
      published: true,
      assignment_group_id: prGroup,
      points: rubric.points_possible,
      submission_types: [ "external_tool" ],
      external_tool_tag_attributes: {
        url: 'http://localhost:8081',
        new_tab: true,
        external_data: '',
        content_type: 'ContextExternalTool',
      }
    }
  }
  const response = await axios.post(canvas + "courses/" + courseId + "/assignments", data, {
    headers: {'Authorization': `Bearer ${token}`}
  })
  const newAssignment = response.data
  const rubricData = {
    rubric_association: {
      rubric_id: rubric.id,
      association_id: newAssignment.id,
      association_type: "Assignment",
      purpose: "grading"
    }
  }
  axios.post(canvas + "courses/" + courseId + "/rubric_associations", rubricData, {
    headers: {'Authorization': `Bearer ${token}`}
  })
  const assignment = {
    reviewDueDate: newAssignment.due_at,
    reviewStatus: 0,
    reviewCanvasId: newAssignment.id,
    graded: false,
    name: assignmentName,
    courseId: parseInt(courseId),
  }
  return assignment
}

// getRawRubrics(token, 1).then(response => {
//   createReviewAssignment(token, 1, 7, "Peer Reviews Testing", null, "2021-08-25T05:59:59Z", response[0]).then(response => {
//     console.log(response)
//   })
// })

// adds assignment to the db
function addReviewAssignment(assignment) {
  return axios.post(`${server}/api/assignments`, assignment)
}



// function getPeerReviews(token, courseId, assignmentId) {
//   axios.get(canvas + "courses/" + courseId + "/assignments/" + assignmentId + "/peer_reviews", {
//     headers: { 'Authorization': `Bearer ${token}` }
//   }).then(response => {
//     console.log(response)
//   }).catch(error => console.log(error))
// }

// const addAnnouncements = async (token, courseid) => {
//   const currTable = await axios.get(`${server}/api/announcements?courseId=` + courseid)
//   axios.get(canvas + "announcements?&context_codes[]=course_" + courseid, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//   }).then(response => {
//     const announcements = response.data.map(announcement => {
//       return {
//         announcement: announcement.title,
//         courseId: courseid
//       }
//     })
//     for (i = 0; i < announcements.length; i++) {
//       currTable.data.data.forEach(currannouncement => {
//         if (currannouncement.announcement == announcements[i].announcement) {
//           announcements.splice(i, 1)
//         }
//       })
//     }
//     console.log(announcements)
//     // axios.post(`${server}/api/announcements?type=multiple`, announcements
//     //   ).then(response => console.log(response)
//     //   ).catch(error => console.log(error))
//   }).catch(error => console.log(error))
// }

// function addSubmissions(token, courseId, assignmentId) {
//   axios.get(canvas + "courses/" + courseId + "/assignments/" + assignmentId +"/submissions?&include[]=group&per_page=200", {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   }).then(response => {
//     const submissions = response.data.map(submission => {
//       if (submission.submitted_at != null) {
//         console.log(submission)
//         return {
//           assignmentId: assignmentId,
//           canvasId: submission.id,
//           grade: submission.grade,
//           groupId: submission.group.id
//         }
//       }
//     })
//     const filtered = submissions.filter(submission => {
//       return submission != null
//     })
//     console.log(filtered)
//     // axios.post(`${server}/api/submissions?type=multiple`, filtered
//     //   ).then(response => console.log(response)
//     //   ).catch(error => console.log(error))
//   }).catch(error => console.log(error))
// }

module.exports = {
  getAssignments,
  getAssignmentGroups,
  getSubmissions,
  getUsers,
  addUsers,
  getGroups,
  createReviewAssignment,
  addReviewAssignment,
  getRawRubrics,
  addRubrics,
  addCourses,
  token
}
