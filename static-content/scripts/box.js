class Box extends Actor{

	// Constructor for class actor Box

	// Called everytime by Stage.prototype.step()
	step(){

	}

	// Move box if player ask or the next box asking
	setMove(up, side){

		//Set up new coordinate
		var newX = this.x+side;
		var newY = this.y+up;

		//Look at the next position is an actor
		var newBox = this.stage.getActor(newX, newY);
		var newImg;

		// if it is actor
		if (newBox != null){ //

			newBox.setMove(up,side);
			newImg = newBox.img;

		// then just move it aside
		}else {

			newImg = this.stage.blankImageSrc;
		}
		this.stage.switchImage(this.x, this.y, this.img, newX, newY, newImg);
		this.x = newX;
		this.y = newY
	}

}
