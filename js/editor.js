'use strict'

const btnCreate = document.querySelector("#createDoc")
const asideDocs = document.querySelector(".aside")
let editor = document.getElementById('editor');
const btnsEditor = document.querySelectorAll('.btnsEditor');
let editorContents = "";

//Properties array to store saved docs' properties like tags and favourite boolean 
let properties = []

//Store all document text
let docTexts = []

//Get a unique id
let date = new Date()
let docID = date.getTime()
docID = String(docID)


//Set an attribute that is the same as the docID
editor.setAttribute("data-docuID", docID)

//If there isn't a localstorage item with the name "docTextsID", make one
if (!localStorage.getItem("docTextsID")) {


    //Set an attribute that is the same as the docID
    editor.setAttribute("data-docuID", docID)

    //Make the object in which we store the text and id
    let currentDocumentContent = {
        id: docID,
        Text: editorContents
    }
    //Push the object into docTexts
    docTexts.push(currentDocumentContent)

    //Convert it into JSON
    docTexts = JSON.stringify(docTexts)

    //Create the first instance of the stored array in local storage
    localStorage.setItem("docTextsID", docTexts)

    console.log(localStorage.getItem("docTextsID"));
} else {
    let arrDocTextsID = JSON.parse(localStorage.getItem("docTextsID"))
    let allIDs = []
    arrDocTextsID.forEach(docObj => {
        allIDs.push(docObj.id)
    });
    let latestDoc = Math.max(allIDs)
    console.log(latestDoc);

    //Make the editor have the same id and text as the latest document opened
    editor.setAttribute("data-docuID", latestDoc)
}


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
            type.addEventListener('change', function (event) {
                const idBtn = event.target.value;
                document.execCommand(...editorButtons[idBtn]);
            });
        } else {
            const idBtn = btn.getAttribute('id');
            btn.addEventListener('click', function () {
                document.execCommand(...editorButtons[idBtn]);
            });
        }
    }
}

/* Store all docs in aside */



/* Create new docs */
btnCreate.addEventListener("click", createDoc)

function createDoc() {
    if (JSON.parse(localStorage.getItem("docTextsID")).Text != editor.innerHTML) {
        alert("Not saved");
    } else {
        //Make sure the current document is saved
        editorStoreValue()

        //Create new
    }
}

const editorGetValue = function () {
    if (JSON.parse(localStorage.getItem("docTextsID")) !== undefined && JSON.parse(localStorage.getItem("docTextsID"))) {
        //Get the saved json array and convert it into a normal array
        let savedArray = JSON.parse(localStorage.getItem("docTextsID"))
        //console.log(JSON.parse(localStorage.getItem("docTextsID")));

        //console.log(savedArray[0].Text);
        editor.innerHTML = savedArray[0].Text;
        //console.log(editor.innerHTML);

    }
}

const editorStoreValue = function () {
    //Update the element
    editor = document.getElementById('editor');
    console.log(editor);
    //Get the current editor contents
    editorContents = document.getElementById('editor').innerHTML;
    console.log(editorContents);
    
    //If the text stored in localstorage is not the same as the text in the editor, there must've been a change. Therefore we give the document a new id
    if (JSON.parse(localStorage.getItem("docTextsID"))) {
        //Store the docTextsID array in a variable
        let arrDocTextsID = JSON.parse(localStorage.getItem("docTextsID"))
        
        console.log(arrDocTextsID);
        
        //Check that the variable isn't undefined
        if (arrDocTextsID !== undefined) {
            console.log("arrDocTextsID is not undefined");

            console.log(editor.getAttribute("data-docuid"));

            //Check current editor index in arrDocTextsID 
            let currentEditor = arrDocTextsID.map(object => object.id).indexOf(editor.getAttribute("data-docuid"));

            console.log(currentEditor);

            console.log(arrDocTextsID[currentEditor].Text);
            //Check if the text of the stored 
            if (arrDocTextsID[currentEditor].Text != editor.innerHTML) {
                console.log("Changes have been made");
                console.log(arrDocTextsID[currentEditor].Text, " - is not equal to -", editor.innerHTML);

                //Get a unique id
                let date = new Date()
                docID = date.getTime()

                //Change the id of the editor and object
                arrDocTextsID[currentEditor].id = docID
                editor.setAttribute("data-docuID", docID)


                //Change the text of the object to coincide with the editor
                arrDocTextsID[currentEditor].Text = editorContents
                //console.log(typeof(docTexts));

                arrDocTextsID = JSON.stringify(arrDocTextsID)

                //Send it into localstorage
                localStorage.setItem("docTextsID", arrDocTextsID);
            }
        } else {
            console.log(localStorage.getItem("docTextsID")[0].Text);
        }
    } else {
        //Check the textsID item in localsotrage
        console.log(localStorage.getItem("docTextsID"));
    }
    //console.log(docID);


}


eventListenerToEditorBtns();
editorGetValue();


//autosave
setInterval(() => {
    editorStoreValue();
}, 5000); 

editorStoreValue();


const arr = [{
    id: 'a',
    name: "gaming"
}, {
    id: 'b',
    name: "gaming"
}, {
    id: 'c',
    name: "gaming"
}];

const index = arr.map(object => object.id).indexOf('c');

console.log(index); // 👉️ 2