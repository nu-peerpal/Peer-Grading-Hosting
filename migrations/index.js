const postAnnouncements = require("./announcements.js");
const postAssignments = require("./assignments.js");
const postCourses = require("./courses.js");
const postGroups = require("./groups.js");
const postPeerMatchings = require("./peerMatchings.js");
const postRubrics = require("./rubrics.js");
const postSubmissions = require("./submissions.js");
const postUsers = require("./users.js");

(async () => {
  try {
    // Note: to run again, should clear database (or will fail)
    let res;

    res = await postCourses();
    console.log(res.data);

    res = await postAnnouncements();
    console.log(res.data);

    res = await postRubrics();
    console.log(res.data);

    res = await postAssignments();
    console.log(res.data);

    res = await postUsers();
    console.log(res.data);

    res = await postGroups();
    console.log(res.data);

    res = await postSubmissions();
    console.log(res.data);

    res = await postPeerMatchings();
    console.log(res.data);
  } catch (err) {
    console.log(err.response.data);
  }
})();
