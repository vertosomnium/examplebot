var Twit = require('twit');
var T = new Twit(require('./config.js'));

var paulina = {
  screen_name: "HeSheSaid2016",
  count: 180
};

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

destroyTweets();
