force480p = false; // Debug option, forces game to run at 854x480 resolution.

sX = 0;
sY = 0;
player = undefined;
editbg = false;
inInventory = false;
let pressed = 0;
let space = false;
let inWorld = false;
let prevMouse = false;

let worldWidthSlider = new Slider(0, 0, 200, 32, 64, 4096, 16, 256);
let worldHeightSlider = new Slider(0, 0, 200, 32, 64, 4096, 16, 64);
let genWorldButton = new Button(0, 0, 200, 32, function() {});
let loadWorldButton = new Button(0, 0, 200, 32, function() {});
let importButton = new Button(0, 0, 200, 32, function() {});
saveExportArea = undefined;

function setup() {
	createCanvas(force480p ? 854 : windowWidth, force480p ? 480 : windowHeight);
	world = new World();
	res = new ScaledRes();
	noSmooth();
	textAlign(LEFT, TOP);
	world.setSize(512, 128);
	world.generate();
	worldWidthSlider = new Slider(res.getScaledWidth() / 2 - 100, res.getScaledHeight() / 2 - 26, 200, 24, 64, 8192, 64, 512);
	worldHeightSlider = new Slider(res.getScaledWidth() / 2 - 100, res.getScaledHeight() / 2 + 2, 200, 24, 32, 2048, 32, 128);
	genWorldButton = new Button(res.getScaledWidth() / 2 - 100, res.getScaledHeight() / 2 + 30, 200, 24, function() {
		world.setSize(worldWidthSlider.value, worldHeightSlider.value);
		world.generate();
		inWorld = true;
	});
	loadWorldButton = new Button(res.getScaledWidth() / 2 - 100, res.getScaledHeight() / 2 + 58, 200, 24, function() {
		if(localStorage.getItem('savedata')) {
			loadGame();
		} else alert('No data to load.');
	});
	importButton = new Button(res.getScaledWidth() / 2 - 100, res.getScaledHeight() / 2 + 86, 200, 24, function() {
		let input = window.prompt('Paste save data to import. Ctrl-V to paste.');
		if(input !== null && input.length !== 0) loadGame(input);
	});
}

function draw() {
	if(selectedRecipe > player.getRecipes().length-1) selectedRecipe = 0;
	if(selectedRecipe < 0) selectedRecipe = player.getRecipes().length-1;
	background(100, 100, 255);
	if(inWorld) {
		player.update();
		world.update();
		sX = player.x - (res.getScaledWidth() / 2) + 16;
		sY = player.y - (res.getScaledHeight() / 2) + 32;
		if(sX < 0) sX = 0;
		if(sX + res.getScaledWidth() > (world.width-2) * 32 + 64) sX = (world.width-2) * 32 - res.getScaledWidth() + 64;
		if(sY + res.getScaledHeight() > world.height * 32) sY = world.height * 32 - res.getScaledHeight();
		world.render(true);
		res.drawRect(player.x - sX, player.y - sY, 32, 64, 0xFF000000);
		world.render(false);
		player.render();
	} else {
		worldWidthSlider.update(res.getScaledWidth() / 2 - 100, res.getScaledHeight() / 2 - 82);
	 	worldHeightSlider.update(res.getScaledWidth() / 2 - 100, res.getScaledHeight() / 2 - 54);
		genWorldButton.update(res.getScaledWidth() / 2 - 100, res.getScaledHeight() / 2 - 26);
		loadWorldButton.update(res.getScaledWidth() / 2 - 100, res.getScaledHeight() / 2 + 2);
		importButton.update(res.getScaledWidth() / 2 - 100, res.getScaledHeight() / 2 + 30);
	 	worldWidthSlider.render();
	 	res.drawText('Width: ' + worldWidthSlider.value.toString(), worldWidthSlider.x + 4, worldWidthSlider.y + 6, 12, 0xFFFFFFFF);
	 	worldHeightSlider.render();
	 	res.drawText('Height: ' + worldHeightSlider.value.toString(), worldHeightSlider.x + 4, worldHeightSlider.y + 6, 12, 0xFFFFFFFF);
		genWorldButton.render();
		res.drawText('Create World', genWorldButton.x + (genWorldButton.width / 2) - (res.getScaledTextWidth(12, 'Create World') / 2), genWorldButton.y + 6, 12, 0xFFFFFFFF);
		loadWorldButton.render();
		res.drawText('Load Save', loadWorldButton.x + (loadWorldButton.width / 2) - (res.getScaledTextWidth(12, 'Load Save') / 2), loadWorldButton.y + 6, 12, 0xFFFFFFFF);
		importButton.render();
		res.drawText('Import Save', importButton.x + (importButton.width / 2) - (res.getScaledTextWidth(12, 'Import Save') / 2), importButton.y + 6, 12, 0xFFFFFFFF);
	}
	res.drawText(res.getScaledMouseX() + ", " + res.getScaledMouseY(), 2, res.getScaledHeight() - 24, 12, 0xFF000000);
	res.drawText(Math.floor(frameRate() * 100 + 0.5) / 100 + " fps", 2, res.getScaledHeight() - 12, 12, 0xFF000000);
	prevMouse = mouseIsPressed;
}

