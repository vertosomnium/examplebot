var Twit = require('twit');
var T = new Twit(require('./config.js'));
var politician = {slug: "hillary-donald", owner_screen_name: "papipaulina", count: 10, include_rts: false};

function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

function retweetLatest() {
	T.get('lists/statuses', politician, function (error, data) {
	  // console.log(error, data);

		for(var i = (data.length-1); i > 0; i--){
		  if (!error) {

			var retweetId = data[i].id_str;
			var retweetDate = data[i].created_at;
			// console.log(data[i].created_at + ': ' + retweetId);
			console.log(i + ': ' + retweetDate + ': ' + retweetId);

			T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
				if (response) {
					
					 console.log('Success! Check your bot, it should have retweeted something.')
					 sleep(2000);

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

var paulina = {screen_name: "papipaulina", count: 200};

function destroyTweets() {
	T.get('statuses/user_timeline', paulina, function (error, data) {
	  console.log(error, data);

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
setInterval(retweetLatest, 1000 * 60 * 60);
