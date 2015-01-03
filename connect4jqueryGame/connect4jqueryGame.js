/* BLUEPRINT
	two boards:
	1. display board, called displayboard
	2. game board, called playboard

	general process:
		1. click on display board => input to game board
		2. game board processes input into an output within
			its own board
		3. game board output => input to display board
		4. display board changes in response to this
			input that it accepts from game board
*/

//declare global variables

var rowNum=6;	//6 rows
var colNum=7;	//7 columns 
var totalMovesLeft=rowNum*colNum;	//tracks whose turn, as well as game end
var playboardCoord;	//to hold coordinates of playboard for win checking
var win=false;	// indicates whether there's been a winner or not

//when a column is clicked
var selected=0;
var result=0;
var moveCoord;


//setup playboard
var playboard=[];

for (var row=0;row<rowNum;row++){
		var inners=new Array(colNum);	//makes columns
		playboard.push(inners);
}

var resetPlayboard=function(){
//fills playboard with blank underscores
	for (var row=0;row<rowNum;row++)	{
		for (var col=0;col<colNum;col++){
			playboard[row][col]="_";
		}
	}
}	// end resetPlayboard function
	

var play=function(color, colChosen){
	var move=colChosen;

	var adjustCol=move-1;

	var adjustRow=0;

	for (var row=0;row<rowNum;row++){
		if (playboard[row][adjustCol]==="_"){
			adjustRow=row; //overriding assignment as it moves down col
		}
	}

	//places the dropped checker, depending on user column choice
	playboard[adjustRow][adjustCol]=color;

	playboardCoord=[adjustRow,adjustCol];

	totalMovesLeft--;

	for (var row=0;row<rowNum;row++)	{
		console.log(playboard[row]);
	}
	console.log(totalMovesLeft);

	//adjustRow represents the x coordinate
	//adjustCol represents the y coordinate
	//this is the opposite of how it at first glance displays,
	//	because everything is inline-block

	var y=adjustCol+1;
	var x=adjustRow+1;
	var placement=[x,y];
	return placement;
}	//end play function

var putOnDisplayboard=function(coord){
	var xLoc=coord[0];
	var yLoc=coord[1];

	//x is the nth-child of .dropPanel
	//y is the nth-child of .gameboard

	//example of 12 spot
	// x=2;
	// y=5;
	// (x*colNum)-(colNum-y);
	// (2*7)-(7-5)=33;
	var locOnBoard=((xLoc*colNum)-(colNum-yLoc));
	return locOnBoard;
}	//end putOnDisplayboard function

var checkWin=function(color){
	var winDesig;
	if (color=="red"){
		winDesig="R";	//"R" and "B" differences help when  in the console
	}
	if (color=="blue"){
		winDesig="B";
	}
	//check horizontal
	for (var row=0;row<rowNum;row++)	{
		for (var col=0;col<colNum-3;col++){	// -3 because the 4th column is bound for hor. connect4 going right
			if (playboard[row][col]==color){
				if (playboard[row][col+1]==color && playboard[row][col+2]==color && playboard[row][col+3]==color){

					playboard[row][col]=winDesig;
					playboard[row][col+1]=winDesig;
					playboard[row][col+2]=winDesig;
					playboard[row][col+3]=winDesig;
					win=true;
				}
			}
		}
	}	//end check horizontal

	//check vertical
	for (var row=0;row<rowNum-3;row++)	{	// -3 because 4th row is the bound for vert connect4 going down
		for (var col=0;col<colNum;col++){
			if (playboard[row][col]==color){
				if (playboard[row+1][col]==color && playboard[row+2][col]==color && playboard[row+3][col]==color){

					playboard[row][col]=winDesig;
					playboard[row+1][col]=winDesig;
					playboard[row+2][col]=winDesig;
					playboard[row+3][col]=winDesig;
					win=true;
				}
			}
		}
	}	//end check vertical

	//check SouthWest to NorthEast	(diagonal)
	for (var row=3;row<rowNum;row++)	{	//for such a diagonal to be possible, need to at least rows above
		for (var col=0;col<colNum-3;col++){	
			if (playboard[row][col]==color){
				if (playboard[row-1][col+1]==color && playboard[row-2][col+2]==color && playboard[row-3][col+3]==color){

					playboard[row][col]=winDesig;
					playboard[row-1][col+1]=winDesig;
					playboard[row-2][col+2]=winDesig;
					playboard[row-3][col+3]=winDesig;
					win=true;
				}
			}
		}
	}	//end check SouthWest to NorthEast

	//check NorthWest to SouthEast (diagonal)
	for (var row=0;row<rowNum-3;row++)	{	// -3 due to separation boundary of possible spots on board
		for (var col=0;col<colNum-3;col++){
			if (playboard[row][col]==color){
				if (playboard[row+1][col+1]==color && playboard[row+2][col+2]==color && playboard[row+3][col+3]==color){

					playboard[row][col]=winDesig;
					playboard[row+1][col+1]=winDesig;
					playboard[row+2][col+2]=winDesig;
					playboard[row+3][col+3]=winDesig;
					win=true;
				}
			}
		}
	}	//end check NorthWest to SouthEast
}	//end checkWin function

