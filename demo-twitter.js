// Reads from twitter and turns the candle green if the sentiment is positive, and red if the sentiment is negative

'use strict';
var Playbulb = require('./playbulb');
var Twitter = require('twitter');
var sentiment = require('sentiment');
var twitterCredentials = require('./demo-twitter-config');

var ready = false;
var pb;

function connect () {
    console.log("Connecting to candle...");
    pb = new Playbulb.PlaybulbCandle();
    pb.ready(function () {
        console.log("Connected to candle.");
        ready = true;
    });
}

setTimeout(connect, 0); // async connect to the candle

var client = new Twitter(twitterCredentials);

client.stream('statuses/sample', {}, function(stream) {
    console.log("Search running...");

    stream.on('data', function(tweet) {
        if (ready) {
            console.log(tweet.text);
            var value = sentiment(tweet.text);
            console.log(value);
            if (value.score > 0) {
                console.log("green");
                pb.setColor(255, 0, 255, 0);
            } else if (value.score < 0) {
                console.log("red");
                pb.setColor(255, 255, 0, 0);
            }
        } else {
            console.log(tweet);
        }
    });
 
    stream.on('error', function(error) {
        throw error;
    });
});

