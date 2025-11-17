var img;
var blurImg;
var videoFeed;

var handPose;

// index finger tip keypoint coordinate drawn on image 
// mapped from video region to image
// origin is (img.width, 0)
var pdisplayx;
var pdisplayy;
var displayx;
var displayy;

var options = {
    maxHands: 1,
    flipped: true,
}
var detections = [];

// changing mode
// 1 for view mode, 2 for freehand mode, 3 for circle mode, 0 means do not apply any mode
var mode = 0;
var freeHandImgSet = false;

var viewBoxSize = 60;

function preload() {
    handPose = ml5.handPose(options);
    img = loadImage('./assets/Amogus.png');
    blurImg = loadImage('./assets/Amogus.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    blurImg.filter(BLUR, 7.5);
    pixelDensity(1);
    videoFeed = createCapture(VIDEO);
    videoFeed.size(width, height);
    videoFeed.hide();
    handPose.detectStart(videoFeed, gotResults);
}

function draw() {
    switch (mode) {
        case 1:
            clear(0, 0, img.width, img.height);
            let croppedImg = cropImage(img, displayx, displayy, viewBoxSize, viewBoxSize);
            image(blurImg, 0, 0, blurImg.width, blurImg.height);
            if (detections.length > 0) {
                image(croppedImg, displayx - viewBoxSize / 2, displayy - viewBoxSize / 2, viewBoxSize, viewBoxSize);
            }
            break;
        case 2:
            if (!freeHandImgSet) {
                image(img, 0, 0, img.width, img.height);
                freeHandImgSet = true;
            }
            stroke(0, 255, 0);
            strokeWeight(10);
            line(displayx, displayy, pdisplayx, pdisplayy);
            break;
        case 3:
            break;
        default:
            push();
            image(img, 0, 0, img.width, img.height);
            pop();
            break;
    }
    push();
    translate(img.width, 0);
    scale(-1, 1);
    image(videoFeed, -img.width, 0, img.width, img.height);
    pop();
    if (detections) {
        drawKeypoints(detections);
    }
    if (keyIsPressed) {
        switchMode(key);
    }
}

function gotResults(results) {
    detections = results;
}

function drawKeypoints(detections) {
    push();
    noStroke();
    fill(0, 255, 0);
    // translate(img.width, 0);
    for (let detection of detections) {
        let index_finger_tip = detection.index_finger_tip;
        let pt = {
            x: index_finger_tip.x,
            y: index_finger_tip.y,
        }
        // Convert to relative coordinates
        var relx = pt.x / videoFeed.width;
        var rely = pt.y / videoFeed.height;
        pdisplayx = displayx;
        pdisplayy = displayy;
        displayx = relx * (img.width);
        displayy = rely * (img.height);
        circle(displayx, displayy, 10);
        circle(displayx + img.width, displayy, 10);
    }
    pop();
}

function switchMode(key) {
    switch (key) {
        case 'v':
            mode = 1;
            break;
        case 'f':
            mode = 2;
            break;
        case 'c':
            mode = 3;
            break;
        case 'e':
            mode = 0;
            freeHandImgSet = false;
            break;
        default:
            break;
    }
}

// return a unblured portion of image for a region of (box_width, boxheight) on (x, y)
function cropImage(img, x, y, box_width, box_height) {
    // top-left coordinate of view box
    let dx = x - box_width / 2;
    let dy = y - box_height / 2;

    return img.get(dx, dy, box_width, box_height);
}

// Freehand drawing
function freeHandDrawing() {

}

function circleDrawing() {

}