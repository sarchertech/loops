class Interpreter {
  statements = [];
  graphics = null;
  nodes = {};
  links = {};

  constructor(statements, graphics) {
    this.statements = statements;
    this.graphics = graphics;
  }

  run() {
    for (const statement of this.statements) {
      switch (statement.operator) {
        case "|":
          this.createNode(statement.left);
          this.createNode(statement.right);
          this.linkNodes(statement.left, statement.right);
          break;

        default:
          console.log("undefined statement");
          break;
      }
    }
  }

  // @next
  // link the nodes
  // position the nodes in a way so they can fit in the space
  // not sure whether they should require panning/zooming
  // need to look at the best representation of the graph
  // object tree or adjacentcy list? or soemthing else
  createNode(name) {
    if (this.nodes[name]) {
      console.log("already added");
      // TODO add connection
    } else {
      this.nodes[name] = true;
      this.graphics.addNode(name);
    }
  }

  linkNodes(a, b) {
  }
}