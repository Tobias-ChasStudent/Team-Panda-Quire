'use strict'
let tagsObj = new Object;
const findTags = document.getElementById('findTags');
const selectFindTags = document.getElementById('findTags');
const inputNewTags = document.getElementById('inputTags');
const formAddTags = document.getElementById('formAddTags');
const btnSaveTags = document.getElementById('btnSaveTags');
const btnAddTag = document.getElementById('addTag');

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
    },
    remove(tag, id) {
        tagsObj[tag].splice(tagsObj[tag].indexOf(id.toString()), 1)
        if (tagsObj[tag][0] == undefined) delete tagsObj[tag];
        this.set();
    }
}

const removeTag = function(e) {
    console.log('remove', e.target.textContent, currentDoc)
    const tag = e.target.textContent.toLowerCase();
    tagFunctions.remove(tag, currentDoc);

    displayTagsInEditor(currentDoc);
}

const displayTagsInEditor = function (id) {
    document.querySelectorAll('.tagLabel').forEach(el => el.remove())
    tagFunctions.findAll(id).forEach(tag => {
        const tagNode = document.createElement('p');
        tagNode.classList.add('tagLabel');
        tagNode.textContent = tag.toUpperCase();
        formAddTags.before(tagNode);
    });

    document.querySelectorAll('.tagLabel').forEach(node => node.addEventListener('click', removeTag))
}

////////////////////////////
// Event listeners
btnAddTag.addEventListener('click', function() {
    formAddTags.classList.toggle('hidden');
    formAddTags.classList.toggle('formAddTags');
    inputNewTags.focus();
});

btnSaveTags.addEventListener('click', function(e) {
    e.preventDefault();
    //comma separated tags to array
    const tags = inputNewTags.value.toLowerCase().replaceAll(' ','').split(',');

    if (tags.at(0).length > 0) {
        tags.forEach(tag => tagFunctions.add(tag, currentDoc));
        displayTagsInEditor(currentDoc);
        selectTagsMenu();
    }

    inputNewTags.value = '';
    inputNewTags.blur();

});

