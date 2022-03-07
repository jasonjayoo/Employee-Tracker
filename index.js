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
          "View all Employees by their Roles?",
          "View all Employees by Departments?",
          "Update an Employee?",
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
        case "View all Employees by their Roles?":
          viewAllRoles();
          break;
        case "View all Employees by Departments":
          viewAllDepartments();
          break;
        case "Update an Employee?":
          updateEmployee();
          break;
        default:
          break;
      }
    });
}

