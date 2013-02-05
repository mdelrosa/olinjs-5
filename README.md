olinjs-5
========

lecture #5: debugging & APIs

## Notes from the last homework

## OAuth - authentication with other sites

**OAuth** is a way for your application to request resources from other sites on behalf of your user. Let's say that we were making an application for Facebook that allows people to find the funniest pictures of their friends.

We would need the following from Facebook
* Some way to check that you are the correct Facebook user
* Some way to get all your friends photos

Obviously we can't handle Facebook login. Facebook doesn't trust us, and neither should our user. So instead, we'll delegate the login functionality to Facebook using OAuth. Facebook will then give us an **authentication token** that we can use to require resources on behalf of the user.

In short this is what will happen

1. Go to our app
1. Our app bounces user to FB to login
1. User logs in via FB
1. FB then sends us back an Authentication Token
1. We use this auth token to get images/post on people's walls/etc

But first, let's tell Facebook we're gonna rock their world.

### Create a FB app

First we need to tell Facebook that we're creating a 3rd party app that relies on their platform. 

![create_app]()

Say no to Heroku because we're better than some premade thing. We don't conform to molds.

![heroku]()

After you create an app, you should see a page with the app id and the app secret. Think of those two as the username and password of your app.You never want to show anyone else the app secret.

Alright, after we've got this setup, we're gonna tell Facebook that we'll be testing it locally. Otherwise this would get annoying unless we did a Heroku push every time.

![localhost]()

### FB Auth
Create a new express app with sessions enabled

```
express --sessions
```

OAuth is kinda annoying to deal with by yourself. You are almost always better off finding someone else's library implmentation. For the purposes of this example, let's use the [facebook-node-sdk](https://github.com/amachang/facebook-node-sdk) because it's the first one I found.

Install that package via npm

```
npm install facebook-node-sdk
```

And add it to your `package.json`
```diff
"dependencies": {
    "express": "3.0.6",
    "jade": "*",
+    "fb": "0.1.0"
  }
```

Follow the [facebook-node-sdk's readme](https://github.com/amachang/facebook-node-sdk) on how to get started. Notice this line here

```
app.get('/', Facebook.loginRequired(), function (req, res) {
```

Whaooo that's new. What's that second argument? From the [express documentation](http://expressjs.com/api.html#app.VERB) we see that

```
app.VERB(path, [callback...], callback)
```

And express gives us the following description
* Multiple callbacks may be given, all are treated equally, and behave just like middleware, with the one exception that these callbacks may invoke next('route') to bypass the remaining route callback(s).

Cool. It means that if you pass in multiple functions they'll probably be called one after the other depending on how the previous functions are implemented.

If you wanna be cool, you can look at the [source of the facebook-node-sdk](https://github.com/amachang/facebook-node-sdk/blob/master/lib/facebook.js) to see what's actually happening. (line 50 is where the fun starts)

**Sidenote**: I recommend looking at as much source code as possible. I find that it's often easier to see what's going on by looking through the source than trying to google weird error messages. Also you might pick up cool tricks. YMMV.

####Getting the auth token

Remember how we said that you need an auth token to do things on behalf of your user? Notice how the documentation doesn't tell you at all how to get the Auth token?

Don't write your documentation like this. Now we have to look through source code to see what's going on.

## Debugging

As our applications get more and more complex, they also become harder to debug. In a professional environment, we'd start writing tests to automate this but first let's practice how to actually find the source of the error.

Pull down the debug-quiz repo. Don't worry, it's not actually a quiz. I hate grading.

```js
git clone https://github.com/olinjs/debug-quiz.git
```

Now try to get those things running. Use whatever you want.
