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
const toggleFav = document.querySelector('.show-favourites');
const trashCans = []
toggleFav.className = "favToggledOff";

const searchBar = document.querySelector('#search-bar');
let editorContents = "";
let currentDoc = 0;
let documentsArray = []

//Get a unique id
let date = new Date()
let docID = date.getTime()
docID = String(docID)

const parseDate = function (unixTime) {
    const t = new Date(unixTime);
    return `${t.getFullYear()}-${t.getMonth().toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')} ${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`
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
    //documentsArray = JSON.parse(localStorage.getItem("Documents"));
    for (let i = 0; i < documentsArray.length; i++) {
        if (localStorage.getItem("currentDoc") == documentsArray[i].id) {
            documentsArray[i].title = docTitle.value;
            documentsArray[i].timeStamp = Date.now();
            documentsArray[i].Text = editor.innerHTML;
            documentsArray[i].textPreview = editor.textContent.substring(0, 20);
            //documentsArray[i].tags = ['test1', 'test2', 'test3']; //TEMPORARY
            localStorage.setItem("Documents", JSON.stringify(documentsArray));
            //documentsArray[i].classList.add('active');
        }
    }
    localStorage.setItem("Documents", JSON.stringify(documentsArray));
    updateCurrentDocAside();
}

eventListenerToEditorBtns();

//autosave
setInterval(() => {
    editorStoreValue();
}, 3000);


const updateCurrentDocAside = function() {
    const index = documentsArray.findIndex(el => el.id == currentDoc)
    console.log('index', index, currentDoc)
    const section = document.getElementById(currentDoc);
    const title = section.children[0];
    const textpreview = section.children[1];
    const date = section.children[2];

    section.classList.add('active');
    title.textContent = documentsArray[index].title
    textpreview.textContent = documentsArray[index].textPreview;
    date.textContent = parseDate(Date.now());
}


document.getElementById('btnSave').addEventListener("click", editorStoreValue)

function switchCurrentEditor(id) {
   // if (id != "") {
    console.log('switch' + id)
    const allDocSections = document.querySelectorAll("#documentCards>section")
    console.log(allDocSections)
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

function favFilter (){
    toggleFav.classList.toggle('favToggleOff');
    let favDocs = [];
    favDocs = toggleFav.className.includes('favToggleOff') ? documentsArray.filter(fav => fav.favourite == true) : documentsArray;
    //find index of fav document
    let currentFav = favDocs.findIndex(fav => fav.id == currentDoc)

    if(currentFav == -1) {
    currentDoc = favDocs[0].id;
    } else {
        currentDoc == favDocs[currentFav].id;
    }
    loadAside(favDocs)
}

toggleFav.addEventListener('click', favFilter);



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
                const index = documentsArray.findIndex(el => el.id == docId)
                console.log(docId, index)
                if(e.target.className.includes('fa-star')) {
                    e.target.classList.toggle('fa-solid');
                    e.target.classList.toggle('fa-regular');
                    if(e.target.className.includes('fa-regular')) {
                        documentsArray[index].favourite  = false;
                    } else if (e.target.className.includes('fa-solid')){
                        documentsArray[index].favourite = true;
                    }
                    localStorage.setItem("Documents", JSON.stringify(documentsArray));
                    return
                } else if (e.target.className.includes('fa-trash-can')) {
                    const docId = e.target.parentElement.id
                    const index = docs.findIndex(el => el.id == docId)
                    if(docs[i].id != currentDoc) {
                    console.log("The index of the pressed trashcan", index)
    
                    console.log('removed', docs.splice(index, 1)); 
                    
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

    console.log(documentsArray)
    console.log('PROPARR' + documentsArray)

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
asideElement.classList.toggle('hidden')