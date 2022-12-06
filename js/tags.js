'use strict'
let tagsObj = new Object;
const findTags = document.getElementById('findTags');
const tagsSuggestion = document.getElementById('tagsSuggestion');
const inputNewTags = document.getElementById('inputTags');
const btnSaveTags = document.getElementById('btnSaveTags');

// methods for managing tags
const tagFunctions = {
    get() {
        tagsObj = JSON.parse(localStorage.getItem('tags'));
        if (!tagsObj) { // check if tagsObj is falsy
            this.set({})
            tagsObj = {};
        }
        // return tagsObj;
    },
    set(obj = tagsObj) {
        localStorage.setItem('tags', JSON.stringify(obj));
    },
    find(tag) { //return array of id numbers for selected tag
        for (const [key, idArr] of Object.entries(tagsObj)) {
            console.log(key);
            if (tag == key) return idArr;
        }
    },
    docArray(tag) { //returns array of doc objects from documentsArray by selected tag
        const tagNames = this.find(tag) ?? false;
        if (tagNames === false) return false;
        const arr = new Array;
        for (const tagName of tagNames) {
            for (const [i, {id}] of documentsArray.entries()) {
                if (id == tagName) {
                    arr.push(documentsArray[i]);
                }
            }
        }
        return arr;
    },
    findAll(idFind) { //return array of tags for selected id number
        const tagsArr = Object.entries(tagsObj)
            .filter(tag => tag[1].includes(idFind.toString()))
            .map(tag => tag[0])
        return tagsArr;
    },
    allTags() { //returns array of all unique tags
        return Object.keys(tagsObj);
    },
    add(tag, id) {
        this.get() 
        if (Object.keys(tagsObj).includes(tag)) {
            if (!tagsObj[tag].includes(id)) tagsObj[tag].push(id);
        } else {
            tagsObj[tag] = [id];
        }
        this.set();
    }
}

const removeTag = function(tag, id) {

}

const displayTagsInEditor = function (id) {
    document.querySelectorAll('.tagLabel').forEach(el => el.remove())
    tagFunctions.findAll(id).forEach(tag => {
        tagsContainer.insertAdjacentHTML('afterbegin', `
            <p class="tagLabel">${tag.toUpperCase()}</p>
        `);
    });
    
}

////////////////////////////
// Event listeners
//Handles input of tags: adds tags to currentDoc
btnSaveTags.addEventListener('click', function() {
    //comma separated tags to array
    const tags = inputNewTags.value.toLowerCase().replaceAll(' ','').split(',');

    tags.forEach(tag => tagFunctions.add(tag, currentDoc));
    loadAside()

    inputNewTags.value = '';
    inputNewTags.blur();

});

findTags.addEventListener('change', function(e) {
    let docs = documentsArray;
    if (!e.target.value == '') {
        docs = tagFunctions.docArray(e.target.value);
    }

    currentDoc = docs[0].id;
    if (docs) loadAside(docs);
})

////////////////////////////
//Initialization
//Load tags to autocompletion box
if (tagFunctions.get() == null) tagFunctions.set();

tagFunctions.get();
let arr = new Array;
tagFunctions.allTags().forEach(tag => {
    tagsSuggestion.insertAdjacentHTML('beforeend', 
        `<option>${tag}</option>`
    );
});

