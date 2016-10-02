var Twit = require('twit');
var T = new Twit(require('./config.js'));
var max = 756000000005000001;

var paulina = {
	screen_name: "HeSheSaid2016",
	count: 180
};

var getIdTrump = {
	screen_name: "realdonaldtrump",
	count: 1,
	max_id: 746000000005000001
}
function sleep(milli) {
  	var currentTime = new Date().getTime();
		while (currentTime + milli >= new Date().getTime()) {
  }
}

function retweetLatest(user, max_id=765000000005000001) {
	var politician = {
		screen_name: user,
		count: 180,
		max_id: max_id
	};

	console.log("getting some tweets", politician)


	T.get('statuses/user_timeline', politician, function (error, data) {
		if (error) return console.log("ERROR", error)

	  // console.log(error, data);

		var lastTweet = data[0].id;
		since = lastTweet;

		timelines[user] = timelines[user].concat(data);

		if (max < 8000000000000000) {
			max += 1000000000000000;
			setTimeout(retweetLatest, 2000, user, max);
		}
		else {
			doneness[user] = true;
		}

	});
}

function destroyTweets() {
	T.get('statuses/user_timeline', politician, function (error, data) {
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

var doneness = {
	realDonaldTrump: false,
	HillaryClinton: false
}

var timelines = {
	realDonaldTrump: [],
	HillaryClinton: []
}

retweetLatest("realDonaldTrump");
retweetLatest("HillaryClinton");

function checkDonenessandMaybeRetweetIfReady() {
	console.log("checking doneness")
	if (doneness["realDonaldTrump"] && doneness["HillaryClinton"]) {
		console.log("both feeds are done")

		var combinedTimelines = [].concat(timelines["realDonaldTrump"]).concat(timelines["HillaryClinton"]);

		var sortedTimelines = combinedTimelines.sort(function (a, b) {
			if (a.id_str > b.id_str) {
				return 1;
			}
			if (a.id_str < b.id_str) {
				return -1;
			}
			return 0;
		});

		console.log(sortedTimelines.map(tweet => `${tweet.user.name} on ${tweet.created_at}`))

		sortedTimelines.forEach(function (tweet, index) {
			setTimeout(function () {
				T.post('statuses/retweet/' + tweet.id_str, { }, function (error, response) {
					if (error) {
						console.log('There was an error with Twitter:', error);
					}
					if (response) {
						console.log('retweetId:' + tweet.id_str)
					}
				})
			}, 5100 * index)
		})
	}
	else {
		setTimeout(checkDonenessandMaybeRetweetIfReady, 5000);
	}
}

// checkDonenessandMaybeRetweetIfReady();
destroyTweets();
// getId();

// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60

// setInterval(retweetLatest, 1000 * 60 * 17); //retweet every 17 min
