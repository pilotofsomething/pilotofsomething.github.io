selectedSlot = 0;
selectedRecipe = 0;
recipeList = [];
cursorItem = undefined;
chestGUI = new GuiChest();
furnaceGUI = new GuiFurnace();

class Player {
	constructor(x, y) {
		this.inventory = new Array(55);
		for(let i=0;i<this.inventory.length;i++) {
			if(itemList[i] !== undefined) {
				this.inventory[i] = new ItemStack(itemList[i], itemList[i].maxStack, 0);
			}
		}
		this.recipeSlot = undefined;
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.ground = false;
	}
	update() {
		for(let i=0;i<this.inventory.length;i++) {
			if(this.inventory[i] !== undefined) {
				if(this.inventory[i].stack < 1) this.inventory[i] = undefined;
			}
		}
		if(this.ground && space) {
			player.vy -= 10;
		}
		this.vx = pressed * 4;
		this.x += this.vx;
		this.y += this.vy;
		this.vy += 0.5;
		if(this.vy > 48) this.vy = 48;
		if(this.x < 0) this.x = 0;
		if(this.x > (world.width * 32) - 32) this.x = (world.width * 32) - 32;
		if(mouseIsPressed && prevMouse !== mouseIsPressed) {
			if(mouseButton === LEFT) {
				for(let i=0;i<this.inventory.length;i++) {
					let j = Math.floor(i / 11);
					let k = i % 11;
					if(inInventory && res.getScaledMouseX() >= k * 52 + 2 && res.getScaledMouseX() <= k * 52 + 54 && res.getScaledMouseY() >= (i < 11 ? 2 : (6 + 52 * j)) && res.getScaledMouseY() <= (i < 11 ? 2 : (6 + 52 * j)) + 52) {
						if(this.inventory[i] !== undefined && cursorItem === undefined) {
							cursorItem = this.inventory[i];
							this.inventory[i] = undefined;
						} else if(this.inventory[i] === undefined && cursorItem !== undefined) {
							this.inventory[i] = cursorItem;
							cursorItem = undefined;
						} else if(this.inventory[i] !== undefined) {
							if(this.inventory[i].id !== cursorItem.id) {
								let temp = this.inventory[i];
								this.inventory[i] = cursorItem;
								cursorItem = temp;
							} else {
								if(this.inventory[i].stack + cursorItem.stack <= this.inventory[i].getItem().maxStack) {
									this.inventory[i].stack += cursorItem.stack;
									cursorItem = undefined;
								} else {
									let oldsize = this.inventory[i].stack;
									this.inventory[i].stack += this.inventory[i].getItem().maxStack - this.inventory[i].stack;
									cursorItem.stack -= this.inventory[i].getItem().maxStack - oldsize;
								}
							}
						}
						break;
					}
				}
				if(res.getScaledMouseX() >= 2 && res.getScaledMouseX() <= 54 && res.getScaledMouseY() >= 318 && res.getScaledMouseY() <= 370) {
					let recipe = this.getRecipes()[selectedRecipe];
					let counts = new Array(recipe.items.length);
					for(let i=0;i<counts.length;i++) {
						counts[i] = recipe.items[i].stack;
					}
					if(cursorItem === undefined || (cursorItem.id == recipe.result.id && cursorItem.stack + recipe.result.stack <= cursorItem.getItem().maxStack)) {
						for(let i=0;i<counts.length;i++) {
							for(let i1=0;counts[i] > 0 && i1 < this.inventory.length;i1++) {
								if(this.inventory[i1] !== undefined && this.inventory[i1].id === recipe.items[i].id) {
									let c = counts[i];
									counts[i] -= Math.min(Math.min(counts[i], this.inventory[i1].stack), this.inventory[i1].getItem().maxStack);
									this.inventory[i1].stack -= Math.min(Math.min(c, this.inventory[i1].stack), this.inventory[i1].getItem().maxStack);
									if(this.inventory[i1].stack < 1) this.inventory[i1] = undefined;
								}
							}
						}
						if(cursorItem === undefined) {
							cursorItem = new ItemStack(recipe.result.getItem(), recipe.result.stack, recipe.result.damage);
						} else cursorItem.stack += recipe.result.stack;
					}
				}
			} else if(mouseButton === RIGHT) {
				for(let i=0;i<this.inventory.length;i++) {
					let j = Math.floor(i / 11);
					let k = i % 11;
					if(inInventory && res.getScaledMouseX() >= k * 52 + 2 && res.getScaledMouseX() <= k * 52 + 54 && res.getScaledMouseY() >= (i < 11 ? 2 : (6 + 52 * j)) && res.getScaledMouseY() <= (i < 11 ? 2 : (6 + 52 * j)) + 52) {
						if(this.inventory[i] === undefined && cursorItem !== undefined) {
							cursorItem.stack--;
							this.inventory[i] = new ItemStack(cursorItem.getItem(), 1, cursorItem.damage);
						} else if(this.inventory[i] !== undefined && cursorItem !== undefined && cursorItem.id === this.inventory[i].id) {
							cursorItem.stack--;
							this.inventory[i].stack++;
							if(cursorItem.stack < 1) cursorItem = undefined;
						} else if(this.inventory[i] !== undefined) {
							cursorItem = new ItemStack(this.inventory[i].getItem(), ceil(this.inventory[i].stack/2), this.inventory[i].damage);
							this.inventory[i].stack = floor(this.inventory[i].stack/2);
							if(this.inventory[i].stack < 1) this.inventory[i] = undefined;
						}
						break;
					}
				}
			}
		}
		if(chestGUI.currentChest !== undefined) chestGUI.update();
		if(furnaceGUI.currentFurnace !== undefined) furnaceGUI.update();
	}
	render() {
		let slots = inInventory ? this.inventory.length : 11;
		for(let i=0;i<slots;i++) {
			let j = Math.floor(i / 11);
			let k = i % 11;
			if(selectedSlot !== i) {
				res.drawImage(cell, k * 52 + 2, i < 11 ? 2 : (6 + 52 * j));
			} else res.drawImage(selectedCell, k * 52 + 2, i < 11 ? 2 : (6 + 52 * j));
			if(this.inventory[i] !== undefined) {
				if(!editbg || !(this.inventory[i].getItem() instanceof ItemBlock)) {
					res.drawImage(textures[this.inventory[i].id], k * 52 + 12, (i < 11 ? 2 : (6 + 52 * j)) + 10);
				} else res.drawImage(texturesBg[this.inventory[i].id], k * 52 + 12, (i < 11 ? 2 : (6 + 52 * j)) + 10);
				res.drawText(this.inventory[i].stack.toString(), k * 52 + 12, (i < 11 ? 2 : (6 + 52 * j)) + 29, 12, 0xFFFFFFFF);
				if(this.inventory[i].getItem().maxDamage > 0) {
					res.drawRect(k * 52 + 14, (i < 11 ? 4 : (8 + 52 * j)) + 10, 28, 2, 0xFF000000);
					let percent = map(this.inventory[i].getItem().maxDamage - this.inventory[i].damage, 0, this.inventory[i].getItem().maxDamage, 0, 1);
					res.drawRect(k * 52 + 14, (i < 11 ? 4 : (8 + 52 * j)) + 10, 28 * percent, 2, 0xFF00CF00);
				}
			}
			if(inInventory && res.getScaledMouseX() >= k * 52 + 2 && res.getScaledMouseX() <= k * 52 + 54 && res.getScaledMouseY() >= (i < 11 ? 2 : (6 + 52 * j)) && res.getScaledMouseY() <= (i < 11 ? 2 : (6 + 52 * j)) + 52) {
				res.drawRect(k * 52 + 12, (i < 11 ? 2 : (6 + 52 * j)) + 10, 32, 32, 0x3FFFFFFF);
			}
		}
		if(inInventory) {
			if(furnaceGUI.currentFurnace === undefined) {
				let prevRecipe = this.getRecipes()[selectedRecipe > 0 ? selectedRecipe - 1 : this.getRecipes().length-1];
				let currRecipe = this.getRecipes()[selectedRecipe];
				let nextRecipe = this.getRecipes()[selectedRecipe < this.getRecipes().length-1 ? selectedRecipe + 1 : 0];
				if(currRecipe !== undefined) {
					res.drawText("Crafting\nRecipe " + (selectedRecipe + 1) + " of " + this.getRecipes().length, 54, 276, 14, 0xFF000000);
					res.drawImage(cell, 2, 266);
					if(!editbg || !(prevRecipe.result.getItem() instanceof ItemBlock)) {
						res.drawImage(textures[prevRecipe.result.id], 12, 276);
					} else res.drawImage(texturesBg[prevRecipe.result.id], 12, 276);
					res.drawText(prevRecipe.result.stack.toString(), 12, 295, 12, 0xFFFFFFFF);
					res.drawImage(selectedCell, 2, 318);
					if(!editbg || !(currRecipe.result.getItem() instanceof ItemBlock)) {
						res.drawImage(textures[currRecipe.result.id], 12, 328);
					} else res.drawImage(texturesBg[currRecipe.result.id], 12, 328);
					res.drawText(currRecipe.result.stack.toString(), 12, 347, 12, 0xFFFFFFFF);
					res.drawImage(cell, 2, 370);
					if(!editbg || !(nextRecipe.result.getItem() instanceof ItemBlock)) {
						res.drawImage(textures[nextRecipe.result.id], 12, 380);
					} else res.drawImage(texturesBg[nextRecipe.result.id], 12, 380);
					res.drawText(nextRecipe.result.stack.toString(), 12, 399, 12, 0xFFFFFFFF);
					for(let i=0;i<currRecipe.items.length;i++) {
						res.drawImage(cell, 2 + (i + 1) * 52, 318);
						if(!editbg || !(currRecipe.items[i].getItem() instanceof ItemBlock)) {
							res.drawImage(textures[currRecipe.items[i].id], 12 + (i + 1) * 52, 328);
						} else res.drawImage(texturesBg[currRecipe.items[i].id], 12 + (i + 1) * 52, 328);
						res.drawText(currRecipe.items[i].stack.toString(), 12 + (i + 1) * 52, 347, 12, 0xFFFFFFFF);
					}
					if(res.getScaledMouseX() >= 2 && res.getScaledMouseX() <= 54 && res.getScaledMouseY() >= 318 && res.getScaledMouseY() <= 370) {
						res.drawRect(12, 328, 32, 32, 0x3FFFFFFF);
					}
				}
			}
			if(chestGUI.currentChest !== undefined) chestGUI.render();
			if(furnaceGUI.currentFurnace !== undefined) furnaceGUI.render();
			if(cursorItem !== undefined) {
				if(!editbg || !(cursorItem.getItem() instanceof ItemBlock)) {
					res.drawImage(textures[cursorItem.id], res.getScaledMouseX() - 16, res.getScaledMouseY() - 16);
				} else res.drawImage(texturesBg[cursorItem.id], res.getScaledMouseX() - 16, res.getScaledMouseY() - 16);
				res.drawText(cursorItem.stack.toString(), res.getScaledMouseX() - 16, res.getScaledMouseY() + 1, 12, 0xFFFFFFFF);
				if(cursorItem.getItem().maxDamage > 0) {
					res.drawRect(res.getScaledMouseX() - 14, res.getScaledMouseY() - 14, 28, 2, 0xFF000000);
					let percent = map(cursorItem.getItem().maxDamage - cursorItem.damage, 0, cursorItem.getItem().maxDamage, 0, 1);
					res.drawRect(res.getScaledMouseX() - 14, res.getScaledMouseY() - 14, 28 * percent, 2, 0xFF00CF00);
				}
			}
		}
	}
	contains(x, y) {
		return !(x < this.x || x > this.x + 32 || y < this.y || y > this.y + 64);
	}
	addItem(item) {
		let firstInd = -1;
		for(let i=0;i<this.inventory.length && item.stack > 0;i++) {
			if(this.inventory[i] === undefined && firstInd === -1) {
				firstInd = i;
			} else if(this.inventory[i] !== undefined && this.inventory[i].id === item.id) {
				if(this.inventory[i].stack + item.stack <= item.getItem().maxStack) {
					this.inventory[i].stack += item.stack;
					item.stack = 0;
					return true;
				} else {
					let oldsize = this.inventory[i].stack;
					this.inventory[i].stack += this.inventory[i].getItem().maxStack - this.inventory[i].stack;
					item.stack -= this.inventory[i].getItem().maxStack - oldsize;
				}
			}
		}
		if(firstInd !== -1) {
			this.inventory[firstInd] = new ItemStack(item.getItem(), item.stack, item.damage);
			item.stack = 0;
			return true;
		} else return false;
	}
	getSpeedVsBlock(block) {
		if(this.inventory[selectedSlot] === undefined) {
			return 1.0;
		} else {
			return this.inventory[selectedSlot].getItem().getSpeedVsBlock(block);
		}
	}
	saveJSON() {
		let json = {};
		json.x = this.x;
		json.y = this.y;
		json.vx = this.vx;
		json.vy = this.vy;
		let saveInventory = [];
		for(let i=0;i<this.inventory.length;i++) {
			if(this.inventory[i] !== undefined) {
				saveInventory.push(this.inventory[i].saveJSON(i));
			}
		}
		json.inventory = saveInventory;
		return json;
	}
	loadJSON(json) {
		this.x = json.x;
		this.y = json.y;
		this.vx = json.vx;
		this.vy = json.vy;
		this.inventory = new Array(55);
		for(let i=0;i<json.inventory.length;i++) {
			this.inventory[json.inventory[i].slot] = new ItemStack(itemList[0], 0, 0).loadJSON(json.inventory[i]);
		}
	}
	canCraft(recipe) {
		let numItems = new Array(recipe.items.length);
		for(let i=0;i<numItems.length;i++) {
			numItems[i] = 0;
		}
		for(let i=0;i<this.inventory.length;i++) {
			if(this.inventory[i] === undefined) continue;
			for(let i1=0;i1<numItems.length;i1++) {
				if(recipe.items[i1].id === this.inventory[i].id) {
					numItems[i1] += this.inventory[i].stack;
				}
			}
		}
		for(let i=0;i<numItems.length;i++) {
			if(numItems[i] < recipe.items[i].stack) return false;
		}
		return true;
	}
	getRecipes() {
		let recipeArray = [];
		for(let i=0;i<recipeList.length;i++) {
			if(this.canCraft(recipeList[i])) recipeArray.push(recipeList[i]);
		}
		return recipeArray;
	}
}

