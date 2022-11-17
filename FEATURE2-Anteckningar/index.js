'use strict'

const textArea = document.getElementById('textarea');
const currentDocument = 'docId817326123';


const storeValue = function() {
    localStorage.setItem(currentDocument, textArea.value);
}

setInterval(() => {
    storeValue();
}, 5000);
