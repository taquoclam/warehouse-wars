class Astar {
	constructor(stage){
		this.visitedList = new visitedList();
		this.toBeChecked = new MinHeap();
		this.stage = stage; 
	}

	calculateTheRoad(thisSmartEnemy, thisPlayer){
		var destNode = new Node(thisPlayer.x, thisPlayer.y, null, null);
		this.toBeChecked.addNode(new Node(thisSmartEnemy.x, thisSmartEnemy.y, destNode, null));
		while(!this.toBeChecked.isEmpty()){
			var currentNode = this.toBeChecked.removeNode();
			if (currentNode == null){
				return null;
			}

			if (currentNode.isSameNode(destNode)){
				return currentNode.getFullPath();
			}

			this.visitedList.add(currentNode);
			for (var xpos = currentNode.x-1; xpos<currentNode.x+2; xpos++){
				for (var ypos = currentNode.y-1; ypos<currentNode.y+2; ypos++){
					if (xpos == currentNode.x && ypos == currentNode.ypos){
						continue;
					}
					if (this.stage.getActor(xpos, ypos) != null){
						continue;
					}
					var neighborNode = new Node(xpos, ypos, destNode, currentNode);
					if (this.visitedList.contains(neighborNode)){
						continue;
					}
					if (!this.toBeChecked.contains(neighborNode)){
						this.toBeChecked.addNode(neighborNode);
					} else {
						this.toBeChecked.updateNode(neighborNode);
					}
				}
				
			}
		}
	}

	clearUp(){
		this.visitedList.clearUp();
		this.toBeChecked.cleanUp();
	}

}

class visitedList{

	constructor(){
		this.list= [];
	}
	contains(node){
		var length = this.list.length;
		for(var i = 0; i < length; i++){
			if (node.isSameNode(this.list[i])){
				return true;
			}
		}
		return false;
	}

	clearUp(){
		this.list= [];
	}

	add(node){
		this.list[this.list.length] = node;
	}


}

class MinHeap{
	constructor(){
		this.heap = [];
		this.length = 0;
	}

	isEmpty(){
		return this.length == 0;
	}

	updateNode(node){
		for (var i = 0; i< this.length; i++){
			if (this.heap[i].isSameNode(node)){
				if (this.heap[i].getFCost() > node.getFCost()){
					this.heap[i] = node;
					var j = i;
					while(j> 0){
						var parentInd; 
						if (j%2 == 0){
							parent = j/2 -1;
						} else {
							parent = j/2;
						}
						if (this.heap[i].getFCost() < this.heap[parentInd].getFCost()){
							var temp = this.heap[parentInd];
							this.heap[parentInd] = this.heap[j];
							this.heap[j] = temp;
							return;
						}
					}
				}
				break;
			}
		}
	}

	addNode(node){
		this.heap[this.length] = node;
		var currentInd = this.length;
		var parentInd = Math.floor((this.length-1)/2);
		while (parentInd > 0 && this.heap[parentInd].getFCost() > this.heap[currentInd].getFCost()){
			var temp = this.heap[parentInd];
			this.heap[parentInd] = this.heap[currentInd];
			currentInd = temp;
			currentInd = parentInd;
			parentInd = Math.floor((currentInd-1)/2);
		}
		this.length++;
	}

	removeNode(){
		var node = this.heap[this.length-1];
		this.heap[0] = node; 
		this.heap[this.length-1] = null; 
		this.length--;
		var ind = 0; 
		while (ind < this.length){
			var newInd = this.length;
			if (2*ind + 1 < this.length){
				newInd  = 2*ind+1;
			} else if (2*ind + 2 < this.length){
				if (this.heap[2*ind+1].getFCost()<this.heap[2*ind+2].getFCost()){
					newInd = 2*ind  +1 ;
				} else {
					newInd  = 2*ind+2;
				}
			} else {
				break;
			}
			if (this.heap[ind].getFCost() > this.heap[newInd].getFCost()){
				var temp = this.heap[ind];
				this.heap[ind] = this.heap[newInd];
				this.heap[newInd] = temp;
			} else{
				newInd = this.length;
			}
			ind = newInd;
		}
		return node;
	}

	cleanUp(){
		this.heap = [];
		this.length = 0;
	}

	contains(node){
		for(var ele in this.heap){
			if (node.isSameNode(ele)){
				return true;
			}
		}
		return false;
	}
}

class Node{
	constructor(x, y, dest, prevNode){
		this.x = x; 
		this.y = y; 
		this.dest = dest;
		this.prevNode = prevNode;
		if (prevNode == null){
			this.g = 0;
		} else {
			this.g = this.prevNode.g + 1; 
		}
		if (dest != null)
			this.h = ((dest.x - this.x)**2 +  (dest.y - this.y)**2)**(0.5);
		else 
			this.h = 0;
	}

	getFCost(){
		return this.g+this.h;
	}

	isSameNode(other){
		return other.x == this.wx && other.y == this.y;
	}


	getFullPath(){
		fullPath = [];
		var currentNode = this.prevNode;
		while(currentNode != null){
			fullPath[fullPath.length] = currentNode;
			currentNode = currentNode.prevNode;
		}

		return fullPath ; 
	}
}