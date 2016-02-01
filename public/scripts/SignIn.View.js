//Load common code that includes config, then load the app logic for this page.
requirejs(['./requirejsCommon', './lib/jquery', './SignIn.ViewModel' ], function (common, jquery, SignInViewModel) {
    console.log('I am in the file');
    // requirejs(['app/main1']);

    var signInViewModel = new SignInViewModel.SignInViewModel();

    ko.applyBindings(signInViewModel, $.find('.signin-form')[0]);
});
