let canvas = document.getElementById("lightningJS");
let ctx = canvas.getContext("2d");
let dpr = window.devicePixelRatio;

// ------- fix blur on canvas -------
let dpi = window.devicePixelRatio;
function fix_dpi() {
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    //get CSS width
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    //scale the canvas
    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
}
fix_dpi();

// ------- parameters -------
// adjust these variables as needed
let params = {
    frequency: 0.08, // between 0 and 1: frequency of lightning strikes
    generalDirection: 0.5, // between 0 and 1: which general direction the lightning will go
    lengthRoughness: { // length of lightning segments
        min: 20,
        max: 60
    },
    angleRoughness: { // between 0 and 90: amount of angle in each lightning segment
        min: 30,
        max: 80
    },
    thickness: { // keep numbers small
        min: 2,
        max: 8
    },
    split: 0.03, // between 0 and 1: odds of the lightning strike splitting
    color: "white", // lightning color
    shadowBlur: 10,
    shadowColor: "rgb(142, 177, 255)",
}
let { origin, generalDirection, lengthRoughness, angleRoughness, thickness, slower } = params;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

// gets segments
function getBolt(fromX, fromY, direction) {
    let length = getRandomIntInclusive(lengthRoughness.min, lengthRoughness.max);
    let angleDeg = getRandomIntInclusive(angleRoughness.min, angleRoughness.max);

    let coordinates = {};
    coordinates.x = Math.round(Math.cos(angleDeg * Math.PI / 180) * length);
    coordinates.y = Math.round(Math.sqrt(length ** 2 - coordinates.x ** 2)) + fromY;
    Math.random() < direction ? coordinates.x = -coordinates.x : "";
    coordinates.x += fromX;
    return coordinates;
}

// uses recursion to split up the lightning strike
function drawLightning(x, y, direction=generalDirection) {
    ctx.moveTo(x, y);
    let bolt;
    while (y < canvas.height) {
        if (Math.random() < params.split) {
            drawLightning(x, y, Math.random());
            ctx.moveTo(x, y);
        }
        bolt = getBolt(x, y, direction);
        x = bolt.x;
        y = bolt.y;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    return;
}
  
function init() {
    ctx.strokeStyle = params.color;
    ctx.shadowBlur = params.shadowBlur;
    ctx.shadowColor = params.shadowColor;
}

function delay() {
    return new Promise((res, err) => {
        setTimeout(() => {
            res();
        }, 200);
    });
}
async function loop() {
    if (Math.random() < params.frequency) {
        ctx.lineWidth = getRandomIntInclusive(thickness.min, thickness.max);
        if (ctx.lineWidth === thickness.max) {
            canvas.style.opacity = 0.9;
        }
        ctx.beginPath();
        drawLightning(getRandomIntInclusive(0, canvas.width), 0);
    }
    await delay();
    canvas.style.opacity = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(loop);
}
init();
loop();