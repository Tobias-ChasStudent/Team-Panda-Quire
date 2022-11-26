'use strict'

const btnCreate = document.querySelector("#createDoc")
const asideDocs = document.querySelector(".aside")
let editor = document.getElementById('editor');
const docTitle = document.querySelector('.doc-title');
const btnsEditor = document.querySelectorAll('.btnsEditor');
let editorContents = "";
let currentDoc = 0;

let documentsArray = []

//Get a unique id
let date = new Date()
let docID = date.getTime()
docID = String(docID)

//If there isn't a localstorage item with the name "docTextsID", make one
if (!localStorage.getItem('Documents')) {

    let date = new Date()
    docID = date.getTime()

        console.log(documentsArray)
        console.log('PROPARR' +documentsArray)

    localStorage.setItem("Documents", JSON.stringify(documentsArray))

} else {
    let arrDocTextsID = JSON.parse(localStorage.getItem("Documents"))
    let allIDs = []
    arrDocTextsID.forEach(docObj => {
        allIDs.push(docObj.id)
    });
    let latestDoc = Math.max(allIDs)
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
    documentsArray = JSON.parse(localStorage.getItem("Documents"))

    console.log(documentsArray);

    // let date = new Date()
    docID = Date.now()

    let currentDocProperties = {
        id: docID,
        Text: editorContents,
        /* index: documentsArray.length-1, */
        title: docTitle.value,
        timeStamp: Date.now(),
        textPreview: editorContents.substring(0, 20)
    }
    
    console.log(documentsArray)
    documentsArray.push(currentDocProperties)
    console.log('PROPARR' + documentsArray)

    localStorage.setItem("Documents", JSON.stringify(documentsArray))

    //Empty aside to then repopulate
    asideDocs.innerHTML = ""

    //push Documents-array into aside-list
    loadAside();
}

const editorGetValue = function () {
    if (JSON.parse(localStorage.getItem("Documents")).length !== 0) {
        //Get the saved json array and convert it into a normal array
        let savedArray = JSON.parse(localStorage.getItem("Documents")).reverse()

        console.log(savedArray);
        //console.log(JSON.parse(localStorage.getItem("docTextsID")));

        //console.log(savedArray[0].Text);
        editor.innerHTML = savedArray[0].Text;
        //console.log(editor.innerHTML);
    }
}

const editorStoreValue = function () {
    documentsArray = JSON.parse(localStorage.getItem("Documents"));
    for(let i = 0; i < documentsArray.length; i++) {
        if (currentDoc == documentsArray[i].id) {
             documentsArray[i].Text = editor.innerHTML;
             documentsArray[i].textPreview = editor.innerHTML.substring(0, 20)
             localStorage.setItem("Documents", JSON.stringify(documentsArray))
        }
    }
    asideDocs.innerHTML = "";
    loadAside();
    
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
 
    return `${t.getFullYear()}-${t.getMonth().toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')} ${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`
}

//sort by date
/* documentsArray = JSON.parse(localStorage.getItem("Documents")) */

function loadAside() {
//Parse text and properties local storage
//show latest first
documentsArray = JSON.parse(localStorage.getItem("Documents")).reverse()

if (documentsArray.length !== 0) {

    //eventlistener on sorting method?
    //const ny = eductationArray.sort(({Completion:a}, {Completion: b}) => b-a);

    for (let i = 0; i < documentsArray.length; i++) {
        let docListItem = document.createElement('section');
        docListItem.innerHTML = `
        <h3>${documentsArray[i].title}</h3>
        <p>${documentsArray[i].textPreview}</p>
        <p><em>${parseDate(documentsArray[i].timeStamp)}</em></p>
        `
        
        console.log('PROPARRAY: ' + documentsArray);
        asideDocs.appendChild(docListItem);
        console.log("Combined " + documentsArray[i].title + " and " + documentsArray[i].textPreview);
    }
    currentDoc = documentsArray[0].id;
    editorGetValue();
} else {
    return
}
}

loadAside();





/* function sortRecent() {
        educations.innerHTML = null;
        const ny = eductationArray.sort(({Completion:a}, {Completion: b}) => b-a);
        eductationArray .forEach((course) => {
            const eduDescription = document.createElement('div');
            eduDescription.className = "education-list";
            const eduEntries = Object.entries(course);
            eduEntries.forEach(([key, value]) => {
                eduDescription.innerHTML += `<span style="font-weight: bold;">${key}:</span> ${value} <br> `;
                educations.appendChild(eduDescription);
            })
        })
    } */