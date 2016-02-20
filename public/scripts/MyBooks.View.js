//Load common code that includes config, then load the app logic for this page.
requirejs(['requirejsCommon', 'AddBook.ViewModel', 'BookDisplay.ViewModels' ], function (common, AddBookViewModel, BookDisplayViewModel) {
    console.log('I am in the file');
    // requirejs(['app/main1']);

    var addBookViewModel = new AddBookViewModel.AddBookViewModel();
    ko.applyBindings(addBookViewModel, $('.add-container')[0]);

    var myBooks = JSON.parse($('.data-island .myBooks').eq(0).text());
    var booklistVM = new BookDisplayViewModel.BookListViewModel(myBooks);
    ko.applyBindings(booklistVM, $('.my-book-container')[0]);
});
