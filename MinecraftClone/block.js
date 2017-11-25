class Block {
	constructor(id) {
		this.id = id;
		this.hardness = 1.0;
		blockList[id] = this;
	}
	setHardness(hardness) {
		this.hardness = hardness;
		blockList[this.id] = this;
		return this;
	}
	getDrop(item) {
		return itemList[this.id];
	}
	onRightClick(x, y) {}
}
class BlockStone extends Block {
	constructor(id) {
		super(id);
	}
	getDrop(item) {
		return item !== undefined && item.getItem() instanceof ItemPickaxe ? itemList[cobble.id] : undefined;
	}
}
class BlockCobble extends BlockStone {
	constructor(id) {
		super(id);
	}
	getDrop(item) {
		return item !== undefined && item.getItem() instanceof ItemPickaxe ? itemList[this.id] : undefined;
	}
}
class BlockWood extends Block {
	constructor(id) {
		super(id);
	}
}
class BlockSoil extends Block {
	constructor(id) {
		super(id);
	}
}
class BlockGrass extends BlockSoil {
	constructor(id) {
		super(id);
	}
	getDrop(item) {
		return itemList[dirt.id];
	}
}
class BlockChest extends BlockWood {
	constructor(id) {
		super(id);
	}
	onRightClick(x, y) {
		inInventory = true;
		chestGUI.currentChest = world.getBlockEntity(x, y);
	}
}
class BlockFurnace extends BlockCobble {
	constructor(id) {
		super(id);
	}
	onRightClick(x, y) {
		inInventory = true;
		furnaceGUI.currentFurnace = world.getBlockEntity(x, y);
	}
}
class BlockOre extends BlockStone {
	constructor(id) {
		super(id);
	}
	getDrop(item) {
		return item !== undefined && item.getItem() instanceof ItemPickaxe  && this.id === 10 ? itemList[diamond.id] : this.id === 11 ? itemList[coal.id] : undefined;
	}

}
class BlockLeaves extends Block {
	constructor(id) {
		super(id);
	}
	getDrop(item) {
		return undefined;
	}
}
class BlockEntity {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.remove = false;
	}
	update() {}
	saveJSON() {
		let json = {};
		json.x = this.x;
		json.y = this.y;
		json.type = 'BLOCKENTITY';
		return json;
	}
	loadJSON(json) {
		this.x = json.x;
		this.y = json.y;
		return this;
	}
}
class BlockEntityChest extends BlockEntity {
	constructor(x, y) {
		super(x, y);
		this.inventory = new Array(27);
	}
	update() {
		for(let i=0;i<this.inventory.length;i++) {
			if(this.inventory[i] !== undefined) {
				if(this.inventory[i].stack < 1) this.inventory[i] = undefined;
			}
		}
		if(!(blockList[world.foreground[this.x][this.y]] instanceof BlockChest) && !(blockList[world.background[this.x][this.y]] instanceof BlockChest)) {
			for(let i=0;i<this.inventory.length;i++) {
				if(this.inventory[i] !== undefined) {
					world.entities.push(new EntityItem(new ItemStack(this.inventory[i].getItem(), this.inventory[i].stack, this.inventory[i].damage), (this.x * 32) + 4, (this.y * 32) + 4, random(-3, 3), random(0, 5)));
				}
			}
			this.remove = true;
		}
	}
	saveJSON() {
		let json = super.saveJSON();
		json.type = 'CHEST';
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
		super.loadJSON(json);
		this.inventory = new Array(27);
		for(let i=0;i<json.inventory.length;i++) {
			this.inventory[json.inventory[i].slot] = new ItemStack(itemList[0], 0, 0).loadJSON(json.inventory[i]);
		}
		return this;
	}
}
class BlockEntityFurnace extends BlockEntity {
	constructor(x, y) {
		super(x, y);
		this.inputSlot = undefined;
		this.outputSlot = undefined;
		this.fuelSlot = undefined;
		this.burnTime = 0;
		this.maxBurn = 0;
		this.time = 0;
	}
	update() {
		let recipe = this.inputSlot !== undefined ? getSmelting(this.inputSlot) : undefined;
		if(recipe !== undefined) {
			if(this.burnTime > 0 ) {
				if(this.time < recipe.time && this.inputSlot.stack >= recipe.item.stack && ((this.outputSlot !== undefined && this.outputSlot.stack + recipe.result.stack <= this.outputSlot.getItem().maxStack)) || this.outputSlot === undefined) {
					this.time++;
				}
				if(this.time >= recipe.time) {
					if(this.outputSlot === undefined) {
						this.outputSlot = new ItemStack(recipe.result.getItem(), recipe.result.stack, recipe.result.damage);
					} else if(this.outputSlot.id === recipe.result.id) {
						this.outputSlot.stack += recipe.result.stack;
					}
					this.inputSlot.stack -= recipe.item.stack;
					this.time = 0;
				}
			} else if(this.fuelSlot !== undefined) {
				if(this.fuelSlot.id === wood.id || this.fuelSlot.id === planks.id) {
					this.burnTime = 450;
					this.maxBurn = 450;
					this.fuelSlot.stack--;
				} else if(this.fuelSlot.id === stick.id) {
					this.burnTime = 300;
					this.maxBurn = 300;
					this.fuelSlot.stack--;
				} else if(this.fuelSlot.id === coal.id) {
					this.burnTime = 4800;
					this.maxBurn = 4800;
					this.fuelSlot.stack--;
				}
			} else {
				if(this.time > 0) this.time--;
			}
		}
		if(this.inputSlot !== undefined && this.inputSlot.stack < 1) this.inputSlot = undefined;
		if(this.outputSlot !== undefined && this.outputSlot.stack < 1) this.outputSlot = undefined;
		if(this.fuelSlot !== undefined && this.fuelSlot.stack < 1) this.fuelSlot = undefined;
		if(this.burnTime > 0) this.burnTime--;
		if(!(blockList[world.foreground[this.x][this.y]] instanceof BlockFurnace) && !(blockList[world.background[this.x][this.y]] instanceof BlockFurnace)) {
			if(this.inputSlot !== undefined) {
				world.entities.push(new EntityItem(new ItemStack(this.inputSlot.getItem(), this.inputSlot.stack, this.inputSlot.damage), (this.x * 32) + 4, (this.y * 32) + 4, random(-3, 3), random(0, 5)));
			}
			if(this.outputSlot !== undefined) {
				world.entities.push(new EntityItem(new ItemStack(this.outputSlot.getItem(), this.outputSlot.stack, this.outputSlot.damage), (this.x * 32) + 4, (this.y * 32) + 4, random(-3, 3), random(0, 5)));
			}
			if(this.fuelSlot !== undefined) {
				world.entities.push(new EntityItem(new ItemStack(this.fuelSlot.getItem(), this.fuelSlot.stack, this.fuelSlot.damage), (this.x * 32) + 4, (this.y * 32) + 4, random(-3, 3), random(0, 5)));
			}
			this.remove = true;
		}
	}
	saveJSON() {
		let json = super.saveJSON();
		json.type = 'FURNACE';
		if(this.inputSlot !== undefined) json.inputSlot = this.inputSlot.saveJSON(0);
		if(this.outputSlot !== undefined) json.outputSlot = this.outputSlot.saveJSON(1);
		if(this.fuelSlot !== undefined) json.fuelSlot = this.fuelSlot.saveJSON(2);
		json.burnTime = this.burnTime;
		json.maxBurn = this.maxBurn;
		json.time = this.time;
		return json;
	}
	loadJSON(json) {
		super.loadJSON(json);
		if(json.inputSlot !== undefined) this.inputSlot = this.inputSlot.saveJSON();
		if(json.outputSlot !== undefined) this.outputSlot = this.outputSlot.saveJSON();
		if(json.fuelSlot !== undefined) this.fuelSlot = this.fuelSlot.saveJSON();
		this.burnTime = json.burnTime;
		this.maxBurn = json.maxBurn;
		this.time = json.time;
		return this;
	}
}

blockList = new Array(32768);
stone = new BlockStone(0).setHardness(2.0);
dirt = new BlockSoil(1).setHardness(1.0);
grass = new BlockGrass(2).setHardness(1.2);
wood = new BlockWood(3).setHardness(1.8);
planks = new BlockWood(4).setHardness(1.8);
cobble = new BlockCobble(5).setHardness(2.5);
ironOre = new BlockCobble(6).setHardness(4.0);
goldOre = new BlockCobble(7).setHardness(3.5);
chest = new BlockChest(8).setHardness(2.0);
furnace = new BlockFurnace(9).setHardness(2.4);
diamondOre = new BlockOre(10).setHardness(5.5);
coalOre = new BlockOre(11).setHardness(3.0);
leaves = new BlockLeaves(12).setHardness(0.7);
