const { CollectionsOutlined } = require("@material-ui/icons");
const axios = require("axios")
const { server } = require("./config/index.js");

const canvas = "http://ec2-3-22-99-14.us-east-2.compute.amazonaws.com/api/v1/"
const token = "Z0yUTlhvaEPRnh0iuYdnZgI68qrluXPN5zgcQ2Ca47Xb5U5NO5cHy3lP882sRL7n"


// gets up to 300 users from a course given the courseId
const getUsers = async (token, courseId) => {
  const response = await axios.get(canvas + "courses/" + courseId + "/enrollments?per_page=300", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
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
  })
  return users
}

//getUsers(token, 1).then(response => console.log(response))

// adds users to the db
const addUsers = (userData) => {
  const users = userData.map(user => {
    return {
      canvasId: user.canvasId,
      lastName: user.lastName,
      firstName: user.firstName
    }
  })
  return axios.post(`${server}/api/users?type=multiple`, users)
}


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

// adds assignments to db
const addAssignments = (assignments) => {
  return axios.post(`${server}/api/assignments?type=multiple`, assignments)
}


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

// gets rubrics from a course given a courseId
const getRubrics = async (token, courseId) => {
  const response = await axios.get(canvas + "courses/" + courseId + "/rubrics", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const rubrics = response.data.map(rubricObj => {
    const rubric = rubricObj.data.map(rubricData => {
      return [rubricData.points, rubricData.description]
    })
    return rubric
  })
  return rubrics
}

// getRubrics(token, 1).then(response => console.log(response))

// adds rubrics to db
const addRubrics = (rubrics) => {
  return axios.post(`${server}/api/rubrics?type=multiple`, rubrics);
}

// Gets submissions info for an assignment given a courseId and assignmentId
// If 'submissionType' is 'online_text_entry', the submission was submitted as text and the text will be under 'submission'
// If 'submissionType' is 'online_upload', the submission was submitted as pdf and the link to download will be under 'submission'
const getSubmissions = async (token, courseId, assignmentId) => {
  const response = await axios.get(canvas + "courses/" + courseId + "/assignments/" + assignmentId +"/submissions?&include[]=group&grouped=1&per_page=300", {
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
    }
    return {
      submissionType: submission.submission_type,
      submission: submissionBody,
      assignmentId: assignmentId,
      canvasId: submission.id,
      grade: submission.grade,
      groupId: submission.group.id
    }
  })
  return submissions
}

// getSubmissions(token, 1, 6).then(response => console.log(response))



// createReviewAssignment creates the review assignment in Canvas
// Arguments:
//  token: Canvas API token
//  courseId: Canvas ID of original assignment
//  assignmentName: Name of original assignment
//  dueDate: Due date for the review assignment in ISO 8601 format, e.g. 2014-10-21T18:48:00Z
function createReviewAssignment(token, courseId, assignmentId, assignmentName, dueDate) {
  const data = {
    assignment: { 
      name: assignmentName + " Peer Review",
      due_at: dueDate, //"2021-05-01T11:59:00Z"
      description: "Peer Review Assignment for " + assignmentName,
      published: true,
      points_possible: 10
    }
  }
  axios.post(canvas + "courses/" + courseId + "/assignments", data, {
    headers: {'Authorization': `Bearer ${token}`}
  }).then(response => {
    const assignment = response.data
    const assignmentInfo = {
      courseId: courseId,
      canvasId: assignmentId,
      reviewCanvasId: assignment.id,
      reviewDueDate: assignment.due_at,
      reviewStatus: 1
    }
    console.log(assignmentInfo)
  })
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
  createReviewAssignment,
  getRubrics,
  token
}
