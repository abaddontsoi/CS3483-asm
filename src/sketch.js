var img;
var videoFeed;
var handPose;
var options = {
    maxHands: 1,
    flipped: true,
}
var detections = [];

function preload() {
    handPose = ml5.handPose(options);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    img = loadImage('./assets/Amogus.png')
    pixelDensity(1);
    videoFeed = createCapture(VIDEO);
    videoFeed.size(width, height);
    videoFeed.hide();
    handPose.detectStart(videoFeed, gotResults);
}

function draw() {
    image(img, 0, 0, img.width, img.height);
    push();
    translate(img.width, 0);
    scale(-1, 1);
    image(videoFeed, -img.width, 0, img.width, img.height);
    pop();
    if (detections) {
        drawKeypoints(detections);
    }
}

function gotResults(results) {
    detections = results;
    console.log(detections);
}

function drawKeypoints(detections) {
    noStroke();
    fill(255, 0, 0);
    translate(img.width, 0);
    for (let detection of detections) {
        let index_finger_tip = detection.index_finger_tip;
        let pt = {
            x: index_finger_tip.x,
            y: index_finger_tip.y,
        }
        // Convert to relative coordinates
        var relx = pt.x / videoFeed.width;
        var rely = pt.y / videoFeed.height;
        let displayx = relx * (img.width) - img.width;
        let displayy = rely * (img.height)
        circle(displayx, displayy, 10);
        circle(displayx + img.width, displayy, 10);
    }
}

// unblur image for a region of (box_width, boxheight) on (x, y)
function viewImage(img, x, y, box_width, box_height) {

}

// Freehand drawing
function freeHandDrawing() {

}

function circleDrawing() {
    
}