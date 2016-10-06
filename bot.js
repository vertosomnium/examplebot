var Twit = require('twit');
var T = new Twit(require('./config.js'));

var doneness = {
	HillaryClinton: false,
	realDonaldTrump: false
}

var timelines = {
	HillaryClinton: [],
	realDonaldTrump: []
}

function retweetLatest(user, since_id=755300000055950001, max_id=756300000055950001) {
	var politician = {
		screen_name: user,
		count: 10,
		since_id: since_id,
		max_id: max_id
	};

	console.log("getting some tweets", politician)

	T.get('statuses/user_timeline', politician, function (error, data) {
		if (error) return console.log("ERROR", error)

	  // console.log(error, data);

		timelines[user] = timelines[user].concat(data);

		if (max_id < 800000000000000000) {
			max_id += 1000000000000000;
			since_id += 1000000000000000;
			setTimeout(retweetLatest, 5100, user, since_id, max_id);
		}
		else {
			doneness[user] = true;
		}
		console.log('max_id' + max_id, 'since_id' + since_id)
	});
}

retweetLatest("HillaryClinton");
retweetLatest("realDonaldTrump");

function checkDonenessandMaybeRetweetIfReady() {
	// console.log("checking doneness")
	if (doneness["realDonaldTrump"] && doneness["HillaryClinton"]) {
		// console.log("both feeds are done")

		var combinedTimelines = [].concat(timelines["HillaryClinton"]).concat(timelines["realDonaldTrump"]);

		// console.log('combinedTimelines' + combinedTimelines)

		var sortedTimelines = combinedTimelines.sort(function (a, b) {
			if (a.id > b.id) {
				return 1;
			}
			if (a.id < b.id) {
				return -1;
			}
			return 0;
		});

		console.log(sortedTimelines.map(tweet => `${tweet.user.name} on ${tweet.created_at}`))

		sortedTimelines.forEach(function (tweet, index) {
			setTimeout(function () {
				T.post('statuses/retweet/' + tweet.id_str, { }, function (error, response) {
					if (error) {
						// console.log('There was an error with Twitter:', error);
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

checkDonenessandMaybeRetweetIfReady();
// destroyTweets();
// getId();

// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60

// setInterval(retweetLatest, 1000 * 60 * 17); //retweet every 17 min
