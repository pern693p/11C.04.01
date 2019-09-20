"use strict";

document.addEventListener("DOMContentLoaded", startStudentList);
document.querySelector("#house_picker").addEventListener("change", filterHouse);
document.querySelector("#sort_by").addEventListener("change", sortBy);
document.querySelector("#expelled_picker").addEventListener("change", filterExpelled);


let allStudentsData = [];
let cleanStudentsData = [];
let filteredStudentsData = [];
let notExpelledStudentsData = [];
let ExpelledStudentsData = [];
let housePickedValue = "All";
let isExpelledValue = "All";

const studentData = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  house: "",
  pictureName: "",
  studentId: "",
  expelled: "",
};

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
  allStudentsData.forEach(function (jsonObject, index) {
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
    cleanStudent.studentId = index;
    cleanStudent.expelled = "false";

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

  notExpelledStudentsData = cleanStudentsData;

  showStudents(cleanStudentsData);
  showAmountOfStudents();
  showHouseNumbers(cleanStudentsData);
}


function showStudents(students) {
  let studentListElement = document.querySelector("#list");
  studentListElement.innerHTML = "";

  students.forEach(student => {
    let template = `
      <div id="${student.studentId}" class="student">
        <img class="studentImage" src=${student.pictureName}>
        <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
        <p>${student.house}</p>
        <p>Is expelled:${student.expelled}</p>
        <button id="expell" type="button">Expell this student!</button>
      </div>`;
    studentListElement.insertAdjacentHTML("beforeend", template);
    
    document.getElementById(student.studentId).querySelector(".studentImage").addEventListener('click', event => { 
      popupStudent(student)
    });
    document.getElementById(student.studentId).querySelector("#expell").addEventListener('click', event => { 
      expellStudent(student)
    });
  });
}


function popupStudent(student){
  document.querySelector(".popup_content").innerHTML = `
    <div class="student">
      <img src=${student.pictureName}>
      <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
      <p>${student.house}</p>
    </div>
  `;
  document.querySelector("#popup").style.backgroundImage = `url(img/${student.house}_house.png)`;
  document.querySelector("#popup").style.display = "block";
  document.querySelector("#close").style.display = "block";
  document.querySelector("#close").addEventListener("click", () => {
    document.querySelector("#popup").style.display = "none";
    document.querySelector("#close").style.display = "none";
  });
}

function expellStudent(student){
  // notExpelledStudentsData.splice(student.studentId, 1); 
  // ExpelledStudentsData.push(student.studentId, 1);
  student.expelled = "true"; 
  console.log(student);

  document.getElementById(student.studentId).classList.toggle("hide-animation")
  setTimeout(function(){
    let elem = document.getElementById(student.studentId);
    elem.parentNode.removeChild(elem);
  }, 1000);
}

function filterHouse() {
  housePickedValue = this.value;
  studentsInHouse(housePickedValue);    
}

function filterExpelled() {
  isExpelledValue = this.value;
  expelledStudentsInHouse(isExpelledValue); 
}

function studentsInHouse(housePickedValue) {
  const students = cleanStudentsData.filter(filterFunction);
  filteredStudentsData = students;

  function filterFunction(student) {
    if (student.house === housePickedValue) {
      return true;
    } else if (housePickedValue === "All") {
      return true;
    } else {
      return false;
    }
  }
  showStudents(students);
}

function expelledStudentsInHouse(isExpelledValue) {
    const students = cleanStudentsData.filter(filterFunction);
    filteredStudentsData = students;
    
    function filterFunction(student) {
      if (student.expelled === isExpelledValue) {
        return true;
      } else if (isExpelledValue === "All") {
        return true;
      } else {
        return false;
      }
    }
    showStudents(students);
  }


function sortBy() {
  let sortData; 

  if(filteredStudentsData == null || filteredStudentsData.length === 0) {
    sortData = cleanStudentsData;
  } else {
    sortData = filteredStudentsData;
  }

  // Change filter
  let sort = this.value;
  console.log(sort);

  // If statement to sort by choice
  if (sort == "Firstname") {
    console.log(sort);
    // Function to sort by firstname

    sortData.sort(function(a, b) {
      return a.firstName.localeCompare(b.firstName);
    });
  } else if (sort == "Lastname") {
    console.log(sort);
    sortData.sort(function(a, b) {
      return a.lastName.localeCompare(b.lastName);
    });
  } else if (sort == "House") {
    console.log(sort);
    sortData.sort(function(a, b) {
      return a.house.localeCompare(b.house);
    });

    // Reset sort
  } else if (sort == "none") {
    // Call start function
    startStudentList();
  }
  // Call function to show studentlist again
  showStudents(sortData);
}

function showAmountOfStudents() {
  document.querySelector(
    "#total"
  ).innerHTML = `Total number of students: ${cleanStudentsData.length}`;
}

function showHouseNumbers(cleanStudentsData) {
  let gryffindor = cleanStudentsData.filter(obj =>
    obj.house.includes("Gryffindor")
  );
  let hufflepuff = cleanStudentsData.filter(obj =>
    obj.house.includes("Hufflepuff")
  );
  let slytherin = cleanStudentsData.filter(obj =>
    obj.house.includes("Slytherin")
  );
  let ravenclaw = cleanStudentsData.filter(obj =>
    obj.house.includes("Ravenclaw")
  );
  document.querySelector("#total_gryffindor").innerHTML = `Gryffindor: ${gryffindor.length}`;
  document.querySelector("#total_hufflepuff").innerHTML = `Hufflepuff: ${hufflepuff.length}`;
  document.querySelector("#total_slytherin").innerHTML = `Slytherin: ${slytherin.length}`;
  document.querySelector("#total_ravenclaw").innerHTML = `Ravenclaw: ${ravenclaw.length}`;
  // document.querySelector("#total_expelled").innerHTML = `${ravenclaw.length}`;
}
