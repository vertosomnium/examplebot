var Twit = require('twit');
var T = new Twit(require('./config.js'));
var politician = {screen_name: "cybertwee", count: 1};

function retweetLatest() {
	T.get('statuses/user_timeline', politician, function (error, data) {
	  console.log(error, data);

	  if (!error) {

	  	// ...then we grab the ID of the tweet we want to retweet...
		// var retweetId = data.id_str[0];

		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/:id', {id: '777888357250572292' }, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