function addRecipe(result, items) {
	let recipe = {};
	recipe.result = result;
	recipe.items = items;
	recipeList.push(recipe);
}
smeltingRecipes = [];
function addSmelting(item, result, time) {
	let recipe = {};
	recipe.item = item;
	recipe.result = result;
	recipe.time = time;
	smeltingRecipes.push(recipe);
}
function getSmelting(item) {
	for(let i=0;i<smeltingRecipes.length;i++) {
		if(smeltingRecipes[i].item.id === item.id) {
			return smeltingRecipes[i];
		}
	}
}
addSmelting(new ItemStack(itemList[ironOre.id], 1, 0), new ItemStack(ironIngot, 1, 0), 420);
addSmelting(new ItemStack(itemList[goldOre.id], 1, 0), new ItemStack(goldIngot, 1, 0), 300);
addSmelting(new ItemStack(itemList[diamondOre.id], 1, 0), new ItemStack(diamond, 1, 0), 350);
addSmelting(new ItemStack(itemList[cobble.id], 1, 0), new ItemStack(itemList[stone.id], 1, 0), 200);

addRecipe(new ItemStack(itemList[planks.id], 4, 0), [new ItemStack(itemList[wood.id], 1, 0)]);
addRecipe(new ItemStack(stick, 4, 0), [new ItemStack(itemList[planks.id], 2, 0)]);
let matList = [planks.id, cobble.id, ironIngot.id, goldIngot.id, diamond.id];
let matNames = ["wood", "stone", "iron", "gold", "diamond"];
for(let i=0;i<matList.length;i++) {
	addRecipe(new ItemStack(eval(matNames[i] + 'Pick'), 1, 0), [new ItemStack(stick, 2, 0), new ItemStack(itemList[matList[i]], 3, 0)]);
	addRecipe(new ItemStack(eval(matNames[i] + 'Axe'), 1, 0), [new ItemStack(stick, 2, 0), new ItemStack(itemList[matList[i]], 3, 0)]);
	addRecipe(new ItemStack(eval(matNames[i] + 'Shovel'), 1, 0), [new ItemStack(stick, 2, 0), new ItemStack(itemList[matList[i]], 1, 0)]);
}
addRecipe(new ItemStack(itemList[chest.id], 1, 0), [new ItemStack(itemList[planks.id], 8, 0)]);
addRecipe(new ItemStack(itemList[furnace.id], 1, 0), [new ItemStack(itemList[cobble.id], 8, 0)]);
