class AdvancedMonster extends Monster{

	monsterMove(){
		var targetGuest = null;
		var dist = -1; 

		for(var i = 0; i < this.stage.actors.length;i++){
			if (this.stage.actors[i] instanceof Player){

				if (dist == -1 || dist > this.calculateDistToActor(this.stage.actors[i])){
					targetGuest = this.stage.actors[i]; 
					dist = this.calculateDistToActor(this.stage.actors[i]);
				}
			}
		}
		if (targetGuest != null){

			//var pathFinder = new Astar(this.stage);
			//var nextStep = pathFinder.calculateTheRoad(this, targetGuest)[1];
			var newX = Math.ceil(targetGuest.x - this.x);
			if (newX != 0){
				newX = newX/Math.abs(newX);
			}
			var newY = Math.ceil(targetGuest.y - this.y);
			if (newY != 0){
				newY = newY/Math.abs(newY);
			}
			if (this.stage.getActor(this.x + newX, this.y+newY) != null){
				super.monsterMove();
				return;
			}
			this.stage.switchImage(this.x, this.y, this.img, this.x + newX,this.y+newY, this.stage.blankImageSrc);
			this.x = this.x+newX;
			this.y = this.y+newY;

		}else {
			super.monsterMove();
		}
	}
	calculateDistToActor(actor){
		return (this.x - actor.x)**2 + (this.y-actor.y)**2;
	}
}
