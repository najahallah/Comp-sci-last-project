/**
 * Created by h205p2 on 6/9/16.
 */
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDPVuZdO4O1SCO6qY1-_KYoF42f_1frUOE",
    authDomain: "assassin-a488d.firebaseapp.com",
    databaseURL: "https://assassin-a488d.firebaseio.com",
    storageBucket: "assassin-a488d.appspot.com"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        loggedInUser = firebase.auth().currentUser;
        $('#currentUser').text(user.email);

        firebase.database().ref('users/' + user.uid).on('value', function (snapshot) {
            $('#userTarget').text(snapshot.val().targetName);
        });
    } else {
        // No user is signed in.
        console.log('no user');*
        $('#currentUser').text("no user");
    }
});

function killUser() {
    kill = false;
    var pin = $('#inputPin').val();

    firebase.database().ref('users/' + loggedInUser.uid).on('value', function (snapshot) {
        targetEmail = snapshot.val().targetEmail;
        targetName = snapshot.val().targetName;
    });

    firebase.database().ref('users/').on('value', function (snapshot) {
        $.each(snapshot.val(), function (key, value) {
            if (value.email == targetEmail && value.pin == pin) {
                $('#outcome').text("Congrats, you have killed " + targetName);
                kill = true;
            }
        });
    });

    if(kill) {
        firebase.database().ref('users/').on('value', function (snapshot) {
            $.each(snapshot.val(), function (key, value) {
                if (value.email == targetEmail) {

                    firebase.database().ref('users/' + key).update({
                        isAlive: false
                    });
                }
            });
        });
    }
    if(!kill) {
        $('#outcome').text("Sorry, that is not the correct pin to kill " + targetName);

    }
}