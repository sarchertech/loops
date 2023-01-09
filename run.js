const input = document.getElementById('input');
const output = document.getElementById('output');
const twoWrapper = document.getElementById('two');
const graphics = new Graphics(twoWrapper);
graphics.init();

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function onInput(event) {
  graphics.clear();
  const lex = new Lexer(event.target.value);
  lex.scanTokens();
  const parser = new Parser(lex.tokens);
  parser.parse();
  // output.innerText = JSON.stringify(parser.ast, null, 2);
  console.log(parser.ast);
  const interpreter = new Interpreter(parser.ast, graphics);
  interpreter.run();
}

input.oninput = debounce(onInput);

