//	Initialize Firebase
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

//	Declare Global Variables
var player1Exists = false;
var player1Object;
var player1Name = '';
var player1Choice = '';
var p1Choice = '';
var player2Exists = false;
var player2Object;
var player2Name = '';
var player2Choice = '';
var p2Choice = '';
var userName = '';
var userNum;
var turn = 1;
var winner = '';
var game = false;

//	Event Listeners

//	This checks each time the players directory is updated and updates the game displays and variables
//	depending on if both players are connected (will need to .remove() onDisconnect() later so that
//	these are updated when a player disconnects (because the players/child will no longer exist).
db.ref('players/').on('value', function(playersSnap) {

	//	Check to see of player 1 exists or not
	if(playersSnap.child('p1').exists()) {

		//	Set game variables to player 1's info
		player1Exists = true;
		player1Object = playersSnap.val().p1;
		p1Choice = playersSnap.val().p1.choice;
		player1Name = playersSnap.val().p1.name;

		//	Update player 1 displays
		$('#name1').text(player1Name);
		$('#one').removeClass('js-hidden');
		$('#missing1').addClass('js-hidden');
		$('#wins1').text(playersSnap.val().p1.wins);
		$('#losses1').text(playersSnap.val().p1.losses);
	} else {

		//	Reset game variables in case player 1 did exist, but has since been removed
		player1 = false;
		player1Object = null;
		player1Name = '';
		p1Choice = '';
		
		//	Update player 1 displays accordingly
		$('#one').addClass('js-hidden');
		$('#missing1').removeClass('js-hidden');
	}

	//	Do all of the above scenarios, but for player 2
	if(playersSnap.child('p2').exists()) {

		//	Set game variables to player 2's info
		player2Exists = true;
		player2object = playersSnap.val().p2;
		player2Name = playersSnap.val().p2.name;
		p2Choice = playersSnap.val().p2.choice;

		//	Update player 2 displays
		$('#name2').text(player2Name);
		$('#two').removeClass('js-hidden');
		$('#missing2').addClass('js-hidden');
		$('#wins2').text(playersSnap.val().p2.wins);
		$('#losses2').text(playersSnap.val().p2.losses);
	} else {

		//	Reset game variables in case player 1 did exist, but has since been removed
		player2 = false;
		player2Object = null;
		player2Name = '';
		p2Choice = '';
		
		//	Update player 2 displays accordingly
		$('#two').addClass('js-hidden');
		$('#missing2').removeClass('js-hidden');
	}
	
	if(!player1Exists && !player2Exists) {
		db.ref('turn').set(0);
	}
	if(!player1Exists || !player2Exists) {
		game = false;
	}

}, function(error) {
	console.log('Error: ' + error.code);
});


$('#play').click(function() {

	if($('#player-input').val().trim() != '') {

		userName = $('#player-input').val().trim();

		if(player1Exists && player2Exists) {
			alert('Game is currently full!');
			//	Clear the name input field
			$('#player-input').val('');
		} else if(player1Exists && !player2Exists) {

			userNum = 2;

			//	Add Player 2 to the DB
			db.ref('players/p2').set({
				name: userName,
				wins: 0,
				losses: 0,
				choice: ''
			});

			//	Set the onDisconnect() for player 2
			db.ref('players/p2').onDisconnect().remove();

			//	Hide the Name input field
			$('.new-player').addClass('js-hidden');

		} else if(!player1Exists) {

			userNum = 1;

			//	Add Player 1 to the DB
			db.ref('players/p1').set({
				name: userName,
				wins: 0,
				losses: 0,
				choice: ''
			});
			
			//	Sets the turn to 1 when Player One is created
//			db.ref('turn').set(1);

			//	Set the onDisconnect() for player 1
			db.ref('players/p1').onDisconnect().remove();

			//	Hide the Name input field
			$('.new-player').addClass('js-hidden');
		}
		if(player1Exists && player2Exists) {
			db.ref('turn').set(1);
			game = true;
		}

	}
});

db.ref('turn').on('value', function(turnSnap) {	

	if(player1Exists && player2Exists) {

		if(turnSnap.val() == 1) {
			turn = 1;
		
			//	Update the game displays for Turn 1 Status
			if(userNum == 1) {
				$('#p1-waiting').addClass('js-hidden');
				$('#choices1').removeClass('js-hidden');
	
				$('#p2-waiting').removeClass('js-hidden');
				$('#choices2').addClass('js-hidden');

			} else if(userNum == 2) {
				$('#p1-waiting').addClass('js-hidden');
				$('#choices1').addClass('js-hidden');
				$('#p2-waiting').removeClass('js-hidden');
				$('#choices2').addClass('js-hidden');
			}

			$('#msg-1').text(player1Name + "'s turn!");
			$('.game-message').removeClass('js-hidden');

		} else if (turnSnap.val() == 2) {	
			if(userNum == 2) {	
				$('#p2-waiting').addClass('js-hidden');
				$('#choices2').removeClass('js-hidden');
//				$('#choices2').removeClass('js-hidden');
//				$('#choices2').attr('class', 'nothing');

				$('#p1-waiting').removeClass('js-hidden');
				$('#choices1').addClass('js-hidden');

			} else if (userNum == 1) {
				$('#p2-waiting').addClass('js-hidden');
				$('#choices2').addClass('js-hidden');
				$('#p1-waiting').removeClass('js-hidden');
				$('#choices1').addClass('js-hidden');
			}

			$('#msg-1').text(player2Name + "'s turn!");
			$('.game-message').removeClass('js-hidden');

		} else if (turnSnap.val() == 0) {
			$('#p1-waiting').removeClass('js-hidden');
			$('#choices1').addClass('js-hidden');
			$('#msg-1').text('Waiting on Players...');
			$('.game-message').removeClass('js-hidden');
			$('#p2-waiting').removeClass('js-hidden');
			$('#choices2').addClass('js-hidden');
		}
	} else if (turnSnap.val() == 0) {
		$('#p1-waiting').removeClass('js-hidden');
		$('#choices1').addClass('js-hidden');
		$('#msg-1').text('Waiting on Players...');
		$('.game-message').removeClass('js-hidden');
		$('#p2-waiting').removeClass('js-hidden');
		$('#choices2').addClass('js-hidden');
	} else {
		db.ref('turn').set(0);
	}
	turn = turnSnap.val();

}, function(error) {
	console.log('Error: ' + error.code);
});

