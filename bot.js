var Twit = require('twit');
var T = new Twit(require('./config.js'));
var tweetConfig = require('./tweet-config.js').default;

var doneness = {
	HillaryClinton: false,
	realDonaldTrump: false
}

var timelines = {
	HillaryClinton: [],
	realDonaldTrump: []
}

var i =  1;

function retweetLatest(user, minId) {
	var tweetConfig = require('./' + user + '-config.json');

	since_id = minId || tweetConfig.minId
	max_id = parseInt(since_id) + 100000000000000

	var politician = {
		screen_name: user,
		count: 180,
		since_id: since_id,
		max_id: max_id,
		include_rts: false
	};


	T.get('statuses/user_timeline', politician, function (error, data) {
		console.log("getting some tweets", politician)

		if (error) return console.log("ERROR", error)

		timelines[user] = timelines[user].concat(data);

		// var lastTweetId = data.length - 1;
		// var lastTweet = data[lastTweetId].id;

	  console.log(timelines);

	  console.log('incoming data', data)
	  if (data.length > 0) {
			var fs = require('fs');
			fs.writeFile("./" + user + ".json", JSON.stringify(timelines[user], undefined, 2), function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("The file was saved!");
			});

			console.log('THE data IS !!!!!!!!!!!!!!!!!!!!!!!!!', data)
			fs.writeFile("./" + user + "-config.json", JSON.stringify({minId: data[data.length - 1].id_str}, undefined, 2), function(err) {
			    if(err) {
			        return console.log(err);
			    }

			    console.log("The file was saved!");
			});
		}
		if (max_id < 800000000000000000) {
			i++;
			setTimeout(retweetLatest, 10100, user, max_id);
			for (var log = 0; log < data.length; log++) {
				console.log(log + data[log].created_at + ': ' + data[log].user.screen_name + data[log].id_str);
			}
			console.log(i)
			console.log('max_id' + max_id, 'since_id' + since_id)
		}
		else {
			doneness[user] = true;
		}
	});
}

retweetLatest("HillaryClinton");
retweetLatest("realDonaldTrump");

// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60

// setInterval(retweetLatest, 1000 * 60 * 17); //retweet every 17 min
