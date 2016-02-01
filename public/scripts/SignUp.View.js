//Load common code that includes config, then load the app logic for this page.
requirejs(['./requirejsCommon', './lib/jquery', './SignUp.ViewModel' ], function (common, jquery, SignUpViewModel) {
    console.log('I am in the file');
    // requirejs(['app/main1']);

    var signUpViewModel = new SignUpViewModel.SignUpViewModel();

    ko.applyBindings(signUpViewModel, $.find('.signup-form')[0]);
});
