
/*
App: Calculator application with basic arithmetic operations and few advanced operations like logarithms and square roots.
NOTE: The code is not 100% complete and flawless. There is room for improvement. These could include:
TODO: Fixes Required
[1] After a invalid operation is performed either 'Error' or 'Error: <error description of invalid operation>' is displayed
    on screen. After which if a user clicks on any number for calculation, this app considers the text for calculation. This
    needs to be fixed to reset the display and add the first clicked operand as the first number.
[2] Need to add check if result is error string and when pressing a 'operation symbol' followed by pressing 'equals' button 
    then do not call backend with the operands. As this generates error 500 code.
[3] Implement robust handling of Error conditions ( example: 'division by zero', etc) by displaying a specific error message
    instead of relying on backend error.
[5] Adding a limit to the number of decimal places that can be entered for avoiding precision issues.
[6] Implement robust handling of extremely large numbers (refer to JavaScript's maximum and minimum number limit) to prevent
    unexpected behavior.

TODO: Enhancements
[1] Add Keyboard input support for ease of use.
[2] Add explicit checks for invalid operations to send-in more accurate requests to backend to minimize error hits to backend 
    and potential 500 server errors.
[3] Add a 'backspace' or 'delete' function to allow users to correct mistakes while entering input number.
[4] Add a dynamic font size adjustment for the display to accommodate very large numbers without overflow.
[5] Add a feature for storing calculation histories to allow users to review past calculations and use these results for further
    calculations.
[6] Add a feature to copy the result in to the clipboard directly from the calculator display.
[7] Add unit tests for the frontend to ensure reliability.
*/
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [calculator_display, set_calculator_display] = useState('0'); // Current display value
  const [first_operand, set_first_operand] = useState(null); // First operand
  const [current_operation, set_current_operation] = useState(null); // Current operation
  const [awaiting_second_operand, set_awaiting_second_operand] = useState(false); // Awaiting second operand
  const [is_calculation_complete, set_is_calculation_complete] = useState(false); // Calculation complete flag
  const [history, set_history] = useState([]); // Calculation history

  // Helper function to format large numbers for display
  const format_large_number = useCallback((number) => {
    if (number > Number.MAX_SAFE_INTEGER || number < Number.MIN_SAFE_INTEGER) {
      return 'Out of Range'; // Handle extremely large numbers
    }
    return Math.abs(number) < 1e15 && Math.abs(number) > 1e-6
      ? number.toString()
      : number.toExponential(10); // Format for small or large numbers
  }, []);

  // Helper function to map operation names to symbols
  const get_operation_symbol = useCallback((operation) => {
    switch (operation) {
      case 'add': return '+';
      case 'subtract': return '-';
      case 'multiply': return '×';
      case 'divide': return '÷';
      default: return '';
    }
  }, []);

  // Handle number input
  const handle_number_input = useCallback((input_number) => {
    if (calculator_display.startsWith('Error')) {
      set_calculator_display(input_number);
      set_awaiting_second_operand(false);
      set_is_calculation_complete(false);
      return;
    }

    if (awaiting_second_operand || is_calculation_complete) {
      set_calculator_display(input_number);
      set_awaiting_second_operand(false);
      set_is_calculation_complete(false);
    } else {
      if (input_number === '.' && calculator_display.includes('.')) return; // Prevent multiple decimals
      if (calculator_display.includes('.') && calculator_display.split('.')[1]?.length >= 6) return; // Limit decimals
      set_calculator_display(calculator_display === '0' ? input_number : calculator_display + input_number);
    }
  }, [calculator_display, awaiting_second_operand, is_calculation_complete]);

  // Handle operation buttons
  const handle_operation_click = useCallback((operation) => {
    if (calculator_display.startsWith('Error')) return;
    set_first_operand(parseFloat(calculator_display));
    set_current_operation(operation);
    set_awaiting_second_operand(true);
    set_is_calculation_complete(false);
  }, [calculator_display]);

  // Calculate the result
  const calculate_result = useCallback(async () => {
    if (calculator_display.startsWith('Error') || first_operand === null || current_operation === null) return;

    try {
      const api_response = await axios.post(`http://localhost:5000/api/${current_operation}`, {
        number_1: first_operand,
        number_2: parseFloat(calculator_display),
      });
      const formatted_result = format_large_number(api_response.data.result);
      set_calculator_display(formatted_result);
      set_history((prev) => [
        ...prev,
        `${first_operand} ${get_operation_symbol(current_operation)} ${calculator_display} = ${formatted_result}`,
      ]);
      set_is_calculation_complete(true);
    } catch (error) {
      set_calculator_display(error.response?.data?.error ? `Error: ${error.response.data.error}` : 'Error');
    }

    set_first_operand(null);
    set_current_operation(null);
  }, [calculator_display, first_operand, current_operation, format_large_number, get_operation_symbol]);

  // Clear the calculator display and reset state
  const clear_calculator = () => {
    set_calculator_display('0');
    set_first_operand(null);
    set_current_operation(null);
    set_awaiting_second_operand(false);
    set_is_calculation_complete(false);
  };

  // Perform advanced operations
  const perform_advanced_operation = useCallback(async (operation) => {
    try {
      const api_response = await axios.post(`http://localhost:5000/api/${operation}`, {
        number: parseFloat(calculator_display),
      });
      const formatted_result = format_large_number(api_response.data.result);
      set_calculator_display(formatted_result);
      set_is_calculation_complete(true);
    } catch (error) {
      set_calculator_display(error.response?.data?.error ? `Error: ${error.response.data.error}` : 'Error');
    }
  }, [calculator_display, format_large_number]);

  // Delete the last character from the display
  const delete_last_character = () => {
    set_calculator_display((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  // Copy the result to clipboard
  const copy_to_clipboard = () => {
    navigator.clipboard.writeText(calculator_display);
  };

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '0' && e.key <= '9') handle_number_input(e.key);
      if (e.key === '+') handle_operation_click('add');
      if (e.key === '-') handle_operation_click('subtract');
      if (e.key === '*') handle_operation_click('multiply');
      if (e.key === '/') handle_operation_click('divide');
      if (e.key === 'Enter') calculate_result();
      if (e.key === 'Backspace') delete_last_character();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handle_number_input, handle_operation_click, calculate_result, delete_last_character]);

  return (
    <div className="calculator-box">
      <h1 className="calculator-title">CALCULATOR</h1>
      <div className="calculator">
        <div className="display">
          <div className="operation">
            {first_operand !== null && `${first_operand} ${get_operation_symbol(current_operation)}`}
          </div>
          <div className="current-value">{calculator_display}</div>
          <div className="result">{is_calculation_complete && `= ${calculator_display}`}</div>
        </div>

        <div className="buttons">
          <button onClick={clear_calculator}>C</button>
          <button onClick={() => perform_advanced_operation('sqrt')}>√</button>
          <button onClick={() => perform_advanced_operation('log')}>log</button>
          <button onClick={() => handle_operation_click('divide')}>÷</button>

          <button onClick={() => handle_number_input('7')}>7</button>
          <button onClick={() => handle_number_input('8')}>8</button>
          <button onClick={() => handle_number_input('9')}>9</button>
          <button onClick={() => handle_operation_click('multiply')}>×</button>

          <button onClick={() => handle_number_input('4')}>4</button>
          <button onClick={() => handle_number_input('5')}>5</button>
          <button onClick={() => handle_number_input('6')}>6</button>
          <button onClick={() => handle_operation_click('subtract')}>-</button>

          <button onClick={() => handle_number_input('1')}>1</button>
          <button onClick={() => handle_number_input('2')}>2</button>
          <button onClick={() => handle_number_input('3')}>3</button>
          <button onClick={() => handle_operation_click('add')}>+</button>

          <button onClick={copy_to_clipboard}>Copy</button>
          <button onClick={() => handle_number_input('0')}>0</button>
          <button onClick={() => handle_number_input('.')}>.</button>
          <button onClick={calculate_result}>=</button>

          <button onClick={delete_last_character}>DEL</button>
        </div>

        <div className="history">
          <h2>History</h2>
          {history.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
