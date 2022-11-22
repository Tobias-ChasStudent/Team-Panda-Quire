'use strict'

const editor = document.getElementById('editor');
const btnsEditor = document.querySelectorAll('.btnsEditor');
let editorContents = "";
const currentDocument = 'idDoc817326123';

const editorButtons = {
    btnBold: function(){
        document.execCommand('bold');
    },
    btnItalic: function(){
        document.execCommand('italic');
    },
    btnUnorderedList: function(){
        document.execCommand('insertUnorderedList');
    },
    btnOrderedList: function(){
        document.execCommand('insertOrderedList');
    },
    btnH1: function(){
        document.execCommand('fontSize', false, '7');
    }
}

const eventListenerToEditorBtns = function () {
    for (const btn of btnsEditor) {
        const id = btn.getAttribute('id');
        btn.addEventListener('click', editorButtons[id])
    }

}

const editorGetValue = function() {
    editor.innerHTML = localStorage.getItem(currentDocument);
}

const editorStoreValue = function() {
    editorContents = document.getElementById('editor').innerHTML;
    localStorage.setItem(currentDocument, editorContents);
}

/* btnBold.addEventListener('click', function() {
    document.execCommand('bold');
}); */

eventListenerToEditorBtns();
editorGetValue();

//autosave
setInterval(() => {
    editorStoreValue();
}, 5000);
