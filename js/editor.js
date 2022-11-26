'use strict'

const btnCreate = document.querySelector("#createDoc")
const asideDocs = document.querySelector(".aside")
let editor = document.getElementById('editor');
const docTitle = document.querySelector('.doc-title');
const btnsEditor = document.querySelectorAll('.btnsEditor');
let editorContents = "";

let propertiesArray = []

//Get a unique id
let date = new Date()
let docID = date.getTime()
docID = String(docID)

//If there isn't a localstorage item with the name "docTextsID", make one
if (!localStorage.getItem('Properties')) {

    let date = new Date()
    docID = date.getTime()

        console.log(propertiesArray)
        console.log('PROPARR' +propertiesArray)

    localStorage.setItem("Properties", JSON.stringify(propertiesArray))

} else {
    let arrDocTextsID = JSON.parse(localStorage.getItem("Properties"))
    let allIDs = []
    arrDocTextsID.forEach(docObj => {
        allIDs.push(docObj.index)
    });
    let latestDoc = Math.min(allIDs)
    console.log(latestDoc);

    console.log('allid: ' + allIDs);

    //Make the editor have the same id and text as the latest document opened
    editor.setAttribute("data-docuID", latestDoc)
    console.log(editor.getAttribute("data-docuID"));
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
    
    console.log("Create doc button press");

    //Update the element
   /*  editor = document.getElementById('editor'); */
    console.log(editor);
    //Get the current editor contents
    editorContents = document.getElementById('editor').innerHTML;
    console.log(editorContents);
    
    //Make sure the document is saved
   /*  editorStoreValue() */

    //Create a new document...
    editor.innerHTML = "";

    //Parse text and properties local storage
    propertiesArray = JSON.parse(localStorage.getItem("Properties"))

    console.log(propertiesArray);

    // let date = new Date()
    docID = Date.now()

    let currentDocProperties = {
        id: docID,
        Text: editorContents,
        /* index: propertiesArray.length-1, */
        title: docTitle.value,
        timeStamp: Date.now(),
        textPreview: editorContents.substring(0, 20)
    }
    
    console.log(propertiesArray)
    propertiesArray.push(currentDocProperties)
    console.log('PROPARR' + propertiesArray)

    localStorage.setItem("Properties", JSON.stringify(propertiesArray))

    //Empty aside to then repopulate
    asideDocs.innerHTML = ""

    //push properties-array into aside-list
    loadAside();
}

const editorGetValue = function () {
    if (JSON.parse(localStorage.getItem("data-docuID")) !== undefined) {
        //Get the saved json array and convert it into a normal array
        let savedArray = JSON.parse(localStorage.getItem("data-docuID"))

        console.log(savedArray);
        //console.log(JSON.parse(localStorage.getItem("docTextsID")));

        //console.log(savedArray[0].Text);
       /*  editor.innerHTML = savedArray[1].Text; */
        //console.log(editor.innerHTML);
    }
}

const editorStoreValue = function () {
    console.log(editor.getAttribute("data-docuid"));
    //Update the element
    editor = document.getElementById('editor');
    console.log(editor);
    //Get the current editor contents
    editorContents = document.getElementById('editor').innerHTML;
    console.log(editorContents);

    //If the text stored in localstorage is not the same as the text in the editor, there must've been a change. Therefore we give the document a new id
    if (JSON.parse(localStorage.getItem("data-docuID"))) {
        //Store the docTextsID array in a variable
        /* let arrDocTextsID = JSON.parse(localStorage.getItem("data-docuID")) */

        console.log(arrDocTextsID);

        //Check that the variable isn't undefined
        if (arrDocTextsID !== undefined) {
            console.log("arrDocTextsID is not undefined");

            let currentEditor = editor.getAttribute("data-docuid");
            console.log(currentEditor);

            //Check if the text of the current editor doesn't match the stored text, ergo a change has been made
            if (arrDocTextsID[currentEditor].Text != editor.innerHTML) {
                console.log("Changes have been made");
                console.log(arrDocTextsID[currentEditor].Text, " - is not equal to -", editor.innerHTML);

                //Get a unique id
                /* let date = new Date()
                docID = date.getTime() */

              /*   //Change the id of the object
                arrDocTextsID[currentEditor].id = docID

                //Set the data attribute
                editor.setAttribute("data-docuID", arrDocTextsID[currentEditor].index);
                console.log(arrDocTextsID[currentEditor].index);


                //Change the text of the object to coincide with the editor;
                arrDocTextsID[currentEditor].Text = editorContents
                //console.log(typeof(docTexts));

                arrDocTextsID = JSON.stringify(arrDocTextsID);

                //Extract the properties array from localstorage
                let propertiesArray = JSON.parse(localStorage.getItem("Properties")); */

                //Change the preview to accurately depict the text
               /*  propertiesArray[currentEditor].textPreview = editor.textContent.substring(0, 20);
 */
                //Check that it changed
                console.log(propertiesArray);
            }
        } else {
            console.log(localStorage.getItem("data-docuID")[0].Text);
        }
    } else {
        //Check the textsID item in localsotrage
        console.log(localStorage.getItem("data-docuID"));
    }
    //console.log(docID);


}

eventListenerToEditorBtns();
editorGetValue();


/* //autosave
setInterval(() => {
    editorStoreValue();
}, 5000); */

document.getElementById('btnSave').addEventListener("click", editorStoreValue)


const parseDate = function(unixTime) {
    const t = new Date(unixTime);

    return `${t.getFullYear()}-${t.getMonth()}-${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`
}

function loadAside() {
//Parse text and properties local storage
let propertiesArray = JSON.parse(localStorage.getItem("Properties"))

if (JSON.parse(localStorage.getItem("Properties")).length !== 0) {
    for (let i = 0; i < propertiesArray.length; i++) {
        let docListItem = document.createElement('section');
        docListItem.innerHTML = `
        <h3>${propertiesArray[i].title}</h3>
        <p>${propertiesArray[i].textPreview}</p>
        <p><em>${parseDate(propertiesArray[i].timeStamp)}</em></p>
        `
        
        console.log('PROPARRAY: ' + propertiesArray);
        asideDocs.appendChild(docListItem);
        console.log("Combined " + propertiesArray[i].title + " and " + propertiesArray[i].textPreview);
    }
} else {
    return
}
}

loadAside();
