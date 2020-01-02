class Player extends Actor{

	// Constructor for class player

	// Called everytime by Stage.prototype.step()
	step(){

	}


	// Set move to new place according to player
	setMove(up,side){

		//New coordinate
		var newX = this.x + side;
		var newY = this.y + up;

		// Check if next move is valid by search for an actor in new cooridinate
		var newNeighbor = this.stage.getActor(newX,newY);
		var letMove = 0;

		// new coor is empty
		if (newNeighbor == null){
			letMove = 1;

		// new coor is a box
    		} else if (newNeighbor instanceof Box){

			// Box can be moved
	    		if (this.checkNextNeighbor(up,side,newNeighbor) == 1)
	    		{
	    			newNeighbor.setMove(up,side);
	    			letMove = 1;
	    		}
    		}


		//move player
		if (letMove == 1){
    		this.stage.switchImage(this.x, this.y, this.img, newX, newY, this.stage.blankImageSrc);
    		this.x = newX;
    		this.y = newY;
			var findMonster = this.checkMonster(newX, newY);
			this.stage.score += findMonster *20;
		}
	}

	//return 1 if player moves beside a monster
	checkMonster(x, y){
		var i, j, count = 0;;
		for (i = x-1; i<x+2; i++){
			for (j = y -1; j < y+2; j++){
				if(this.stage.getActor(i,j) instanceof Monster){
					count ++;
				}
			}
		}
		return count;
	}



	// return 1 if box can be moved or 0 is box is stuck
	checkNextNeighbor(up, side, neighbor){
		var newX = neighbor.x + side;
		var newY = neighbor.y + up;
		var newNeighbor = this.stage.getActor(newX,newY);
		if (newNeighbor instanceof Box){
			return this.checkNextNeighbor(up, side, newNeighbor);
		} else if (newNeighbor == null){

			return 1;
		}
		return 0;
	}


}
