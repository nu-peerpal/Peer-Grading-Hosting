const postAnnouncements = require("./announcements.js");
const postAssignments = require("./assignments.js");
const postCourses = require("./courses.js");
const postRubrics = require("./rubrics.js");

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
  } catch (err) {
    console.log(err.response.data);
  }
})();
