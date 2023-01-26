import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="App-header">TODO List</div>
      <div className="App-todo-list">
        <div className="App-input-container">
          <form className="App-todo-input">
            <label htmlFor="input">Input a new task</label>
            <input type="text" className="input" id="input" />
          </form>
          <div>
            <button className="btn App-add-button">Add</button>
          </div>
        </div>
      </div>
      <div className="App-todo-list">
        <div className="App-todo-row">
          <div className="App-todo-item">asdfasf</div>
          <div>
            <button className="btn App-delete-button">Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
