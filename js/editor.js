/* 'use strict'

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
    console.log(window.getSelection().toString());
}, 5000);

function format() {
    
} */

'use strict'

const editor = document.getElementById('editor');
const btnsEditor = document.querySelectorAll('.btnsEditor');
let editorContents = "";
const currentDocument = 'idDoc817326123';

const editorButtons = {
    btnBold: function(){
        document.execCommand('styleWithCSS', true, "true");
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
        document.execCommand('heading', false, 'H1');
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

/* Format text */

function makeHeading1(){
	var highlight = window.getSelection().getRangeAt(0);  
 
    var heading = '<span class="heading1">' + highlight + '</span>';

    document.body.innerHTML = document.body.innerHTML.replace(window.getSelection(), heading);

    console.log(highlight);
    console.log("Replaced");
}


//autosave
setInterval(() => {
    editorStoreValue();
}, 5000);
