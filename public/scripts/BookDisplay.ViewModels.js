define(function (require) {

    function SingleBookViewModel(book) {
        this.bookId = book.bookId;
        this.providerId = book.providerId;
        this.latitude = book.location.latitude;
        this.longitude = book.location.longitude;
    }

    function BookListViewModel(books) {
        this.singleBookVMs = [];

        for(var i=0; i<books.length ; i++) {
            this.singleBookVMs.push(new SingleBookViewModel(books[i]));
        }
    }

    return {
        BookListViewModel: BookListViewModel
    };
});
