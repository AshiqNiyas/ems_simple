let nameinput = document.getElementById("nameinput");
let jobinput = document.getElementById("jobinput");
let salaryinput = document.getElementById("salaryinput");
let searchinput = document.getElementById("searchinput");
let addbtn = document.getElementById("addbtn");
let employees = JSON.parse(localStorage.getItem("employees")) || [];
let filteredEmployees = [...employees];
let table = document.getElementById("table");
let edit = false;
let editIndex = -1;
addEventListener("DOMContentLoaded", render);

function createID() {
  // create a unique id for each employee
  let id = Date.now();
  return id;
}

function addEmployee(e) {
  // add or update an employee based on the edit mode
  e.preventDefault();
  if (!edit) {
    if (nameinput.value && jobinput.value && salaryinput.value) {
      let employee = {
        id: createID(),
        name: nameinput.value,
        job: jobinput.value,
        salary: salaryinput.value,
      };

      employees.push(employee);
      localStorage.setItem("employees", JSON.stringify(employees));
      filteredEmployees = [...employees];
      console.log(employees);
      resetForm();
      render();
    } else {
      alert("Please fill all fields");
    }
  } else {
    updateEmployee(editIndex);
    localStorage.setItem("employees", JSON.stringify(employees));
    filteredEmployees = [...employees];
    render();
  }
}

function updateButton() {
  // display button text based on edit mode
  !edit ? (addbtn.textContent = "Add employee") : (addbtn.textContent = "save");
}

function editmode(id) {
  // switch to edit mode and populate form with current employee to be edited
  if (edit) {
    return canceledit();
  }
  let index = employees.findIndex((em) => em.id === id);
  edit = true;
  updateButton();
  editIndex = id;
  render();
  if (index !== -1) {
    nameinput.value = employees[index].name;
    jobinput.value = employees[index].job;
    salaryinput.value = employees[index].salary;
  }
}

function canceledit() {
  // cancel the edit mode and reset the form
  edit = false;
  editIndex = -1;
  nameinput.value = "";
  jobinput.value = "";
  salaryinput.value = "";
  updateButton();
  render();
}

function updateEmployee(id) {
  // update the employee with the id
  const index = employees.findIndex((em) => em.id === id);
  if (index !== -1) {
    employees[index] = {
      id: id,
      name: nameinput.value,
      job: jobinput.value,
      salary: salaryinput.value,
    };
  }
  filteredEmployees = [...employees];
  canceledit();
  render();
}

function render() {
  // display the employyes from the localstorage or employees array
  updateButton();
  table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Job</th>
            <th>Salary</th>
            <th>Actions</th>

        </tr>
    `;
  filteredEmployees.forEach((el) => {
    table.innerHTML += `
        <tr>
            <td>${el.name}</td>
            <td>${el.job}</td>
            <td>${el.salary}</td>
            <td><button onclick="deleteEmployee(${el.id})">delete</button>
            <button onclick="editmode(${el.id})">${
      editIndex == el.id ? "cancel" : "edit"
    }</button></td>

        </tr>
        `;
  });
}

function deleteEmployee(id) {
  // delete the employee with unique id
  employees = employees.filter((em) => em.id !== id);
  filteredEmployees = [...employees];
  localStorage.setItem("employees", JSON.stringify(employees));
  render();
}

function resetForm() {
  // clear the form
  nameinput.value = "";
  jobinput.value = "";
  salaryinput.value = "";
}

function search(q) {
  // search for employee from the list
  let query = q.toLowerCase();
  filteredEmployees = employees.filter(
    (em) =>
      em.name.toLowerCase().includes(query) ||
      em.job.toLowerCase().includes(query) ||
      em.salary.includes(q)
  );
  render();
}

searchinput.addEventListener("input", () => {
  search(searchinput.value);
});

addbtn.addEventListener("click", addEmployee);
