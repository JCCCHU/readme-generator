const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

const queryURL = "https://api.github.com/search/users?q=";

const questions = [
];

function writeToFile(fileName, data) {
}

function promptUser() {
  return inquirer.prompt([
    {
      type:"input",
      name:"username",
      message:"Provide your Github username to begin."
    }
  ]);
}

async function init() {
  console.log("README Generator 2020");
  try {
    let input = await promptUser();

    axios.get(queryURL+input.name).then(function(response) {
      writeFileAsync("result.md",response);
      console.log(response);
    })

    

    console.log("Successfully wrote to result.md");
    console.log(test);
  } catch(err) {
    console.log(err);
  }

}

init();
