// Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: ""
});

connection.connect(err => {
    if (err) throw err;

    console.log(`Connected by id ${connection.threadId}`)

    runStart();
})

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
            viewEmpByMgr,
            addDept,
            addEmp,
            addRole,
            updateEmpRole,
            updateEmpMgr,
            deleteDept,
            deleteEmp,
            deleteRole
        ]
    })
        .then(answer => {
            console.log(answer.action)
        })
}