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


/* Create new docs */
// btnCreate.addEventListener("click", createDoc)

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
        textPreview: editor.textContent.substring(0, 20),
        favourite: false
    }

    localStorage.setItem('currentDoc', currentDocProperties.id);

    // console.log(documentsArray)
    documentsArray.unshift(currentDocProperties)
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
    docDiv.innerHTML = "";
    loadAside();
}

eventListenerToEditorBtns();
// editorGetValue();


//autosave
/* setInterval(() => {
    editorStoreValue();
}, 3000); */





document.getElementById('btnSave').addEventListener("click", editorStoreValue)

function switchCurrentEditor(id) {
    if (id != "") {
        const allDocSections = document.querySelectorAll("#documentCards>section")
        const doc = document.getElementById(id);
        allDocSections.forEach(element => {
            element.classList.remove("active");
        });
        doc.classList.add("active");
        localStorage.setItem('currentDoc', id);
    
        displayTagsInEditor(id);
        editorGetValue();
    }
}


/* sortDocOption.addEventListener('change', (e) => {
    console.log('hej', e.target.value);
    sortDocs(e.target.value)
}); */


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
    console.log("hi")
    /* documentsArray = JSON.parse(localStorage.getItem('Documents')); */
    console.log(documentsArray)
    let favDocs = [];
    favDocs = toggleFav.className.includes('favToggleOff') ? documentsArray.filter(fav => fav.favourite == true) : documentsArray;

    loadAside(favDocs)

    console.log(favDocs);
}

toggleFav.addEventListener('click', favFilter);

//////////////////////////////
////search UI
function search() {
    documentsArray = JSON.parse(localStorage.getItem("Documents"))

    searchBar.addEventListener('click', () => {
            let previousSearchterm = localStorage.getItem('previous-searchterm');
            console.log(previousSearchterm)
            if(previousSearchterm !== '' && searchBar.value !== '') {
                searchBar.value = previousSearchterm;
            } else if (previousSearchterm == '' || searchBar.value == 'Search') { 
            searchBar.value = ''; 
            loadAside();
            }
        }
    )
    }

    document.addEventListener('click', (e) => {
        if(e.target != searchBar && searchBar.value == '') {
            searchBar.value = "Search";
            localStorage.setItem('previous-searchterm', '');
        }
    })

    //////reset previous search-term if page reloaded
    if (sessionStorage.getItem('reloaded') != null) {
        localStorage.setItem('previous-searchterm', '');
    } else {
        console.log('page was not reloaded');
    }
    sessionStorage.setItem('reloaded', 'yes'); 

    
    
   ///////////////////////////
   ///////////////    SEARCH   ///////////////////// 
    searchBar.addEventListener('input', (e) => {   
    if(searchBar.value !== '') {
        docDiv.innerHTML = "";
        let searchTerm = e.target.value.trim().toLowerCase();
        localStorage.setItem('previous-searchterm', searchTerm);
        let searchResult = documentsArray.filter(myDoc => myDoc.Text.toLowerCase().includes(searchTerm) || myDoc.title.toLowerCase().includes(searchTerm));
        for (let i = 0; i < searchResult.length; i++) {
            //highlight text?
            //change textpreview to display substring where searchTerm is
            if(searchResult[i].Text.toLowerCase().includes(searchTerm) && !searchResult[i].textPreview.toLowerCase().includes(searchTerm)) {
                let textIndex = searchResult[i].Text.search(searchTerm);
                let slicedText = searchResult[i].Text.substring(textIndex, (textIndex + 20));
                searchResult[i].textPreview = slicedText;
            } 
             
            loadAside(searchResult);
        }
    } else {
        console.log('empty')
        loadAside();
    }
    })  

///////////////////////////////////
///////////////////////////////////

search();

function loadAside(docs = JSON.parse(localStorage.getItem("Documents"))) {
    //localStorage.setItem('currentDoc', docs[0].id);
    docDiv.innerHTML = "";
    //Parse text and properties local storage


/*     if (localStorage.getItem('currentDoc') !== null) {
        currentDoc = localStorage.getItem('currentDoc')
    } */


   

    if (docs.length !== 0) {
        for (let i = 0; i < docs.length; i++) {
            let docListItem = document.createElement('section');
            docListItem.setAttribute('id', docs[i].id)
            docListItem.className = 'doclist-card';
            // addbtn.setAttribute('id', documentsArray[i].id)
            // addbtn.className = 'doclist-card';

            let btnStar = document.createElement('i');
            const starTrueFalse = docs[i].favourite ? 'fa-solid' : 'fa-regular';
            btnStar.className = `fa-star ${starTrueFalse}`;
            const deleteBtn = document.createElement('i');
            deleteBtn.className = 'fa-trash-can fa-regular ${docs[i].id}';
            
            docListItem.innerHTML = `
                    <h3 id="${docs[i].id}">${docs[i].title.substring(0, 10)}</h3>

                <p id="${docs[i].id}">${docs[i].textPreview}</p>
                <p id="${docs[i].id}">${parseDate(docs[i].timeStamp)}</p>`
/*                 <p><img src="https://img.icons8.com/material-rounded/24/null/tags.png"/>${tagFunctions.findAll(docs[i].id).toString().replaceAll(',',' ')}</p>
 */            ;

            //console.log('PROPARRAY: ' + documentsArray);
            docListItem.appendChild(btnStar);
            docListItem.appendChild(deleteBtn);
            docDiv.appendChild(docListItem);


            //favourite event function
            docListItem.addEventListener('click', (e) => {
                if(e.target.className.includes('fa-star')) {
                    e.target.classList.toggle('fa-solid');
                    e.target.classList.toggle('fa-regular');
                    if(e.target.className.includes('fa-regular')) {
                        docs[i].favourite  = false;
                    } else if (e.target.className.includes('fa-solid')){
                        docs[i].favourite = true;
                    }
                    localStorage.setItem("Documents", JSON.stringify(docs));
                    return
                }
                //switch what doc you want to edit
            
                switchCurrentEditor(e.target.id);
                


                if (window.innerWidth < 900) {
                    asideElement.classList.toggle('hidden')
                }
            })
            
            /* deleteBtn.addEventListener('click', () => {
                if(docs[i].id != currentDoc) {
                let index = docs.indexOf(docs[i]);
                console.log("The index of the pressed trashcan", index)
                console.log(docs.splice(index, 1));
                docs.splice(index, 1); 
                
                localStorage.setItem('Documents', JSON.stringify(docs));
                loadAside();
                } else (console.log('nej   '))
            }) */
        

            console.log(docs)
        }
        // displayTagsInEditor(currentDoc);
        switchCurrentEditor(currentDoc);

        //editorGetValue();
        /* eventListenerToDocCards(); */
    } 
}

btnShowAside.addEventListener('click', function () {
    asideElement.classList.toggle('hidden')
})

sortDocs('modNewest', JSON.parse(localStorage.getItem("Documents")));


//show aside by default in desktop but not in mobie
if (window.innerWidth < 900) {
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

