// Dependencies
const inquirer = require('inquirer');
const connection = require('../config/connection');


module.exports = {
    viewAllDepts: () => {
        console.log('============================')
        console.log('viewAllDepts Hit on App')
        const queryString = "SELECT * FROM department";
        return connection.query(queryString, (err, res) => {
            if (err) throw err;
            return res;
        })

        console.table();
        console.log('============================')
    },

    viewAllEmps: () => {
        console.log('============================')
        console.log('viewAllEmps Hit on App')
        console.log('============================')
    },

    viewAllRoles: () => {
        console.log('============================')
        console.log('viewAllRoles Hit on App')
        console.log('============================')
    },

    empByMgr: () => {
        console.log('============================')
        console.log('empByMgr Hit on App')
        console.log('============================')
    },

    addNewDept: () => {
        console.log('============================')
        console.log('addNewDept Hit on App')
        console.log('============================')
    },

    addNewEmp: () => {
        console.log('============================')
        console.log('addNewEmp Hit on App')
        console.log('============================')
    },

    addNewRole: () => {
        console.log('============================')
        console.log('addNewRole Hit on App')
        console.log('============================')
    },

    updateRole: () => {
        console.log('============================')
        console.log('updateRole Hit on App')
        console.log('============================')
    },

    updateMgr: () => {
        console.log('============================')
        console.log('updateMgr Hit on App')
        console.log('============================')
    },

    deleteADept: () => {
        console.log('============================')
        console.log('deleteADept Hit on App')
        console.log('============================')
    },

    deleteAnEmp: () => {
        console.log('============================')
        console.log('deleteAEmp Hit on App')
        console.log('============================')
    },

    deleteARole: () => {
        console.log('============================')
        console.log('deleteARole Hit on App')
        console.log('============================')
    }
}

