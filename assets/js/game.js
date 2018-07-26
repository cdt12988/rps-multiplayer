// Initialize Firebase
var config = {
	apiKey: "AIzaSyDtuBaN3MHCbEsw5l2tAnAuOYZOx6ZAgcs",
	authDomain: "twoplayerrps-4bb3a.firebaseapp.com",
	databaseURL: "https://twoplayerrps-4bb3a.firebaseio.com",
	projectId: "twoplayerrps-4bb3a",
	storageBucket: "twoplayerrps-4bb3a.appspot.com",
	messagingSenderId: "869967842169"
};

firebase.initializeApp(config);

var db = firebase.database();
var ref = db.ref();

var player1Ref = db.ref('players/1');
var player2Ref = db.ref('players/2');

var name = '';
var name1 = '';
var name2 = '';
var player1 = false;
var player2 = false;
var currentPlayer = null;

/*
ref.on('value', function(snapshot) {
	if (snapshot.child('players/1').exists() && snapshot.child('players/2').exists()) {
	//	Game is full
	} else if(snapshot.child('players/1').exists()) {
	//	Only player 1 exists
	} else {
	//	No players exist
		db.ref('players').set({
			
		});
	}
}, function(error) {
	console.log('Error: ' + error.code);
});
*/

ref.once('value', function(snapshot) {
	if(snapshot.child('players/1').exists()) {
		player1 = true;
	}
	if (snapshot.child('players/2').exists()) {
		player2 = true;
	}
});

console.log('Player 1? ' + player1);
console.log('Player 2? ' + player2);

$('#play').click(function() {
	if($('#player-input').val().trim() != '') {
		
		ref.once('value', function(snapshot) {
			if(snapshot.child('players/1').exists()) {
				player1 = true;
				name1 = snapshot.child('players/1').val().name;
/*
 				player1Ref = db.ref('players/1');
 				player1Ref.onDisconnect().remove();
*/
			}
			if (snapshot.child('players/2').exists()) {
				player2 = true;
				name2 = snapshot.child('players/2').val().name;
/*
				player2Ref = db.ref('players/2');
				player2Ref.onDisconnect().remove();
*/
			}
		});
		
		name = $('#player-input').val().trim();
		
		if (player1 && player2) {
			console.log('both players exist');
			alert('game is full!');
		} else if (player1) {
			console.log('player 1 exists');
			player2 = true;
			currentPlayer = 2;
			db.ref('players/2').set({
				name: name,
				wins: 0,
				losses: 0,
				choice: ''
			});
			db.ref('players/2').onDisconnect().remove();
//			$('#name2').text(name);
//			$('#name1').text(name1);
			$('.new-player').addClass('js-hidden');
		} else {
			player1 = true;
			currentPlayer = 1;
			console.log('no players exist');
			db.ref('players/1').set({
				name: name,
				wins: 0,
				losses: 0,
				choice: ''
			});
			db.ref('players/1').onDisconnect().remove();
			
			$('#name1').text(name);
			
			$('.new-player').addClass('js-hidden');
		}
	}
});

ref.on('child_added', function(data) {
	console.log('child was added!');
});

ref.on('value', function(snapshot) {
	
}, function(error) {
	
});

/*
db.ref('players').child(1).on('child_changed', function(data) {
	if (data.key() == 'choice') {
		wins1 = childSnapshot.val();
	} else if (childSnapshot.key() == 'losses') {
		losses1 = childSnapshot.val();
	}
	// Update score display
	if (wins1 !== undefined) {
		$('.score1 .float-left').text('Wins: ' + wins1);
		$('.score1 .float-right').text('Losses: ' + losses1);
	}
});
*/

/*
db.ref('players/2').on('child_added', function(playersSnap) {
	if(player2) {
//		$('#name1').text(name1);
		$('#name2').text(playersSnap.val().name);
	}
*/
/*
	} else if (player1) {
		$('name1').text(name1);
		$('name2').text('Waiting for Opponent...');
	}
*/
}, function(error) {
	
});