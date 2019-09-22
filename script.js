"use strict";

document.addEventListener("DOMContentLoaded", startStudentList);
document.querySelector("#sort_by").addEventListener("change", sortBy);
document.querySelector("#house_picker").addEventListener("change", function() { studentsInHouse(this.value); });
document.querySelector("#expelled_picker").addEventListener("change", function() { expelledStudentsInHouse(this.value); });

let allStudentsData = [];
let cleanStudentsData = [];
let filteredStudentsData = [];
let housePickedValue = "All";
let isExpelledValue = "none";
let amountOfExpelledStudents = 0;
let bloodStudentData = [];

const studentData = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  house: "",
  pictureName: "",
  studentId: "",
  isExpelled: false,
  isExpellable: true,
  isPrefect: "false",
  isInSquad: false,
  bloodType: ""
};

const pernilleData = {
  "fullname" : "Pernille Geek Rislov",
  "gender" : "girl", 
  "house" : "Slytherin",
  "isExpelled" : false,
  "isExpellable" : false,
  "isPrefect": "false",
  "isInSquad": false,
  "bloodType" : "Pureblood"
}

//   Get JSON
function startStudentList() {
  async function getStudentsJson() {
    await getBloodJson();
    let getStudentsJson = await fetch(
      "http://petlatkea.dk/2019/hogwartsdata/students.json"
    );
    cleanData(await getStudentsJson.json());
  }
  async function getBloodJson() {
    let getBloodJson = await fetch(
      "http://petlatkea.dk/2019/hogwartsdata/families.json"
    );
    bloodStudentData = await getBloodJson.json();
  }
  getStudentsJson();
}

// Clean Json Data
function cleanData(allStudentsData) {
  allStudentsData.push(pernilleData);
  
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
    
    if (jsonObject.isExpellable == undefined) {
      cleanStudent.isExpellable = true;  
    } else {
      cleanStudent.isExpellable = JSON.parse(jsonObject.isExpellable);
    }

    const housetrim = jsonObject.house.trim();
    let house = housetrim;
    house = house.substring(0, 1).toUpperCase() + house.slice(1).toLowerCase();
    
    cleanStudent.house = house;
    cleanStudent.isExpelled = false;
    cleanStudent.isInSquad = false;
    cleanStudent.studentId = index;

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
    
     // Blood status
     if (bloodStudentData.half.includes(cleanStudent.lastName))  {
      cleanStudent.bloodType = "Halfblood";
    } else if (bloodStudentData.pure.includes(cleanStudent.lastName)) {
      cleanStudent.bloodType = "Pureblood";
    } else {
      cleanStudent.bloodType = "Muggleborn";
    }

    cleanStudentsData.push(cleanStudent);
  });

  showStudents(cleanStudentsData);
  showStudentsData(cleanStudentsData);
}


function showStudents(students) {
  let studentListElement = document.querySelector("#list");
  studentListElement.innerHTML = "";

  students.forEach(student => {
    let studentHouseClass = student.house.toLowerCase();
    let template = `
      <div id="${student.studentId}" class="student ${studentHouseClass}">
        <img class="studentImage" src=${student.pictureName}>
        <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
        <p>House: ${student.house}</p>
        <p>Blood type: ${student.bloodType}</p>
        <button id="expell" type="button" class="expelled-${student.isExpelled}">${student.isExpelled ? "Expelled" : "Expell student"}</button>
        <button id="squad" type="button" class="in-squad-${student.isInSquad}">${student.isInSquad ? "Remove" : "Put in squad"}</button>
      </div>`;
    studentListElement.insertAdjacentHTML("beforeend", template);
    studentListElement.lastElementChild.addEventListener("click", function(event) {
      event.preventDefault();
      openPopup(student);
    });
    studentListElement.lastElementChild.querySelector("#expell").addEventListener("click", function(event) {
      event.stopPropagation();
      expellStudent(student)
    });
    studentListElement.lastElementChild.querySelector("#squad").addEventListener("click", () => {
      event.stopPropagation();
      addOrRemoveFromSquad(student);
    });
  });
}

function openPopup(student){
  let popUpElement = document.querySelector("#popup");
  let studentHouseClass = student.house.toLowerCase();

  popUpElement.querySelector(".popup_wrapper").innerHTML = `
    <div class="popup_content ${studentHouseClass}" style="background-image: url(img/${student.house}_house.png)">
      <img src=${student.pictureName}>
      <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
      <p>${student.house}</p>
    </div>
    <div id="close">&times;</div>
  `;
  popUpElement.style.display = "block";
  popUpElement.querySelector("#close").addEventListener("click", () => {
    popUpElement.style.display = "none";
  });
}

function expellStudent(student) {
  let audio = new Audio('audio/magic_wand.mp3');
  
  if (student.isExpellable) {
    audio.play();
    student.isExpelled = true; 
    amountOfExpelledStudents = amountOfExpelledStudents += 1;
    document.getElementById(student.studentId).classList.toggle("hide-animation")

    setTimeout(function(){
      let elem = document.getElementById(student.studentId);
      elem.parentNode.removeChild(elem);
    }, 1000);
    showStudentsData(cleanStudentsData);
  } else {
    alertUser("Cannot be expelled! Too much of a Geek");
  }
}

function addOrRemoveFromSquad(student) {
  if ((student.bloodType === "Pureblood") || (student.house === "Slytherin" && student.bloodType === "Pureblood")) {
    let house_picker = document.querySelector("#house_picker");
    let value = house_picker.value;

    if (!student.isInSquad) {
      student.isInSquad = true;
    } else {
      student.isInSquad = false;
    }
    if (value !== "none") {
      studentsInHouse(value);
    } else {
      showStudents(cleanStudentsData);
    }
  } else {
    alertUser('Only pure blood or pure blood from house Slytherin is allowed in squad')
  }
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
      if (student.isExpelled === JSON.parse(isExpelledValue)) {
        return true;
      } else if (isExpelledValue === "none") {
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

function showStudentsData(cleanStudentsData) {
  let totalStudentsElement = document.querySelector("#total_students");
  let totalExpelledStudentsElement = document.querySelector("#total_expelled");
  let totalNotExpelledStudentsElement = document.querySelector("#total_not_expelled");

  let gryffindor = cleanStudentsData.filter(obj => obj.house.includes("Gryffindor"));
  let hufflepuff = cleanStudentsData.filter(obj => obj.house.includes("Hufflepuff"));
  let slytherin = cleanStudentsData.filter(obj => obj.house.includes("Slytherin"));
  let ravenclaw = cleanStudentsData.filter(obj => obj.house.includes("Ravenclaw"));
  
  document.querySelector("#total_gryffindor").innerHTML = `Gryffindor: ${gryffindor.length}`;
  document.querySelector("#total_hufflepuff").innerHTML = `Hufflepuff: ${hufflepuff.length}`;
  document.querySelector("#total_slytherin").innerHTML = `Slytherin: ${slytherin.length}`;
  document.querySelector("#total_ravenclaw").innerHTML = `Ravenclaw: ${ravenclaw.length}`;
  
  totalExpelledStudentsElement.innerHTML = `Total number of expelled students: ${amountOfExpelledStudents}`;
  totalNotExpelledStudentsElement.innerHTML = `Total number of not expelled students: ${cleanStudentsData.length - amountOfExpelledStudents}`;
  totalStudentsElement.innerHTML = `Total number of students: ${cleanStudentsData.length}`;
};

function alertUser(message) {
  let audio = new Audio('audio/buzz.mp3');
  audio.play();
  setTimeout(function(){ alert(message); }, 300);
}

