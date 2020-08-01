const viev = {
	displayMessage: function (msg) {
		let messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function (location) {
		let cell = document.getElementById (location);
		cell.setAttribute("class","hit");
	},
	displayMiss: function (location) {
		let cell = document.getElementById (location);
		cell.setAttribute("class","miss");
	}
};

const model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk:0,
	ships: 
		[ 
			{ locations: [0,0,0], hits: ["","",""]},
			{ locations: [0,0,0], hits: ["","",""]},
			{ locations: [0,0,0], hits: ["","",""]}
		],
	fire: function(guess) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			let index = ship.locations.indexOf(guess);
			if (ship.hits[index] === "hit") {
				viev.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				viev.displayHit(guess);
				viev.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					viev.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		viev.displayMiss(guess);
		viev.displayMessage("You missed.");
		return false;
	},
	isSunk: function (ship) {
		for (let i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},
	generateShipLocation: function () {
		let locations;
		for (let i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},
	generateShip: function() {
		let direction = Math.floor(Math.random() * 2);
		let row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		let newShipLocations = [];
		for (let i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	collision: function (locations) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = model.ships[i];
			for (let j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};

function parseGuess (guess) {
	let alphabet = ["a","b","c","d","e","f","g"];
	if (guess === null || guess.length !== 2) {
		alert ("ooops, please write correct");
	} else {
		let firstChar = guess.charAt(0);
		let row = alphabet.indexOf(firstChar);
		let colomn = guess.charAt(1);
		if (isNaN(row) || isNaN(colomn)) {
			alert ("oooops, not a numbers");
		} else if (row < 0 || row >= model.boardSize || colomn < 0 || colomn >= model.boardSize) {
			alert ("ooops, not on the board");
		} else {
			return row + colomn;
		}
	}
	return null;
};

const controler = {
	guesses: 0,

	processGuess: function(guess) {
		let location = parseGuess(guess);
		if (location) {
			this.guesses++;
			let hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				viev.displayMessage(`you sunk all my battleships, in ${this.guesses} guesses`);
			}
		}
	}
};


function handleKeyPress(e) {
	let fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

function handleFireButton () {
	let guessInput = document.getElementById("guessInput");
	let guess = guessInput.value;
	controler.processGuess(guess);
	guessInput.value = "";
}

window.onload = init;

function init () {
	let fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	let guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocation();
}
