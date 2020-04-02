const inquirer = require('inquirer');
const jest = require('jest');
const fs = require('fs');
const Engineer = require('./Engineer');
const Manager = require('./Manager');
const Intern = require('./Intern');
const team = [];
let teamManager = '';

createTeam();

function createTeam() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Who is the manager of your team?',
            name: 'name'
        },
        {
            type: 'input',
            message: 'What is their email?',
            name: 'email'
        },
        {
            type: 'input',
            message: 'What is their ID?',
            name: 'id'
        },
        {
            type: 'input',
            message: 'What is their office number?',
            name: 'number'
        },
        
    ])
    .then(({name, email, id, number}) => {
        teamManager = new Manager(name, id, email, number);
    })
    .then(() =>{
        console.log('/////////////////Next Team member/////////////////');
        createMember();
    })
}


const createMember = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the role of the next team member?',
            name: 'role'
        },
        {
            type: 'input',
            message: 'What is their name?',
            name: 'name'
        },
        {
            type: 'input',
            message: 'What is their ID number?',
            name: 'id'
        },
        {
            type: 'input',
            message: 'What is their email?',
            name: 'email'
        }
    ])
    .then(({role, name, id, email}) => {
        switch (role.toLowerCase()) {
            case 'engineer':
                createEngineer(name, id, email);
                
                break;
            case 'intern':
                createIntern(name, id, email);
                
                break;
            default:
                console.log('Not a valid role');
                createMember();
        }
        
    })
}

const add = () => {
    inquirer.prompt({
        type: 'list',
        message: 'Would you like to add another member?',
        name: 'answer',
        choices: ['Yes', 'No']
    })
    .then(({answer}) => {
        if (answer == 'Yes') {
            console.log('/////////////////Next Team member/////////////////');
            createMember();
        } else {
            createHtml();
        }
    })
}


const createEngineer = (name, id, email) => {
    inquirer.prompt(
        {
            type: 'input',
            message: 'What is their GitHub?',
            name: 'github'
        }
    )
    .then(({github}) => {
        const engineer = new Engineer(name, id, email, github);
        team.push(engineer);
    })
    .then(() => {
        add();
    })
}

const createIntern = (name, id, email) => {
    inquirer.prompt(
        {
            type: 'input',
            message: 'What is their school?',
            name: 'school'
        }
    )
    .then(({school}) => {
        const intern = new Intern(name, id, email, school);
        team.push(intern);
    })
    .then(() => {
        add();
    })
}

const createHtml = () => {
    
    const team = addMember();
    
    const mainHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div id="team">
            <h1>My Team</h1>
        </div>

        <section>

        ${team}

        </section>
    </body>
    </html>
    `;

    fs.writeFile('team.html', mainHtml, (err) => {
        if (err) {
            throw err;
        }

        console.log('File written.');
    })

}


const addMember = () => {
    let template = `
        <section class="main">
            <div class="label">
                <h2 class="name">${teamManager.getName()}</h2>
                <img class="img" src="" alt="">
                <h3 class="role">Manager</h3>
            </div>

            <div class="info-container">
                <div class="info">
                    <h3>ID: ${teamManager.getId()}</h3>
                    <h4>Email: <a href="${teamManager.getEmail()}">${teamManager.getEmail()}</a></h4>
                    <h4>Office Number: ${teamManager.officeNumber}</h4>
                </div>
            </div>
        </section>
    `;

    for (let i = 0; i < team.length; i++) {
        const name = team[i].getName();
        const id = team[i].getId();
        const email = team[i].getEmail();
        const role = team[i].getRole();
        
        let other = '';
        if (role.toLowerCase() == 'engineer') {
            other = `GitHub: <a href="${team[i].getGithub()}">${team[i].getGithub()}</a>`;
        } else if (role.toLowerCase() == 'intern') {
            other = `School: ${team[i].getSchool()}`;
        }

        template += `

            <section class="main">
                <div class="label">
                    <h2 class="name">${name}</h2>
                    <img class="img" src="" alt="">
                    <h3 class="role">${role}</h3>
                </div>
            
                <div class="info-container">
                    <div class="info">
                        <h3>ID: ${id}</h3>
                        <h4>Email: <a href="${email}">${email}</a></h4>
                        <h4>${other}</h4>
                    </div>
                </div>
            </section>
        `;
    }
    return template;
}














