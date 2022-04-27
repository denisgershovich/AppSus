import { storageService } from "../../../services/storage.service.js";
import { utilService } from "../../../services/util.service.js";

export const noteService = {
  query,
  changeBgcColor,
  addNote,
};

const NOTES_KEY = "notedDB";
let gNotes = [];

const preMade = [
  {
    id: "n101",
    type: "note-txt",
    isPinned: true,
    info: {
      txt: "Fullstack Me Baby!",
    },
  },
  {
    id: "n102",
    type: "note-img",
    info: {
      url: "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
      title: "Bobi and Me",
    },
    style: {
      backgroundColor: "#00d",
    },
  },
  {
    id: "n103",
    type: "note-todos",
    info: {
      label: "Get my stuff together",
      todos: [
        { txt: "Driving liscence", doneAt: null },
        { txt: "Coding power", doneAt: 187111111 },
      ],
    },
  },
  {
    id: "n104",
    type: "note-vid",
    info: {
      url: "https://www.youtube.com/embed/tgbNymZ7vqY",
    },
  },
];

function query() {
  let notes = _loadFromStorage();
  if (!notes) {
    return (notes = _createNotes().then((res) => {
      gNotes = res;
      _saveToStorage();
      return Promise.resolve(res);
    }));
  }
  gNotes = notes;
  return Promise.resolve(notes);
}

function addNote({ primaryValue, seconderyValue, noteType }) {
  return _createNote(primaryValue, seconderyValue, noteType).then((res) => {
    gNotes.push(res);
    _saveToStorage();
    return res
  });
}

function changeBgcColor(noteId, value) {
  const noteIdx = gNotes.findIndex((note) => {
    if (note.id === noteId) return true;
  });
  gNotes[noteIdx] = { ...gNotes[noteIdx], style: { backgroundColor: value } };
  _saveToStorage();
  return Promise.resolve(gNotes[noteIdx]);
}

function _createNote(primaryValue, seconderyValue, noteType) {
  switch (noteType) {
    case "txt":
      return Promise.resolve({
        id: utilService.makeId(),
        type: "note-txt",
        isPinned: false,
        info: {
          txt: primaryValue,
        },
      });
    case "img":
      return Promise.resolve({
        id: utilService.makeId(),
        type: "note-img",
        info: {
          url: seconderyValue,
          title: primaryValue,
        },
      });
    case "todo":
      return Promise.resolve({
        id: utilService.makeId(),
        type: "note-todos",
        info: {
          label: pri,
          todos: [{ txt: seconderyValue, doneAt: null }],
        },
      });
    case "vid": return Promise.resolve({
      id: utilService.makeId(),
      type: "note-vid",
      info: {
        url: primaryValue,
      },
    })
  }
}

function _createNotes() {
  return Promise.resolve(preMade);
}

function _saveToStorage(notes = gNotes) {
  storageService.saveToStorage(NOTES_KEY, notes);
}

function _loadFromStorage() {
  return storageService.loadFromStorage(NOTES_KEY);
}
