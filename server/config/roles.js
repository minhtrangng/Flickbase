const accessControl = require('accesscontrol');

const allRights = {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*']
}

let grantsObject = {
    admin: {
        testrole: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },
        profile: allRights,
        articles: allRights
    },
    user: {
        // testrole: {
        //     'read:any': ['*'],
        // }
        profile: {
            'read:own': ['*', '!password', '!_id'],
            'update:own': ['*'] 
        },
        articles: {
            'read:any': ['*']
        }
    }
}

const roles = new accessControl(grantsObject);

module.exports = { roles }