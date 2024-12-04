let column; let row; let size = 25; let board = [];
let sound;
let tomato; let bush; let caterpillar;
let dir; let gameOver = false; let length = 1;
let eatingSound; let bushImpact; let wallImpact; let biteSound;
// global variables as these are going to be frequently used throughout the program

function preload(){ // preloads the sounds before executing anything else
	eatingSound = loadSound('/sounds/tomato.mp3'); // when the player eats a tomato
	bushImpact = loadSound('/sounds/bushImpact.mp3'); // when the player runs into a bush
	wallImpact = loadSound('/sounds/wallImpact.mp3'); // when the player runs into the wall
	biteSound = loadSound('/sounds/biteSound.mp3'); // when the player runs into themselves
}

function setup() { // setup of the caterpillar game
	createCanvas(550, 550); // creating the canvas
	frameRate(7); // frame rate for caterpillar movements
	column = width / size; // setting column sizing 
	row = height / size; // setting row sizing
	for (let index = 0; index < column ; index++){ // loop for creating the columns for the board 
		board[index]= []; 
	for (let num = 0; num < row; num++){ // loop for creating rows for the board
			board[index][num] = 0; // each index automatically be set to contain a zero 
		}
	}
	tomato = createVector(int(random(column)), int(random(row))); // randomizer for the inital tomato
	caterpillar = createVector(int(random(column)), int(random(row))); // randomizer for the start of the caterpillar
	bush = createVector(int(random(column)), int(random(row))); // randomizer for the inital dead bush
	dir = createVector(0, 0); //setting the direction of user input to (0,0) stagnant
}


function draw() { // drawing the board
	background(220); 
	updateCaterpillar(); // this will allow the caterpillar to move without adding extra length to the end
	displayBoard(); // displaying the board
	scoreCounter(); // allowing for the score to be shown on the board
	board[tomato.x][tomato.y] = -1; // the tomatos will be initialized with a value of -1
	board[bush.x][bush.y] = -2 // dead bushes will be initalized with a value of -2
	if (gameOver === false){ // as long as the game is NOT over
		board[caterpillar.x][caterpillar.y] = length; // the length of the caterpillar will be how long it becomes
	}
	else{ // formatting for the 'GAME OVER' Screen
		textAlign(CENTER, MIDDLE);
		textSize(75);
		circle(width/2, width/2); // allows for the color to come forward
		fill(225,0,0); // RED
		text("GAME OVER\n", width/2, width/2);
		biteSound.stop(); // automatically stops all sound after the user loses
		bushImpact.stop();
		wallImpact.stop();
	}
}

function displayBoard(){ // displaying the board
	for (let index = 0; index < column ; index++){ // building the columns based on the width/size allocated
	for (let num = 0; num < row; num++){ // building the rows based on the height/size allocated
			if (board[index][num] == -2 ){ // when a random square is assigned -2
				fill(150,75,0); // it will be assigned brown for the dead bush	
			}
			else if (board[index][num] == -1){ // when a random square is assigned -1
				fill(225, 0, 0); // it will be assigned red for the tomato
			}
			else if (board[index][num] >= 1){ // when the square is the caterpillar itself
				fill(0, 128, 0); // it will be assigned green
			}
			else{ // otherwise the board will be gray
				fill(225);
			}
			rect(index*size, num*size, size, size); // rectangle size for the board, and items
		}
	}	
}

function scoreCounter(){ // score counter
	textAlign(RIGHT); 
	textSize(35);
	circle(width-20,30); // allows the color to come forward
	fill(245, 5, 5);
	text(`Score: ${length-1}`, width-20, 30); // output with the length - 1 (since the length is already 1) to keep score
}



function keyPressed(){ // key pressed 
	if (keyCode === LEFT_ARROW || keyCode === 65){ // if the user presses the left arrow or the "A" key
		dir = createVector(-1,0); // the caterpillar moves to the left
	} 
	else if (keyCode === RIGHT_ARROW || keyCode === 68){ // if the user presses the right arrow or the "D" key 
		dir = createVector(1,0); // the caterpillar moves to the right
	}
	else if (keyCode === UP_ARROW || keyCode === 87){ // if the user presses the up arrow or the "W" key
		dir = createVector(0,-1); // the caterpillar moves up
	}
	else if (keyCode === DOWN_ARROW || keyCode === 83){ // if the user presses the down arrow or the "S" key
		dir = createVector(0,1); // the caterpillar moves down
	}
}

function updateCaterpillar(){ //
	caterpillar.add(dir); // allows the caterpillar to move within the grid

	if (dist(caterpillar.x, caterpillar.y, tomato.x, tomato.y) == 0){ // when the caterpillar collides with tomato(s)
		eatingSound.play(); // they will hear a sound made by the tomatos
		randomizer(); // another tomato & bush will generate 
		length += 1; // add one to original length
	}

	if (caterpillar.x < 0 ||caterpillar.x > column-1 || caterpillar.y < 0 || caterpillar.y > row-1){ // when the caterpillar collides with the wall
		wallImpact.play(); // the player will hear a thump 
		gameOver = true; // game will end
		print("GAME OVER"); // message displays with console ONLY
	}
	else if (board[caterpillar.x][caterpillar.y] > 1){ // when caterpillar collides with itself
		biteSound.play(); // the player will hear a bite 
		gameOver = true; // game will end
		dir.set(0,0);
		print("GAME OVER"); // message displays with console ONLY
	}
	else if (board[caterpillar.x][caterpillar.y] == -2){ // when the caterpillar collides with any bushes
		bushImpact.play(); // the player will hear a bush sound
		gameOver = true; // game will end
		dir.set(0,0); // caterpillar will stop
		print("GAME OVER"); // message displays with console ONLY
	}
	else { // if the caterpillar does not collide with any of the previous
		board[caterpillar.x][caterpillar.y] = 1 + length; // the caterpillar will move one on the grid
		updateLocation(); // the function to update the rest of the length
	}
}

function updateLocation(){ // updating the last index of the caterpiller
	for (let index = 0; index < column; index++){
		for (let num = 0; num < row; num++){
			if (board[index][num] > 0){  
				board[index][num] -= 1;
			}
		}
	}
}

function randomizer(){ // randomizer for the tomatos & dead bush
	while (true){
		tomato = createVector(int(random(column)), int(random(row))); // creating another random location for the tomato
		bush = createVector(int(random(column)), int(random(row))); // creating another random location for the dead bush
		if (board[tomato.x][tomato.y] === 0 ){ // adding this part to ensure that the tomato & bush do not appear on top of the 
			if(board[bush.x][bush.y] === 0){ // actual caterpillar itself
				break;
			}
		}

	}
}

