import requests
import json

canvas = "http://canvas.peerpal.io/api/v1/"
token = "XiDf3kWMYi8cjDGegnrs2Dcq0Vh6ay98yHs65eHoqxf8xvGO1zlWe8cES9L8hNHN"


def getCourseIds():
    response = requests.get(canvas + "courses.json?access_token=" + token)
    courseids = []
    # print(response.json())
    for i in response.json():
      # print (i["name"])
      # print (i["id"])
      courseids.append(i["id"])
    return courseids

def getEnrollment(courseid):
  response = requests.get(canvas + "courses/" + str(courseid) + "/enrollments?access_token=" + token)
  return response.json()
#print(getCourseIds(token))

def addEnrollment(courseid, user):
    response = requests.post(canvas + "courses/" + str(courseid) + "/enrollments?access_token=" + token, user)
    return response.json()

def getSubmissions(courseid, assignmentid):
  response = requests.get(canvas + "courses/" + str(courseid) + "/assignments/" + str(assignmentid) +"/submissions?access_token=" + token)
  return response.json()

def getAssignments(courseid):
  response = requests.get(canvas + "courses/" + str(courseid) + "/assignments?access_token=" + token)
  return response.json()

def getAssignment(courseid, assignmentid):
  response = requests.get(canvas + "courses/" + str(courseid) + "/assignments/" + str(assignmentid) + "?access_token=" + token)
  return response.json()

def getGroups(courseid):
  response = requests.get(canvas + "/courses/" + str(courseid) + "/groups?access_token="+token)
  groups = []
  for i in response.json():
    membership = getGroupMembership(i['id'])
    groups.append([i['name'],extractUser_ids(membership)])
  return groups

def extractUser_ids(membership):
  users = []
  for i in membership:
    users.append(i['user_id'])
  return users


def getGroupMembership(groupid):
  response = requests.get(canvas + "/groups/" + str(groupid) + "/memberships?access_token="+token)
  return response.json()

""" def makeSubmission(courseid, assignmentid, submission):
    response = requests.post(canvas + "courses/" + str(courseid) + "/assignments/" + str(assignmentid) + "/submissions?access_token=" + token, submission)
    return response.json()

def createSubmission(courseid, assignmentid, userid, files):
    response = requests.post(canvas + "courses/" + str(courseid) + "/assignments/" + str(assignmentid) + "/submissions/" + str(userid) + "/files?access_token=" + token, files)
    return response.json() """

hartline_id = 1
essay_assignment_id = 4
user_id = 24
user = {
  'course_id' : hartline_id,
  'enrollment[user_id]' : user_id,
  'enrollment[type]' : "TaEnrollment",
  'enrollment[enrollment_state]' : "active"
}
submission = {
  'submission[submission_type]': 'online_upload',
  'submission[file_ids][]': [8],
  'submission[user_id]': 7
}

#print(addEnrollment(hartline_id, user))
#print(getEnrollment(hartline_id))
#print(getAssignments(hartline_id))
#print(getGroups(hartline_id))
#print(getGroupMembership(1))
#print(getAssignment(hartline_id,essay_assignment_id))
#print(getSubmissions(hartline_id,essay_assignment_id))






