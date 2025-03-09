import { useState, useEffect } from "react";

const App = () => {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [firstOperand, setFirstOperand] = useState(null);
  const [secondOperand, setSecondOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [awaitingSecondOperand, setAwaitingSecondOperand] = useState(false);

  const handleDigit = (digit) => {
    if (awaitingSecondOperand) {
      setDisplay(digit);
      setAwaitingSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }

    setExpression((prev) => prev + digit);
  };

  const handleOperator = (op) => {
    if (operator && !awaitingSecondOperand) {
      const result = operate(firstOperand, operator, parseFloat(display));
      setFirstOperand(result);
      setDisplay(result.toString());
      setExpression(result + " " + op + " ");
    } else {
      setFirstOperand(parseFloat(display));
      setExpression(display + " " + op + " ");
    }

    setOperator(op);
    setAwaitingSecondOperand(true);
  };

  const handleEquals = () => {
    if (operator && firstOperand !== null) {
      const result = operate(firstOperand, operator, parseFloat(display));
      setDisplay(result.toString());
      setExpression(expression + " = " + result);
      setFirstOperand(result);
      setOperator(null);
      setSecondOperand(null);
      setAwaitingSecondOperand(false);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setFirstOperand(null);
    setSecondOperand(null);
    setOperator(null);
    setAwaitingSecondOperand(false);
  };

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    setExpression((prev) => (prev.length > 1 ? prev.slice(0, -1) : ""));
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setExpression(expression + ".");
    }
  };

  const operate = (a, operator, b) => {
    if (operator === "+") return a + b;
    if (operator === "-") return a - b;
    if (operator === "×") return a * b;
    if (operator === "÷") return b !== 0 ? a / b : "Error";
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      if (!isNaN(key)) handleDigit(key);
      if (["+", "-", "*", "/"].includes(key)) handleOperator(key === "*" ? "×" : key === "/" ? "÷" : key);
      if (key === "Enter") handleEquals();
      if (key === "Backspace") handleBackspace();
      if (key === ".") handleDecimal();
      if (key === "Escape") handleClear();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [display]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-80">
        <input
          className="text-right text-3xl bg-gray-700 p-4 rounded-lg mb-4 w-full outline-none"
          value={expression}
          placeholder="0"
          readOnly
        />
        <div className="grid grid-cols-4 gap-3">
          <button className="btn col-span-2 bg-red-500" onClick={handleClear}>C</button>
          <button className="btn bg-yellow-500" onClick={handleBackspace}>⌫</button>
          <button className="btn bg-yellow-500" onClick={() => handleOperator("÷")}>÷</button>
          {[7, 8, 9].map((num) => <button key={num} className="btn" onClick={() => handleDigit(num.toString())}>{num}</button>)}
          <button className="btn bg-yellow-500" onClick={() => handleOperator("×")}>×</button>
          {[4, 5, 6].map((num) => <button key={num} className="btn" onClick={() => handleDigit(num.toString())}>{num}</button>)}
          <button className="btn bg-yellow-500" onClick={() => handleOperator("-")}>-</button>
          {[1, 2, 3].map((num) => <button key={num} className="btn" onClick={() => handleDigit(num.toString())}>{num}</button>)}
          <button className="btn bg-yellow-500" onClick={() => handleOperator("+")}>+</button>
          <button className="btn col-span-2" onClick={() => handleDigit("0")}>0</button>
          <button className="btn" onClick={handleDecimal}>.</button>
          <button className="btn bg-green-500" onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  );
};

export default App;
