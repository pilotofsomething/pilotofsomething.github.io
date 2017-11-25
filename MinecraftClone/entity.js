class Entity {
	constructor(x, y, mx, my, vx, vy) {
		this.x = x;
		this.y = y;
		this.mx = mx;
		this.my = my;
		this.vx = vx;
		this.vy = vy;
		this.ground = false;
		this.remove = false;
	}
	contains(x, y) {
		return !(x < this.x || x > this.x + this.mx || y < this.y || y > this.y + this.my);
	}
	update() {
		if(this.vy < 48) this.vy += 0.5;
		this.x += this.vx;
		this.y += this.vy;
		let offX = Math.floor((this.x - 64) / 32);
		let offY = Math.floor((this.y - 64) / 32);
		this.ground = false;
		for(let x=offX;x<offX+4;x++) {
			for(let y=offY;y<offY+4;y++) {
				if(world.foreground[x][y] !== -1) {
					let x1 = x * 32;
					let y1 = y * 32;
					if(this.contains(x1+4.01, y1) || this.contains(x1+27.99, y1)) {
						this.vy = 0;
						this.y = y1 - this.my;
						this.ground = true;
					}
					if(this.contains(x1+4.01, y1+32) || this.contains(x1+27.99, y1+32)) {
						this.vy = 0;
						this.y = y1+32.01;
					}
					if(this.contains(x1, y1+4.01) || this.contains(x1, y1+27.99)) {
						this.vx = 0;
						this.x = x1 - this.mx;
					}
					if(this.contains(x1+32, y1+4.01) || this.contains(x+32, y1+27.99)) {
						this.vx = 0;
						this.x = x1 + 32;
					}
				}
			}
		}
	}
	render() {
		res.drawRect(this.x - sX, this.y - sY, this.mx, this.my, 0);
	}
	saveJSON() {
		let json = {};
		json.x = this.x;
		json.y = this.y;
		json.vx = this.vx;
		json.vy = this.vy;
		json.mx = this.mx;
		json.my = this.my;
		json.type = 'ENTITY';
		return json;
	}
	loadJSON(json) {
		this.x = json.x;
		this.y = json.y;
		this.vx = json.vx;
		this.vy = json.vy;
		this.mx = json.mx;
		this.my = json.my;
		return this;
	}
}
class EntityItem extends Entity {
	constructor(item, x, y, vx, vy) {
		super(x, y, 24, 24, vx !== undefined ? vx : 0, vy !== undefined ? vy : 0);
		this.item = item;
	}
	update() {
		super.update();
		this.vx *= 0.6;
		if(player.contains(this.x, this.y) || player.contains(this.x+this.mx, this.y) || player.contains(this.x+this.mx, this.y+this.my) || player.contains(this.x, this.y+this.my)) {
			player.addItem(this.item);
		}
		if(this.item.stack <= 0) this.remove = true;
	}
	render() {
		res.drawImage(textures[this.item.id], this.x - sX, this.y - sY, this.mx, this.my);
	}
	saveJSON() {
		let json = super.saveJSON();
		json.type = 'ITEM';
		json.item = this.item.saveJSON();
		return json;
	}
	loadJSON(json) {
		super.loadJSON(json);
		this.item = new ItemStack(itemList[0], 0, 0).loadJSON(json.item);
		return this;
	}
}
