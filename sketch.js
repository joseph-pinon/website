const backgroundColor = 18;
const particleCount = 150;
const historyLength = 30;

let particles = [];

let spawnedParticleCount = 0;
let spawnedParticles = [];
let despawnIndices = [];


const noiseScale = 0.001;
const speed = 0.1;
const mouseRange = 200;
const mouseStrength = 0.001;

let mouseDir = 1;

function particle(x, y){
  this.x = x;
  this.y = y;
  this.history = [createVector(x, y)];

  this.update = (amountMoved) => {
    this.x += amountMoved.x;
    this.y += amountMoved.y;
    this.history.push(createVector(this.x, this.y))
    
    if (this.history.length > historyLength){
      this.history.shift()
    }

  }

  this.draw = (r, g, b) => {
    for (let i = 0; i < this.history.length - 1; i++){
      lerpR = lerp(backgroundColor, r, i/this.history.length);
      lerpG = lerp(backgroundColor, g, i/this.history.length);
      lerpB = lerp(backgroundColor, b, i/this.history.length);
      stroke(lerpR, lerpG, lerpB);
      line(this.history[i].x, this.history[i].y, this.history[i+1].x, this.history[i+1].y)
      strokeWeight(2);
    }
  }

  this.respawn = () => {
    this.x = random(width);
    this.y = random(height);
    this.history = []
    this.history.push(createVector(this.x, this.y))
  }
}

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("home-canvas-container");

  for (let i = 0; i < particleCount; i++){
    particles.push(new particle(random(width), random(height)))
  }
}

function draw() {
  background(backgroundColor) 

  checkMousePressed();

  for (let i = 0; i < particleCount; i++){
    let particle = particles[i];
    let amountMoved = calculateMotion(particle);
    particle.update(amountMoved);


    if (!checkBoundary(particle)){
      particle.respawn();
    }

    particle.draw(255, 255, 255);
  }

  for (let i = 0; i < spawnedParticleCount; i++){
    let particle = spawnedParticles[i];
    let amountMoved = calculateMotionSpawned(particle);
    particle.update(amountMoved);
    if (!checkBoundary(particle)){
      despawnIndices.push(i);
    }
    particle.draw(255, 0, 0);
  }

  despawnParticles(despawnIndices);

  despawnIndices = [];
}

function despawnParticles(despawnIndices){
  for (let i = 0; i < despawnIndices.length; i++){
    spawnedParticleCount--;
    spawnedParticles.splice(despawnIndices[i], 1);
  }
}

function checkMousePressed(){
  if (mouseIsPressed){
    //spawnedParticleCount++;
    //spawnedParticles.push(new particle(mouseX + random(0, 20), mouseY+random(0, 20)));
    mouseDir = -1;
  }
  else{
    mouseDir = 1;
  }
}

function checkBoundary(p){
  let pos = p.history[0];
  return pos.x >= 0 && pos.x <= width && pos.y >= 0 && pos.y <= height;
}

function calculateMotion(particle){
  noiseDetail(2, 0.5);

  let n = noise(particle.x * noiseScale, particle.y * noiseScale);
  let a = TAU * n;
  
  let mouseVector = createVector(particle.x - mouseX, particle.y - mouseY);
  let distance = mouseVector.mag()
  let mouseDirection = createVector(mouseDir * mouseVector.x / distance, mouseDir * mouseVector.y / distance);
  let magnitude = mouseRange - constrain(distance, 0, mouseRange);
  let mouseForceVector = createVector(mouseDirection.x * magnitude, mouseDirection.y * magnitude)

  let amountMovedX = ((speed * cos(a)) + mouseStrength * mouseForceVector.x) * deltaTime;
  let amountMovedY = ((speed * sin(a)) + mouseStrength * mouseForceVector.y) * deltaTime;

  return createVector(amountMovedX, amountMovedY);
}

function calculateMotionSpawned(particle){
  noiseDetail(1, 0.5);

  let n = noise(particle.x * noiseScale, particle.y * noiseScale);
  let a = TAU * n;
  
  let mouseVector = createVector(particle.x - mouseX, particle.y - mouseY);
  let distance = mouseVector.mag()
  let mouseDirection = createVector(mouseVector.x/distance, mouseVector.y/distance)
  let magnitude = mouseRange - constrain(distance, 0, mouseRange);
  let mouseForceVector = createVector(mouseDirection.x * magnitude, mouseDirection.y * magnitude)

  let amountMovedX = ((speed * cos(a)) + mouseStrength * mouseForceVector.x) * deltaTime;
  let amountMovedY = ((speed * sin(a)) + mouseStrength * mouseForceVector.y) * deltaTime;

  return createVector(amountMovedX, amountMovedY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
