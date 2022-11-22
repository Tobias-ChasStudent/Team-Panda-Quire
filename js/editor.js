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
        const type = btn.parentElement
        if (type.id == 'selectHeading') {
            type.addEventListener('change', function(event) {
                const idBtn = event.target.value;
                document.execCommand(...editorButtons[idBtn]);
            });
        } else {
        const idBtn = btn.getAttribute('id');
        btn.addEventListener('click', function() {
            document.execCommand(...editorButtons[idBtn]);
        });
        }
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
