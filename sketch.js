var img;
var blurImg;
var videoFeed;

var handPose;

// index finger tip keypoint coordinate drawn on image 
// mapped from video region to image
// origin is (img.width, 0)
var pdisplayx = 0;
var pdisplayy = 0;
var displayx = 0;
var displayy = 0;
var indicatorColor = [0, 255, 0];

var options = {
    maxHands: 1,
    flipped: true,
}
var detections = [];
var index_finger = {
    x: 0,
    y: 0.
};
var thumb = {
    x: 0,
    y: 0.
};

// changing mode
// 1 for view mode, 2 for freehand mode, 3 for circle mode, 0 means do not apply any mode
var mode = 0;
var freeHandImgSet = false;
var viewBoxSize = 60;
// r, g, b
var pixelView = [0, 0, 0];


function preload() {
    handPose = ml5.handPose(options);
    img = loadImage('./Amogus.png');
    blurImg = loadImage('./Amogus.png');
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
            image(blurImg, 0, 0, blurImg.width, blurImg.height);
            let croppedImg = cropImage(img, displayx, displayy, viewBoxSize, viewBoxSize);
            if (detections.length > 0) {
                image(croppedImg, displayx - viewBoxSize / 2, displayy - viewBoxSize / 2, viewBoxSize, viewBoxSize);
            }
            break;
        case 2:
            // Reset to original image
            if (!freeHandImgSet) {
                clear(0, 0, img.width, img.height);
                image(img, 0, 0, img.width, img.height);
                freeHandImgSet = true;
            }
            push();
            stroke(0, 255, 0);
            strokeWeight(10);
            // Only draw when index finger is tracked
            if (displayx && displayy && pdisplayx && pdisplayy) {
                line(displayx, displayy, pdisplayx, pdisplayy);
            }
            pop();
            break;
        case 3:
            // Reset to original image
            clear(0, 0, img.width, img.height);
            image(img, 0, 0, blurImg.width, blurImg.height);
            push();
            // get pixel color of image
            pixelView = img.get(displayx, displayy);
            // Set opacity
            pixelView[3] = 120;
            // Calculate radius
            if (index_finger && thumb) {
                let radius = dist(index_finger.x, index_finger.y, thumb.x, thumb.y) * 0.5;
                fill(pixelView);
                noStroke();
                circle(displayx, displayy, radius);
            }
            pop();
            break;
        // On exit
        case 0:
            push();
            clear(0, 0, img.width, img.height);
            image(img, 0, 0, img.width, img.height);
            pop();
            break;
        default:
            break;
    }
    push();
    translate(img.width, 0);
    scale(-1, 1);
    image(videoFeed, -img.width, 0, img.width, img.height);
    pop();
    if (detections.length > 0) {
        drawIndicator();
    }
    if (keyIsPressed) {
        switchMode(key);
    }
}

function gotResults(results) {
    detections = results;
    // Only care about the first detection
    if (detections.length > 0) {
        let detection = detections[0];
        let index_finger_tip = detection.index_finger_tip;
        let thumb_tip = detection.thumb_tip;
        index_finger = {
            x: index_finger_tip.x || null,
            y: index_finger_tip.y || null,
        }
        thumb = {
            x: thumb_tip.x || null,
            y: thumb_tip.y || null,
        }
    }
}

function drawIndicator() {
    push();
    // Change indicator color
    if (mode == 3) {
        indicatorColor = pixelView.slice(0, 3);
        strokeWeight(1);
    } else {
        indicatorColor = [0, 255, 0];
        noStroke();
    }
    fill(indicatorColor);
    if (index_finger) {
        // Convert to relative coordinates
        var relx = index_finger.x / videoFeed.width;
        var rely = index_finger.y / videoFeed.height;
        pdisplayx = displayx;
        pdisplayy = displayy;
        displayx = relx * (img.width);
        displayy = rely * (img.height);
        circle(displayx, displayy, 10);
        circle(displayx + img.width, displayy, 10);
    } else {
        // pdisplayx = null;
        // pdisplayy = null;
        displayx = null;
        displayy = null;
    }
    pop();
}

function switchMode(key) {
    freeHandImgSet = false;
    pdisplayx = null;
    pdisplayy = null;
    displayx = null;
    displayy = null;
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