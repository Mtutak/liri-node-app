console.log("Let's get started with LIRI!");
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
//Store Keys in Variable
// keys.method
//Using Inquirer instead of Process
// console.log("Process Output: " + process.argv);
// var userCommand = process.argv[2];
// FUNCTIONS FOR RUNNING EACH COMMAND ===================
function spotifyCommand() {
    inquirer.prompt(
        [{
            type: "input",
            message: "What song are you searching for? Press Enter for Default Search",
            name: "song"
        }]).then(function (user) {
        var songSearch = user.song.trim();
        if (user.song === undefined || user.song === '' || user.song === ' ') {
            songSearch = 'The Sign';
        }
        console.log("Searching for " + songSearch + "! Processing Request...");
        var spotify = require('spotify');
        spotify.search({
            type: 'track',
            query: songSearch
        }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            var base = '';
            if (songSearch === 'The Sign') {
                base = data.tracks.items[6];
            } else {
                base = data.tracks.items[0];
            }
            console.log(" =============== ");
            console.log('* Song Name :' + base.name);
            console.log('* Artist Name: ' + base.artists[0].name);
            console.log('* Album Name: ' + base.album.name);
            console.log('* Preview Link: ' + base.preview_url);
            console.log(" ================ ");
        });
    });
}

function movieCommand() {
    inquirer.prompt(
        [{
            type: "input",
            message: "What movie are you searching for?",
            name: "movie"
        }]).then(function (user) {
        console.log(JSON.stringify(user));
        // OMDB MOVIE REQUEST
        var movieName = "matrix";
        request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json", function (error, response, body) {
            //checking if request was successful
            if (!error && response.statusCode === 200) {
                console.log("Successful OMDB Call");
                //Getting data from returned JSON object body
                var valueNeeded = JSON.parse(body).property;
                console.log(valueNeeded);
            }
        });
    });
}

function tweetCommand() {
    console.log('Get Tweets');
}

function textFileCommand() {
    //look into fs properties and methods
    fs.readFile("random.txt", "utf8", function (err, data) {
        //reformat data returned and store in variable
        var output = data.split(",");
        for (var i = 0; i < output.length; i++) {
            console.log(output[i]);
        }
    });
}
// START INQUIRER QUESTION PROMPT =======================
inquirer.prompt([{
        type: "list",
        message: "What is your command?",
        name: "command",
        choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says']
    }, {
        type: "confirm",
        message: "Are you sure: ",
        name: "confirm",
        default: true
    }
    //Once done with questions then interact with answers
    //inquirer creates a user object that we can work with
]).then(function (user) {
    //if user object confirm property is true from prompt
    if (user.confirm) {
        console.log("Success!");
        if (user.command === "my-tweets") {
            //this will show your last 20 tweets and when they were created
            tweetCommand();
        } else if (user.command === "spotify-this-song") {
            //this will output artist(s) the song name a preview link of the song from spotify, the album that the song is from
            // default to "The Sign" by Ace of Base
            spotifyCommand();
        } else if (user.command === "movie-this") {
            //movie data returned with default
            movieCommand();
        } else if (user.command === "do-what-it-says") {
            //get data from text file and run command 
            textFileCommand();
        } else {
            console.log('command not recognize restart and try again');
        }
    } else {
        console.log("Error: Please Confirm Entry");
    }
});