// document.querySelector("button")?.addEventListener("click", async () => {
//     await Tone.start();
//     console.log("audio is ready");
// });
  
let ready = false;
  
let numBars = 15; // variables for sound viz
let samples = 12;
let circlePts, squarePts;
let circleScale = 0.15;
let numInstruments = 7;
  
let stageWidth, stageHeight;  // variables for layout
let mainStage, logoStage, playerStages;
let min_top_margin = 50;
let min_left_margin = 10;
let top_margin;
let left_margin;
let right_margin;
let bottom_margin = 20;
let logo;
let colors;
  
function preload() {
    logo = loadImage("assets/IST_logo.jpg");
    audioFont = loadFont("assets/Audiowide-Regular.ttf");
}
  
function setup() {
    createCanvas(windowWidth, windowHeight);
    textSize(16);
    fill(0);
  
    colors = [
      color(0, 0, 0),
      color(170, 50, 50),
      color(225, 120, 70),
      color(230, 170, 80),
      color(245, 225, 100),
      color(65, 145, 80),
      color(200, 200, 200),
    ];
  
    createStages();
    calculatePoints();
}
  
function draw() {
    background(255);
    drawTitle();
    drawStages();
}
  
function drawMeter(meter, x, y, w, l, numBars, c) {
    //Draw meter
    push();
    translate(x, y);
    let cellWidth = w;
    let cellHeight = l;
    fill(c);
    noStroke();
    let h = (cellHeight / 100) * constrain(128 + meter.getValue(), 0, 100);
    let barHeight = cellHeight / numBars;
    for (let i = 0; i < numBars; i++) {
      if (i * barHeight < h) {
        rect(0 + 0.125 * cellWidth, cellHeight - (i + 1) * barHeight, 0.75 * cellWidth, 0.9 * barHeight);
      }
    }
    pop();
    stroke(c);
}
  
  // calculate shape points for tweens
function calculatePoints() {
  
    let length = mainStage.w / 2;
  
    //Calculate the outer square points
    pA = createVector(-length, -length);
    pB = createVector(-length, length);
    pC = createVector(length, length);
    pD = createVector(length, -length);
  
    squarePts = [];
    for (let i = 0; i < samples; i++) {
      let v = p5.Vector.lerp(pA, pB, (1 / samples) * i);
      squarePts.push(v);
    }
    for (let i = 0; i < samples; i++) {
      let v = p5.Vector.lerp(pB, pC, (1 / samples) * i);
      squarePts.push(v);
    }
    for (let i = 0; i < samples; i++) {
      let v = p5.Vector.lerp(pC, pD, (1 / samples) * i);
      squarePts.push(v);
    }
    for (let i = 0; i < samples; i++) {
      let v = p5.Vector.lerp(pD, pA, (1 / samples) * i);
      squarePts.push(v);
    }
  
    //Calculate the inner circle points
    circlePts = [];
    let v = createVector(-circleScale * length, -circleScale * length);
    for (let i = 0; i < 4 * samples; i++) {
      circlePts.push(v.copy());
      v.rotate(-TWO_PI / (4 * samples));
    }
}
  
function drawTween(pos, w, h, base, signal, interval, c) {
    push();
    translate(pos.x + w / 2, pos.y + h / 2);
    noFill();
    strokeWeight(2);
    stroke(0);
    fill(c);
    beginShape();
    for (let i = 0; i < squarePts.length; i++) {
      let pt = p5.Vector.lerp(
        circlePts[i],
        squarePts[i],
        base + signal * interval
      );
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
    pop();
}
  
function createStages() {
    setDimensions();
  
    let b = select("button");
    b.style("font-family", audioFont);
    b.position(width - right_margin - b.width, top_margin - b.height - 10);
  
    playerStages = [];
    let stageSize = stageWidth;
  
    mainStage = new Stage(
      createVector(1 * stageSize, 0 * stageSize),
      2 * stageSize,
      2 * stageSize,
      "Main"
    );
  
    logoStage = new Stage(
      createVector(0 * stageSize, 0 * stageSize),
      stageSize,
      stageSize,
      "Logo"
    );
  
    playerStages.push(
      new Stage(
        createVector(0 * stageSize, 1 * stageSize),
        stageSize,
        stageSize,
        "0"
      )
    );
    playerStages.push(
      new Stage(
        createVector(0 * stageSize, 2 * stageSize),
        stageSize,
        stageSize,
        "1"
      )
    );
    playerStages.push(
      new Stage(
        createVector(1 * stageSize, 2 * stageSize),
        stageSize,
        stageSize,
        "2"
      )
    );
    playerStages.push(
      new Stage(
        createVector(2 * stageSize, 2 * stageSize),
        stageSize,
        stageSize,
        "3"
      )
    );
    playerStages.push(
      new Stage(
        createVector(3 * stageSize, 2 * stageSize),
        stageSize,
        stageSize,
        "4"
      )
    );
    playerStages.push(
      new Stage(
        createVector(3 * stageSize, 1 * stageSize),
        stageSize,
        stageSize,
        "5"
      )
    );
    playerStages.push(
      new Stage(
        createVector(3 * stageSize, 0 * stageSize),
        stageSize,
        stageSize,
        "6"
      )
    );
}
  
function setDimensions() {
    //find the limiting dimension to maximum stage size
    let stageSize = min(
      (width - 2 * min_left_margin) / 4,
      (height - 2 * min_top_margin) / 3
    );
  
    stageWidth = stageSize;
    stageHeight = stageSize;
  
    top_margin = height - 3 * stageSize - bottom_margin;
    left_margin = (width - 4 * stageSize) / 2;
    right_margin = left_margin;
}
  
function drawTitle(){
    fill(0);
    noStroke();
    textFont(audioFont);
    textAlign(CENTER);
    textSize(top_margin / 2);
    text("The International Soundboard of Tourism", width / 2, top_margin / 2);
    translate(left_margin, top_margin);
    rect(-10, -10, 4 * stageWidth + 20, 3 * stageHeight + 20);
}
  
function drawStages() {
    // draw stage backgrounds
    mainStage.display();
    logoStage.display();
    playerStages.forEach((stage) => stage.display());
  
    //draw logo on first stage
    image(logo, logoStage.pos.x, logoStage.pos.y, logoStage.w, logoStage.h);
  
    if (ready) {
      for (let i = (activePerformers.length - 1); i >= 0; i--) {
        let s = playerStages[i];
  
        // draw meter on that stage
        // drawMeter(meter, x, y, w, l, numBars, c)
        drawMeter(activePerformers[i].meter, s.pos.x, s.pos.y, s.w, s.h, numBars, colors[i]);
  
        // draw corresponding shape on main stage
        // drawTween(pos, w, h, base, signal, interval, c)
        drawTween(
          mainStage.pos,
          mainStage.w,
          mainStage.h,
          (i * 1) / (numInstruments - 1),
          activePerformers[i].waveform.getValue()[0],
          0.25,
          colors[i]
        );
      }
    }
}
  
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    createStages();
    calculatePoints();
    redraw();
}
  
class Stage {
    constructor(pos, w, h, id) {
      this.w = w;
      this.h = h;
      this.pos = pos;
      this.c = color(255);
      this.id = id;
      this.contents = null;
    }
  
    display() {
      rectMode(CORNER);
      // draw stage background
      fill(this.c);
      stroke(this.c);
      rect(this.pos.x, this.pos.y, this.w, this.h);  
      // fill(0);
      // text(this.id, this.pos.x, this.pos.y);
      
    }
}