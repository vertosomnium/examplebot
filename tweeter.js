var Twit = require('twit');
var T = new Twit(require('./config.js'));
var timelines = require('./timelines.json')

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
  }, 5100)
})