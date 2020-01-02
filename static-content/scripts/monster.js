class Monster extends Actor{

	//constructor for class monster



	monsterMove(){
		var newX = this.x + Math.floor(Math.random()*3)-1;
			var newY =this.y +  Math.floor(Math.random()*3)-1;
			while (newX == this.x && newY == this.y || this.stage.getActor(newX, newY) != null){
				newX = this.x + Math.floor(Math.random()*3)-1;
				newY = this.y + Math.floor(Math.random()*3)-1;
			}
			this.stage.switchImage(this.x, this.y, this.img, newX, newY, this.stage.blankImageSrc);
			this.x = newX;
			this.y = newY;
	}


	// Called everytime by Stage.prototype.step()
	step(){

		// Search for player in nearby
		if (this.checkPlayerNearby() == 1){
    		this.getPlayer(this.victim);
    		this.stage.removeActor(this.victim);
    		this.victim = null;
    		this.stage.changeState("END");

    	} else if (this.checkDeadEnd() == 1){
    		this.stage.numMonster	--;
    		this.stage.score+=500;
    		this.stage.removeActor(this);
    		this.stage.setImage(this.x, this.y, this.stage.blankImageSrc);
    	} else {
    		this.monsterMove();
    		
    	}
	}
	
	//Check if no way out
	checkDeadEnd(){
		var i;
		var j;
		for(i = this.x-1; i < this.x+2; i++){
			for(j = this.y-1; j < this.y+2; j++){
				var newNeighbor=this.stage.getActor(i,j);
				if (newNeighbor == null)
					return 0;
			}
		}

		return 1;
	}

	// Found player kill him
	getPlayer(player){
		var newX = player.x;
		var newY = player.y;
		this.stage.switchImage(this.x, this.y, this.img, newX, newY, this.stage.blankImageSrc);
    	this.x = newX;
    	this.y = newY;
	}

	//Return 1 if player is nearby otherwise 0
	checkPlayerNearby(){
		var x,y;
		for(x = this.x-1; x<this.x+2;x++){
			for(y = this.y-1; y<this.y+2; y++){
				if (this.stage.getActor(x,y) instanceof Player){
					this.victim = this.stage.getActor(x,y);
					return 1;
				}
			}
		} 
		return 0;
	}

	//move to this position
	setPos(x, y){
		this.x = x;
		this.y = y;
		this.stage.setImage(this.x, this.y, this.img);
	}

}
