"use strict";

document.addEventListener("DOMContentLoaded", startStudentList);
document
  .querySelector("#house_picker")
  .addEventListener("change", showStudents);

//Sort-by dropdown
document.querySelectorAll("#sort-by").forEach(option => {
  option.addEventListener("change", sortBy);
});

let allStudentsData = [];
let cleanStudentsData = [];
let sort;

//   get json
function startStudentList() {
  async function getJson() {
    let jsonData = await fetch(
      "http://petlatkea.dk/2019/hogwartsdata/students.json"
    );

    allStudentsData = await jsonData.json();

    cleanData(allStudentsData);
  }
  getJson();
}

function cleanData(allStudentsData) {
  allStudentsData.forEach(jsonObject => {
    const cleanStudent = Object.create(studentData);
    const fullnametrim = jsonObject.fullname.trim();

    let studentNames = fullnametrim.split(" ");

    let firstName = studentNames[0];

    firstName =
      firstName.substring(0, 1).toUpperCase() +
      firstName.slice(1, firstName.length).toLowerCase();

    cleanStudent.firstName = firstName;

    if (studentNames.length == 2) {
      let lastName = studentNames[1];
      lastName =
        lastName.substring(0, 1).toUpperCase() +
        lastName.slice(1).toLowerCase();

      cleanStudent.lastName = lastName;
    } else if (studentNames.length == 3) {
      let middleName = studentNames[1];
      middleName =
        middleName.substring(0, 1).toUpperCase() +
        middleName.slice(1).toLowerCase();

      let lastName = studentNames[2];
      lastName =
        lastName.substring(0, 1).toUpperCase() +
        lastName.slice(1).toLowerCase();

      cleanStudent.middleName = middleName;
      cleanStudent.lastName = lastName;

      // MANGLER NICKNAME "ERNIE"
    }

    const housetrim = jsonObject.house.trim();
    let house = housetrim;
    house = house.substring(0, 1).toUpperCase() + house.slice(1).toLowerCase();
    cleanStudent.house = house;

    let studentPhotoName = studentNames[0].substring(0, 1).png;

    if (firstName === "Justin") {
      let lastName = studentNames[1].substring(6, studentNames[1].length);

      let studentPhotoName = `images/${lastName}_${studentNames[0]
        .substring(0, 1)
        .toLowerCase()}.png`;

      cleanStudent.pictureName = studentPhotoName;
    } else if (firstName === "Padma") {
      let lastName = studentNames[1].toLowerCase();
      lastName = lastName.toLowerCase();
      let photoName = `images/${lastName}_${studentNames[0]
        .substring(0, 4)
        .toLowerCase()}e.png`;

      cleanStudent.pictureName = photoName;
    } else if (firstName === "Parvati") {
      let lastName = studentNames[1].toLowerCase();
      lastName = lastName.toLowerCase();
      let photoName = `images/${lastName}_${studentNames[0].toLowerCase()}.png`;
      cleanStudent.pictureName = photoName;
    } else if (studentNames.length == 2) {
      let lastName = studentNames[1];

      lastName = lastName.toLowerCase();

      let studentPhotoName = `images/${lastName}_${studentNames[0]
        .substring(0, 1)
        .toLowerCase()}.png`;

      cleanStudent.pictureName = studentPhotoName;
    } else if (studentNames.length == 3) {
      let lastName = studentNames[2];

      lastName = lastName.toLowerCase();

      let studentPhotoName = `images/${lastName}_${studentNames[0]
        .substring(0, 1)
        .toLowerCase()}.png`;

      cleanStudent.pictureName = studentPhotoName;
    }

    cleanStudentsData.push(cleanStudent);
  });

  showStudents(cleanStudentsData);
}

const studentData = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  house: "",
  pictureName: ""
};

// FILTERING VIRKER IKKE ENDNU

function showStudents(cleanStudentsData) {
  let selectedHouse = document.querySelector("#house_picker").value;
  let studentListElement = document.querySelector("#list");
  studentListElement.innerHTML = "";

  if (selectedHouse === "All") {
    cleanStudentsData.forEach(student => {
      studentListElement.innerHTML += `
<div class="student">
<img src=${student.pictureName}>
    <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
    <p>${student.house}</p>

</div>`;
    });
  } else {
    let filteredStudents = studentsInHouse(selectedHouse);
    filteredStudents.forEach(filterStudent => {
      studentListElement.innerHTML += `
<div class="student">
<img src=${filterStudent.pictureName}>
    <h2>${filterStudent.firstName} ${filterStudent.middleName} ${filterStudent.lastName}</h2>
    <p>${filterStudent.house}</p>

</div>`;
    });
  }
}

let selectedHouse = document.querySelector("#house_picker").value;
let studentListElement = document.querySelector("#list");
studentListElement.innerHTML = "";

if (selectedHouse === "All") {
  cleanStudentsData.forEach(student => {
    showStudent(student);
  });
} else {
  let filteredStudents = studentsInHouse(selectedHouse);
  filteredStudents.forEach(filterStudent => {
    showStudent(filterStudent);
  });
}

function studentsInHouse(selectedHouse) {
  const students = cleanStudentsData.filter(filterFunction);

  function filterFunction(student) {
    if (student.house === selectedHouse) {
      return true;
    } else {
      return false;
    }
  }
  return students;
}

function showStudent(student) {
  let studentListElement = document.querySelector("#list");

  studentListElement.innerHTML += `
    <div class="student">
      <h2>${student.fullname}</h2>
      <p>${student.house}</p>
    </div>`;
}

function sortBy() {
  console.log("Sort json");

  // Change filter
  sort = this.value;
  console.log(sort);
  // If statement to sort by choice
  if (sort == "Firstname") {
    console.log(sort);
    // Function to sort by firstname

    cleanStudentsData.sort(function(a, b) {
      return a.firstName.localeCompare(b.firstName);
    });
  } else if (sort == "Lastname") {
    console.log(sort);
    cleanStudentsData.sort(function(a, b) {
      return a.lastName.localeCompare(b.lastName);
    });
  } else if (sort == "House") {
    console.log(sort);
    cleanStudentsData.sort(function(a, b) {
      return a.house.localeCompare(b.house);
    });

    // Reset sort
  } else if (sort == "none") {
    // Call start function
    startStudentList();
  }
  // Call function to show studentlist again
  showStudents(cleanStudentsData);
}

function studentsInHouse(selectedHouse) {
  const students = cleanStudentsData.filter(filterFunction);

  function filterFunction(student) {
    if (student.house === selectedHouse) {
      return true;
    } else {
      return false;
    }
  }
  return students;
}
