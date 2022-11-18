'use strict'

const editor = document.getElementById('editor');
let editorContents = document.getElementById('editor').innerHTML;
const currentDocument = 'idDoc817326123';

const editorGetValue = function() {
    editor.innerHTML = localStorage.getItem(currentDocument);
}

const editorStoreValue = function() {
    editorContents = document.getElementById('editor').innerHTML;
    localStorage.setItem(currentDocument, editorContents);
}

editorGetValue();

//autosave
setInterval(() => {
    editorStoreValue();
}, 5000);
