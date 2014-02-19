/*
	miley.js
	An implementation of the MileyFeed project.
*/

var totalTweets = 0;
var tweetIDs = [];

$(document).ready(function() {
	getTweets();
	var intervalID = setInterval(getTweets, 5000);
});

function getTweets() {
	getRequester('http://miley.djroomba.com/feed/aeleti', addTweets);
}

function addTweets(response) {
	var tweetData = JSON.parse(response);

	//Iterating through Tweets
	for(var i = tweetData.length - 1; i >= 0; i--) {
		var currentTweet = tweetData[i];
		var tweetID = currentTweet.id;
		var fullname = currentTweet.user.name;
		var username = currentTweet.user.screen_name;
		var tweet_body_text = currentTweet.text;
		var profile_picture = currentTweet.user.profile_image_url;

		//Avoiding Duplicate Tweets
		if (tweetIDs.indexOf(tweetID) > -1) {
			console.log("Duplicate Removed");
			continue;
		}
		else {
			createTweet(profile_picture, fullname, username, tweet_body_text);
			tweetIDs.push(tweetID);
			totalTweets++;

			//Limiting Tweets to 100
			if (totalTweets > 100) {
				$('#tweet_list li:last-child').remove();
				totalTweets--;
			}
		}
	}
}

function createTweet(profile_picture, fullname, username, tweet_body_text_input) {
	var tweetList = document.getElementById('tweet_list');

	var tweet = document.createElement('li');
	tweet.className = "tweet";

	var profile_pic = document.createElement('img');
	profile_pic.className = "profile_picture";
	profile_pic.src = profile_picture;
	tweet.appendChild(profile_pic);

	var tweet_text = document.createElement('div');
	tweet_text.className = "tweet_text";
	tweet.appendChild(tweet_text);

	var tweet_heading_text = document.createElement('div');
	tweet_heading_text.className = "tweet_heading_text";
	tweet_text.appendChild(tweet_heading_text);

	var user_fullname = document.createElement('span');
	user_fullname.className = "fullname";
	user_fullname.innerHTML = fullname;
	tweet_heading_text.appendChild(user_fullname);

	var user_username = document.createElement('span');
	user_username.className = "username";
	user_username.innerHTML = "@" + username;
	tweet_heading_text.appendChild(user_username);

	var tweet_body_text = document.createElement('div');
	tweet_body_text.className = "tweet_body_text";
	tweet_body_text.innerHTML = tweet_body_text_input;
	tweet_text.appendChild(tweet_body_text);

	tweetList.insertBefore(tweet, tweetList.childNodes[0]);
}

function getRequester (url, callback) {
	// create a request object
	var request = new XMLHttpRequest();

	// specify the HTTP method, URL, and asynchronous flag
	request.open('GET', url, true);

	// add an event handler
	request.addEventListener('load', function(e){
	    if (request.status == 200) {
	        // do something with the loaded content
	        var content = request.responseText;
	        callback(content);
	    } else {
	        alert("Tweets could not be loaded.")
	    }
	}, false);

	// start the request, optionally with a request body for POST requests
	request.send(null);
}
