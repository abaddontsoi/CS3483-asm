var img;
var blurImg;
var videoFeed;

var handPose;

// index finger tip keypoint coordinate drawn on canva 
var displayx;
var displayy;

var options = {
    maxHands: 1,
    flipped: true,
}
var detections = [];
var viewMode = false;
var freeHandMode = false;
var circleMode = false;

var viewBoxSize = 10;

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
    if (viewMode) {
        clear(0, 0, img.width, img.height);
        let croppedImg = cropImage(img, displayx, displayy, viewBoxSize, viewBoxSize);
        image(blurImg, 0, 0, blurImg.width, blurImg.height);
        image(croppedImg, displayx, displayy, croppedImg.width, croppedImg.height);
    } else {
        push();
        image(img, 0, 0, img.width, img.height);
        pop();
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
        displayx = relx * (img.width) - img.width;
        displayy = rely * (img.height);
        circle(displayx, displayy, 10);
        circle(displayx + img.width, displayy, 10);
    }
}

function switchMode(key) {
    switch (key) {
        case 'v':
            viewMode = true;
            break;
        case 'f':
            freeHandMode = false;
            break;
        case 'c':
            circleMode = false;
            break;
        case 'e':
            viewMode = false;
            freeHandMode = false;
            circleMode = false;
            break;
        default:
            break;
    }
    console.log({
        'viewMode': viewMode,
        'freeHandMode': freeHandMode,
        'circleMode': circleMode,
    })
}

// return a unblured portion of image for a region of (box_width, boxheight) on (x, y)
function cropImage(img, x, y, box_width, box_height) {
    // top-left coordinate of view box
    let dx = Math.max(x - box_width/2, 0);
    let dy = Math.max(y - box_height/2, 0);

    return img.get(dx, dy, box_width, box_height);
}

// Freehand drawing
function freeHandDrawing() {

}

function circleDrawing() {

}