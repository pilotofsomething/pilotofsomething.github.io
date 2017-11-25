class Item {
	constructor(id) {
		this.id = id;
		this.maxStack = 99;
		this.maxDamage = 0;
		itemList[id] = this;
	}
	setMaxStack(amount) {
		this.maxStack = amount;
		itemList[this.id] = this;
		return this;
	}
	getSpeedVsBlock(block) {
		return 1.0;
	}
	onRightClick(stack, x, y) {}
	onUse(stack, x, y) {}
	onLeftClick(stack, x, y) {}
	onBlockBreak(stack, x, y) {};
}
class ItemBlock extends Item {
	constructor(id) {
		super(id);
	}
	onRightClick(stack, x, y) {
		if(!editbg) {
			if(world.foreground[x][y] === -1) {
				world.foreground[x][y] = this.id;
				stack.stack--;
			}
		} else {
			if(world.background[x][y] === -1) {
				world.background[x][y] = this.id;
				stack.stack--;
			}
		}
	}
}
class ItemChest extends ItemBlock {
	constructor(id) {
		super(id);
	}
	onRightClick(stack, x, y) {
		super.onRightClick(stack, x, y);
		if(world.getBlockEntity(x, y) === undefined) {
			world.blockentities.push(new BlockEntityChest(x, y));
		}
	}
}
class ItemFurnace extends ItemBlock {
	constructor(id) {
		super(id);
	}
	onRightClick(stack, x, y) {
		super.onRightClick(stack, x, y);
		if(world.getBlockEntity(x, y) === undefined) {
			world.blockentities.push(new BlockEntityFurnace(x, y));
		}
	}
}
class ItemPickaxe extends Item {
	constructor(id, material) {
		super(id);
		this.maxStack = 1;
		this.material = material;
		this.maxDamage = material.maxDamage;
	}
	getSpeedVsBlock(block) {
		return block instanceof BlockStone ? this.material.speed : 1;
	}
	onBlockBreak(stack, x, y) {
		stack.damageItem(1);
	}
}
class ItemAxe extends Item {
	constructor(id, material) {
		super(id);
		this.maxStack = 1;
		this.material = material;
		this.maxDamage = material.maxDamage;
	}
	getSpeedVsBlock(block) {
		return block instanceof BlockWood ? this.material.speed : 1;
	}
	onBlockBreak(stack, x, y) {
		stack.damageItem(1);
	}
}
class ItemShovel extends Item {
	constructor(id, material) {
		super(id);
		this.maxStack = 1;
		this.material = material;
		this.maxDamage = material.maxDamage;
	}
	getSpeedVsBlock(block) {
		return block instanceof BlockSoil ? this.material.speed : 1;
	}
	onBlockBreak(stack, x, y) {
		stack.damageItem(1);
	}
}
class ItemStack {
	constructor(item, stack, damage) {
		this.id = item.id;
		this.stack = stack;
		this.damage = damage;
	}
	damageItem(amount) {
		this.damage += amount;
		if(this.damage > this.getItem().maxDamage) this.stack--;
	}
	getItem() {
		return itemList[this.id];
	}
	saveJSON(slot) {
		let json = {};
		json.id = this.id;
		json.stacksize = this.stack;
		json.damage = this.damage;
		json.slot = slot;
		return json;
	}
	loadJSON(json) {
		this.id = json.id;
		this.stack = json.stacksize;
		this.damage = json.damage;
		return this;
	}
}
class Material {
	constructor(durability, speed) {
		this.maxDamage = durability;
		this.speed = speed;
	}
}
woodMaterial = new Material(59, 2);
stoneMaterial = new Material(131, 4);
ironMaterial = new Material(250, 6);
goldMaterial = new Material(89, 12);
diamondMaterial = new Material(2048, 8);

itemList = Array(65536);
for(let i=0;i<blockList.length;i++) {
	if(blockList[i] !== undefined && blockList[i] instanceof BlockChest) {
		new ItemChest(i);
	} else if(blockList[i] !== undefined && blockList[i] instanceof BlockFurnace) {
		new ItemFurnace(i);
	} else if(blockList[i] !== undefined) {
		new ItemBlock(i);
	}
}
stick = new Item(32768);
woodPick = new ItemPickaxe(32769, woodMaterial);
woodAxe = new ItemAxe(32770, woodMaterial);
woodShovel = new ItemShovel(32771, woodMaterial);
stonePick = new ItemPickaxe(32772, stoneMaterial);
stoneAxe = new ItemAxe(32773, stoneMaterial);
stoneShovel = new ItemShovel(32774, stoneMaterial);
ironIngot = new Item(32775);
goldIngot = new Item(32776);
ironPick = new ItemPickaxe(32777, ironMaterial);
ironAxe = new ItemAxe(32778, ironMaterial);
ironShovel = new ItemShovel(32779, ironMaterial);
goldPick = new ItemPickaxe(32780, goldMaterial);
goldAxe = new ItemAxe(32781, goldMaterial);
goldShovel = new ItemShovel(32782, goldMaterial);
diamond = new Item(32783);
diamondPick = new ItemPickaxe(32784, diamondMaterial);
diamondAxe = new ItemAxe(32785, diamondMaterial);
diamondShovel = new ItemShovel(32786, diamondMaterial);
coal = new Item(32787);
