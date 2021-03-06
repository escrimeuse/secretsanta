document.addEventListener('DOMContentLoaded', function main() {
	
	/*
	This function adds another participant field to the form
	*/
	function addPerson() {
		numParticipants++;	// adding a new person, so increment the number of participants
		
		// now we will create new HTML elements to add to the page
		
		var newLabel = document.createElement('label');
		newLabel.setAttribute('for','person'+numParticipants);
		
		var labelText = document.createTextNode('Name');
		newLabel.appendChild(labelText);
		
		var newTextInput = document.createElement('input');
		newTextInput.setAttribute('id','person'+numParticipants);
		newTextInput.setAttribute('type','text');
		
		var newRemoveButton = document.createElement('a');
		newRemoveButton.setAttribute('id','remove_p'+numParticipants);
		var removeText = document.createTextNode('-');
		newRemoveButton.appendChild(removeText);
		newRemoveButton.addEventListener('click',removePerson);
		
		var newParagraph = document.createElement('p');
		newParagraph.setAttribute('id','p'+numParticipants);
		newParagraph.appendChild(newLabel);
		newParagraph.appendChild(newTextInput);
		newParagraph.appendChild(newRemoveButton);
		document.getElementById("participants").appendChild(newParagraph);
		
	}
	
	/*
	This function removes the selected participant from the form
	*/
	function removePerson() {
		var pToRemove = this.id.replace('remove_','');
		var pToRemove = document.getElementById(pToRemove);
		pToRemove.parentNode.removeChild(pToRemove);
	}
		
	
	/*
	This function pairs up all the participants into givers and receivers
	*/
	function getPairs() {
		
		// first let's get all our participants from the form
		var participants = document.forms["secretsanta"];
		var index=0;
		var participantArray = [];
		while(index<participants.length) {
			// this loops through all the participants and adds them to our array
			participantArray[index]=document.forms["secretsanta"][index].value;
			console.log(participantArray[index]);
			index++;
		}
		
		/* 
		Now we're going to randomly select a pairing for each person. 
		The rules for pairings are as follows:
		- a participant cannot be paired with themselves (i.e.: Person A cannot be the secret santa for Person A)
		- a participant cannot be paired more than once (i.e.: Person A and Person B cannot both be the secret santa for Person C)
		- every participant must be paired 
		
		To accomplish this, the pairs will be assigned as follows (thanks to github.com/dersam for thinking of this):
		- the person at index 0 in the shuffled array will be paried with the person at index 1
		- the person at index 1 will be paired with the person at index 2
		- etc. until end of array
		- the person at the last index will be paired with the person at index 0
		
		
		*/
		var shuffledParticipants = shuffle(participantArray);
		var count = 0;
		var pairings = {};
		while (count < shuffledParticipants.length) {
			var giver = shuffledParticipants[count];
			var receiver = undefined;
			if(count == shuffledParticipants.length-1) {
				receiver = shuffledParticipants[0]
			} 
			else {
				receiver = shuffledParticipants[count+1];
			}
			
			pairings[giver]=receiver;
			
			count++;
			
		}
		console.log(pairings);
		
		return pairings;
		
	}

	/*source of the shuffle function: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	NOTE: I added code so that this function does NOT change the array being passed as an argument. Instead, it makes a copy
	of said array (which is then called shuffledArray), and then shuffles and returns shuffledArray.
	*/
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		var shuffledArray = [];
		
		var index=0;
		while(index<array.length) {
			shuffledArray[index]=array[index];
			index++;
		}

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = shuffledArray[currentIndex];
			shuffledArray[currentIndex] = shuffledArray[randomIndex];
			shuffledArray[randomIndex] = temporaryValue;
		}

		return shuffledArray;
	}	

	/*
	This function displays all the giver/receiver pairings in the browser
	*/
	function displayPairs() {
		var pairs = getPairs();
		var displayArea = document.getElementById("pairings");
		
		displayArea.innerHTML = ''; 
		
		var introPairsText = document.createTextNode("Ho ho ho! Here are the pairings!");
		var introPairsParagraph = document.createElement('p');
		introPairsParagraph.appendChild(introPairsText);
		displayArea.appendChild(introPairsParagraph);
		
		for (key in pairs) {
			var giverNode = document.createElement('span');
			giverNode.setAttribute('class','giver');
			var giverText = document.createTextNode(key);
			giverNode.appendChild(giverText);
			
			var receiverNode = document.createElement('span');
			receiverNode.setAttribute('class','receiver');
			var receiverText = document.createTextNode(pairs[key]);
			receiverNode.appendChild(receiverText);
			
			var pairingNode= document.createElement('p');
			pairingNode.appendChild(giverNode);
			var text = document.createTextNode(' will give to ');
			pairingNode.appendChild(text);
			pairingNode.appendChild(receiverNode);

			displayArea.appendChild(pairingNode);
		}
		
		var wantNewPairsText = document.createTextNode("If you aren't happy with these pairings and want new ones, click on the \"Get Pairings\" button again.");
		var wantNewPairsParagraph = document.createElement('p');
		wantNewPairsParagraph.appendChild(wantNewPairsText);
		displayArea.appendChild(wantNewPairsParagraph);
		
	}
	
	/*
	This function displays the message passed as an argument to the browser
	*/
	function displayValidationError(themessage) {
		var displayArea = document.getElementById("pairings");
		displayArea.innerHTML = ''; 

		var text = document.createTextNode(themessage);
		var newNode = document.createElement('p');
		newNode.appendChild(text);
		displayArea.appendChild(newNode);
	}
	
	/*
	This function validates form input. If the input is valid, then it proceeds with creating/displaying pairs (by calling displayPairs())
	*/
	function validate() {
		var participants = document.forms["secretsanta"];
		
		if (participants.length > 1) {
			
			// we check that all fields have something entered in them
			var count = 0;
			var emptyFields = false;
		
			while (count < participants.length) {
				
				if (!document.forms["secretsanta"][count].value.trim()) { 
					emptyFields = true;
					break;
				}
				count++;
			}
			
			if (emptyFields) {
				displayValidationError("Ho Ho NO! You have one or more empty name fields. Please enter the names of the missing people, or remove them from the list.");
				return;
			}
			
		
		
				
		} else {
			displayValidationError('Ho Ho NO! You cannot do a Secret Santa with less than two people!');
			return;
		}
		
		// if everything is valid, then we proceed with creating/displaying pairs
		displayPairs();
		

	}
		
	var numParticipants=3;
	
	document.getElementById("addmore").addEventListener("click",addPerson);
	document.getElementById("remove_p1").addEventListener("click",removePerson);
	document.getElementById("remove_p2").addEventListener("click",removePerson);
	document.getElementById("remove_p3").addEventListener("click",removePerson);
	document.getElementById("pair").addEventListener("click",validate);

	
});