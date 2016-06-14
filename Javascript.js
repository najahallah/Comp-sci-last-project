var config = {
    apiKey: "AIzaSyDPVuZdO4O1SCO6qY1-_KYoF42f_1frUOE",
    authDomain: "assassin-a488d.firebaseapp.com",
    databaseURL: "https://assassin-a488d.firebaseio.com",
    storageBucket: "assassin-a488d.appspot.com"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        loggedInUser = firebase.auth().currentUser;
        console.log(user.email);
        $('#output').text("Current User: " + user.email);
        showTargetInfo();
    } else {
        console.log('no user');
        $('#output').text("Current User: No User");
    }
});

function createUser() {
    var email = $('#email').val();
    var password = $('#password').val();
    var name = $('#name').val();
    var pin = $('#pin').val();

    firebase.auth().createUserWithEmailAndPassword(email,password).then(function(user) {
        firebase.database().ref('users/' + user.uid).set({
            name: name,
            email: user.email,
            isAlive: true,
            isAssigned: false,
            pin: pin,
            targetName: "",
            targetEmail: ""
        });
    });
}

function logInUser() {
    var email = $('#email').val();
    var password = $('#password').val();
    firebase.auth().signInWithEmailAndPassword(email, password);
}

function determineTarget() {
    firebase.database().ref('users/'  + loggedInUser.uid).once('value').then(function (snapshot) {
        if(snapshot.val().targetName.length==0) {
            assignTarget();
        }
        else {
            $("#output").append("<br>Your target is already assigned: " + snapshot.val().targetName);
        }
    });
}

function assignTarget() {
    var userArray = [];
    firebase.database().ref('users/').once('value').then(function (snapshot) {
        $.each(snapshot.val(), function (key, value) {
            if (value.isAlive == true && value.isAssigned == false && value.email != loggedInUser.email) {
                userArray.push({"uid": key, "person": value});
            }
        });
        if(userArray.length>0) {
            var selectedTarget = userArray[Math.floor(Math.random() * userArray.length)];
            updateUsers(selectedTarget);
        }
        else {
            $("#output").append("<br>No more users available to assign.<br>Congrats. You WON!<br>");
        }
    });
}
 
function updateUsers(selectedTarget) {
    //add assignment to person
    firebase.database().ref('users/' + loggedInUser.uid).update({
        targetName: selectedTarget.person.name,
        targetEmail: selectedTarget.person.email
    });
    //update isAssigned on target
    firebase.database().ref('users/' + selectedTarget.uid).update({
        isAssigned: true
    });
    $("#output").append("<br>Your target is: " + selectedTarget.person.name);
}

function resetAssignments() {
    firebase.database().ref('users/').once('value').then(function (snapshot) {
        $.each(snapshot.val(), function (key, value) {
            firebase.database().ref('users/' + key).update({
                targetName: "",
                targetEmail: "",
                isAssigned: false,
                isAlive: true
            });
        });
    });
    $("#output").append("<br>All assignments reset");
}

function logOutUser() {
    firebase.auth().signOut().then(function() {
        $("#output").append("<br>User logged out");
    });
}

function killUser() {
    var pin = $('#inputPin').val();
    firebase.database().ref('users/' + loggedInUser.uid).once('value').then(function (snapshot) {
        targetEmail = snapshot.val().targetEmail;
        targetName = snapshot.val().targetName;
    });
    firebase.database().ref('users/').once('value').then(function (snapshot) {
        var kill = false;
        $.each(snapshot.val(), function (key, value) {
            if (value.email == targetEmail && value.pin == pin) {
                $('#output').append("<br>Congrats, you have killed " + targetName);
                kill = true;
                setKillVars(targetEmail);
            }
        });
        if(!kill) {
            $('#output').append("<br>Sorry, that is not the correct pin to kill " + targetName);
        }
    });
}

function setKillVars(targetEmail) {
    firebase.database().ref('users/' + loggedInUser.uid).update({
        targetEmail: "",
        targetName: ""
    });
    firebase.database().ref('users/').once('value').then(function (snapshot) {
        $.each(snapshot.val(), function (key, value) {
            if (value.email == targetEmail) {
                firebase.database().ref('users/' + key).update({
                    isAlive: false,
                    isAssigned: false
                });
            }
        });
    });
}

function showTargetInfo() {
    firebase.database().ref('users/'  + loggedInUser.uid).once('value').then(function (snapshot) {
        var victim = snapshot.val().targetName || "No one assigned";
        $("#output").append("<br>Your target is: " + victim);
    });
}

