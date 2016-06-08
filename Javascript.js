// Initialize Firebase
var config = {
    apiKey: "AIzaSyDPVuZdO4O1SCO6qY1-_KYoF42f_1frUOE",
    authDomain: "assassin-a488d.firebaseapp.com",
    databaseURL: "https://assassin-a488d.firebaseio.com",
    storageBucket: "assassin-a488d.appspot.com",
};
firebase.initializeApp(config);

$(document).ready(function() {
    loggedInUser = firebase.auth().currentUser;
    if(loggedInUser != null) {
        $('#currentUser').text(loggedInUser.email);
    }
    else {
        $('#currentUser').text("no user");
    }
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        loggedInUser = firebase.auth().currentUser;
        console.log(user.email);
        $('#currentUser').text(user.email);
    } else {
        // No user is signed in.
        console.log('no user')
        $('#currentUser').text("no user");
    }
});

function createUser() {
    var email = $('#email').val();
    var password = $('#password').val();
    var name = $('#name').val();
    var pin = $('#pin').val();

    firebase.auth().createUserWithEmailAndPassword(email,password).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            firebase.database().ref('users/').on('value', function (snapshot) {
                console.log(snapshot.val());
                console.log(user.uid);
                newUser = true;
                $.each(snapshot.val(), function (key, value) {
                    if (key == user.uid) {
                        console.log("existing user");
                        newUser = false;
                    }
                });
                if(newUser) {
                    console.log("writing new user data")
                    firebase.database().ref('users/' + user.uid).set({
                        userName: name,
                        email: user.email,
                        isAlive: true,
                        isAssigned: false,
                        pin: pin,
                        target: ""
                    });
                }
            });
        }
    });
}

function logInUser() {
    var email = $('#email').val();
    var password = $('#password').val();

    firebase.auth().signInWithEmailAndPassword(email, password);

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user.email);
        }
    });
}

//grabs all users from the database and returns a random one
function getTarget() {
    var userArray = [];
    firebase.database().ref('users/').on('value', function (snapshot) {
        $.each(snapshot.val(), function (key, value) {
            //do whatever
            if (value.isAlive == true && value.isAssigned == false && value.email != loggedInUser.email) {
                    userArray.push({"uid":key,"person":value});
            }
        });

        var selectedPerson = userArray[Math.floor(Math.random() * userArray.length)];

        //add assignment to person
        firebase.database().ref('users/' + loggedInUser.uid).update({
            target: selectedPerson.person.email
        });

        //update isAssigned on target
        firebase.database().ref('users/' + selectedPerson.uid).update({
            isAssigned: true
        });

        $("#target").text("Your target is " + selectedPerson.person.name);

    });


}



function logOutUser() {
    firebase.auth().signOut().then(function() {
        console.log("Log Out: successful.");
        location.reload();
    }, function(error) {
        // An error happened.
    });
}

//function startGame(userArray){
//    var targetArray = [];
//
//    for (i = 0; i < userArray.length; i++) {
//        if(userArray.length >= 10) {
//            var target = chooseRandomUser();
//            targetArray.push(target);
//        }
//        else{
//            alert("Please log in some other time. There are not enough Assassins present to eliminate.");
//            break;
//        }
//    }
//    console.log(userArray);
//    console.log(targetArray);
//}

function writeTarget() {
        var person = chooseRandomUser(userArray);
        for (i = 0; i < userArray.length; i++) {
            firebase.database().ref('users/' + loggedInUser.uid).set({
                target: person.userEmail
            });

        }
}
