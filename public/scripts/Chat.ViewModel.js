define(function (require) {
    var io = require('../socket.io/socket.io');

    function ChatViewModel(myId, otherPersonId) {
        this.myId = myId;
        this.otherPersonId = otherPersonId;

        this.newMessageText = ko.observable("");
        this.messages = ko.observableArray();

        this.socket = io();

        this.setupSocketIo();
    }

    ChatViewModel.prototype.setupSocketIo = function setupSocketIo() {
        this.socket.on('chat message', function(msg){
            this.addMessage(msg);
        }.bind(this));
    }

    ChatViewModel.prototype.addMessage = function addMyMessage(message, isMine) {
        if(message) {
            this.messages.push({
                isMine: isMine,
                messageText: message,
                messageTime: new Date()
            });
        }
    };

    ChatViewModel.prototype.sendNewMessage = function sendNewMessage() {
        if(this.newMessageText()) {
            // Send the message to receiver
            this.socket.emit('chat message', this.newMessageText())

            // Add it to our message list
            this.addMessage(this.newMessageText(), true);

            this.newMessageText("");
        }
    };


    ChatViewModel.prototype.getSearchUrl = function getSearchUrl() {
        return "/api/books/search?bookId="+this.bookId()+"&city="+this.city()+"&longitude="+this.longitude()+"&latitude="+this.latitude();
    }

    return {
        ChatViewModel: ChatViewModel
    };
});
