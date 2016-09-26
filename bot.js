var Twit = require('twit');
var T = new Twit(require('./config.js'));
var max = 765153606765412352;
var since = 764153606765412352;
var paulina = {
	screen_name: "papipaulina",
	count: 180
};

function sleep(milli) {
  	var currentTime = new Date().getTime();
		while (currentTime + milli >= new Date().getTime()) {
  }
}

function retweetLatest() {
	var politician = {
		slug: "hillary-donald",
		owner_screen_name: "papipaulina",
		count: 180,
		include_rts: false,
		since_id: since,
		max_id: max
	};
	T.get('lists/statuses', politician, function (error, data) {
	  // console.log(error, data);

		for (var i = (data.length - 1); i > 0; i--) {
		  if (!error) {

			var retweetId = data[i].id;
			var retweetDate = data[i].created_at;
			var lastTweet = data[0].id;
			console.log(i + ': ' + retweetDate + ': ' + retweetId);
			// console.log('a:' + a + ',' + 'b:' + b);
//			T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
//				if (response) {
//					 console.log('Success! Check your bot, it should have retweeted something.')
//					 sleep(2000);
//				}
//				if (error) {
//					 console.log('There was an error with Twitter:', error);
//				}
//			})
		  }
		  // However, if our original search request had an error, we want to print it out here.
		  else {
		  	console.log('There was an error with your hashtag search:', error);
		  }
		}
		since = lastTweet;
		max = since + 1000000000000000;
	});
}

function destroyTweets() {
	T.get('statuses/user_timeline', paulina, function (error, data) {
	  // console.log(error, data);

		for(var i = (data.length-1); i > 0; i--){
		  if (!error) {

			var retweetId = data[i].id_str;

			T.post('statuses/destroy/' + retweetId, { }, function (error, response) {
				if (response) {
					console.log('Success! Check your bot, it should have destroyed tweets.')
				}
				if (error) {
					console.log('There was an error with Twitter:', error);
				}
			})
		  }
		  else {
		  	console.log('There was an error with deleting tweets:', error);
		  }
		}
	});
}

retweetLatest();
// destroyTweets();

// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60

setInterval(retweetLatest, 1000 * 60 * 17); //retweet every 17 min
