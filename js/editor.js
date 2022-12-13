'use strict'

const sortDocOption = document.querySelector('#selectSort');
const btnCreate = document.querySelector("#createDoc");
const docDiv = document.querySelector("#documentCards");
const asideElement = document.querySelector("aside");
let docCards = document.querySelectorAll('docCard');
let editor = document.getElementById('editor');
const docTitle = document.querySelector('.doc-title');
const tagsContainer = document.getElementById('tagsContainer');
const btnsEditor = document.querySelectorAll('.btnsEditor');
const btnShowAside = document.getElementById('showAside');
const showFilter = document.querySelector('.show-filter');
const filterMenu = document.querySelector('#menuFilterSort');
const clearFilter2 = document.querySelector('#clearFilter')

let editorContents = "";
let currentDoc = 0;
let documentsArray = []

//Get a unique id
let date = new Date()
let docID = date.getTime()
docID = String(docID)

const parseDate = function (unixTime) {
    const t = new Date(unixTime);
    return `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')} ${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`
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
    btnH3: ['formatBlock', false, "H3"],
    btnBody: ['removeFormat']
}

const eventListenerToEditorBtns = function () {
    for (const btn of btnsEditor) {
        const type = btn.parentElement
        if (type.id == 'selectHeading') {
            type.addEventListener('change', function (event) {
                if (!event.target.value) return;

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

function createDoc(newDocumentObject) {
    if (localStorage.getItem('Documents') == true) {
        editorStoreValue();
    }

    docID = Date.now()

    //convert from html to text
    hiddenEL.innerHTML = newDocumentObject.Text;
    const cleanText = hiddenEL.textContent.replace(/\s{2,}/g,' ').trim();
    let slicedText = cleanText.substring(0, 25);

    //create new object properties
    newDocumentObject.id = docID;
    newDocumentObject.timeStamp = docID;
    newDocumentObject.textPreview = slicedText
    newDocumentObject.favourite = false;
    
    editor.innerHTML = newDocumentObject.Text;
    docTitle.value = newDocumentObject.title
    currentDoc = newDocumentObject.id;
    localStorage.setItem('currentDoc', newDocumentObject.id);
    documentsArray.unshift(newDocumentObject);
    localStorage.setItem("Documents", JSON.stringify(documentsArray))

    sortDocs('modNewest');
}


function editorGetValue() {
    if (JSON.parse(localStorage.getItem("Documents")).length !== 0 ) {
        //Get the saved json array and convert it into a normal array
        currentDoc = localStorage.getItem("currentDoc");
        documentsArray = JSON.parse(localStorage.getItem("Documents"))
        if (currentDoc === 0) currentDoc = documentsArray[0].id;
        let docObj = documentsArray.find(o => o.id == currentDoc);
        // editor.innerHTML = savedArray[0].Text;
        editor.innerHTML = docObj.Text;
        docTitle.value = docObj.title
    }
}

function editorStoreValue() {
    documentsArray = JSON.parse(localStorage.getItem("Documents"))
    const index = documentsArray.findIndex(el => el.id == currentDoc)
    documentsArray[index].title = docTitle.value;
    documentsArray[index].timeStamp = Date.now();
    documentsArray[index].Text = editor.innerHTML;
    documentsArray[index].textPreview = editor.textContent.replace(/\s{2,}/g,' ').trim().substring(0, 25);
    localStorage.setItem("Documents", JSON.stringify(documentsArray));
 }

eventListenerToEditorBtns();

const saveDocument = function () {
    if (inSearchMode) {
        updateCurrentDocAside(searchResult);
    } else if (!inSearchMode) {
        updateCurrentDocAside()
    }
    editorStoreValue();
}

//autosave
setInterval(() => {
     saveDocument()
}, 200);


const updateCurrentDocAside = function(docs = documentsArray) {
    const index = docs.findIndex(el => el.id == currentDoc)
    const section = document.getElementById(currentDoc);
    const title = section.children[1];
    const textpreview = section.children[2];
    const date = section.children[3];

    section.classList.add('active');
    title.textContent = docs[index].title
    textpreview.textContent = docs[index].textPreview;
    date.textContent = parseDate(Date.now());
}


document.getElementById('btnSave').addEventListener("click", () => {
    saveDocument();
    updateCurrentDocAside();
})

function switchCurrentEditor(id) {
    const allDocSections = document.querySelectorAll("#documentCards>section")
    const doc = document.getElementById(id);
    allDocSections.forEach(element => {
        element.classList.remove("active");
    });
    doc.classList.add("active");
    localStorage.setItem('currentDoc', id);
    displayTagsInEditor(id);
    editorGetValue();
    document.title = documentsArray[documentsArray.findIndex(el => el.id == id)].title + ' - Quire';
}


function sortDocs(sort = "modNewest", docs = documentsArray) {
    let sortedDocsArray = [...docs];

    switch(sort) {
        case "modNewest": 
            sortedDocsArray.sort(({timeStamp:a}, {timeStamp:b}) => b-a);
            break;
        case "modOldest":
            sortedDocsArray.sort(({timeStamp:a}, {timeStamp:b}) => a-b);
            break;
        case "createdNewest":
            sortedDocsArray.sort(({id:a}, {id:b}) => b-a);
            break;
        case "createdOldest": 
            sortedDocsArray.sort(({id:a}, {id:b}) => a-b);
            break;
    }
    loadAside(sortedDocsArray);
}

function loadAside(docs = JSON.parse(localStorage.getItem("Documents"))) {
    docDiv.innerHTML = "";

    clearFilter.classList.add('hidden')
    if(docs === documentsArray) {
        clearFilter.classList.add('hidden')
    } else if(docs !== documentsArray ){
        clearFilter.classList.remove('hidden')
    }

    /////keep currentDoc in aside whilst filtering
     let arrDocIds = []
    //create an array with all ids of the docs array
    for (let i = 0; i < docs.length; i++) {
        arrDocIds.push(docs[i].id)
    }

    let defaultArray = JSON.parse(localStorage.getItem("Documents"));
   
            if(arrDocIds.findIndex(doc => doc == currentDoc) == -1) {
            for (let i = 0; i < defaultArray.length; i++) {
                if (defaultArray[i].id == currentDoc) {
                    docs.unshift(defaultArray[i])
                }
            }
        }

    if (docs.length !== 0) {
        for (let i = 0; i < docs.length; i++) {
            let docListItem = document.createElement('section');
            docListItem.setAttribute('id', docs[i].id)
            docListItem.className = 'doclist-card';

            const starTrueFalse = docs[i].favourite ? 'fa-solid' : 'fa-regular';
            const deleteBtn = document.createElement('i');
            deleteBtn.className = `fa-trash-can fa-regular hidden ${docs[i].id}`;
            deleteBtn.style.marginLeft = '1vh';
            
            docListItem.insertAdjacentHTML('beforeend', `
                <i class="fa-trash-can fa-regular hidden ${docs[i].id}"></i>
                <h3 id="${docs[i].id}">${docs[i].title.substring(0, 40)}</h3>
                <p id="${docs[i].id}">${docs[i].textPreview}</p>
                <p id="${docs[i].id}">${parseDate(docs[i].timeStamp)}</p>
                <i class="fa-star ${starTrueFalse}"></i>
                `);

            docDiv.appendChild(docListItem);

            //favourite event function
            docListItem.addEventListener('click', (e) => {
                const docId = e.target.closest('section').id
                const index = docs.findIndex(el => el.id == docId)
                if(e.target.className.includes('fa-star')) {
                    e.target.classList.toggle('fa-solid');
                    e.target.classList.toggle('fa-regular');
                    if(e.target.className.includes('fa-regular')) {
                        docs[index].favourite  = false;
                    } else if (e.target.className.includes('fa-solid')){
                        docs[index].favourite = true;
                    }
                    localStorage.setItem("Documents", JSON.stringify(docs));
                    return
                } else if (e.target.className.includes('fa-trash-can')) {
                    const index = docs.findIndex(el => el.id == docId)
                    if(docs[i].id != currentDoc) {
                        docs.splice(index, 1)
                        localStorage.setItem('Documents', JSON.stringify(docs));
                        loadAside();
                    } else (alert('Can not remove opened document.'))
                        return
                }
                //switch what doc you want to edit
                switchCurrentEditor(e.target.id);
            
                if (window.innerWidth < 900) {
                    asideElement.classList.toggle('hidden')
                }
            })
        }
        updateCurrentDocAside()
    } 
}

btnShowAside.addEventListener('click', function () {
    asideElement.classList.toggle('hidden')
})


//If there isn't a localstorage item with the name "docTextsID", make one
if (!localStorage.getItem('Documents')) {
    //create new document
    getObjData('newdocument')
    localStorage.setItem("Documents", JSON.stringify(documentsArray))
} else {
    editorGetValue();
    loadAside(documentsArray);
    currentDoc = localStorage.getItem('currentDoc');
    switchCurrentEditor(currentDoc);
}

//show aside by default in desktop but not in mobie
if (window.innerWidth < 900) {
    asideElement.classList.toggle('hidden')
}
asideElement.classList.toggle('hidden');



