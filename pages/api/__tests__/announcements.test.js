import { createTestClient } from "./testclient";
import db from "../../../models";
import announcementsHandler from "../announcements";

let appClient;
let entries = {
  courses: [
    {
      id: 1,
      active: true,
      canvasId: "1",
      courseName: "CS 111",
    },
  ],
  announcements: [
    {
      id: 1,
      announcement: "Hello",
      courseId: 1,
    },
    {
      id: 2,
      announcement: "How are you",
      courseId: 1,
    },
  ],
};

describe("announcement tests", () => {
  beforeAll(async (done) => {
    appClient = createTestClient(announcementsHandler);
    await db.connect();
    done();
  });

  beforeEach(async (done) => {
    await db.sequelize.sync({ force: true }); // drop then create all tables
    for (const table in entries) {
      const tableEntries = entries[table];
      await Promise.all(tableEntries.map((entry) => db[table].create(entry)));
    }
    done();
  });

  it("should get a list of announcements", async (done) => {
    const res = await appClient.get("?courseId=1");
    expect(res.statusCode).toEqual(200);
    const expectedRes = entries.announcements.map(({ announcement }) => ({
      announcement,
    }));
    expect(res.body).toEqual(expectedRes);
    done();
  });
});
