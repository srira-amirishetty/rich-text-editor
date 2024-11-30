import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./App.css";

const App = () => {
  const [editorState, setEditorState] = useState("");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const quillRef = useRef(null);

  const saveHistory = (content) => {
    setHistory((prev) => [...prev, content]);
    setRedoStack([]);
  };

  const handleChange = (content) => {
    setEditorState(content);
    saveHistory(content);
  };

  const undo = () => {
    if (history.length > 1) {
      const prevHistory = [...history];
      const lastState = prevHistory.pop();
      setRedoStack((prev) => [editorState, ...prev]);
      setEditorState(prevHistory[prevHistory.length - 1]);
      setHistory(prevHistory);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.shift();
      setHistory((prev) => [...prev, nextState]);
      setEditorState(nextState);
      setRedoStack([...redoStack]);
    }
  };

  const clearEditor = () => {
    setEditorState("");
    saveHistory("");
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ size: ["small", false, "large", "huge"] }],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "size",
    "clean",
  ];

  return (
    <div className="app">
      <h1>React Rich Text Editor</h1>
      <div className="toolbar">
        <button onClick={undo} disabled={history.length <= 1}>
          Undo
        </button>
        <button onClick={redo} disabled={redoStack.length === 0}>
          Redo
        </button>
        <button onClick={clearEditor}>Clear</button>
      </div>
      <ReactQuill
        ref={quillRef}
        value={editorState}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
      />
    </div>
  );
};

export default App;
