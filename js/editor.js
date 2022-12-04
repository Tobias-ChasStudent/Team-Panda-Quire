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
const toggleFav = document.querySelector('.show-favourites');
toggleFav.className = "favToggledOff";

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
        textPreview: editor.textContent.substring(0, 20),
        favourite: false
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
    //documentsArray = JSON.parse(localStorage.getItem("Documents"));
    for (let i = 0; i < documentsArray.length; i++) {
        if (localStorage.getItem("currentDoc") == documentsArray[i].id) {
            console.log(documentsArray[i].title)
            documentsArray[i].title = docTitle.value;
            documentsArray[i].timeStamp = Date.now();
            documentsArray[i].Text = editor.innerHTML;
            documentsArray[i].textPreview = editor.textContent.substring(0, 20);
            
            //localStorage.setItem("Documents", JSON.stringify(documentsArray));
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

    switch (sort) {
        case "modNewest":
            documentsArray.sort(({ timeStamp: a }, { timeStamp: b }) => b - a);
            //console.log(sort);
            break;
        case "modOldest":
            documentsArray.sort(({ timeStamp: a }, { timeStamp: b }) => a - b);
            //console.log(sort)
            break;
        case "createdNewest":
            documentsArray.sort(({ id: a }, { id: b }) => b - a);
            //console.log(sort);
            break;
        case "createdOldest":
            documentsArray.sort(({ id: a }, { id: b }) => a - b);
            //console.log(sort);
            break;
    }
    localStorage.setItem('Documents', JSON.stringify(documentsArray));
    loadAside();
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

function loadAside(doc = documentsArray) {
    docDiv.innerHTML = "";
    //Parse text and properties local storage


    if (localStorage.getItem('currentDoc') !== null) {
        currentDoc = localStorage.getItem('currentDoc')
    }

    if (doc.length !== 0) {
        for (let i = 0; i < doc.length; i++) {
            let docListItem = document.createElement('section');
            // let addbtn = document.createElement('section');
            docListItem.setAttribute('id', doc[i].id)
            docListItem.className = 'doclist-card';
            // addbtn.setAttribute('id', documentsArray[i].id)
            // addbtn.className = 'doclist-card';

            let btnStar = document.createElement('i');
            const starTrueFalse = doc[i].favourite ? 'fa-solid' : 'fa-regular';
            btnStar.className = `fa-star ${starTrueFalse}`;


            docListItem.innerHTML = `
            <h3 id="${doc[i].id}">${doc[i].title.substring(0, 10)}</h3>
            <p id="${doc[i].id}">${doc[i].textPreview}</p>
            <p id="${doc[i].id}">${parseDate(doc[i].timeStamp)} </p>
        `
            //     addbtn.innerHTML = `
            //     <button id="${documentsArray[i].id}" > + Favorite</button>
            // `

            //console.log('PROPARRAY: ' + documentsArray);
            docListItem.appendChild(btnStar);
            docDiv.appendChild(docListItem);


            
            docListItem.addEventListener('click', (e) => {
                if(e.target.className.includes('fa-star')) {
                    e.target.classList.toggle('fa-solid');
                    e.target.classList.toggle('fa-regular');
                    if(e.target.className.includes('fa-regular')) {
                        doc[i].favourite  = false;
                    } else if (e.target.className.includes('fa-solid')){
                        doc[i].favourite = true;
                    }
                    localStorage.setItem("Documents", JSON.stringify(doc));
                    return
                }
                //switch what doc you want to edit
                switchCurrentEditor(e.target.id);
                if (window.innerWidth < 900) {
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

btnShowAside.addEventListener('click', function () {
    asideElement.classList.toggle('hidden')
})

sortDocs();


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



            //docDiv.appendChild(addbtn);
          
            //console.log("Combined " + documentsArray[i].title + " and " + documentsArray[i].textPreview);
            //localStorage.setItem('favorites', JSON.stringify(favorites));
            // const favorites = JSON.parse(localStorage.getItem("Fav")||[]);
               
            //     //const favorites = localStorage.getItem("Fav");
            //     if (!favorites) {
            //         localStorage.setItem("Fav", JSON.stringify({ stores: [] }));
            //         favorites = JSON.parse(localStorage.getItem("Fav"));
            //     } else {
            //         favorites = JSON.parse(favorites);
            //     }

            //     favorites.stores.push(storeName);

            // docListItem.addEventListener('click', (e) => {
            //     console.log("hi");
            //     console.log("My new log"+documentsArray[i].id);

               // let storeName = $(e.target).parents()[documentsArray[i].id].innerHTML;
                

                //localStorage.setItem("Fav", JSON.stringify(favorites));
                //localStorage.setItem('currentDoc', id);

            //});

            // get favorites from local storage or empty array
            // var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            // // add class 'fav' to each favorite
            // favorites.forEach(function (favorite) {
            //     document.getElementById(favorite).className = 'fav';
            // });
            // register click event listener
            // addbtn.addEventListener('click', function (e) {
            //     var id = e.target.id,
            //         item = e.target,
            //         index = favorites.indexOf(id);
            //     // return if target doesn't have an id (shouldn't happen)
            //     if (!id) return;
            //     // item is not favorite
            //     if (index == -1) {
            //         favorites.push(id);
            //         item.className = 'fav';
            //         // item is already favorite
            //     } else {
            //         favorites.splice(index, 1);
            //         item.className = '';
            //     }
            //     // store array in local storage
            //     localStorage.setItem('favorites', JSON.stringify(favorites));
            // });