const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');

// Ajuste para telas com maior pixel ratio
if (window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx.scale(1, 1); 
}

let width = canvas.width;
let height = canvas.height;
let rotationY = 0;
let dots = [];

const DOT_RADIUS = 4;
const GLOBE_RADIUS = width * 0.3;  // Tamanho da esfera
const PROJECTION_CENTER_X = width / 2; 
const PROJECTION_CENTER_Y = height / 2; 
const FIELD_OF_VIEW = width * 0.8; 


let GLOBE_CENTER_Z = GLOBE_RADIUS * 2;  
function drawDot(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function createGlobe() {
    for (let i = 0; i < 500; i++) {
        let latitude = Math.acos(2 * Math.random() - 1) - Math.PI / 2; 
        let longitude = Math.random() * 2 * Math.PI;

        let x = GLOBE_RADIUS * Math.cos(latitude) * Math.cos(longitude);
        let y = GLOBE_RADIUS * Math.cos(latitude) * Math.sin(longitude);
        let z = GLOBE_RADIUS * Math.sin(latitude);

        dots.push({ x, y, z, color: getRandomColor() });
    }
}

function getRandomColor() {
    const colors = ['#F0FFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function rotatePoint(x, y, z, angleY) {
    // Rotação apenas no eixo Y
    let tempX = x * Math.cos(angleY) - z * Math.sin(angleY);
    let tempZ = x * Math.sin(angleY) + z * Math.cos(angleY);
    x = tempX;
    z = tempZ;

    return { x, y, z };
}

function projectPoint(x, y, z) {
    // Projeção simples para transformar a coordenada 3D em 2D
    let scale = FIELD_OF_VIEW / (FIELD_OF_VIEW + z + GLOBE_CENTER_Z);  
    let x2D = x * scale + PROJECTION_CENTER_X;  
    let y2D = y * scale + PROJECTION_CENTER_Y;  
    return { x: x2D, y: y2D };
}

function animate() {
    ctx.clearRect(0, 0, width, height);


    rotationY += 0.01;

    // Desenha os pontos
    for (let dot of dots) {

        let { x, y, z } = rotatePoint(dot.x, dot.y, dot.z, rotationY);

        let { x: screenX, y: screenY } = projectPoint(x, y, z);

        drawDot(screenX, screenY, dot.color);
    }

    requestAnimationFrame(animate);
}


createGlobe();
animate();
