//Load common code that includes config, then load the app logic for this page.
requirejs(['requirejsCommon', 'Search.ViewModel', 'Chat.ViewModel', 'Utils'], function (common, SearchViewModel, ChatViewModel, Utils) {
    var searchViewModel = new SearchViewModel.SearchViewModel();
    ko.applyBindings(searchViewModel, $('.main-content')[0]);

    var chatViewModel = new ChatViewModel.ChatViewModel(Utils.getCurrentUser().userId, null);
    ko.applyBindings(chatViewModel, $('.chat-box-container')[0]);
});
