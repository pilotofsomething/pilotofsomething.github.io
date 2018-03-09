
var zoom = 100;
var pan = 0;
var events = [];

function addEvent(pos, date, text) {
	events.push({
		"pos": pos,
		"date": date,
		"text": text
	});
}

addEvent(0.45556, "June 14, 1940", "Paris falls to the German Army.");
addEvent(1.93548, "December 7, 1941", "Japan attacks Pearl Harbor.");
addEvent(1.5, "1941", "Konrad Zuse invents \nthe Z3 computer.");
addEvent(2.5, "1942", "John Atanasoft and Clifford Berry \nbuild the first digital computer.");
addEvent(4.44443, "June 6, 1944", "The Normandy Invasion - D-Day.");
addEvent(5.54301, "July 16, 1945", "First atomic bomb invented/tested.");
addEvent(5.59946, "August 6, 1945", "Atomic bomb used against Japan in WWII.");
addEvent(6.5, "1946", "Percy Spencer invents the microwave oven.");
addEvent(7.5, "1947", "First mobile phone is invented.");
addEvent(8.56989, "July 26, 1948", "Executive Order 9981 ends segregation\nin the United States Military.");

function setup() {
	createCanvas(windowWidth, windowHeight);
	zoom = (windowWidth - 20) / 11;
	pan = 0.5;
	textAlign(LEFT, TOP);
}

function draw() {
	background(255);
	stroke(0);
	strokeWeight(4 / zoom);
	scale(zoom, zoom);
	translate(pan, (windowHeight / 2) * (1 / zoom));
	line(0, 0, 10, 0);
	for(let i = 0; i < 11; i++) {
		line(i, 10 / zoom, i, -10 / zoom);
		push();
		scale(1 / zoom, 1 / zoom);
		textSize(12);
		text((1940 + i).toString(), (i * zoom) - (textWidth((1940 + i).toString()) / 2), -22);
		pop();
	}
	for(let i = 0; i < events.length; i++) {
		var event = events[i];
		push();
		scale(1 / zoom, 1 / zoom);
		translate(event.pos * zoom, 0);
		if(i % 2 == 0 && i % 4 < 2) {
			text(event.date, 2, 60);
			text(event.text, 2, 72);
			strokeWeight(2);
			line(0, 0, 0, 70);
		} else if(i % 2 == 1 && i % 4 < 2) {
			text(event.date, 2, 120);
			text(event.text, 2, 132);
			strokeWeight(2);
			line(0, 0, 0, 130);
		} else if(i % 2 == 0) {
			text(event.date, 2, -72);
			text(event.text, 2, -60);
			strokeWeight(2);
			line(0, 0, 0, -72);
		} else {
			text(event.date, 2, -132);
			text(event.text, 2, -120);
			strokeWeight(2);
			line(0, 0, 0, -132);
		}
		pop();
	}
}

function mouseDragged() {
	pan += (mouseX - pmouseX) / zoom;
}

function mouseWheel(e) {
	pan *= zoom;
	zoom -= e.delta;
	if(zoom < 1) zoom = 1;
	pan /= zoom;
	return false;
}