let canvas = document.getElementById("lightningJS");
let ctx = canvas.getContext("2d");
let dpr = window.devicePixelRatio;
canvas.width = canvas.width * dpr;
canvas.height = canvas.height * dpr;

// adjust these variables as needed
let params = {
    lengthRoughness: { // length of lightning segments
        min: 10,
        max: 30
    },
    angleRoughness: { // in degrees
        min: 20,
        max: 60
    },
    thickness: { // keep numbers small
        min: 1,
        max: 3
    },
    slower: 7 // make higher to slow lightning down
}

let { lengthRoughness, angleRoughness, thickness, slower } = params;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getBolt() {
    let length = getRandomIntInclusive(lengthRoughness.min, lengthRoughness.max);
    let angleDeg = getRandomIntInclusive(angleRoughness.min, angleRoughness.max);

    let coordinates = {};
    coordinates.x = Math.round(Math.cos(angleDeg * Math.PI / 180) * length);
    coordinates.y = Math.round(Math.sqrt(length ** 2 - coordinates.x ** 2));
    Math.round(Math.random()) ? "" : coordinates.x = -coordinates.x;
    return coordinates;
}

let lightning = [];
function createLightning() {
    let marker = 0;
    while (marker < canvas.height) {
        let bolt = getBolt();
        marker += bolt.y;
        lightning.push(bolt);
    }
}

function shuffleLightning(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function drawLightning() {
    ctx.lineWidth = getRandomIntInclusive(thickness.min, thickness.max);
    let x = canvas.width / 2;
    let y = 0;
    ctx.moveTo(x, y);
    let blurry = false;
    (Math.floor(Math.random() * 5) !== 0) ? "" : blurry = true;
    for (let j = 0; j < lightning.length; j++) {
        x += lightning[j].x;
        y += lightning[j].y;
        ctx.lineTo(x, y);
        if (blurry) ctx.stroke();
    }
    if (!blurry) {
        ctx.stroke();
        canvas.style.opacity = 1;
    }
    else {
        canvas.style.opacity = 0.9;
    }
}

let counter = 1;
function draw() {
    if (counter % slower === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "white";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgb(255, 255, 110)";
    
        ctx.beginPath();
        drawLightning();
        shuffleLightning(lightning);
        counter = 1;
    }
    counter ++;
    requestAnimationFrame(draw);
}
createLightning();
draw();