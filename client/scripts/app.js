// YOUR CODE HERE:


var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  username: 'anonymous',
  roomname: 'lobby',
  messages: [],
  friends: {},
  lastMessageId: 0
};

app.init = () => {
  app.username = window.location.search.substr(10);
  app.$message = $('#message');
  app.$chats = $('#chats');
  app.$roomSelect = $('#roomSelect');
  app.$send = $('#send');
  app.$send.on('submit', app.handleSubmit);
  app.$chats.on('click', '.username', app.handleUsernameClick);
  app.fetch(false);
  setInterval(function() {
    app.fetch(true);
  }, 5000);
};

app.send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.$message.val('');
      //app.fetch();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = (a) => {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: { order: '-createdAt' },
    contentType: 'application/json',
    success: function (data) {
      /*if (!data.results || !data.results.length) { return; }
      app.messages = data.results;
      var recent = data.results[data.results.length - 1];
      if (recent.objectId !== app.lastMessageId) {
        app.renderMessages(data.results, a);
        app.lastMessageId = recent.objectID;
      }*/
      var recent = data.results[data.results.length - 1];
      if (recent.objectId !== app.lastMessageId) {
        app.renderMessage(data.results[0]);
        app.lastMessageId = recent.objectID;
      }
      console.log('chatterbox: Message retrieved');
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
};

app.renderMessages = function(messages, a) {
  app.clearMessages();
  if (Array.isArray(messages)) {
    messages.filter(function(message) {
      return message.rommname === app.roomname || app.roomname === 'lobby' && !message.roomname;
    }).forEach(app.renderMessage);
    if (a) {
      $('body').animate({'scrollTop': '0px'}, 'fast');
    }
  }
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(message) {
  if (!message.roomname) {
    message.roomname = 'lobby';
  }
  var $chat = $('<div class="chat"/>');
  var $username = $('<span class="username"/>');
  $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);
  if (app.friends[message.username]) {
    $username.addClass('friend');
  }
  var $message = $('<br><span/>');
  $message.text(message.text).appendTo($chat);
  app.$chats.prepend($chat);
};

app.renderRoomList = function(ms) {
  var rooms = {};
  ms.forEach((m) => {
    var r = m.roomname;
    if (r && !rooms[r]) {
      app.renderRoom(r);
      rooms[r] = true;
    }
  });
  app.$roomSelect.val(app.roomname);
};

app.renderRoom = function(room) {
  $('<option>' + room + '</option>').appendTo(app.$roomSelect);
};

app.handleUsernameClick = function(e) {
  var username = $(e.target).data('username');
  //if (username !== undefined) {
  //app.friends[username] = !app.friends[username];
  var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
  var $usernames = $(selector).toggleClass('friend');
//}
};

app.handleSubmit = function(e) {
  var message = {
    username: app.username,
    text: app.$message.val(),
    roomname: app.roomname || 'lobby'
  };
  app.send(message);
  e.preventDefault();
};

app.startSpinner = function() {
  $('.spinner img').show();
  $('form input[type=submit]').attr('disabled', null);
};

app.stopSpinner = function() {
  $('spinner img').fadeOut('fast');
  //$('')
};