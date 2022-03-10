

DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- DEPARTMENT TABLE
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
 
);
-- ROLE TABLE 
CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);
-- EMPLOYEE TABLE 
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  roles_id INT,
  FOREIGN KEY (roles_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)

);

-- DEPARTMENT SEEDS 
INSERT INTO department (id, name)
VALUE (1, "Sales");
INSERT INTO department (id, name)
VALUE (2, "Engineering");
INSERT INTO department (id, name)
VALUE (3, "Finance");
INSERT INTO department (id, name)
VALUE (4, "Marketing");

-- EMPLOYEE ROLE SEEDS 
INSERT INTO roles (title, salary, department_id)
VALUE ("Marketing Manager", 110000, 4);
INSERT INTO roles (title, salary, department_id)
VALUE ("Marketing Associate", 80000, 4);
INSERT INTO roles (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ("Sales Manager", 90000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ("Sales Associate", 45000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ("Accountant", 95000, 3);


