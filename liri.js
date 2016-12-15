console.log("let's get started!");
//need keys for API
var keys = require("./keys.js");
//need fs package to read txt file and perform any other functions
var fs = require("fs");
//need inquirer to prompt questions/answers from user
var inquirer = require("inquirer");
//need request NPM package for omdb API requests
var request = require("request");
var twitter = require("twitter");
var spotify = require("spotify");
//look into fs properties and methods
fs.readFile("random.txt", "utf8", function (err, data) {
    //reformat data returned and store in variable
    var output = data.split(",");
    for (var i = 0; i < output.length; i++) {
        console.log(output[i]);
    }
});
//Store Keys in Variable
// keys.method
//Use Inquirer instead of Process
// console.log("Process Output: " + process.argv);
// var userCommand = process.argv[2];
//Create a prompt with a series of questions.
inquirer.prompt([{
        type: "list",
        message: "What is your command?",
        name: "name",
        choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says']
    }, {
        type: "input",
        message: "What song are you searching for?",
        name: "song name"
    }, {
        type: "input",
        message: "What movie are you searching for?",
        name: "movie"
    }, {
        type: "confirm",
        message: "Are you sure: ",
        name: "confirm",
        default: true
    }
    // {
    // Another Question if Applicable
    // }
    //Once done with questions then interact with answers
    //inquirer creates a user object that we can work with
]).then(function (user) {
    // Making JSON to read
    console.log(JSON.stringify(user));
    //if user object confirm property is true from prompt
    if (user.confirm) {
        console.log("success");
    } else {
        console.log("Error: Please Confirm Entry");
    }
});
// console.log("User Command" + userCommand);
// if (userCommand === "my-tweets") {
//     //this will show your last 20 tweets and when they were created
// } else if (userCommand === "spotify-this-song") {
//     //this will output artist(s) the song name a preview link of the song from spotify, the album that the song is from
//     // default to "The Sign" by Ace of Base
// } else if (userCommand === "movie-this") {
//     //movie data returned with default
// } else if (userCommand === "do-what-it-says") {
//     //get data from text file and run command 
// } else {
//     //alert to enter correct command
// }
// OMDB MOVIE REQUEST
request("http://www.omdbapi.com/?t=matrix&y=&plot=short&r=json", function (error, response, body) {
    //checking if request was successful
    if (!error && response.statusCode === 200) {
        console.log("Successful OMDB Call");
        //Getting data from returned JSON object body
        var valueNeeded = JSON.parse(body).property;
    }
});