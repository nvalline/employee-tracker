// Dependencies
const cTable = require('console.table');
const inquirer = require('inquirer');
const connection = require('./assets/config/connection');

// Application initialization
function runStart() {
    const viewDepts = "View ALL departments";
    const viewEmps = "View ALL employees";
    const viewRoles = "View ALL Roles";
    const addDept = "Add a department";
    const addEmp = "Add an employee";
    const addRole = "Add a role";
    const updateEmpRole = "Update an employee role";
    const deleteEmp = "Delete an employee";

    inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            viewDepts,
            viewEmps,
            viewRoles,
            addDept,
            addEmp,
            addRole,
            updateEmpRole,
            deleteEmp,
            "Exit"
        ]
    })
        .then(answer => {
            switch (answer.action) {
                case viewDepts:
                    viewAllDepts();
                    break;
                case viewEmps:
                    viewAllEmps();
                    break;
                case viewRoles:
                    viewAllRoles();
                    break;
                case addDept:
                    addNewDept();
                    break;
                case addEmp:
                    addNewEmp();
                    break;
                case addRole:
                    addNewRole();
                    break;
                case updateEmpRole:
                    updateRole();
                    break;
                case deleteEmp:
                    deleteAnEmp();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        })
}

// Add employee details
function addEmpDetails(roleData) {
    let mgrArray = ["None"];

    // Query employee table for data
    const mgrString = "SELECT id, first_name, last_name FROM employee";
    connection.query(mgrString, (err, data) => {
        if (err) throw err;

        // Concat employee/manager names
        let fullName = [];
        for (const mgr of data) {
            fullName = `${mgr.first_name} ${mgr.last_name}`;
            mgrArray.push(fullName);
        }


        inquirer.prompt([
            {
                type: "input",
                message: "Enter the new employee's first name:",
                name: "emp_fname"
            },
            {
                type: "input",
                message: "Enter the new employee's last name:",
                name: "emp_lname"
            },
            {
                type: "input",
                message: "Enter the salary:",
                name: "emp_salary"
            },
            {
                type: "list",
                message: "Select the employee's manager:",
                name: "emp_mgr",
                choices: mgrArray
            }
        ])
            .then(answer => {
                let mgr;
                // Split manager choice to identify id
                if (answer.emp_mgr !== "None") {
                    const mgrSplit = answer.emp_mgr.split(" ");

                    choosenMgr = data.filter((e) => {
                        return e.first_name == mgrSplit[0] && e.last_name == mgrSplit[1];
                    })

                    const mgrId = choosenMgr[0].id;

                    mgr = mgrId;
                } else {
                    mgr = null;
                }

                // Add employee to table
                const insertString = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                connection.query(insertString, [answer.emp_fname, answer.emp_lname, roleData[0].id, mgr], (err, result) => {
                    if (err) throw err;

                    console.log('============================')
                    console.log(`${answer.emp_fname} ${answer.emp_lname} was added!`)
                    console.log('============================')
                    runStart();
                })
            })
    })

}

// Add new department
function addNewDept() {
    inquirer.prompt({
        type: "input",
        message: "Enter the name of the Department:",
        name: "newDept"
    })
        .then(answer => {
            const queryString = "INSERT INTO department (name) VALUES (?);";
            connection.query(queryString, [answer.newDept], (err, result) => {
                if (err) throw err;
                console.log('============================')
                console.log(`${answer.newDept} was added!`)
                console.log('============================')
                runStart();
            })
        })
}

// Add new employee, check for role
function addNewEmp() {
    let roleArray = ["Create New"];
    let roleQuery;

    // Query for role data
    const queryString = "SELECT * FROM role";
    connection.query(queryString, (err, data) => {
        if (err) throw err;
        roleQuery = data;

        for (const role of roleQuery) {
            roleArray.push(role.title);
        }

        inquirer.prompt(
            {
                type: "list",
                message: "Enter the role of the new employee:",
                name: "emp_role",
                choices: roleArray
            }
        )
            .then(answer => {
                // If new role, prompted to first create role. Else pass roleData on to addEmpDetails
                if (answer.emp_role === "Create New") {
                    console.log("You must first create the role.")
                    addNewRole();
                } else {
                    roleData = roleQuery.filter((role) => {
                        return role.title == answer.emp_role;
                    })

                    addEmpDetails(roleData);
                }
            })
    })
}

// Add new role
function addNewRole() {
    let deptsArray = [];
    let deptsQuery;

    // Query for department data
    const queryString = "SELECT * FROM department";
    connection.query(queryString, (err, data) => {
        deptsQuery = data;

        for (const dept of deptsQuery) {
            deptsArray.push(dept.name);
        }

        inquirer.prompt([
            {
                type: "list",
                message: "Select the department to add a role:",
                name: "dept",
                choices: deptsArray
            },
            {
                type: "input",
                message: "Enter the name of the role",
                name: "role_name"
            }
        ])
            .then(answer => {
                // filter choice to determine department id
                choosenDept = deptsQuery.filter((dept) => {
                    return dept.name == answer.dept;
                })

                const deptId = choosenDept[0].id;

                // Add role to role table
                const insertString = "INSERT INTO role (title, department_id) VALUES (?, ?)";
                connection.query(insertString, [answer.role_name, deptId], (err, result) => {
                    if (err) throw err;
                    console.log('============================')
                    console.log(`${answer.role_name} was added!`)
                    console.log('============================')

                    runStart();
                })
            })
    })
}

