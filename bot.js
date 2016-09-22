var Twit = require('twit');
var T = new Twit(require('./config.js'));
var politician = {slug: "hillary-donald", owner_screen_name: "papipaulina", count: 20, include_rts: false};

function retweetLatest() {
	T.get('lists/statuses', politician, function (error, data) {
	  console.log(error, data);

		for(var i = 0; i < data.length; i++){
		  if (!error) {

		  	// ...then we grab the ID of the tweet we want to retweet...
			var retweetId = data[i].id_str;

			// ...and then we tell Twitter we want to retweet it!
			T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
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
		}
	});
}

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
