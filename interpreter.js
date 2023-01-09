class Interpreter {
  statements = [];
  graphics = null;

  constructor(statements, graphics) {
    this.statements = statements;
    this.graphics = graphics;
  }

  run() {
    for (const statement of this.statements) {
      switch (statement.operator) {
        case "|":
          this.createTheNode(statement);

          break;

        default:
          console.log("undefined statement");
          break;
      }
    }
  }

  // @next
  // add this to github
  createTheNode(statement) {
    console.log("create the node");
    this.graphics.addNode();
  }
}