// Delete an employee
function deleteAnEmp() {
    let empArray = ["Cancel"];
    let empQuery;

    // Query employee data
    const queryEmpString = "SELECT * FROM employee";
    connection.query(queryEmpString, (err, data) => {
        if (err) throw err;
        empQuery = data;

        // Concat employee names
        for (const name of empQuery) {
            fullName = `${name.first_name} ${name.last_name}`;
            empArray.push(fullName);
        }

        inquirer.prompt([
            {
                type: "list",
                message: "Select the employee to remove:",
                name: "emp_del",
                choices: empArray
            }
        ])
            .then(answer => {
                if (answer.emp_del === "Cancel") {
                    console.log('============================')
                    console.log("Delete Canceled")
                    console.log('============================')
                    runStart();
                } else {
                    const empSplit = answer.emp_del.split(" ");

                    choosenEmp = empQuery.filter((e) => {
                        return e.first_name == empSplit[0] && e.last_name == empSplit[1];
                    })

                    deleteEmployee(choosenEmp);
                }
            })
    })
}

// Delete Employee Query
function deleteEmployee(choosenEmp) {
    const queryString = "DELETE FROM employee WHERE id = ?";
    connection.query(queryString, [choosenEmp[0].id], (err, result) => {
        if (err) throw err;

        console.log('============================')
        console.log(`${choosenEmp[0].first_name} ${choosenEmp[0].last_name} was deleted!`)
        console.log('============================')

        runStart();
    })
}

// Update employee role
function updateRole() {
    let empArray = [];
    let empQuery;
    let roleArray = ["Create New"];
    let roleQuery;

    // Query for employee data
    const queryEmpString = "SELECT * FROM employee";
    connection.query(queryEmpString, (err, data) => {
        if (err) throw err;
        empQuery = data;

        for (const name of empQuery) {
            fullName = `${name.first_name} ${name.last_name}`;
            empArray.push(fullName);
        }
    })

    // Query for Role data
    const queryRoleString = "SELECT * FROM role";
    connection.query(queryRoleString, (err, data) => {
        if (err) throw err;
        roleQuery = data;

        for (const role of roleQuery) {
            roleArray.push(role.title);
        }

        inquirer.prompt([
            {
                type: "list",
                message: "Select the employee to update their role:",
                name: "emp_name",
                choices: empArray
            },
            {
                type: "list",
                message: "Select the new role:",
                name: "new_role",
                choices: roleArray
            }
        ])
            .then(answer => {
                if (answer.new_role === "Create New") {
                    console.log("You must first create the role.")
                    addNewRole();
                } else {
                    const empSplit = answer.emp_name.split(" ");

                    choosenEmp = empQuery.filter((e) => {
                        return e.first_name == empSplit[0] && e.last_name == empSplit[1];
                    })

                    roleData = roleQuery.filter((role) => {
                        return role.title == answer.new_role;
                    })

                    updateRoleDetails(choosenEmp, roleData);
                }
            })
    })
}

// Query to update role details
function updateRoleDetails(choosenEmp, roleData) {
    const queryString = "UPDATE employee SET role_id = ? WHERE id = ?";
    connection.query(queryString, [roleData[0].id, choosenEmp[0].id], (err, result) => {
        if (err) throw err;

        console.log('============================')
        console.log("The role was updated!")
        console.log('============================')

        runStart();
    })
}

// View All Departments
function viewAllDepts() {
    console.log('============================')
    console.log('All Departments')
    console.log('============================')
    const queryString = "SELECT * FROM department";
    connection.query(queryString, (err, res) => {
        if (err) throw err;
        console.table(res)
        runStart();
    })
}

// View All Employees
function viewAllEmps() {
    console.log('============================')
    console.log('All Employees')
    console.log('============================')
    let queryString = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, IFNULL(CONCAT_WS(' ', m.first_name, m.last_name), 'n/a') AS manager ";
    queryString += "FROM employee INNER JOIN role ON role.id = employee.role_id ";
    queryString += "INNER JOIN department ON department.id = role.department_id ";
    queryString += "LEFT JOIN employee m ON m.id = employee.manager_id "
    queryString += "ORDER BY id ASC";
    connection.query(queryString, (err, res) => {
        if (err) throw err;

        console.table(res)
        runStart();
    })
}

// View All Roles
function viewAllRoles() {
    console.log('============================')
    console.log('All Roles')
    console.log('============================')
    const queryString = "SELECT id, title FROM role";
    connection.query(queryString, (err, res) => {
        if (err) throw err;
        console.table(res)
        runStart();
    })
}

runStart();