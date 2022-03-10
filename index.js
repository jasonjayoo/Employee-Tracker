const inquirer = require("inquirer");
const consoleTable = require("console.table");

// const connections = require("./db/connection.js");
// const schema = require("./db/schema.sql");
// const seeds = require("./db/seeds.sql");

const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employee_trackerDB",
});

// let sql = 'CREATE DATABASE employeetracker';

// connection.query(sql, (err, result) => {
//     if(err) throw(err)
//     console.log(result);
// });

// let employees = [];
// let roles = [];
// let departments = [];

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected");
  init();
});

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "Please choose an option from the menu below: ",
        choices: [
          "Add An Employee?",
          "Add A Role?",
          "Add A Department?",
          "View all Employees?",
          "View all Roles?",
          "View all Departments?",
          "Update an Employee?",
          "Exit",
        ],
      },
    ])
    .then(function (res) {
      switch (res.options) {
        case "Add An Employee?":
          addEmployee();
          break;
        case "Add A Role?":
          addRole();
          break;
        case "Add A Department?":
          addDepartment();
          break;
        case "View all Employees?":
          viewAllEmployees();
          break;
        case "View all Roles?":
          viewAllRoles();
          break;
        case "View all Departments?":
          viewAllDepartments();
          break;
        case "Update an Employee?":
          updateEmployee();
          break;
        case "Exit":
          init();
          break;
      }
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "Enter their first name ",
      },
      {
        name: "lastname",
        type: "input",
        message: "Enter their last name ",
      },
      {
        name: "roles",
        type: "list",
        message: "What is their role? ",
        choices: selectRole(),
      },
      {
        name: "choice",
        type: "rawlist",
        message: "Whats their managers name?",
        choices: selectManager(),
      },
    ])
    .then(function (val) {
      let rolesId = selectRole().indexOf(val.roles) + 1;
      let managerId = selectManager().indexOf(val.choice) + 1;
      connection.query(
        "INSERT INTO employee SET first_name = ?, last_name = ?, manager_id = ?, roles_id = ?",
        [val.firstname, val.lastname, managerId, rolesId ],

        function (err) {
          if (err) throw err;
          console.table(val);
          init();
        }
      );
    });
}

//Select Role Quieries Role Title for Add Employee Prompt
let rolesArray = [];
function selectRole() {
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      rolesArray.push(res[i].title);
    }
  });
  return rolesArray;
}
//Select Role Quieries The Managers for Add Employee Prompt
let managersArray = [];
function selectManager() {
  connection.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        managersArray.push(res[i].first_name);
      }
    }
  );
  return managersArray;
}

//Add Employee Role
function addRole() {
  connection.query(
    "SELECT roles.department_id AS Department, roles.title AS Title, roles.salary AS Salary FROM roles",
    function (err, res) {
      inquirer
        .prompt([
          {
            name: "Department",
            type: "input",
            message: "Enter Dept ID Number? [ 1 = Sales, 2 = Engineering, 3 = Finance, 4 = Marketing] * MORE Depts @ View all Departments.]",
          },
          {
            name: "Title",
            type: "input",
            message: "What is the title of the role?",
          },
          {
            name: "Salary",
            type: "input",
            message: "What is the salary?",
          },
        ])
        .then(function (res) {
          connection.query(
            "INSERT INTO roles SET ?",
            {
              department_id: res.Department,
              title: res.Title,
              salary: res.Salary,
            },
            function (err) {
              if (err) throw err;
              console.table(res);
              init();
            }
          );
        });
    }
  );
}
