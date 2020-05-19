// Dependencies
const cTable = require('console.table');
const inquirer = require('inquirer');
const connection = require('./assets/config/connection');

// Action functionality
// const { empByMgr, addNewDept, addNewEmp, addNewRole, updateRole, updateMgr, deleteADept, deleteAnEmp, deleteARole } = require('./assets/scripts/app');

// Application initialization
function runStart() {
    const viewDepts = "View ALL departments";
    const viewEmps = "View ALL employees";
    const viewRoles = "View ALL Roles";
    const viewEmpByMgr = "View Employees by manager";
    const addDept = "Add a department";
    const addEmp = "Add an employee";
    const addRole = "Add a role";
    const updateEmpRole = "Update an employee role";
    const updateEmpMgr = "Update an employee manager";
    const deleteDept = "Delete a department";
    const deleteEmp = "Delete an employee";
    const deleteRole = "Delete a role";

    inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            viewDepts,
            viewEmps,
            viewRoles,
            // viewEmpByMgr,
            addDept,
            addEmp,
            addRole,
            updateEmpRole,
            updateEmpMgr,
            deleteDept,
            deleteEmp,
            deleteRole,
            "Exit"
        ]
    })
        .then(answer => {
            let result;
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
                // case viewEmpByMgr:
                //     mgrQuery();
                //     break;
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
                case updateEmpMgr:
                    updateMgr();
                    break;
                case deleteDept:
                    deleteADept();
                    break;
                case deleteEmp:
                    deleteAnEmp();
                    break;
                case deleteRole:
                    deleteARole();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        })
}

function addEmpDetails(roleData) {
    let mgrArray = ["None"];

    const mgrString = "SELECT id, first_name, last_name FROM employee";
    connection.query(mgrString, (err, data) => {
        if (err) throw err;

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
                if (answer.emp_mgr !== "None") {
                    console.log(mgrArray)
                    console.log(answer.emp_mgr)

                    const mgrSplit = answer.emp_mgr.split(" ");
                    console.log(mgrSplit[0])
                    console.log(mgrSplit[1])

                    console.log("This is the data:")
                    console.log(data)

                    choosenMgr = data.filter((e) => {
                        return e.first_name == mgrSplit[0] && e.last_name == mgrSplit[1];
                    })
                    console.log("This is the choosenMgr:")
                    console.log(choosenMgr)

                    const mgrId = choosenMgr[0].id;
                    console.log(mgrId)

                    mgr = mgrId;
                } else {
                    mgr = null;
                }

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

function addNewEmp() {
    let roleArray = ["Create New"];
    let roleQuery;

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

function addNewRole() {
    let deptsArray = [];
    let deptsQuery;

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

                // ** If role exists return

                choosenDept = deptsQuery.filter((dept) => {
                    return dept.name == answer.dept;
                })

                const deptId = choosenDept[0].id;

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

// function empByMgr(data) {
//     let choicesArray = [];

//     for (const mgr of data) {
//         choicesArray.push(`${mgr.first_name} ${mgr.last_name}`);
//     }

//     inquirer.prompt({
//         type: "list",
//         message: "Select the Manager to search:",
//         name: "manager",
//         choices: choicesArray
//     })
//         .then(answer => {
//             console.log('============================')
//             console.log('Employee By Manager')
//             console.log('============================')
//             console.log(answer.manager)
//             const queryString = "SELECT id, first_name, last_name FROM employee WHERE manager id  = ";
//             connection.query(queryString, (err, res) => {
//                 if (err) throw err;
//                 console.table(res)
//                 runStart();
//             })

//         });
// }

// function mgrQuery() {
//     const queryString = "SELECT first_name, last_name FROM employee WHERE manager_id IS NOT NULL";
//     connection.query(queryString, (err, data) => {
//         if (err) throw err;

//         empByMgr(data);
//     })
// }

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

function viewAllEmps() {
    console.log('============================')
    console.log('All Employees')
    console.log('============================')
    let queryString = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id ";
    queryString += "FROM employee INNER JOIN role ON role.id = employee.role_id ";
    queryString += "INNER JOIN department ON department.id = role.department_id ";
    queryString += "ORDER BY id ASC";
    connection.query(queryString, (err, res) => {
        if (err) throw err;
        console.table(res)
        runStart();
    })
}

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