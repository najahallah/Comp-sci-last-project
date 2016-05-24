/**
 * Created by h205p2 on 5/20/16.
 */

  function setData(){
    var myFirebaseRef = new Firebase("https://assassin-a488d.firebaseio.com/");
    myFirebaseRef.set([
        {
            "name": "Orshi",
            "pin": "1234",
            "isAlive": true,
            "target":{"targetName": "Tuul",
                "targetPin":"2345"}
        },

        {
            "name": "Tuul",
            "pin": "2345",
            "isAlive": true,
            "target":{"targetName": "Christina",
                "targetPin":"3456"}
        },

        {
            "name": "Christina",
            "pin": "3456",
            "isAlive": true,
            "target":{"targetName": "Najah",
                "targetPin":"5678"}
        },

        {
            "name": "Najah",
            "pin": "5678",
            "isAlive": true,
            "target":{"targetName": "Kelsey",
                "targetPin":"6789"}
        },

        {
            "name": "Kelsey",
            "pin": "6789",
            "isAlive": true,
            "target":{"targetName": "Orshi",
                "targetPin":"1234"}
        }]);
}


        var myFunction = function() {
            var x = prompt("Please enter your pin", "");
            for (y = 0; y < db.length; y++) {
                if (x === db[y].pin) {
                    console.log(db[y].target.targetName);
                    break;
                }
            }
    };

var killed = function(pin){
    var pin = document.getElementById("unique").innerHTML;
    for (y = 0; y < db.length; y++) {
        if (pin === db[y].pin) {
            document.getElementById();
            break;
        }
    }
};

function myFunction() {
    var max = 10000;
    var random=[];
    for(var i = 0;i<max ; i++) {
        var x = Math.floor(Math.random() * max);
        if (x <= 999) {
            return myFunction();
        }
        document.getElementById("demo").innerHTML = x;
        document.getElementById("kmy").disabled = true;
    }
}