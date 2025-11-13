import * as p5 from 'p5';

new p5((p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(240);
  };

  p.draw = () => {
    if (p.mouseIsPressed) {
      p.fill(0, 100);
      p.circle(p.mouseX, p.mouseY, 40);
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
