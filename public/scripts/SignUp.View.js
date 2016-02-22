//Load common code that includes config, then load the app logic for this page.
requirejs(['requirejsCommon', 'SignUp.ViewModel' ], function (common, SignUpViewModel) {
    console.log('I am in the file');
    // requirejs(['app/main1']);

    var signUpViewModel = new SignUpViewModel.SignUpViewModel();

    ko.applyBindings(signUpViewModel, $('.main-content')[0]);
});
