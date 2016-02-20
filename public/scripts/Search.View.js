//Load common code that includes config, then load the app logic for this page.
requirejs(['requirejsCommon', 'Search.ViewModel'], function (common, SearchViewModel) {
    var searchViewModel = new SearchViewModel.SearchViewModel();
    ko.applyBindings(searchViewModel, $('.main-content')[0]);
});
