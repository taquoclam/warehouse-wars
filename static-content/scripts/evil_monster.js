class invisibleMonster extends Monster{
	constructor(x, y, stage, img){
		super(x,y,stage, img);
		this.isInvisible = true;
		this.originalImg = img;
		this.gameInterval = setInterval(function(){
			for(var i= 0; i< stage.actors.length; i++){
				if (stage.actors[i] instanceof invisibleMonster){
					stage.actors[i].changeInvisible();
				}
			}
		}, 20000);
	}

	changeInvisible(){
		if (this.isInvisible){
			this.stage.setImage(this.x, this.y, this.stage.blankImageSrc);
			this.img = this.stage.blankImageSrc;
			clearInterval(this.gameInterval);
			this.gameInterval = setInterval(function(){
			for(var i= 0; i< stage.actors.length; i++){
				if (stage.actors[i] instanceof invisibleMonster){
					stage.actors[i].changeInvisible();
				}
			}
		}, 5000);
		} else{
			this.stage.setImage(this.x, this.y, this.originalImg);
			this.img = this.originalImg;
			clearInterval(this.gameInterval);
			this.gameInterval = setInterval(function(){
			for(var i= 0; i< stage.actors.length; i++){
				if (stage.actors[i] instanceof invisibleMonster){
					stage.actors[i].changeInvisible();
				}
			}
		}, 20000);
		}
		this.isInvisible = !this.isInvisible;
	}
}