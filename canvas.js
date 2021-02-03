const { CollectionsOutlined } = require("@material-ui/icons");
const axios = require("axios")
const { server } = require("./config/index.js");

const canvas = "http://ec2-3-22-99-14.us-east-2.compute.amazonaws.com/api/v1/"
const token = "Z0yUTlhvaEPRnh0iuYdnZgI68qrluXPN5zgcQ2Ca47Xb5U5NO5cHy3lP882sRL7n"

//gets all courses
function addCourses(token) {
  axios.get(canvas + "courses", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
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
    axios.post(`${server}/api/courses?type=multiple`, courses
    ).then(response => console.log(response)
    ).catch(error => console.log(error))
  }).catch(error => console.log(error))
}

//gets up to 200 users
function addUsers(token, courseid) {
  axios.get(canvas + "courses/" + courseid + "/enrollments?per_page=200", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
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
    console.log(users)
    // axios.post(`${server}/api/users?type=multiple`, users
    //   ).then(response => console.log(response)
    //   ).catch(error => console.log(error))
  }).catch(error => console.log(error))
}

//gets announcements from the last 14 days
async function addAnnouncements(token, courseid) {
  console.log(token)
  const currTable = await axios.get(`${server}/api/announcements?courseId=` + courseid)
  console.log(currTable.data.data)
  axios.get(canvas + "announcements?&context_codes[]=course_" + courseid, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
  }).then(response => {
    const announcements = response.data.map(announcement => {
      return {
        announcement: announcement.title,
        courseId: courseid
      }
    })
    for (i = 0; i < announcements.length; i++) {
      currTable.data.data.forEach(currannouncement => {
        if (currannouncement.announcement == announcements[i].announcement) {
          announcements.splice(i, 1)
        }
      })
    }
    axios.post(`${server}/api/announcements?type=multiple`, announcements
      ).then(response => console.log(response)
      ).catch(error => console.log(error))
  }).catch(error => console.log(error))
}


function addGroups(token, courseid) {
  axios.get(canvas + "courses/" + courseid + "/groups", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
    const groups = response.data.map(group => {
      return {
        canvasId: group.id,
        //assignmentId: 
        //courseId?
      }
    })
    console.log(groups)
  })
}

function addGroupEnrollment(token, groupid) {
  axios.get(canvas + "groups/" + groupid + "/users", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
    const enrollments = response.data.map(group => {
      return {
        groupId: group.id,
        //assignmentId: 
        //courseId?
      }
    })
    // axios.post(`${server}/api/group_enrollments?type=multiple`, group_enrollments
    //   ).then(response => console.log(response)
    //   ).catch(error => console.log(error))
  })
}

async function getAssignments(token, courseid) {
  const response = await axios.get(canvas + "courses/" + courseid + "/assignments", {
    headers: { 'Authorization': `Bearer ${token}` } 
  })
  const assignments = response.data.map(assignment => {
    return {
      // courseId: courseid,
      assignmentDueDate: assignment.due_at,
      canvasId: assignment.id,
      name: assignment.name,
      // assignmentGroup: assignment.assignment_group_id
    }
  })
  return assignments
  // .then(response => {
  //   const assignments = response.data.map(assignment => {
  //     return {
  //       // courseId: courseid,
  //       assignmentDueDate: assignment.due_at,
  //       canvasId: assignment.id,
  //       name: assignment.name,
  //       // assignmentGroup: assignment.assignment_group_id
  //     }
  //   })
  //   console.log(assignments)
  // })
}

getAssignments(token, 17)

function addSubmissions(token, courseid, assignmentid) {
  axios.get(canvas + "courses/" + courseid + "/assignments/" + assignmentid +"/submissions?&include[]=group&per_page=200", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
    const submissions = response.data.map(submission => {
      if (submission.submitted_at != null) {
        console.log(submission)
        return {
          assignmentId: assignmentid,
          canvasId: submission.id,
          grade: submission.grade,
          groupId: submission.group.id
        }
      }
    })
    const filtered = submissions.filter(submission => {
      return submission != null
    })
    console.log(filtered)
    // axios.post(`${server}/api/submissions?type=multiple`, filtered
    //   ).then(response => console.log(response)
    //   ).catch(error => console.log(error))
  }).catch(error => console.log(error))
}


// courses/17/assignments?assignment[name]=Test Peer Review&assignment[due_at]=2021-02-01T11:59:00Z&assignment[description]=Peer Review Assignment for Test&assignment[group_category_id]=2&assignment[published]=true

function createReviewAssignment(token, courseid, assignmentid) {
  const data = {
    assignment: { 
      name: "Test Peer Review",
      due_at: "2021-02-01T11:59:00Z",
      description: "Peer Review Assignment for Test",
      published: true,
      points_possible: 10
    }
  }
  axios.post(canvas + "courses/" + courseid + "/assignments", data, {
    headers: {'Authorization': `Bearer ${token}`}
  }).then(response => {
    const assignment = response.data
    const assignmentinfo = {
      courseId: courseid,
      canvasId: assignmentid,
      reviewCanvasId: assignment.id,
      reviewDueDate: assignment.due_at,
      reviewStatus: 1
    }
    console.log(assignmentinfo)
  }).catch(error => {
    console.log(error)
  })
}

//createReviewAssignment(token, 17, 0)

//addSubmissions(token, 1, 6)

function getPeerReviews(token, courseid, assignmentid) {
  axios.get(canvas + "courses/" + courseid + "/assignments/" + assignmentid + "/peer_reviews", {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(response => {
    console.log(response)
  }).catch(error => console.log(error))
}

//getPeerReviews(token, 1, 2)
//addAssignments(token, 1)

module.exports = {
  addAnnouncements,
  getAssignments,
  createReviewAssignment
}