function keyPressed() {
	if(inWorld) {
		if(key === 'A') {
			pressed = -1;
		} else if(key === 'D') {
			pressed = 1;
		} else if(key === ' ') {
			space = true;
		} else if(key === 'O') {
			try {
				localStorage.setItem('savedata', JSON.stringify(saveGame()));
			} catch(ex) {
				alert('Failed to save world. Try exporting it instead.');
			}
		} else if(key === 'I') {
			dispExport(JSON.stringify(saveGame()));
		} else if(key === 'U') {
			hideExport();
		} else if(key === 'E') {
			if(inInventory && (chestGUI.currentChest !== undefined || furnaceGUI.currentFurnace !== undefined)) {
				chestGUI.currentChest = undefined;
				furnaceGUI.currentFurnace = undefined;
			} else inInventory = !inInventory;
		}
		if(keyCode === TAB) {
			editbg = !editbg;
			return false;
		}
	}
	if(keyCode !== 116 && keyCode !== 122 && keyCode !== 123 && keyCode !== CONTROL && key !== 'A' && key !== 'C') {
		return false;
	}
}

function keyReleased() {
	if(inWorld) {
		if(key === 'A' && pressed === -1) {
			pressed = 0;
		} else if(key === 'D' && pressed === 1) {
			pressed = 0;
		} else if(key === ' ') {
			space = false;
		}
	}
	if(keyCode === TAB) return false;
	if(keyCode !== 116 && keyCode !== 122 && keyCode !== 123 && keyCode !== CONTROL && key !== 'A' && key !== 'C') {
		return false;
	}
}

function mouseWheel(e) {
	if(!inInventory) {
		if(e.delta > 0) {
			selectedSlot++;
		} else selectedSlot--;
		if(selectedSlot > 10) selectedSlot = 0;
		if(selectedSlot < 0) selectedSlot = 10;
	} else if(player.getRecipes().length > 0) {
		if(e.delta > 0) {
			selectedRecipe++;
		} else selectedRecipe--;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	res.updateScale();
}

function saveGame() {
	let json = {};
	json.world = world.saveJSON();
	json.player = player.saveJSON();
	return json;
}

function loadGame(data) {
	let json;
	if(data === undefined) {
		json = JSON.parse(localStorage.getItem('savedata'));
	} else json = JSON.parse(data);
	world.loadJSON(json.world);
	player.loadJSON(json.player);
	inWorld = true;
}

function dispExport(text) {
	saveExportArea = document.createElement('textarea');
	saveExportArea.textContent = text;
	saveExportArea.style.position = 'fixed';
	saveExportArea.style.width = '50%';
	saveExportArea.style.height = '50%';
	document.body.appendChild(saveExportArea);
}

function hideExport() {
	document.body.removeChild(saveExportArea);
	saveExportArea = undefined;
}
