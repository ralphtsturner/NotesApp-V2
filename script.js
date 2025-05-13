const notesContainer = document.getElementById("notes-container");
const createBtn = document.getElementById("create-btn");

let dragSrcEl = null;

function format(command) {
  document.execCommand(command, false, null);
}

function loadNotes() {
  const savedNotes = JSON.parse(localStorage.getItem("notesAppData")) || [];
  savedNotes.forEach(note => createNote(note.text, note.img));
}

function saveNotes() {
  const notes = Array.from(notesContainer.children).map(note => {
    const textarea = note.querySelector(".note-text");
    const img = note.querySelector(".note-img");
    return {
      text: textarea.innerHTML,
      img: img ? img.src : null
    };
  });
  localStorage.setItem("notesAppData", JSON.stringify(notes));
}

function createNote(text = "", imgSrc = "") {
  const note = document.createElement("div");
  note.className = "note";
  note.setAttribute("draggable", true);

  // Drag events
  note.addEventListener("dragstart", handleDragStart);
  note.addEventListener("dragover", handleDragOver);
  note.addEventListener("drop", handleDrop);
  note.addEventListener("dragend", handleDragEnd);

  if (imgSrc) {
    const img = document.createElement("img");
    img.className = "note-img";
    img.src = imgSrc;
    note.appendChild(img);
  }

  const textarea = document.createElement("div");
  textarea.contentEditable = "true";
  textarea.className = "note-text";
  textarea.innerHTML = text;
  textarea.addEventListener("input", saveNotes);
  note.appendChild(textarea);

  const actions = document.createElement("div");
  actions.className = "note-actions";

  const editBtn = document.createElement("img");
  editBtn.src = "./images/edit.png";
  editBtn.title = "Add/Edit Image";
  editBtn.onclick = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      let img = note.querySelector(".note-img");
      if (img) {
        img.src = url;
      } else {
        img = document.createElement("img");
        img.className = "note-img";
        img.src = url;
        note.insertBefore(img, textarea);
      }
      saveNotes();
    }
  };

  const deleteBtn = document.createElement("img");
  deleteBtn.src = "./images/delete.png";
  deleteBtn.title = "Delete Note";
  deleteBtn.onclick = () => {
    note.remove();
    saveNotes();
  };

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  note.appendChild(actions);

  notesContainer.appendChild(note);
  saveNotes();
}

function handleDragStart(e) {
  dragSrcEl = this;
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
  e.preventDefault();
  const draggingNote = document.querySelector(".dragging");
  if (this !== draggingNote) {
    const bounding = this.getBoundingClientRect();
    const offset = bounding.y + bounding.height / 2;
    if (e.clientY > offset) {
      this.after(draggingNote);
    } else {
      this.before(draggingNote);
    }
  }
}

function handleDrop(e) {
  this.classList.remove("dragging");
  saveNotes();
}

function handleDragEnd() {
  this.classList.remove("dragging");
  saveNotes();
}

createBtn.addEventListener("click", () => createNote());
window.addEventListener("load", loadNotes);