db.ref('players').on('child_removed', function(playerSnap) {
	db.ref('turn').set(0);
}, function(error) {
	console.log('Error: ' + error.code);
});

$('.choice1').click(function() {

	player1Choice = $(this).text();

	db.ref('players/p1').update({
		choice: player1Choice
	});

	turn = 2;
	db.ref('turn').set(turn);
});

$('.choice2').click(function() {

	player2Choice = $(this).text();

	db.ref('players/p2').child('choice').set(
		player2Choice
	);

//	db.ref('players/p1').update({
//		choice: player2Choice
//	});

//	turn = 1;
//	db.ref('turn').set(turn);
	resolveGame();
});

$('#send').click(function() {
	var msg = $('#chat-input').val();
	
	if(msg != '') {
		db.ref('chat').set({
			message: userName + ': ' + msg
		});
		
		$('#chat-input').val('');
	}
});

function resolveGame() {

/*
	$('.results').empty();

	if(player1Object.choice === 'Rock') {
		if(player2Object.choice === 'Rock') {
			winner = 'Nobody';
		} else if(player2Object.choice === 'Paper') {
			winner = player2Name;
		} else if (player2Object.choice === 'Scisscors') {
			winner = player1Name;
		}
	} else if(player1Object.choice === 'Paper') {
		if(player2Object.choice === 'Rock') {
			winner = player1Name;
		} else if(player2Object.choice === 'Paper') {
			winner = 'Nobody';
		} else if(player2Object.choice === 'Scisscors') {
			winner = player2Name;
		}
	} else if(player1Object.choice === 'Scisscors') {
		if(player2Object.choice === 'Rock') {
			winner = player2Name;
		} else if(player2Object.choice === 'Paper') {
			winner = player1Name;
		} else if(player2Object.choice === 'Scisscors') {
			winner = 'Nobody';
		}
	}
*/

	$('.results').empty();		console.log('p1: ' + p1Choice + '; p2: ' + p2Choice);

	if(p1Choice === 'Rock') {
		if(p2Choice === 'Rock') {
			winner = 'Nobody';
		} else if(p2Choice === 'Paper') {
			winner = player2Name;
		} else if (p2Choice === 'Scissors') {
			winner = player1Name;
		}
	} else if(p1Choice === 'Paper') {
		if(p2Choice === 'Rock') {
			winner = player1Name;
		} else if(p2Choice === 'Paper') {
			winner = 'Nobody';
		} else if(p2Choice === 'Scissors') {
			winner = player2Name;
		}
	} else if(p1Choice === 'Scissors') {
		if(p2Choice === 'Rock') {
			winner = player2Name;
		} else if(p2Choice === 'Paper') {
			winner = player1Name;
		} else if(p2Choice === 'Scissors') {
			winner = 'Nobody';
		}
	}
	
	if(winner == player1Name) {
		db.ref('players/p1/wins').transaction( function(wins) {
			return wins + 1;
		});
		db.ref('players/p2/losses').transaction( function(losses) {
			return losses + 1;
		});
	} else if(winner == player2Name) {
		db.ref('players/p1/losses').transaction( function(losses) {
			return losses + 1;
		});
		db.ref('players/p2/wins').transaction( function(wins) {
			return wins + 1;
		});
	}
	
	db.ref('result').set({
		winner: ''
	});
	db.ref('result').set({
		winner: winner
	});
//	db.ref('result').onDisconnect().remove();
}

//	Chat Event Listener
db.ref('chat').on('value', function(chatSnap) {
	console.log(chatSnap);
	console.log(chatSnap.val());
	console.log(chatSnap.val().message);
	var newMsg = chatSnap.val().message;
	var chatDiv = $('<div>');
	chatDiv.html(newMsg);
	
	$('.chatbox').append(chatDiv);
});

//	Result/End of Game Event Listener
db.ref('result').on('value', function(resultSnap) {

	if(turn == 2 && resultSnap.val().winner != '') {
		var choice1 = $('<div>');
		choice1.text(player1Name + ' chose ' + p1Choice + '!');
		var choice2 = $('<div>');
		choice2.text(player2Name + ' chose ' + p2Choice + '!');
		var result = $('<h3>');
		result.text(resultSnap.val().winner + ' wins!');

		$('.results').append(choice1, choice2, result);

		setTimeout(function() {
			$('.results').empty();
		}, 3500);
		
		turn = 1;
		db.ref('turn').set(turn);
	}

}, function(error) {
	console.log('Error: ' + error.code);
});