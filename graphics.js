class Graphics {
  two = null;
  radius = 50;
  nodeCount = 0;

  constructor(wrapperElement) {
    this.wrapperElement = wrapperElement;
  }

  init() {
    const params = { fullscreen: false };
    this.two = new Two(params).appendTo(this.wrapperElement);
  }

  clear() {
    this.nodeCount = 0;
    this.two.clear();
  }

  addNode() {
    console.log("add graphics to node");
    const x = this.radius + 20 + this.nodeCount * (2 * this.radius + 20);
    const y = this.two.height * 0.5;
    const circle = this.two.makeCircle(x, y, this.radius);
    circle.fill = '#FF8000';
    circle.stroke = 'orangered';
    circle.linewidth = 5;
    this.two.update();

    this.nodeCount++;
  }
}