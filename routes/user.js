
/*
 * GET users listing.
 */

var models = require('../database'),
    User = models.user,
    Facebook = require('facebook-node-sdk')

exports.login_page = function(req, res) {
  console.log("login page");
  res.render('login.jade', {
    title: "Login!"
  });
}

exports.login = function(req, res) {
  console.log('loggin in');
  res.redirect('/');
}

exports.list = function(req, res){
  console.log("user page")
  req.facebook.api('/me', function(err, data) {
    console.log(data)
  	User.find({id: data.id}).execFind(function(err, found_user) {
      
      if(err) console.log(err)

      // if there is no user, log the user
      else if (found_user.length === 0) {
   	      req.facebook.api('/me/picture?redirect=false&type=large', function(err, data) {
    	    req.session.picture = data.data.url;
    	  });

        console.log("/ #1")
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
    	// console.log(user)
    	req.session.user = user;
    	req.session.id = user.id
      res.redirect('/')
      }

      // if the user exists in the db, display his pic
      else {
        console.log("/ #2")
      	req.session.user = found_user[0];
      	// console.log(req.facebook.getLogoutUrl());
        req.facebook.api('/me/picture?redirect=false&type=large', function(err, picData) {
          res.render('profile.jade', {
          	title: req.session.user.name, 
          	picture: picData.data.url,
            prof_font: req.session.user.font,
            prof_color: req.session.user.prof_color
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
    } 
  });
}


exports.log_out = function(req, res) {
    req.user = null;
    req.session.destroy();
    res.redirect('/login_page');
};