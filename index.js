// Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');

// Action functionality
const { viewAllDepts, viewAllEmps, viewAllRoles, empByMgr, addNewDept, addNewEmp, addNewRole, updateRole, updateMgr, deleteADept, deleteAnEmp, deleteARole } = require('./assets/scripts/app');

// Create connection to database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: ""
});

// Connect to database
connection.connect(err => {
    if (err) throw err;

    console.log(`Connected by id ${connection.threadId}`)

    runStart();
})

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
            viewEmpByMgr,
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
                case viewEmpByMgr:
                    empByMgr();
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
                    deleteRole();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        })
}