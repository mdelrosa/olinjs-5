
/*
 * GET users listing.
 */

var models = require('../database'),
    User = models.user,
    Facebook = require('facebook-node-sdk')

exports.list = function(req, res){
  
  req.facebook.api('/me', function(err, data) {

  	User.find({id: data.id}).execFind(function(err, found_user) {
      
      if(err) console.log(err)

      // if there is no user, log the user
      else if (found_user.length === 0) {
   	    req.facebook.api('/me/picture?redirect=false&type=large', function(err, data) {
    	  req.session.picture = data.data.url;
    	});

        var user = new User({
          id: data.id,
      	  name: data.name,
      	  picture: req.session.picture,
      	  prof_color : 'white',
      	  font: 'Courier New'
        });
        user.save(function(err) {
    	  if (err) {return console.log('error', err); res.send('Error saving!')}
    	});
    	console.log(user)
    	req.session.user = user;
    	req.session.id = user.id
        res.redirect('/')
      }

      // if the user exists in the db, display his pic
      else {

      	var current_user = found_user[0];
      	// console.log(req.facebook.getLogoutUrl());
        req.facebook.api('/me/picture?redirect=false&type=large', function(err, picData) {
          res.render('profile.jade', {
          	title: current_user.name, 
          	picture: picData.data.url,
            prof_font: current_user.font,
            prof_color: current_user.prof_color
          })
        });

      } 
    });
  });
}


exports.update_color = function(req, res) {
  req.facebook.api('/me', function(err, data){
  	if (err) return console.log(err)
  	else {
  		console.log(req.body.color)
  		console.log('user', data)
  		User.update({'id': data.id}, {$set: {prof_color: req.body.color}}, {upsert: true}, function(err, found_user) {
  			if(err) return console.log(err)
			else {
				console.log('user', found_user)
			}
  		});
  		res.redirect('/');
	}
  });
}

exports.log_out = function(req, res) {
	req.facebook.logout(function(err) {
		if (err) return console.log(err)
		req.user = null;
        req.session.destroy();
        res.redirect('/');
	})
};