'use strict'
let tagsObj = new Object;
const findTags = document.getElementById('findTags');
const tagsSuggestion = document.getElementById('tagsSuggestion');
const btnSaveTags = document.getElementById('btnSaveTags');

// methods for managing tags
const tagFunctions = {
    get() {
        tagsObj = JSON.parse(localStorage.getItem('tags'));
        return tagsObj;
    },
    set() {
        localStorage.setItem('tags', JSON.stringify(tagsObj));
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
        const tagsArr = new Array;
        for (const [tag, idArr] of Object.entries(tagsObj)) {
            idArr.forEach(id => {
                if (id == idFind) tagsArr.push(tag);
            });
        }
        return tagsArr;
    },
    allTags() { //returns array of all unique tags
        return Object.keys(tagsObj);
    },
    add(tag, id) {
        this.get() //behövs denna?
        if (Object.keys(tagsObj).includes(tag)) {
            tagsObj[tag].push(id);
        } else {
            tagsObj[tag] = [id];
        }
        this.set();
    }
}

////////////////////////////
// Event listeners
//Handles input of tags: adds tags to currentDoc
btnSaveTags.addEventListener('click', function() {
    //get comma separated tags to array
    const tags = document.getElementById('inputTags').value.replaceAll(' ','').split(',');
    console.log(tags)
    tags.forEach(tag => tagFunctions.add(tag, currentDoc));
});

findTags.addEventListener('change', function(e) {
    const docs = tagFunctions.docArray(e.target.value);
    if (docs) loadAside(docs);
})

////////////////////////////
//Initialization
//Load tags to autocompletion box
if (tagFunctions.set() == null) tagFunctions.set();

tagFunctions.get();
let arr = new Array;
tagFunctions.allTags().forEach(tag => {
    tagsSuggestion.insertAdjacentHTML('beforeend', `
    <option>${tag}</option>
    `);
});