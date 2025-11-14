var img;
var videoFeed;


function setup() {
    createCanvas(windowWidth, windowHeight);
    img = loadImage('./assets/Amogus.png')
    pixelDensity(1);
    videoFeed = createCapture(VIDEO);
    videoFeed.size(width, height);
    videoFeed.hide();
}
function draw() {
    image(img, 0, 0, img.width, img.height);
    push();
    translate(img.width, 0);
    scale(-1, 1);
    image(videoFeed, -img.width, 0, img.width, img.height);
    pop();
}