var drawDisplayboard=function(){
	//////DRAW DISPLAY BOARD
	var displayboard=[];

	for (var row=0;row<rowNum;row++){
		var inners=new Array(colNum);	//makes columns
		displayboard.push(inners);
	}

	//draw the drop panel above the columns
	for (var col=0;col<colNum;col++){
		$(".dropPanel").append("<div></div>");
	}

	//draw the 42 slots of the board
	for (var row=0;row<rowNum;row++)	{
		for (var col=0;col<colNum;col++){
			$(".gameboard").append("<div></div>");
		}
	}
}	//end drawDisplayBoard function

var clearDisplayboard=function(){
	$(".dropPanel").children().remove();
	$(".gameboard").children().remove();

	$(".redWins").replaceWith("<div class='dropPanel'></div>");
	$(".blueWins").replaceWith("<div class='dropPanel'></div>");
	$(".tieGame").replaceWith("<div class='dropPanel'></div>");
}	// end clearDisplayBoard function

	//plug-in that controls user-clicks
	$.fn.userMove=function()	{
		// HUZZAH!!!!! stores the move value using $(this).index()!!!	
		$(this).click(function(){

			//controls color/turn alternation
			var checkerColor;
			var otherColor;

			if (totalMovesLeft==0){
			$("body").append("<p>GAMEOVER</p>");
			}
			else if (totalMovesLeft%2==0){
				checkerColor="red";
				otherColor="blue";
			}
			else	{
				checkerColor="blue";
				otherColor="red";
			};

			//change column panel color
			$(".dropPanel > div").css({"background-color":otherColor});

			selected=$(this).index()+1;				//HUZZAH!!! stores the move value
			$("body").append("<p>" +selected+"</p>");	//print input to check

			moveCoord=play(checkerColor,selected);
			result=putOnDisplayboard(moveCoord);
			//
			$(".gameboard").find(":nth-child("+result+")").css({"background-color":checkerColor});	
			console.log("result: "+result);

			for (var full=1;full<=7;full++){
				if (result==full){	//if column is now full

					//black out
					$(".dropPanel").find(":nth-child("+selected+")").css({"background-color":"black"});
					$(".dropPanel").find(":nth-child("+selected+")").replaceWith("<p></p>")
					//make unclickable
					$(".dropPanel").find(":nth-child("+selected+")").css({"pointer-events":"none"});
				}
			}	//end full column check

			if (checkerColor=="red"){
				checkWin("red");
			}
			else	{
				checkWin("blue");
			}

			//if there was a win
			if (win){

				for (var row=0;row<rowNum;row++)	{
					for (var col=0;col<colNum;col++){
						if (playboard[row][col]=="R" || playboard[row][col]=="B"){
							var thisTile=[row+1,col+1];
							var fillIt=putOnDisplayboard(thisTile);
							// $(".gameboard").find(":nth-child("+fillIt+")").css({"background-color":"purple"});
							$(".gameboard").find(":nth-child("+fillIt+")").fadeOut();
							$(".gameboard").find(":nth-child("+fillIt+")").fadeIn();
						}
					}
				}

				if (checkerColor=="red"){
					$(".dropPanel").replaceWith("<div class='redWins'>RED WINS!</div>");
				}
				else {
					$(".dropPanel").replaceWith("<div class='blueWins'>BLUE WINS</div>");
				}
			}	//end if win
			//if there was no win, but no more moves left to make
			else if (totalMovesLeft==0) {
				$(".dropPanel").replaceWith("<div class='tieGame'>TIE GAME</div>")
			};
		});	//end click event 
	};	//end plug-in


var newGame=function(){
	resetPlayboard();
	totalMovesLeft=colNum*rowNum;
	win=false;
	clearDisplayboard();
	drawDisplayboard();

	$(".dropPanel > div").userMove();

	$(".newGamePanel").click(function(){
		newGame();
		return 0;
	});

}	//end newGame function





$(document).ready(function(){
	newGame();
});	//end document.ready


