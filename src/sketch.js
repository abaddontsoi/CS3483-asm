var img;

function setup() {
    createCanvas(windowWidth, windowHeight);
    img = loadImage('./assets/Amogus.png')
}
function draw() {
    image(img, 0, 0, img.width, img.height)
}
