
function keyPressed() {
	if (keyCode === UP_ARROW || keyCode === 87) {
		way = 0;
	}
	if (keyCode === RIGHT_ARROW || keyCode === 68) {
		way = 1;
	}
	if (keyCode === DOWN_ARROW || keyCode === 83) {
		way = 2;
	}
	if (keyCode === LEFT_ARROW || keyCode === 65) {
		way = 3;
	}
}

