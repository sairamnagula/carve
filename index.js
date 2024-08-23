const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "institute.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("Server Running at http://localhost:4000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// GET API student
app.get("/student/", async (request, response) => {
  const getStudentsQuery = `
    SELECT
      *
    FROM
      student
    ORDER BY
      id;`;
  const studentsArray = await db.all(getStudentsQuery);
  response.send(studentsArray);
});

// GET API mentor
app.get("/mentor/", async (request, response) => {
  const getMentorQuery = `
    SELECT
      *
    FROM
      mentor
    ORDER BY
      id;`;
  const mentorsArray = await db.all(getMentorQuery);
  response.send(mentorsArray);
});

// POST API student
app.post("/student/", async (request, response) => {
  const studentDetails = request.body;
  const { Id, Name, availability, area_of_interest } = studentDetails;
  const addStudentQuery = `
    INSERT INTO
      student (Id,Name,availability, area_of_interest)
    VALUES
      (
         ${Id},
         ${Name},
         ${availability},
         ${area_of_interest},
      );`;

  const dbResponse = await db.run(addStudentQuery);
  const Id = dbResponse.lastID;
  response.send({ studentId: Id });
});

// POST API mentor
app.post("/mentor/", async (request, response) => {
  const mentorDetails = request.body;
  const { Id, Name, availability, area_of_expertise } = mentorDetails;
  const addMentorQuery = `
    INSERT INTO
      mentor (Id,Name,availability, area_of_expertise)
    VALUES
      (
         ${Id},
         ${Name},
         ${availability},
         ${area_of_expertise},
      );`;

  const dbResponse = await db.run(addMentorQuery);
  const Id = dbResponse.lastID;
  response.send({ mentorId: Id });
});
