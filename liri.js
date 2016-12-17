console.log("Let's get started with LIRI!");
//need keys for API
var keys = require("./keys.js");
//need fs package to read txt file and perform any other functions
var fs = require("fs");
//need inquirer to prompt questions/answers from user
var inquirer = require("inquirer");
//need request NPM package for omdb API requests
var request = require("request");
var Twitter = require("twitter");
var spotify = require("spotify");
//For Text File FS
var command = '';
var parameter = '';
// var textFile = false;
//Store Keys in Variable
keys = new Twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token_key,
    access_token_secret: keys.access_token_secret
});
var client = keys;
//Storing User Inputs in Variable
var userInput = '';
//Using Inquirer instead of Process
// console.log("Process Output: " + process.argv);
// var userCommand = process.argv[2];
// FUNCTIONS FOR RUNNING EACH COMMAND ===================
function spotifyCommand(file, parameter) {
    var songSearch;
    //Checking if from file
    //This is not DRY CODE I'm sure that there is a better way to do this programatically
    if (file === true) {
        songSearch = parameter;
        console.log("Searching for " + songSearch + "! Processing Request...");
        //Spotify Search via NPM
        spotify.search({
            type: 'track',
            query: songSearch
        }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            //setting base JSON object based on default or search
            var base = '';
            base = data.tracks.items[0];
            //show Spotify Search results
            console.log(" =============== ");
            console.log('* Song Name: ' + base.name);
            console.log('* Artist Name: ' + base.artists[0].name);
            console.log('* Album Name: ' + base.album.name);
            console.log('* Preview Link: ' + base.preview_url);
            console.log(" ================ ");
        });
    } else {
        //ask for song name and give default option
        inquirer.prompt(
            [{
                type: "input",
                message: "What song are you searching for? Press Enter for Default Search",
                name: "song"
            }]).then(function (user) {
            songSearch = user.song.trim();
            //if a default choice then search the sign
            if (user.song === undefined || user.song === '' || user.song === ' ') {
                songSearch = 'The Sign';
            }
            console.log("Searching for " + songSearch + "! Processing Request...");
            //Spotify Search via NPM
            spotify.search({
                type: 'track',
                query: songSearch
            }, function (err, data) {
                if (err) {
                    console.log('Error occurred: ' + err);
                    return;
                }
                //setting base JSON object based on default or search
                var base = '';
                if (songSearch === 'The Sign') {
                    base = data.tracks.items[6];
                } else {
                    base = data.tracks.items[0];
                }
                //show Spotify Search results
                console.log(" =============== ");
                console.log('* Song Name: ' + base.name);
                console.log('* Artist Name: ' + base.artists[0].name);
                console.log('* Album Name: ' + base.album.name);
                console.log('* Preview Link: ' + base.preview_url);
                console.log(" ================ ");
                userCommand = "spotify-this-song," + songSearch + ",";
                storingFile(userCommand);
            });
        });
    }
}

function movieCommand(file, parameter) {
    var movieName;
    //Checking if from file
    if (file === true) {
        movieName = parameter;
    }
    inquirer.prompt(
        [{
            type: "input",
            message: "What movie are you searching for? Press Enter for Default Search",
            name: "movie"
        }]).then(function (user) {
        // OMDB MOVIE REQUEST
        movieName = user.movie.trim();
        // Default Case if not entered
        if (movieName === undefined || movieName === '' || movieName === ' ' || movieName === null) {
            movieName = 'Mr.Nobody';
        }
        console.log(movieName);
        console.log("Searching for " + movieName + "! Processing Request...");
        //OMDB REQUEST
        request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
            //checking if request was successful
            if (!error && response.statusCode === 200) {
                console.log("Successful OMDB Call");
                //Getting data from returned JSON object body
                //show OMDB Search results
                var movie = JSON.parse(body);
                console.log(" =============== ");
                console.log('* Movie Title: ' + movie.Title);
                console.log('* Release Year: ' + movie.Year);
                console.log('* IMDB Rating: ' + movie.imdbRating);
                console.log('* Country: ' + movie.Country);
                console.log('* Plot: ' + movie.Plot);
                console.log('* Actors: ' + movie.Actors);
                console.log('* Rotten Tomatoes Rating: ' + movie.tomatoRating);
                console.log('* Rotten Tomatoes URL: ' + movie.tomatoURL);
                console.log(" ================ ");
                userCommand = "movie-this," + movieName + ",";
                storingFile(userCommand);
            }
        });
    });
}

function tweetCommand(file) {
    console.log('Getting Tweets...');
    client.get('favorites/list', function (error, tweets, response) {
        if (error) {
            console.log('error!');
        }
        for (var i = 0; i < 10; i++) {
            console.log("User Tweet Text: " + tweets[i].text + "  ");
        }
    });
}

function textFileCommand() {
    //look into fs properties and methods
    fs.readFile("random.txt", "utf8", function (err, data) {
        //reformat data returned and store in variable
        var output = data.split(",");
        // for (var i = 0; i < output.length; i++) {
        //      console.log(output[i]);
        // }
        command = output[0];
        parameter = output[1];
        if (command === "my-tweets") {
            //this will show your last 20 tweets and when they were created
            tweetCommand(true);
        } else if (command === "spotify-this-song") {
            //this will output artist(s) the song name a preview link of the song from spotify, the album that the song is from
            // default to "The Sign" by Ace of Base
            spotifyCommand(true, parameter);
        } else if (command === "movie-this") {
            //movie data returned with default
            movieCommand(true, parameter);
        } else {
            console.log('command not recognize restart and try again');
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
//Storing entries to file =====================
function storingFile(userAppend) {
    fs.appendFile('log.txt', userAppend, 'utf8', function (err) {
        if (err) {
            console.log('Error appending to file!');
        }
        console.log('Your entry was appended to file!');
    });
}