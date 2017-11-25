function genCave(x, y, size) {
	let caveBall = new Array(size * 2 + 1);
	for(let i=0;i<caveBall.length;i++) caveBall[i] = new Array(size * 2 + 1);
	for(let x=0;x<caveBall.length;x++) {
		for(let y=0;y<caveBall[0].length;y++) {
			caveBall[x][y] = stone.id;
		}
	}
	for(let i=0;i<32;i++) {
		for(let i1=size;i1>=0;i1--) {
			let x = Math.floor(Math.sin((TWO_PI/32) * i) * i1 + 0.5);
			let y = Math.floor(Math.cos((TWO_PI/32) * i) * i1 + 0.5);
			caveBall[x+size][y+size] = -1;
		}
	}
	for(let i=0;i<size*3;i++) {
		let offsetX = Math.floor(random((-size / 2) * (i * size * 0.25), (size / 2) * (i * size * 0.25)));
		let offsetY = Math.floor(random((-size / 2) * (i * size * 0.25), (size / 2) * (i * size * 0.25)));
		for(let x1=0;x1<caveBall.length;x1++) {
			for(let y1=0;y1<caveBall[0].length;y1++) {
				if(x + x1 + offsetX >= 0 && x + x1 + offsetX < world.width && y + y1 + offsetY >= 0 && y + y1 + offsetY < world.height) {
					world.foreground[x + x1 + offsetX][y + y1 + offsetY] = caveBall[x1][y1] === -1 ? -1 : world.foreground[x + x1 + offsetX][y + y1 + offsetY];
				}
			}
		}
	}
}

function genOre(block, x, y, size) {
	let ore = new Array(size * 2 + 1);
	for(let i=0;i<ore.length;i++) {
		ore[i] = new Array(size * 2 + 2);
	}
	for(let x=0;x<ore.length;x++) {
		for(let y=0;y<ore[0].length;y++) {
			ore[x][y] = stone.id;
		}
	}
	for(let i=0;i<32;i++) {
		for(let i1=Math.floor(size);i1>=0;i1--) {
			let x = Math.floor(Math.sin((TWO_PI/32) * i) * i1 + 0.5);
			let y = Math.floor(Math.cos((TWO_PI/32) * i) * i1 + 0.5);
			ore[x+Math.floor(size)][y+Math.floor(size)] = block.id;
		}
	}
	for(let x1=0;x1<ore.length;x1++) {
		for(let y1=0;y1<ore[0].length;y1++) {
			if(x + x1 >= 0 && x + x1 < world.width && y + y1 >= 0 && y + y1 < world.height) {
				if(ore[x1][y1] !== stone.id) {
					if(random() < 0.5) {
						world.foreground[x + x1][y + y1] = block.id;
					} else world.background[x + x1][y + y1] = block.id;
				}
			}
		}
	}
}

function genTree(x, y, size) {
	let tree = new Array(random() < 0.5 ? 5 : 7);
	let treeF = new Array(tree.length);
	let height = size + Math.floor(random(2, 3))
	centerX = tree.length === 5 ? 2 : 3;
	for(let i=0;i<tree.length;i++) {
		tree[i] = new Array(height);
		treeF[i] = new Array(height);
	}
	for(let i=0;i<size;i++) {
		tree[centerX][i] = wood.id;
	}
	let minLeavesY = Math.floor(random(1, 4));
	for(let x=0;x<tree.length;x++) {
		for(let y=0;y<tree[0].length;y++) {
			if(y > minLeavesY) {
				let i = Math.floor(map(y, tree[0].length-1, minLeavesY+1, 1, tree.length / 2) + 0.5)
				if(x > centerX - i && x < centerX + i) {
					if(tree[x][y] !== wood.id) {
						tree[x][y] = leaves.id;
					}
					treeF[x][y] = leaves.id;
				}
			}
		}
	}
	for(let x=0;x<tree.length;x++) {
		tree[x] = tree[x].reverse();
		treeF[x] = treeF[x].reverse();
	}
	for(let x1=0;x1<tree.length;x1++) {
		for(let y1=0;y1<tree[0].length;y1++) {
			let x2 = (x - Math.floor(tree.length/2)) + x1;
			let y2 = (y - tree[0].length) + y1;
			if(x2 >= 0 && x2 < world.width && y2 >= 0 && y2 < world.height) {
				if(world.foreground[x2][y2] === -1 && treeF[x1][y1] !== undefined) world.foreground[x2][y2] = treeF[x1][y1];
				if(world.background[x2][y2] === -1 && tree[x1][y1] !== undefined) world.background[x2][y2] = tree[x1][y1];
			}
		}
	}
}
