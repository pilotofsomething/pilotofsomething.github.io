textures = new Array(65536);
texturesBg = new Array(32768);
breakAnim = new Array(5);
function loadImg(path, index) {
	textures[index] = loadImage('textures/block/' + path);
	texturesBg[index] = loadImage('textures/block/background/' + path);
}

function preload() {
	for(let i=0;i<breakAnim.length;i++) {
		breakAnim[i] = loadImage('textures/block/break/break_' + i + '.png');
	}
	loadImg('stone.png', 0);
	loadImg('dirt.png', 1);
	loadImg('grass.png', 2);
	loadImg('wood.png', 3);
	loadImg('planks.png', 4);
	loadImg('cobblestone.png', 5);
	loadImg('iron_ore.png', 6);
	loadImg('gold_ore.png', 7);
	loadImg('chest.png', 8);
	loadImg('furnace.png', 9);
	loadImg('diamond_ore.png', 10);
	loadImg('coal_ore.png', 11);
	loadImg('leaves.png', 12);
	textures[32768] = loadImage('textures/item/stick.png');
	textures[32769] = loadImage('textures/item/wood_pickaxe.png');
	textures[32770] = loadImage('textures/item/wood_axe.png');
	textures[32771] = loadImage('textures/item/wood_shovel.png');
	textures[32772] = loadImage('textures/item/stone_pickaxe.png');
	textures[32773] = loadImage('textures/item/stone_axe.png');
	textures[32774] = loadImage('textures/item/stone_shovel.png');
	textures[32775] = loadImage('textures/item/iron_ingot.png');
	textures[32776] = loadImage('textures/item/gold_ingot.png');
	textures[32777] = loadImage('textures/item/iron_pickaxe.png');
	textures[32778] = loadImage('textures/item/iron_axe.png');
	textures[32779] = loadImage('textures/item/iron_shovel.png');
	textures[32780] = loadImage('textures/item/gold_pickaxe.png');
	textures[32781] = loadImage('textures/item/gold_axe.png');
	textures[32782] = loadImage('textures/item/gold_shovel.png');
	textures[32783] = loadImage('textures/item/diamond.png');
	textures[32784] = loadImage('textures/item/diamond_pickaxe.png');
	textures[32785] = loadImage('textures/item/diamond_axe.png');
	textures[32786] = loadImage('textures/item/diamond_shovel.png');
	textures[32787] = loadImage('textures/item/coal.png');
	cell = loadImage('textures/gui/cell.png');
	selectedCell = loadImage('textures/gui/cell_selected.png');
}
class ScaledRes {
	constructor() {
		this.scale = Math.max(Math.floor(windowHeight / 480), 1);
	}
	updateScale() {
		this.scale = Math.max(Math.floor(windowHeight / 480), 1);
	}
	getScaledWidth() {
		return force480p ? 854 : Math.floor(windowWidth / this.scale);
	}
	getScaledHeight() {
		return force480p ? 480 : Math.floor(windowHeight / this.scale);
	}
	getScaledMouseX() {
		return Math.floor(mouseX / this.scale);
	}
	getScaledMouseY() {
		return Math.floor(mouseY / this.scale);
	}
	drawRect(x, y, width, height, color, strokeC) {
		fill((color >> 16) & 255, (color >> 8) & 255, color & 255, (color >> 24) & 255);
		stroke((strokeC >> 16) & 255, (strokeC >> 8) & 255, strokeC & 255, (strokeC >> 24) & 255);
		rect(x * this.scale, y * this.scale, width * this.scale, height * this.scale);
	}
	drawRect(x, y, width, height, color) {
		fill((color >> 16) & 255, (color >> 8) & 255, color & 255, (color >> 24) & 255);
		noStroke();
		rect(x * this.scale, y * this.scale, width * this.scale, height * this.scale);
	}
	drawText(txt, x, y, size, color) {
		fill((color >> 16) & 255, (color >> 8) & 255, color & 255, (color >> 24) & 255);
		textSize(size * this.scale);
		text(txt, x * this.scale, y * this.scale);
	}
	drawImage(img, x, y, width, height) {
		if(width === undefined || height === undefined) {
			image(img, x * res.scale, y * res.scale, img.width * res.scale, img.height * res.scale);
		} else {
			image(img, x * res.scale, y * res.scale, width * res.scale, height * res.scale);
		}
	}
	getScaledTextWidth(size, text) {
		textSize(size * this.scale);
		return textWidth(text);
	}
}
class Slider {
	constructor(x, y, width, height, min, max, increment, defaultVal) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.min = min;
		this.max = max;
		this.increment = increment;
		this.value = defaultVal;
	}
	render() {
		res.drawRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2, 0xFF000000);
		res.drawRect(this.x, this.y, this.width, this.height, 0xFF7F7F7F);
		res.drawRect(((this.value - this.min) / (this.max - this.min)) * this.width + this.x - 2, this.y, 4, this.height, 0xFF000000);
	}
	update(x, y) {
		this.x = x;
		this.y = y;
		if(mouseIsPressed && mouseButton === LEFT) {
			if(res.getScaledMouseX() >= this.x && res.getScaledMouseX() <= this.x + this.width && res.getScaledMouseY() >= this.y && res.getScaledMouseY() <= this.y + this.height) {
				this.value = map((res.getScaledMouseX() - this.x) / this.width, 0, 1, this.min, this.max);
				this.value = Math.floor(this.value / this.increment) * this.increment;
			}
		}
	}
}
class Button {
	constructor(x, y, width, height, onclick) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.onclick = onclick;
	}
	render() {
		res.drawRect(this.x-1, this.y-1, this.width+2, this.height+2, 0xFF000000);
		if(res.getScaledMouseX() >= this.x && res.getScaledMouseX() <= this.x + this.width && res.getScaledMouseY() >= this.y && res.getScaledMouseY() <= this.y + this.height) {
			res.drawRect(this.x, this.y, this.width, this.height, 0xFFAFAFAF);
		} else res.drawRect(this.x, this.y, this.width, this.height, 0xFF7F7F7F);
	}
	update(x, y) {
		this.x = x;
		this.y = y;
		if(res.getScaledMouseX() >= this.x && res.getScaledMouseX() <= this.x + this.width && res.getScaledMouseY() >= this.y && res.getScaledMouseY() <= this.y + this.height) {
			if(mouseIsPressed && prevMouse !== mouseIsPressed && mouseButton === LEFT) {
				this.onclick();
			}
		}
	}
}
class GuiChest {
	constructor() {
		this.currentChest = undefined;
	}
	update() {
		if(mouseIsPressed && prevMouse !== mouseIsPressed) {
			if(mouseButton === LEFT) {
				for(let i=0;i<this.currentChest.inventory.length;i++) {
					let j = Math.floor(i / 9);
					let k = i % 9;
					if(res.getScaledMouseX() >= k * 52 + 158 && res.getScaledMouseX() <= k * 52 + 210 && res.getScaledMouseY() >= 266 + 52 * j && res.getScaledMouseY() <= 318 + 52 * j) {
						if(this.currentChest.inventory[i] !== undefined && cursorItem === undefined) {
							cursorItem = this.currentChest.inventory[i];
							this.currentChest.inventory[i] = undefined;
						} else if(this.currentChest.inventory[i] === undefined && cursorItem !== undefined) {
							this.currentChest.inventory[i] = cursorItem;
							cursorItem = undefined;
						} else if(this.currentChest.inventory[i] !== undefined) {
							if(this.currentChest.inventory[i].id !== cursorItem.id) {
								let temp = this.currentChest.inventory[i];
								this.currentChest.inventory[i] = cursorItem;
								cursorItem = temp;
							} else {
								if(this.currentChest.inventory[i].stack + cursorItem.stack <= this.currentChest.inventory[i].getItem().maxStack) {
									this.currentChest.inventory[i].stack += cursorItem.stack;
									cursorItem = undefined;
								} else {
									let oldsize = this.currentChest.inventory[i].stack;
									this.currentChest.inventory[i].stack += this.currentChest.inventory[i].getItem().maxStack - this.currentChest.inventory[i].stack;
									cursorItem.stack -= this.currentChest.inventory[i].getItem().maxStack - oldsize;
								}
							}
						}
						break;
					}
				}
			} else if(mouseButton === RIGHT) {
				for(let i=0;i<this.currentChest.inventory.length;i++) {
					let j = Math.floor(i / 9);
					let k = i % 9;
					if(res.getScaledMouseX() >= k * 52 + 158 && res.getScaledMouseX() <= k * 52 + 210 && res.getScaledMouseY() >= 266 + 52 * j && res.getScaledMouseY() <= 318 + 52 * j) {
						if(this.currentChest.inventory[i] === undefined && cursorItem !== undefined) {
							cursorItem.stack--;
							this.currentChest.inventory[i] = new ItemStack(cursorItem.getItem(), 1, cursorItem.damage);
						} else if(this.currentChest.inventory[i] !== undefined && cursorItem !== undefined && cursorItem.id === this.currentChest.inventory[i].id) {
							cursorItem.stack--;
							this.currentChest.inventory[i].stack++;
							if(cursorItem.stack < 1) cursorItem = undefined;
						} else if(this.currentChest.inventory[i] !== undefined) {
							cursorItem = new ItemStack(this.currentChest.inventory[i].getItem(), ceil(this.currentChest.inventory[i].stack/2), this.currentChest.inventory[i].damage);
							this.currentChest.inventory[i].stack = floor(this.currentChest.inventory[i].stack/2);
							if(this.currentChest.inventory[i].stack < 1) this.currentChest.inventory[i] = undefined;
						}
						break;
					}
				}
			}
		}
	}
	render() {
		for(let i=0;i<this.currentChest.inventory.length;i++) {
			let j = Math.floor(i/9);
			let k = i % 9;
			res.drawImage(cell, k * 52 + 158, j * 52 + 266);
			if(this.currentChest.inventory[i] !== undefined) {
				if(!editbg || !(this.currentChest.inventory[i].getItem() instanceof ItemBlock)) {
					res.drawImage(textures[this.currentChest.inventory[i].id], k * 52 + 168, j * 52 + 276);
				} else res.drawImage(texturesBg[this.currentChest.inventory[i].id], k * 52 + 168, j * 52 + 276);
				res.drawText(this.currentChest.inventory[i].stack.toString(), k * 52 + 168, 295 + 52 * j, 12, 0xFFFFFFFF);
				if(this.currentChest.inventory[i].getItem().maxDamage > 0) {
					res.drawRect(k * 52 + 170, 278 + 52 * j, 28, 2, 0xFF000000);
					let percent = map(this.currentChest.inventory[i].getItem().maxDamage - this.currentChest.inventory[i].damage, 0, this.currentChest.inventory[i].getItem().maxDamage, 0, 1);
					res.drawRect(k * 52 + 170, 278 + 52 * j, 28 * percent, 2, 0xFF00CF00);
				}
			}
			if(res.getScaledMouseX() >= k * 52 + 158 && res.getScaledMouseX() <= k * 52 + 210 && res.getScaledMouseY() >= 266 + 52 * j && res.getScaledMouseY() <= 318 + 52 * j) {
				res.drawRect(k * 52 + 168, 276 + 52 * j, 32, 32, 0x3FFFFFFF);
			}
		}
	}
}
class GuiFurnace {
	constructor() {
		this.currentFurnace = undefined;
	}
	update() {
		if(mouseIsPressed && prevMouse !== mouseIsPressed) {
			if(mouseButton === LEFT) {
				if(res.getScaledMouseX() >= 2 && res.getScaledMouseX() <= 54 && res.getScaledMouseY() >= 266 && res.getScaledMouseY() <= 318) {
					if(this.currentFurnace.inputSlot !== undefined && cursorItem === undefined) {
						cursorItem = this.currentFurnace.inputSlot;
						this.currentFurnace.inputSlot = undefined;
					} else if(this.currentFurnace.inputSlot === undefined && cursorItem !== undefined) {
						this.currentFurnace.inputSlot = cursorItem;
						cursorItem = undefined;
					} else if(this.currentFurnace.inputSlot !== undefined) {
						if(this.currentFurnace.inputSlot.id !== cursorItem.id) {
							let temp = this.currentFurnace.inputSlot;
							this.currentFurnace.inputSlot = cursorItem;
							cursorItem = temp;
						} else {
							if(this.currentFurnace.inputSlot.stack + cursorItem.stack <= this.currentFurnace.inputSlot.getItem().maxStack) {
								this.currentFurnace.inputSlot.stack += cursorItem.stack;
								cursorItem = undefined;
							} else {
								let oldsize = this.currentFurnace.inputSlot.stack;
								this.currentFurnace.inputSlot.stack += this.currentFurnace.inputSlot.getItem().maxStack - this.currentFurnace.inputSlot.stack;
								cursorItem.stack -= this.currentFurnace.inputSlot.getItem().maxStack - oldsize;
							}
						}
					}
				} else if(res.getScaledMouseX() >= 2 && res.getScaledMouseX() <= 54 && res.getScaledMouseY() >= 370 && res.getScaledMouseY() <= 422) {
					if(this.currentFurnace.fuelSlot !== undefined && cursorItem === undefined) {
						cursorItem = this.currentFurnace.fuelSlot;
						this.currentFurnace.fuelSlot = undefined;
					} else if(this.currentFurnace.fuelSlot === undefined && cursorItem !== undefined) {
						this.currentFurnace.fuelSlot = cursorItem;
						cursorItem = undefined;
					} else if(this.currentFurnace.fuelSlot !== undefined) {
						if(this.currentFurnace.fuelSlot.id !== cursorItem.id) {
							let temp = this.currentFurnace.fuelSlot;
							this.currentFurnace.fuelSlot = cursorItem;
							cursorItem = temp;
						} else {
							if(this.currentFurnace.fuelSlot.stack + cursorItem.stack <= this.currentFurnace.fuelSlot.getItem().maxStack) {
								this.currentFurnace.fuelSlot.stack += cursorItem.stack;
								cursorItem = undefined;
							} else {
								let oldsize = this.currentFurnace.fuelSlot.stack;
								this.currentFurnace.fuelSlot.stack += this.currentFurnace.fuelSlot.getItem().maxStack - this.currentFurnace.fuelSlot.stack;
								cursorItem.stack -= this.currentFurnace.fuelSlot.getItem().maxStack - oldsize;
							}
						}
					}
				} else if(res.getScaledMouseX() >= 106 && res.getScaledMouseX() <= 158 && res.getScaledMouseY() >= 318 && res.getScaledMouseY() <= 370) {
					if(this.currentFurnace.outputSlot !== undefined && cursorItem === undefined) {
						cursorItem = this.currentFurnace.outputSlot;
						this.currentFurnace.outputSlot = undefined;
					} else if(this.currentFurnace.outputSlot === undefined && cursorItem !== undefined) {
						this.currentFurnace.outputSlot = cursorItem;
						cursorItem = undefined;
					} else if(this.currentFurnace.outputSlot !== undefined) {
						if(this.currentFurnace.outputSlot.id !== cursorItem.id) {
							let temp = this.currentFurnace.outputSlot;
							this.currentFurnace.outputSlot = cursorItem;
							cursorItem = temp;
						} else {
							if(this.currentFurnace.outputSlot.stack + cursorItem.stack <= this.currentFurnace.outputSlot.getItem().maxStack) {
								this.currentFurnace.outputSlot.stack += cursorItem.stack;
								cursorItem = undefined;
							} else {
								let oldsize = this.currentFurnace.outputSlot.stack;
								this.currentFurnace.outputSlot.stack += this.currentFurnace.outputSlot.getItem().maxStack - this.currentFurnace.outputSlot.stack;
								cursorItem.stack -= this.currentFurnace.outputSlot.getItem().maxStack - oldsize;
							}
						}
					}
				}
			} else if(mouseButton === RIGHT) {
				if(res.getScaledMouseX() >= 2 && res.getScaledMouseX() <= 54 && res.getScaledMouseY() >= 266 && res.getScaledMouseY() <= 318) {
					if(this.currentFurnace.inputSlot === undefined && cursorItem !== undefined) {
						cursorItem.stack--;
						this.currentFurnace.inputSlot = new ItemStack(cursorItem.getItem(), 1, cursorItem.damage);
					} else if(this.currentFurnace.inputSlot !== undefined && cursorItem !== undefined && cursorItem.id === this.currentFurnace.inputSlot.id) {
						cursorItem.stack--;
						this.currentFurnace.inputSlot.stack++;
						if(cursorItem.stack < 1) cursorItem = undefined;
					} else if(this.currentFurnace.inputSlot !== undefined) {
						cursorItem = new ItemStack(this.currentFurnace.inputSlot.getItem(), ceil(this.currentFurnace.inputSlot.stack/2), this.currentFurnace.inputSlot.damage);
						this.currentFurnace.inputSlot.stack = floor(this.currentFurnace.inputSlot.stack/2);
						if(this.currentFurnace.inputSlot.stack < 1) this.currentFurnace.inputSlot = undefined;
					}
				} else if(res.getScaledMouseX() >= 2 && res.getScaledMouseX() <= 54 && res.getScaledMouseY() >= 370 && res.getScaledMouseY() <= 422) {
					if(this.currentFurnace.fuelSlot === undefined && cursorItem !== undefined) {
						cursorItem.stack--;
						this.currentFurnace.fuelSlot = new ItemStack(cursorItem.getItem(), 1, cursorItem.damage);
					} else if(this.currentFurnace.fuelSlot !== undefined && cursorItem !== undefined && cursorItem.id === this.currentFurnace.fuelSlot.id) {
						cursorItem.stack--;
						this.currentFurnace.fuelSlot.stack++;
						if(cursorItem.stack < 1) cursorItem = undefined;
					} else if(this.currentFurnace.fuelSlot !== undefined) {
						cursorItem = new ItemStack(this.currentFurnace.fuelSlot.getItem(), ceil(this.currentFurnace.fuelSlot.stack/2), this.currentFurnace.fuelSlot.damage);
						this.currentFurnace.fuelSlot.stack = floor(this.currentFurnace.fuelSlot.stack/2);
						if(this.currentFurnace.fuelSlot.stack < 1) this.currentFurnace.fuelSlot = undefined;
					}
				} else if(res.getScaledMouseX() >= 106 && res.getScaledMouseX() <= 158 && res.getScaledMouseY() >= 318 && res.getScaledMouseY() <= 370) {
					if(this.currentFurnace.outputSlot === undefined && cursorItem !== undefined) {
						cursorItem.stack--;
						this.currentFurnace.outputSlot = new ItemStack(cursorItem.getItem(), 1, cursorItem.damage);
					} else if(this.currentFurnace.outputSlot !== undefined && cursorItem !== undefined && cursorItem.id === this.currentFurnace.outputSlot.id) {
						cursorItem.stack--;
						this.currentFurnace.outputSlot.stack++;
						if(cursorItem.stack < 1) cursorItem = undefined;
					} else if(this.currentFurnace.outputSlot !== undefined) {
						cursorItem = new ItemStack(this.currentFurnace.outputSlot.getItem(), ceil(this.currentFurnace.outputSlot.stack/2), this.currentFurnace.outputSlot.damage);
						this.currentFurnace.outputSlot.stack = floor(this.currentFurnace.outputSlot.stack/2);
						if(this.currentFurnace.outputSlot.stack < 1) this.currentFurnace.outputSlot = undefined;
					}
				}
			}
		}
	}
	render() {
		res.drawImage(cell, 2, 266);
		if(this.currentFurnace.inputSlot !== undefined) {
			if(!editbg || !(this.currentFurnace.inputSlot.getItem() instanceof ItemBlock)) {
				res.drawImage(textures[this.currentFurnace.inputSlot.id], 12, 276);
			} else res.drawImage(texturesBg[this.currentFurnace.inputSlot.id], 12, 276);
			res.drawText(this.currentFurnace.inputSlot.stack.toString(), 12, 295, 12, 0xFFFFFFFF);
			if(this.currentFurnace.inputSlot.getItem().maxDamage > 0) {
				res.drawRect(14, 278, 28, 2, 0xFF000000);
				let percent = map(this.currentFurnace.inputSlot.getItem().maxDamage - this.currentFurnace.inputSlot.damage, 0, this.currentFurnace.inputSlot.getItem().maxDamage, 0, 1);
				res.drawRect(14, 278, 28 * percent, 2, 0xFF00CF00);
			}
		}
		if(res.getScaledMouseX() >= 2 && res.getScaledMouseX() <= 54 && res.getScaledMouseY() >= 266 && res.getScaledMouseY() <= 318) {
			res.drawRect(12, 276, 32, 32, 0x3FFFFFFF);
		}
		res.drawImage(cell, 2, 370);
		if(this.currentFurnace.fuelSlot !== undefined) {
			if(!editbg || !(this.currentFurnace.fuelSlot.getItem() instanceof ItemBlock)) {
				res.drawImage(textures[this.currentFurnace.fuelSlot.id], 12, 380);
			} else res.drawImage(texturesBg[this.currentFurnace.fuelSlot.id], 12, 380);
			res.drawText(this.currentFurnace.fuelSlot.stack.toString(), 12, 399, 12, 0xFFFFFFFF);
			if(this.currentFurnace.fuelSlot.getItem().maxDamage > 0) {
				res.drawRect(14, 382, 28, 2, 0xFF000000);
				let percent = map(this.currentFurnace.fuelSlot.getItem().maxDamage - this.currentFurnace.fuelSlot.damage, 0, this.currentFurnace.fuelSlot.getItem().maxDamage, 0, 1);
				res.drawRect(14, 382, 28 * percent, 2, 0xFF00CF00);
			}
		}
		if(res.getScaledMouseX() >= 2 && res.getScaledMouseX() <= 54 && res.getScaledMouseY() >= 370 && res.getScaledMouseY() <= 422) {
			res.drawRect(12, 380, 32, 32, 0x3FFFFFFF);
		}
		res.drawImage(selectedCell, 106, 318);
		if(this.currentFurnace.outputSlot !== undefined) {
			console.log(this.currentFurnace.outputSlot);
			if(!editbg || !(this.currentFurnace.outputSlot.getItem() instanceof ItemBlock)) {
				res.drawImage(textures[this.currentFurnace.outputSlot.id], 116, 328);
			} else res.drawImage(texturesBg[this.currentFurnace.outputSlot.id], 116, 328);
			res.drawText(this.currentFurnace.outputSlot.stack.toString(), 116, 347, 12, 0xFFFFFFFF);
			if(this.currentFurnace.outputSlot.getItem().maxDamage > 0) {
				res.drawRect(118, 278, 28, 2, 0xFF000000);
				let percent = map(this.currentFurnace.outputSlot.getItem().maxDamage - this.currentFurnace.outputSlot.damage, 0, this.currentFurnace.outputSlot.getItem().maxDamage, 0, 1);
				res.drawRect(118, 278, 28 * percent, 2, 0xFF00CF00);
			}
		}
		if(res.getScaledMouseX() >= 106 && res.getScaledMouseX() <= 158 && res.getScaledMouseY() >= 318 && res.getScaledMouseY() <= 370) {
			res.drawRect(116, 328, 32, 32, 0x3FFFFFFF);
		}
		res.drawRect(24, 318, 8, 52, 0xFF000000);
		let percent = this.currentFurnace.burnTime / this.currentFurnace.maxBurn;
		if(Number.isNaN(percent)) percent = 0;
		res.drawRect(24, 318 + ((1.0 - percent) * 52), 8, percent * 52, 0xFFFF3F00);

		res.drawRect(60, 340, 40, 8, 0xFF000000);
		let recipe = this.currentFurnace.inputSlot !== undefined ? getSmelting(this.currentFurnace.inputSlot) : undefined;
		if(recipe !== undefined) {
			percent = this.currentFurnace.time / recipe.time;
			res.drawRect(60, 340, percent * 40, 8, 0xFFBFBFBF);
		}
	}
}
