// YOUR CODE HERE:


var app = {};

app.init = () => {};

app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = () => {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    /*data: JSON.stringify(message),*/
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message retrieved');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve message');
    }
  });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(message) {
  var $message = $('<ul>' + message.username + ': ' + message.text + '</ul>');
  $message.appendTo($('#chats'));
};

app.renderRoom = function(room) {
  $('<option>' + room + '</option>').appendTo($('#roomSelect'));
};

app.handleUsernameClick = function() {};

app.handleSubmit = function() {
  $('#send .submit').on('click', function(message) {
    $('<ul>' + this.renderMessage(message) + '</ul>').appendTo($('#chat'));
  });

};