var auth_url = 'https://accounts.spotify.com/authorize'

var data = {
  response_type: 'token',
  client_id: '3c03b59c6cc2404aa818748e9250ed47',
  redirect_uri: 'http://localhost:3000/callback',
  scope: 'user-read-private user-read-email',
  show_dialog: true
}

Router.onBeforeAction(function() {
  if(!Tokens.isAuthed()) {
    this.render('login')
  }
  else {
    var token = Tokens.findOne().token
    Spotify.setAccessToken(token)
    this.next()
  }
})

Router.route('/', function() {
  Spotify.getMe().then(function(data) {
    console.log(data)
  })
  this.render('analyze')
})

Router.route('/callback', function() {
  console.log('asdf');
  var hash = this.params.hash;
  debugger
  if(hash) {
    var data = Helpers.queryToObject(hash)
    Tokens.insert({token: data.access_token})
    this.redirect('/')
  }
})

Template.login.events({
  'click #login': function() {

    if(!Tokens.isAuthed()) {
      window.location = auth_url + Helpers.toQueryString(data)
    }
  }
})
