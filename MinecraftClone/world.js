breakTime = 0.0;
prevMouseX = 0;
prevMouseY = 0;
class World {
	constructor() {
		this.width = 256;
		this.height = 64;
		this.foreground = [];
		this.background = [];
		this.entities = [];
		this.blockentities = [];
	}
	setSize(width, height) {
		this.width = width;
		this.height = height;
		this.foreground = new Array(width);
		this.background = new Array(width);
		for(let i=0;i<this.foreground.length;i++) {
			this.foreground[i] = new Array(height);
			this.background[i] = new Array(height);
		}
		player = new Player((width / 2) * 32, -128);
	}
	generate() {
		for(let x=0;x<this.width;x++) {
			for(let y=0;y<this.height;y++) {
				this.foreground[x][y] = -1;
				this.background[x][y] = -1;
			}
		}
		//Stage 1: Generate main terrain
		for(let x=0;x<this.width;x++) {
			let val = Math.floor((1 - noise(x / (171.131 * (this.height / 256)))) * (this.height - 1));
			this.foreground[x][val] = stone.id;
			this.background[x][val] = stone.id;
		}
		for(let x=0;x<this.width;x++) {
			for(let y=0;y<this.height;y++) {
				if(y > 0 && this.foreground[x][y-1] === stone.id) {
					this.foreground[x][y] = stone.id;
					this.background[x][y] = stone.id;
				}
			}
		}
		//Stage 2: Add grass
		for(let x=0;x<this.width;x++) {
			for(let y=0;y<this.height;y++) {
				if((y === 0 && this.foreground[x][y] === stone.id) || (this.foreground[x][y-1] === -1 && this.foreground[x][y] === stone.id)) {
					this.foreground[x][y] = grass.id;
					this.background[x][y] = grass.id;
				}
			}
		}
		//Stage 3: Add dirt
		for(let x=0;x<this.width;x++) {
			for(let y=0;y<this.height;y++) {
				if((y > 3 && this.foreground[x][y-4] === grass.id) || (y > 2 && this.foreground[x][y-3] === grass.id) || (y > 1 && this.foreground[x][y-2] === grass.id) || (y > 0 && this.foreground[x][y-1] === grass.id)) {
					this.foreground[x][y] = dirt.id;
					this.background[x][y] = dirt.id;
				}
			}
		}
		//Stage 4: Caves
		for(let x=0;x<this.width;x++) {
			for(let y=0;y<this.height;y++) {
				if(this.foreground[x][y] === stone.id) {
					if(random() < 0.00025) genCave(x, y, Math.floor(random(3, 7)));
				}
			}
		}
		//Stage 5: Ores
		for(let i=0;i<(this.width + this.height) * 0.4;i++) {
			let x = Math.floor(random(this.width));
			let y = this.height - Math.floor(random(this.height / 2));
			if(this.foreground[x][y] === stone.id) {
				genOre(ironOre, x, y, Math.floor(random(3, 5)) / 2);
			}
		}
		for(let i=0;i<(this.width + this.height) * 0.1;i++) {
			let x = Math.floor(random(this.width));
			let y = this.height - Math.floor(random(this.height / 4));
			if(this.foreground[x][y] === stone.id) {
				genOre(goldOre, x, y, Math.floor(random(2, 4)) / 2);
			}
		}
		for(let i=0;i<(this.width + this.height) * 0.05;i++) {
			let x = Math.floor(random(this.width));
			let y = this.height - Math.floor(random(this.height / 8));
			if(this.foreground[x][y] === stone.id) {
				genOre(diamondOre, x, y, Math.floor(random(2, 4)) / 2);
			}
		}
		for(let x=0;x<this.width;x++) {
			for(let y=0;y<this.height;y++) {
				if(x === this.width-2) {
					this.foreground[x][y] = -2;
					this.background[x][y] = -1;
				}
			}
		}
	}
	render(bg) {
		let offX = Math.floor((sX - 256) / 32);
		let offY = Math.floor((sY - 256) / 32);
		if(!bg) {
			for(let i=0;i<this.entities.length;i++) {
				this.entities[i].render();
			}
		}
		for(let x=offX;x<offX + Math.floor(res.getScaledWidth() / 32) + 12;x++) {
			for(let y=offY;y<offY + Math.floor(res.getScaledHeight() / 32) + 12;y++) {
				if(x >= 0 && x < this.width && y >= 0 && y < this.height) {
					if(!bg && this.foreground[x][y] > -1) {
						let tex = Math.floor(this.foreground[x][y]);
						res.drawImage(textures[tex], (x * 32) - sX, (y * 32) - sY);
						if(!inInventory && res.getScaledMouseX() >= (x * 32) - sX && res.getScaledMouseX() < ((x * 32) + 32) - sX && res.getScaledMouseY() >= (y * 32) - sY && res.getScaledMouseY() < ((y * 32) + 32) - sY) {
							res.drawRect((x * 32) - sX, (y * 32) - sY, 32, 32, 0x3FFFFFFF);
						}
						if(breakTime > 0 && res.getScaledMouseX() >= (x * 32) - sX && res.getScaledMouseX() < ((x * 32) + 32) - sX && res.getScaledMouseY() >= (y * 32) - sY && res.getScaledMouseY() < ((y * 32) + 32) - sY) {
							if(breakTime < blockList[this.foreground[x][y]].hardness / 5) {
								res.drawImage(breakAnim[0], (x * 32) - sX, (y * 32) - sY);
							} else if(breakTime < (blockList[this.foreground[x][y]].hardness / 5) * 2) {
								res.drawImage(breakAnim[1], (x * 32) - sX, (y * 32) - sY);
							} else if(breakTime < (blockList[this.foreground[x][y]].hardness / 5) * 3) {
								res.drawImage(breakAnim[2], (x * 32) - sX, (y * 32) - sY);
							} else if(breakTime < (blockList[this.foreground[x][y]].hardness / 5) * 4) {
								res.drawImage(breakAnim[3], (x * 32) - sX, (y * 32) - sY);
							} else res.drawImage(breakAnim[4], (x * 32) - sX, (y * 32) - sY);
						}
					} else if(bg && this.foreground[x][y] < 0 && this.background[x][y] > -1) {
						let tex = Math.floor(this.background[x][y]);
						res.drawImage(texturesBg[tex], (x * 32) - sX, (y * 32) - sY);
						if(!inInventory && res.getScaledMouseX() >= (x * 32) - sX && res.getScaledMouseX() < ((x * 32) + 32) - sX && res.getScaledMouseY() >= (y * 32) - sY && res.getScaledMouseY() < ((y * 32) + 32) - sY) {
							res.drawRect((x * 32) - sX, (y * 32) - sY, 32, 32, 0x3FFFFFFF);
						}
						if(breakTime > 0 && res.getScaledMouseX() >= (x * 32) - sX && res.getScaledMouseX() < ((x * 32) + 32) - sX && res.getScaledMouseY() >= (y * 32) - sY && res.getScaledMouseY() < ((y * 32) + 32) - sY) {
							if(breakTime < blockList[this.background[x][y]].hardness / 5) {
								res.drawImage(breakAnim[0], (x * 32) - sX, (y * 32) - sY);
							} else if(breakTime < (blockList[this.background[x][y]].hardness / 5) * 2) {
								res.drawImage(breakAnim[1], (x * 32) - sX, (y * 32) - sY);
							} else if(breakTime < (blockList[this.background[x][y]].hardness / 5) * 3) {
								res.drawImage(breakAnim[2], (x * 32) - sX, (y * 32) - sY);
							} else if(breakTime < (blockList[this.background[x][y]].hardness / 5) * 4) {
								res.drawImage(breakAnim[3], (x * 32) - sX, (y * 32) - sY);
							} else res.drawImage(breakAnim[4], (x * 32) - sX, (y * 32) - sY);
						}
					}
				}
			}
		}
	}
	update() {
		let offX = Math.floor((sX - 8192) / 32);
		let offY = Math.floor((sY - 8192) / 32);
		player.ground = false;
		for(let i=this.entities.length-1;i>=0;i--) {
			this.entities[i].update();
			if(this.entities[i].remove) this.entities.splice(i, 1);
		}
		for(let i=this.blockentities.length-1;i>=0;i--) {
			this.blockentities[i].update();
			if(this.blockentities[i].remove) this.blockentities.splice(i, 1);
		}
		for(let x=offX-256;x<offX + Math.floor(res.getScaledWidth() / 32) + 512;x++) {
			for(let y=offY-256;y<offY + Math.floor(res.getScaledHeight() / 32) + 512;y++) {
				if(x >= 0 && x < this.width && y >= 0 && y < this.height) {
					if(this.foreground[x][y] !== -1) {
						let x1 = x * 32;
						let y1 = y * 32;
						if(player.contains(x1 + 4.01, y1) || player.contains(x1 + 27.99, y1)) {
							player.vy = 0;
							player.y = y1 - 64;
							player.ground = true;
						}
						if(player.contains(x1 + 4.01, y1 + 32) || player.contains(x1 + 27.99, y1 + 32)) {
							player.vy = 0;
							player.y = y1 + 32.01;
						}
						if(player.contains(x1, y1 + 4.01) || player.contains(x1, y1 + 27.99)) {
							player.vx = 0;
							player.x = x1 - 32;
						}
						if(player.contains(x1 + 32, y1 + 4.01) || player.contains(x1 + 32, y1 + 27.99)) {
							player.vx = 0;
							player.x = x1 + 32;
						}
					}
				}
				if(mouseIsPressed && res.getScaledMouseX() >= (x * 32) - sX && res.getScaledMouseX() < ((x * 32) + 32) - sX && res.getScaledMouseY() >= (y * 32) - sY && res.getScaledMouseY() < ((y * 32) + 32) - sY) {
					if(mouseIsPressed && prevMouse === mouseIsPressed) {
						if(mouseButton === RIGHT) {
							if(!inInventory && res.getScaledMouseX() >= (x * 32) - sX && res.getScaledMouseX() < ((x * 32) + 32) - sX && res.getScaledMouseY() >= (y * 32) - sY && res.getScaledMouseY() < ((y * 32) + 32) - sY) {
								if(player.inventory[selectedSlot] !== undefined) {
									player.inventory[selectedSlot].getItem().onRightClick(player.inventory[selectedSlot], Math.floor((res.getScaledMouseX() + sX) / 32), Math.floor((res.getScaledMouseY() + sY) / 32));
								}
							}
						} else if(mouseButton === LEFT) {
							if(!inInventory && res.getScaledMouseX() >= (x * 32) - sX && res.getScaledMouseX() < ((x * 32) + 32) - sX && res.getScaledMouseY() >= (y * 32) - sY && res.getScaledMouseY() < ((y * 32) + 32) - sY) {
								if((editbg && this.background[x][y] > -1) || (!editbg && this.foreground[x][y] > -1)) {
									if(breakTime >= blockList[editbg ? this.background[x][y] : this.foreground[x][y]].hardness) {
										if(editbg) {
											if(this.background[x][y] > -1) {
												if(blockList[this.background[x][y]].getDrop(player.inventory[selectedSlot]) !== undefined) {
													this.entities.push(new EntityItem(new ItemStack(blockList[this.background[x][y]].getDrop(player.inventory[selectedSlot]), 1, 0), (x * 32) + 4, (y * 32) + 4, random(-2, 2), random(0, 4)));
												}
												this.background[x][y] = -1;
											}
										} else {
											if(this.foreground[x][y] > -1) {
												if(blockList[this.foreground[x][y]].getDrop(player.inventory[selectedSlot]) !== undefined) {
													this.entities.push(new EntityItem(new ItemStack(blockList[this.foreground[x][y]].getDrop(player.inventory[selectedSlot]), 1, 0), (x * 32) + 4, (y * 32) + 4, random(-2, 2), random(0, 4)));
												}
												this.foreground[x][y] = -1;
											}
										}
										if(player.inventory[selectedSlot] !== undefined) {
											player.inventory[selectedSlot].getItem().onBlockBreak(player.inventory[selectedSlot], Math.floor((res.getScaledMouseX() + sX) / 32), Math.floor((res.getScaledMouseY() + sY) / 32));
										}
										breakTime = 0.0;
									} else {
										breakTime += (1.0 / frameRate()) * player.getSpeedVsBlock(blockList[editbg ? this.background[x][y] : this.foreground[x][y]]);
									}
								}
							}
						}
					} else if(mouseIsPressed && prevMouse !== mouseIsPressed) {
						if(mouseButton === RIGHT) {
							if(!inInventory && res.getScaledMouseX() >= (x * 32) - sX && res.getScaledMouseX() < ((x * 32) + 32) - sX && res.getScaledMouseY() >= (y * 32) - sY && res.getScaledMouseY() < ((y * 32) + 32) - sY) {
								if(this.foreground[x][y] > -1) blockList[this.foreground[x][y]].onRightClick(x, y);
								if(this.background[x][y] > -1) blockList[this.background[x][y]].onRightClick(x, y);
								if(player.inventory[selectedSlot] !== undefined) {
									player.inventory[selectedSlot].getItem().onUse(player.inventory[selectedSlot], Math.floor((res.getScaledMouseX() + sX) / 32), Math.floor((res.getScaledMouseY() + sY) / 32));
								}
							}
						} else if(mouseButton === LEFT) {
							if(!inInventory && !(res.getScaledMouseX() >= (x * 32) - sX && res.getScaledMouseX() < ((x * 32) + 32) - sX && res.getScaledMouseY() >= (y * 32) - sY && res.getScaledMouseY() < ((y * 32) + 32) - sY)) {
								if(player.inventory[selectedSlot] !== undefined) {
									player.inventory[selectedSlot].getItem().onLeftClick(player.inventory[selectedSlot], Math.floor((res.getScaledMouseX() + sX) / 32), Math.floor((res.getScaledMouseY() + sY) / 32));
								}
							}
						}
					}
				}
			}
		}
		if((Math.floor(res.getScaledMouseX() / 32) !== Math.floor(prevMouseX / 32) || Math.floor(res.getScaledMouseY() / 32) !== Math.floor(prevMouseY / 32)) || !mouseIsPressed || mouseButton !== LEFT) {
			breakTime = 0.0;
		}
		prevMouseX = res.getScaledMouseX();
		prevMouseY = res.getScaledMouseY();
	}
	getBlockEntity(x, y) {
		for(let i=0;i<this.blockentities.length;i++) {
			if(this.blockentities[i].x === x && this.blockentities[i].y === y) {
				return this.blockentities[i];
			}
		}
	}
	saveJSON() {
		let json = {};
		json.width = this.width;
		json.height = this.height;
		json.foreground = this.foreground;
		json.background = this.background;
		let entities = [];
		for(let i=0;i<this.entities.length;i++) {
			entities.push(this.entities[i].saveJSON());
		}
		json.entities = entities;
		let blockentities = [];
		for(let i=0;i<this.blockentities.length;i++) {
			blockentities.push(this.blockentities[i].saveJSON());
		}
		json.blockentities = blockentities;
		return json;
	}
	loadJSON(json) {
		this.width = json.width;
		this.height = json.height;
		this.foreground = json.foreground;
		this.background = json.background;
		for(let i=0;i<json.entities.length;i++) {
			if(json.entities[i].type === 'ENTITY') {
				this.entities.push(new Entity(0, 0, 0, 0, 0, 0).loadJSON(json.entities[i]));
			} else if(json.entities[i].type === 'ITEM') {
				this.entities.push(new EntityItem(itemList[0], 0, 0, 0, 0).loadJSON(json.entities[i]));
			}
		}
		for(let i=0;i<json.blockentities.length;i++) {
			if(json.blockentities[i].type === 'BLOCKENTITY') {
				this.blockentities.push(new BlockEntity(0, 0).loadJSON(json.blockentities[i]));
			} else if(json.blockentities[i].type === 'CHEST') {
				this.blockentities.push(new BlockEntityChest(0, 0).loadJSON(json.blockentities[i]));
			} else if(json.blockentities[i].type === 'FURNACE') {
				this.blockentities.push(new BlockEntityFurnace(0, 0).loadJSON(json.blockentities[i]));
			}
		}
	}
}
