// requires all installed programs
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employee_trackerDB",
});

// initials the application
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected");
  init();
});

// function to initialize the application with question prompts
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
          "Update Employee Managers?",
          "View Employees by Manager?",
          // "View Employees by Departments?",
          // "Delete Departments, Roles, and Employees",
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
        case "Update Employee Managers?":
          updateEmployeeManagers();
          break;
        case "View Employees by Manager?":
          viewEmployeeByManager();
          break;
        // case "View Employees by Departments?":
        //   viewEmployeesByDepartment();
        //   break;
        // case "Delete Departments, Roles, and Employees":
        //   deleteDepartmentsRolesEmployees();
        //   break;
        case "Exit":
          init();
          break;
      }
    });
}

// function to add new employees to existing database
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
        [val.firstname, val.lastname, managerId, rolesId],

        function (err) {
          if (err) throw err;
          console.table(val);
          init();
        }
      );
    });
}

//select role quieries Role Title for addEmployee function
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
//select role quieries for Managers to addEmployee function
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
            message:
              "Enter Dept ID Number? [ 1 = Sales, 2 = Engineering, 3 = Finance, 4 = Marketing] * MORE Depts @ View all Departments.]",
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

//Add Department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What department would you like to add?",
      },
    ])
    .then(function (res) {
      connection.query(
        "INSERT INTO department SET ? ",
        {
          name: res.name,
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          init();
        }
      );
    });
}

//View All Employees
function viewAllEmployees() {
  connection.query(
    "SELECT employee.roles_id, employee.first_name, employee.last_name, roles.title, roles.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN roles on roles.id = employee.roles_id INNER JOIN department on department.id = roles.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      init();
    }
  );
}

//View All Roles
function viewAllRoles() {
  connection.query(
    "SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles LEFT JOIN department on roles.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      init();
    }
  );
}

//View All Employees By Departments --- debugged -- error - not rendering
function viewAllDepartments() {
  connection.query("SELECT * FROM department;", function (err, res) {
    if (err) throw err;
    console.table(res);
    init();
  });
}

//Update Employee  --- debugged -- error after department is selected
function updateEmployee() {
  connection.query(
    "SELECT employee.last_name, roles.title FROM employee JOIN roles ON employee.roles_id = roles.id;",
    function (err, res) {
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: "lastname",
            type: "rawlist",
            choices: function () {
              let lastname = [];
              for (let i = 0; i < res.length; i++) {
                lastname.push(res[i].last_name);
              }
              return lastname;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "roles",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: selectRole(),
          },
        ])
        .then(function (val) {
          let rolesId = selectRole().indexOf(val.roles) + 1;
          connection.query(
            "UPDATE employee SET roles_id = ? WHERE last_name = ?",
            [rolesId, val.lastname],
            function (err) {
              if (err) throw err;
              console.table(val);
              init();
            }
          );
        });
    }
  );
}

// function to update an employees manager
function updateEmployeeManagers() {
  connection.query(
    "SELECT * FROM employee;",
    function (err, res) {
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: "lastname",
            type: "rawlist",
            choices: function () {
              let lastname = [];
              for (let i = 0; i < res.length; i++) {
                lastname.push(res[i].last_name);
              }
              return lastname;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "manager",
            type: "rawlist",
            message: "Who is the Employee's new manager? ",
            choices: function () {
              let lastname = res.map(({id, last_name})=>({
                name: `${last_name}`,
                value: id
              }));
              // for (let i = 0; i < res.length; i++) {
              //   lastname.push(res[i].last_name);
              // }
              return lastname;
            },
          },
        ])
        .then(function (val) {
          //let rolesId = selectRole().indexOf(val.manager) + 1;
          connection.query(
            "UPDATE employee SET manager_id = ? WHERE last_name = ?",
            [val.manager, val.lastname],
            function (err) {
              if (err) throw err;
              console.table(val);
              init();
            }
          );
        });
    }
  );
}

// function to update an employee by their manager
function viewEmployeeByManager(){
  connection.query("SELECT * FROM employee;",
  function (err, res) {
    if (err) throw err;
    //console.log(res);
    inquirer
      .prompt([
        {
          name: "manager",
          type: "rawlist",
          message: "Who is the Employee's new manager? ",
          choices: function () {
            let lastname = res.map(({id, last_name})=>({
              name: `${last_name}`,
              value: id
            }));
            // for (let i = 0; i < res.length; i++) {
            //   lastname.push(res[i].last_name);
            // }
            return lastname;
          },
        },
      ])
      .then(function (val) {
        //let rolesId = selectRole().indexOf(val.manager) + 1;
        connection.query(
          "SELECT * FROM employee WHERE manager_id = ?;",
          [val.manager],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            init();
          }
        );
      });
  })
  
  
}

// function to view employees by departments 
// function viewEmployeesByDepartment(){
//   connection.query("SELECT * FROM roles;",
//   function (err, res) {
//     if (err) throw err;
//     //console.log(res);
//     inquirer
//       .prompt([
//         {
//           name: "department_id",
//           type: "rawlist",
//           message: "What Department are you looking for? ",
//           choices: function () {
//             let rolesId = res.map(({roles_id})=>({
//               name: `${roles_id}`,
//               value: id
//             }));
//             // for (let i = 0; i < res.length; i++) {
//             //   lastname.push(res[i].last_name);
//             // }
//             return rolesId;
//           },
//         },
//       ])
//       .then(function (val) {
//         //let rolesId = selectRole().indexOf(val.manager) + 1;
//         connection.query(
//           "SELECT * FROM deparment WHERE department_id = ?;",
//           [val.department],
//           function (err, res) {
//             if (err) throw err;
//             console.table(res);
//             init();
//           }
//         );
//       });
//   })
  
  
// }

// // function to delete departments roles and employees
// function deleteDepartmentsRolesEmployees(){
//   connection.query()
// }
