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
const trashCans = []

let editorContents = "";
let currentDoc = 0;
let documentsArray = []

//Get a unique id
let date = new Date()
let docID = date.getTime()
docID = String(docID)

const parseDate = function (unixTime) {
    const t = new Date(unixTime);
    return `${t.getFullYear()}-
    ${(t.getMonth() + 1).toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')} ${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`
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
                const idBtn = event.target.value;
                document.execCommand(...editorButtons[idBtn]);
                console.log('test', ...editorButtons[idBtn])

            });
        } else {
            const idBtn = btn.getAttribute('id');
            btn.addEventListener('click', function () {
                document.execCommand(...editorButtons[idBtn]);
            });
        }
    }
}

function createDoc() {
    if (localStorage.getItem('Documents') == true) {
        editorStoreValue();
    }

    editor = document.getElementById('editor');

    //Get the current editor contents
    editorContents = document.getElementById('editor').innerHTML;
    editor.innerHTML = "";
    docID = Date.now()

    //Create a new document object
    let currentDocProperties = {
        id: docID,
        Text: "",
        title: 'Page titles',
        timeStamp: Date.now(),
        textPreview: editor.textContent.substring(0, 20),
        favourite: false
    }

    currentDoc = currentDocProperties.id;
    localStorage.setItem('currentDoc', currentDocProperties.id);
    documentsArray.unshift(currentDocProperties);
    localStorage.setItem("Documents", JSON.stringify(documentsArray))

    //Empty aside to then repopulate
    docDiv.innerHTML = ""

    //push Documents-array into aside-list
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
    documentsArray[index].textPreview = editor.textContent.replace(/\s{2,}/g,' ').trim().substring(0, 20);
    localStorage.setItem("Documents", JSON.stringify(documentsArray));
 }

eventListenerToEditorBtns();

const saveDocument = function () {
/*     console.log('auto save before editorstorevalue, searchresult', searchResult[0].textPreview);
 */    console.log('autosave docarray' , documentsArray[0].textPreview)

    if (inSearchMode) {
        console.log('in search mode');
        console.log('auto save search result', searchResult[0].textPreview);
        console.log('auto save doc array', searchResult[0].textPreview);
        updateCurrentDocAside(searchResult);
    } else if (!inSearchMode) {
        console.log('not in search mode')
        updateCurrentDocAside()
    }

    editorStoreValue();
}

//autosave
setInterval(() => {
    // saveDocument()
}, 3000);


const updateCurrentDocAside = function(docs = documentsArray) {
    const index = docs.findIndex(el => el.id == currentDoc)
    const section = document.getElementById(currentDoc);
    const title = section.children[0];
    const textpreview = section.children[1];
    const date = section.children[2];

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
   // if (id != "") {
    console.log('switch' + id)
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
    //}
}


function sortDocs(sort = "modNewest", docs = documentsArray) {
    
    // documentsArray = JSON.parse(localStorage.getItem("Documents"))

    switch(sort) {
        case "modNewest": 
            docs.sort(({timeStamp:a}, {timeStamp:b}) => b-a);
            //console.log(sort);
            break;
        case "modOldest":
            docs.sort(({timeStamp:a}, {timeStamp:b}) => a-b);
            //console.log(sort)
            break;
        case "createdNewest":
            docs.sort(({id:a}, {id:b}) => b-a);
            //console.log(sort);
            break;
        case "createdOldest": 
            docs.sort(({id:a}, {id:b}) => a-b);
            //console.log(sort);
            break;
    }
    localStorage.setItem('Documents', JSON.stringify(documentsArray));
    loadAside(documentsArray);
}



function loadAside(docs = JSON.parse(localStorage.getItem("Documents"))) {
    docDiv.innerHTML = "";

    if (docs.length !== 0) {
        for (let i = 0; i < docs.length; i++) {
            let docListItem = document.createElement('section');
            docListItem.setAttribute('id', docs[i].id)
            docListItem.className = 'doclist-card';

            let btnStar = document.createElement('i');
            const starTrueFalse = docs[i].favourite ? 'fa-solid' : 'fa-regular';
            btnStar.className = `fa-star ${starTrueFalse}`;
            const deleteBtn = document.createElement('i');
            deleteBtn.className = `fa-trash-can fa-regular ${docs[i].id}`;
            deleteBtn.style.marginLeft = '1vh';
            
            docListItem.innerHTML = `
                <h3 id="${docs[i].id}">${docs[i].title.substring(0, 40)}</h3>
                <p id="${docs[i].id}">${docs[i].textPreview}</p>
                <p id="${docs[i].id}">${parseDate(docs[i].timeStamp)}</p>`;

            //console.log('PROPARRAY: ' + documentsArray);
            docListItem.appendChild(btnStar);
            docListItem.appendChild(deleteBtn);
            docDiv.appendChild(docListItem);


            //favourite event function
            docListItem.addEventListener('click', (e) => {
                const docId = e.target.parentElement.id
                const index = docs.findIndex(el => el.id == docId)
                console.log(docId, index)
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
                    const docId = e.target.parentElement.id
                    const index = docs.findIndex(el => el.id == docId)
                    if(docs[i].id != currentDoc) {
                    console.log("The index of the pressed trashcan", index)
    
                    console.log('removed', docs.splice(index, 1)); 
                    //tar bort för många items, om tar bort vid favoritfiltrerat?
                    
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
    createDoc()
    localStorage.setItem("Documents", JSON.stringify(documentsArray))
} else {
    editorGetValue();
    loadAside();
    currentDoc = localStorage.getItem('currentDoc');
    switchCurrentEditor(currentDoc);
}

//show aside by default in desktop but not in mobie
if (window.innerWidth < 900) {
    asideElement.classList.toggle('hidden')
}
asideElement.classList.toggle('hidden');



