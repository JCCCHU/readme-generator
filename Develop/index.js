const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
//const { prompts } = require("inquirer");
const { makeBadge, ValidationError } = require('badge-maker');
const writeFileAsync = util.promisify(fs.writeFile);
const mdutil = require("./utils/generateMarkdown");

const queryURL = "https://api.github.com/search/users?q=";

const badgeFormat = {
  label: 'build',
  message: 'passed',
  color: "green"
}

const githubUsername = [
  {
    type:"input",
    name:"username",
    message:"Provide your Github username to begin."
  }
];

const questions = [
  {
    type:"input",
    name:"title",
    message:"What is the name of your project?"
  },
  {
    type:"input",
    name:"description",
    message:"Describe your project."
  },
  {
    type:"input",
    name:"installation",
    message:"What are the steps to installing your project?"
  },
  {
    type:"input",
    name:"usage",
    message:"How do we use your project?"
  },
  {
    type:"list",
    name:"license",
    message:"How will the project be licensed?",
    choices:[
      "GNU GPL v3.0", //https://choosealicense.com/licenses/gpl-3.0/
      "MIT License", //https://choosealicense.com/licenses/mit/
      "No license" //I could allow the users to create their own license but that'll come later if ever
    ]
  },
  {
    type:"input",
    name:"contributing",
    message:"Do you have any guidelines for contributions?"
  },
  {
    type:"input",
    name:"tests",
    message:"Provide sample tests and instructions on how to run them."
  }
]

const userInfo = {
  githubAvatarURL:"",
  githubEmail:""
}

function writeToFile(fileName, data) {
}

function promptUser(questionSet) {
  return inquirer.prompt(questionSet);
}

async function init() {
  console.log("README Generator 2020");
  try {
    let input = await promptUser(githubUsername);
    console.log(queryURL + input.username);
    axios.get(queryURL+input.username).then(function(response) {
      console.log(response.data);
      console.log(response.data.items[0]);
      console.log(response.data.items[0].avatar_url);
      console.log(response.data.items[0].url);
      userInfo.githubAvatarURL = response.data.items[0].avatar_url;
      userInfo.githubEmail = response.data.items[0].url;
      console.log(userInfo);
      console.log("Successfully logged");
      readmeBuilder();
    })
  } catch(err) {
    console.log(err);
  }

}

async function readmeBuilder() {
  console.log("Generating prompts");
  try {
    let input = await promptUser(questions);
    input.githubAvatarURL = userInfo.githubAvatarURL;
    input.githubEmail = userInfo.githubEmail;

    const svg = makeBadge(badgeFormat);
    console.log(svg);

    input.badge = makeBadge({message:"world"});
    console.log("Successfully logged answers");
    console.log("Building README");
    console.log(input);
    let readme = mdutil.generateMarkdown(input);
    await writeFileAsync("result.md",readme);
    console.log("Readme built.");
  } catch(err) {
    console.log(err);
  }
}

init();