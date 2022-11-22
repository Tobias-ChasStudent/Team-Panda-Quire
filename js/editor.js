'use strict'

const editor = document.getElementById('editor');
const btnsEditor = document.querySelectorAll('.btnsEditor');
let editorContents = "";
const currentDocument = 'idDoc817326123';

const editorButtons = {
    btnBold: ['bold'],
    btnItalic: ['italic'],
    btnUnorderedList: ['insertUnorderedList'],
    btnOrderedList: ['insertOrderedList'],
    btnIndent: ['indent'],
    btnH1: ['formatBlock', false, "H1"],
    btnH2: ['formatBlock', false, "H2"],
    btnH3: ['formatBlock', false, "H3"]
}

const eventListenerToEditorBtns = function () {
    for (const btn of btnsEditor) {
        const id = btn.getAttribute('id');
        btn.addEventListener('click', function() {document.execCommand(...editorButtons[id])});
    }
}

const editorGetValue = function() {
    editor.innerHTML = localStorage.getItem(currentDocument);
}

const editorStoreValue = function() {
    editorContents = document.getElementById('editor').innerHTML;
    localStorage.setItem(currentDocument, editorContents);
}


eventListenerToEditorBtns();
editorGetValue();


//autosave
setInterval(() => {
    editorStoreValue();
}, 5000);
