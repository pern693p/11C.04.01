"use strict";

document.addEventListener("DOMContentLoaded", startStudentList);
document
  .querySelector("#house_picker")
  .addEventListener("change", showStudents);

let allStudentsData = [];

//   get json
function startStudentList() {
  async function getJson() {
    let jsonData = await fetch(
      "http://petlatkea.dk/2019/hogwartsdata/students.json"
    );

    allStudentsData = await jsonData.json();
    showStudents(allStudentsData);
  }
  getJson();
}

//   show student list
function showStudents(allStudentsData) {
  let selectedHouse = document.querySelector("#house_picker").value;
  let studentListElement = document.querySelector("#list");
  studentListElement.innerHTML = "";

  if (selectedHouse === "All") {
    allStudentsData.forEach(student => {
      showStudent(student);
    });
  } else {
    let filteredStudents = studentsInHouse(selectedHouse);
    filteredStudents.forEach(filterStudent => {
      showStudent(filterStudent);
    });
  }
}

function studentsInHouse(selectedHouse) {
  const students = allStudentsData.filter(filterFunction);

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

// clean data

// function cleanStudentsData(allStudentsData) {
//   allStudentsData.forEach(jsonObject => {
//     const student = object.create(studentData);
//     console.log(student);
//     // const str = student.split(" ");

//     // const firstName =
//     //   str[0].charAt(0).toUpperCase() + str[0].slice(1).toLowerCase();
//     // const middleName =
//     //   str[1].charAt(0).toUpperCase() + str[1].slice(1).toLowerCase();
//     // const lastName =
//     //   str[2].charAt(0).toUpperCase() + str[2].slice(1).toLowerCase();

//     // return { firstName, middleName, lastName };
//   });
// }
