'use strict'

const sortDocOption = document.querySelector('#selectSort');
const btnCreate = document.querySelector("#createDoc");
const docDiv = document.querySelector("#documentCards");
const asideElement = document.querySelector("aside");
let docCards = document.querySelectorAll('docCard');
let editor = document.getElementById('editor');
const docTitle = document.querySelector('.doc-title');
const btnsEditor = document.querySelectorAll('.btnsEditor');
const btnShowAside = document.getElementById('showAside');
let editorContents = "";
let currentDoc = 0;

let documentsArray = [];

//Get a unique id
let date = new Date()
let docID = date.getTime()
docID = String(docID)

const parseDate = function (unixTime) {
    const t = new Date(unixTime);
    return `${t.getFullYear()}-${t.getMonth().toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')} ${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`
}

//If there isn't a localstorage item with the name "docTextsID", make one
if (!localStorage.getItem('Documents')) {

    createDoc()

    console.log(documentsArray)
    console.log('PROPARR' + documentsArray)

    localStorage.setItem("Documents", JSON.stringify(documentsArray))

} else {
    editorGetValue();
}

const editorButtons = {
    btnBold: ['bold'],
    btnItalic: ['italic'],
    btnUnderline: ['underline'],
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
    if (localStorage.getItem('Documents') == true) {
    editorStoreValue();
    }
    console.log("Create doc button press");

    //Update the element
    editor = document.getElementById('editor');
    //Get the current editor contents
    editorContents = document.getElementById('editor').innerHTML;

    //Make sre the document is saved
    /*  editorStoreValue() */

    //Create a new document...
    editor.innerHTML = "";
    console.log("Cleaned out editor");

    //Parse text and properties local storage
/*     documentsArray = JSON.parse(localStorage.getItem("Documents"))
 */

    // let date = new Date()
    docID = Date.now()

    let currentDocProperties = {
        id: docID,
        Text: "",
        title: 'Page title',
        timeStamp: Date.now(),
        textPreview: editor.textContent.substring(0, 20)
    }

    localStorage.setItem('currentDoc', currentDocProperties.id);

    // console.log(documentsArray)
    documentsArray.push(currentDocProperties)
    // console.log('PROPARR' + documentsArray)

    localStorage.setItem("Documents", JSON.stringify(documentsArray))

    //Empty aside to then repopulate
    docDiv.innerHTML = ""

    //push Documents-array into aside-list
    
    sortDocs();
}

function editorGetValue() {
    if (JSON.parse(localStorage.getItem("Documents")).length !== 0) {
        //Get the saved json array and convert it into a normal array
        currentDoc = localStorage.getItem("currentDoc");
        let savedArray = JSON.parse(localStorage.getItem("Documents"))
        if (currentDoc === 0) currentDoc = savedArray[0].id;
        let docObj = savedArray.find(o => o.id == currentDoc);
        // editor.innerHTML = savedArray[0].Text;
        editor.innerHTML = docObj.Text;
        docTitle.value = docObj.title
    }
}

function editorStoreValue() {
    documentsArray = JSON.parse(localStorage.getItem("Documents"));
    for (let i = 0; i < documentsArray.length; i++) {
        if (localStorage.getItem("currentDoc") == documentsArray[i].id) {
            console.log(documentsArray[i].title)
            documentsArray[i].title = docTitle.value;
            documentsArray[i].timeStamp = Date.now();
            documentsArray[i].Text = editor.innerHTML;
            documentsArray[i].textPreview = editor.textContent.substring(0, 20);
            localStorage.setItem("Documents", JSON.stringify(documentsArray));
            //documentsArray[i].classList.add('active');
        }
    }
    docDiv.innerHTML = "";
    loadAside();
}

eventListenerToEditorBtns();
// editorGetValue();

//autosave
/* setInterval(() => {
    editorStoreValue();
}, 1000); */

//make cursor target end of string in #editor


document.getElementById('btnSave').addEventListener("click", editorStoreValue)

function switchCurrentEditor(id) {
    const allDocSections = document.querySelectorAll("#documentCards>section")
    const doc = document.getElementById(id);
    allDocSections.forEach(element => {
        element.classList.remove("active");
    });
    doc.classList.add("active");
    localStorage.setItem('currentDoc', id);
    editorGetValue();
}


sortDocOption.addEventListener('change', (e) => {
    console.log('hej', e.target.value);
    sortDocs(e.target.value)
});


function sortDocs(sort = "modNewest") {
    
    documentsArray = JSON.parse(localStorage.getItem("Documents"))

    switch(sort) {
        case "modNewest": 
            documentsArray.sort(({timeStamp:a}, {timeStamp:b}) => b-a);
            //console.log(sort);
            break;
        case "modOldest":
            documentsArray.sort(({timeStamp:a}, {timeStamp:b}) => a-b);
            //console.log(sort)
            break;
        case "createdNewest":
            documentsArray.sort(({id:a}, {id:b}) => b-a);
            //console.log(sort);
            break;
        case "createdOldest": 
            documentsArray.sort(({id:a}, {id:b}) => a-b);
            //console.log(sort);
        break;
    }
    localStorage.setItem('Documents', JSON.stringify(documentsArray));
    loadAside();
}


/////////////////////////


function search() {
    let searchBar = document.querySelector('.search-bar');
  
    documentsArray = JSON.parse(localStorage.getItem("Documents"))
    console.log(documentsArray)
   
    searchBar.addEventListener('input', (e) => {
    let searchResult = documentsArray.filter(myDoc => myDoc.Text.includes(e.target.value));
    console.log(searchResult)
    localStorage.setItem('Document', JSON.stringify(searchResult));
    })
    loadAside();
}

search();

////////////////////////

function loadAside() {
    docDiv.innerHTML = "";
    //Parse text and properties local storage
    
    documentsArray = JSON.parse(localStorage.getItem("Documents"));
  
    console.log(documentsArray)
 

    if (documentsArray.length !== 0) {
        for (let i = 0; i < documentsArray.length; i++) {
            let docListItem = document.createElement('section');
            docListItem.setAttribute('id', documentsArray[i].id)
            docListItem.className = 'doclist-card';
            docListItem.innerHTML = `
            <h3 id="${documentsArray[i].id}">${documentsArray[i].title.substring(0, 10)}</h3>
            <p id="${documentsArray[i].id}">${documentsArray[i].textPreview}</p>
            <p id="${documentsArray[i].id}">${parseDate(documentsArray[i].timeStamp)}</p>
        `

            //console.log('PROPARRAY: ' + documentsArray);
            docDiv.appendChild(docListItem);
            //console.log("Combined " + documentsArray[i].title + " and " + documentsArray[i].textPreview);

             docListItem.addEventListener('click', (e) => {
                //switch what doc you want to edit
                switchCurrentEditor(e.target.id);
                if(window.innerWidth < 900) {
                asideElement.classList.toggle('hidden')
                }
            })
        }
        switchCurrentEditor(currentDoc);

        //editorGetValue();
        /* eventListenerToDocCards(); */
    } else {
        return
    }
}

btnShowAside.addEventListener('click', function() {
    asideElement.classList.toggle('hidden')
})

sortDocs();

//show aside by default in desktop but not in mobie
if(window.innerWidth < 900) {
    asideElement.classList.toggle('hidden')
    }
asideElement.classList.toggle('hidden')
/* 

//change title border bottom to fit content
docTitle.addEventListener('input', resizeInput); // bind the "resizeInput" callback on "input" event
resizeInput.call(input); // immediately call the function

function resizeInput(n) {
    // const val = n ? n : this.value.length;
  this.style.width =  this.value.length + "ch";
}
 */