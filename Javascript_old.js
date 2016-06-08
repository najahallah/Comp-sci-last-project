// Initialize Firebase
var config = {
    apiKey: "AIzaSyDPVuZdO4O1SCO6qY1-_KYoF42f_1frUOE",
    authDomain: "assassin-a488d.firebaseapp.com",
    databaseURL: "https://assassin-a488d.firebaseio.com",
    storageBucket: "assassin-a488d.appspot.com",
};
firebase.initializeApp(config);
var loggedInUser;

function writeUserData(userId, name, email) {
    firebase.database().ref('users/' + userId).set({
        userName: name,
        email: email,
        isAlive: true,
        isAssigned: false,
        target: ""

        //write different fields here//
    });
}



function createUser() {
    var userEmail = document.getElementById("userEmail").value;
    var userName = document.getElementById("userName").value;
    var pin = document.getElementById("pin").value;

    firebase.auth().createUserWithEmailAndPassword(userEmail, pin);
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            document.getElementById("success_user").innerHTML = "You are now a user. Please go to the sign in page to log in to begin your missions.";
            loggedInUser = user;
            /// add additional fields here!!!
            writeUserData(user.uid,userName,userEmail);
        }
        else {
            document.getElementById("fail_user").innerHTML = "There is already an account with this email. Please try again.";
        }
        }

    );
}

//MAKE SURE USERARRAY HAS STUFF IN IT

//grabs all users from the database and returns a random one
function chooseRandomUser() {
    var userArray = [];
    firebase.database().ref('users/').on('value', function (snapshot) {
        $.each(snapshot.val(), function (key, value) {
            //do whatever
            if (value.isAlive == true && value.isAssigned == false && value.userName != loggedInUser.userName) {
                    userArray.push(value);
                }
            });
            var person = userArray[Math.floor(Math.random() * userArray.length)];
            //firebase.database().ref('users/' + userId).set({
            //    target: person.userEmail
            //});
            //console.log(person.userName);
            //console.log(loggedInUser);
            document.getElementById("target").innerHTML = "Your target is " + person.userName;
            document.getElementById("getTarget").disabled = true;
            //FIX THIS MAKE SURE IT RETURNS USER ARRAY
            return person;
        });


}


function logInUser() {
    var userEmail = document.getElementById("userEmail").value;
    var pin = document.getElementById("pin").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, pin);
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            loggedInUser = user;
            firebase.database().ref('users/' + user.uid).on('value', function(snapshot) {
                console.log(snapshot.val().email);
                //doSomething(snapshot.val().email);

            });
        }
    });
}

function logOutUser() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        // Sign-out successful.
        console.log("Log Out: successful.");
        alert("You are logged out now.");
        return location.reload();
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
