const btnSortCreated = document.getElementById('sortCreated');
const checkSortCreated = document.querySelector('#labelCheckCreated');
const checkCreatedAscDesc = document.querySelector('#labelCreatedAscDesc');
const btnSortModified = document.getElementById('sortModified');
const checkSortModified = document.querySelector('#labelCheckModified');
const checkModifiedAscDesc = document.querySelector('#labelModifiedAscDesc');
const filterFav = document.getElementById('filterFav');
const toggleFav = document.querySelector('#labelCheckFav');
const filterTag = document.getElementById('filterTag');
const toggleTag = document.querySelector('#labelCheckTag');
const clearFilter = document.querySelector('.clear-filter');
const filterArrow = document.querySelector('.fa-arrow');

const clearSortFilter = function () {
    // clear all other sort and filter options
}

///////////////////////////////////
// Sorting
let sortCreatedState = 0;

btnSortCreated.addEventListener('click', function() {
    clearSortFilter()
    switch(sortCreatedState) {
        case 0: 
            sortDocs('createdNewest');
            sortCreatedState++;
            checkSortCreated.classList.toggle('fa-square-check');
            checkSortCreated.classList.toggle('fa-square');
            break;
        case 1:
            sortDocs('createdOldest');
            sortCreatedState++;
            checkCreatedAscDesc.classList.toggle('fa-arrow-down-wide-short');
            checkCreatedAscDesc.classList.toggle('fa-arrow-up-wide-short');
            break;
        case 2:
            //sortDocs();
            loadAside(documentsArray)
            sortCreatedState = 0;
            checkSortCreated.classList.toggle('fa-square-check');
            checkSortCreated.classList.toggle('fa-square');
            checkCreatedAscDesc.classList.toggle('fa-arrow-down-wide-short');
            checkCreatedAscDesc.classList.toggle('fa-arrow-up-wide-short');
            break;
    }
});

let sortModifiedState = 0;

btnSortModified.addEventListener('click', function() {
    clearSortFilter()
    switch(sortModifiedState) {
        case 0: 
            sortDocs('modNewest');
            sortModifiedState++;
            checkSortModified.classList.toggle('fa-square-check');
            checkSortModified.classList.toggle('fa-square');
            break;
        case 1:
            sortDocs('modOldest');
            sortModifiedState++;
            checkModifiedAscDesc.classList.toggle('fa-arrow-down-wide-short');
            checkModifiedAscDesc.classList.toggle('fa-arrow-up-wide-short');
            break;
        case 2:
            //sortDocs();
            loadAside(documentsArray)
            sortModifiedState = 0;
            checkSortModified.classList.toggle('fa-square-check');
            checkSortModified.classList.toggle('fa-square');
            checkModifiedAscDesc.classList.toggle('fa-arrow-down-wide-short');
            checkModifiedAscDesc.classList.toggle('fa-arrow-up-wide-short');
            break;
    }
});

////////////////////////////////
//Favourites
showFilter.addEventListener('click', () => {
    filterMenu.classList.toggle('hidden');
    if(!showFilter.classList.contains('hidden')) {
        filterArrow.classList.toggle('fa-arrow-down');
        filterArrow.classList.toggle('fa-arrow-up');
     }
})

let favFilterState = false;

function favFilter (){
    
    documentsArray = JSON.parse(localStorage.getItem("Documents"));
    toggleFav.classList.toggle('fa-square-check');
    toggleFav.classList.toggle('fa-square');
    favFilterState = favFilterState ? false : true; 

    let favDocs = [];
    favDocs = favFilterState ? documentsArray.filter(fav => fav.favourite == true) : documentsArray;
    loadAside(favDocs)
}

filterFav.addEventListener('click', favFilter);

//////////////////////////////////
// Filter tags

let tagFilterState = false;

const toggleTagCheck = function() {
    toggleTag.classList.toggle('fa-square');
    toggleTag.classList.toggle('fa-square-check');
}

const handlerFindTags = function() {
    let docs = documentsArray;
    if (findTags.value != 'Choose tag') {
        docs = tagFunctions.docArray(findTags.value.toLowerCase());
    } 
    loadAside(docs); 
    toggleTagCheck()
}

findTags.addEventListener('change', handlerFindTags)

filterTag.addEventListener('click', function() {
    toggleTagCheck();
    tagFilterState = tagFilterState ? false : true; 

    if (tagFilterState) {
        findTags.value = 'Choose tag';
        clearFilterOptions();
    }
});

findTags.addEventListener('click', function(e) {
    e.stopPropagation();
});

const selectTagsMenu = function () {
    tagFunctions.allTags().forEach(tag => {
        selectFindTags.insertAdjacentHTML('beforeend', 
            `<option>${tag}</option>`
        );
    });
}

//Load tags to selection box
if (tagFunctions.get() == null) tagFunctions.set();

tagFunctions.get();
selectTagsMenu();

////////////////////////////////
/// clear filters

clearFilter.addEventListener('click', clearFilterOptions);

function clearFilterOptions() {
    loadAside(documentsArray);

    favFilterState = false;
    tagFilterState = false;
   
    toggleTag.classList.remove('fa-square-check');
    toggleTag.classList.add('fa-square');

    toggleFav.classList.remove('fa-square-check');
    toggleFav.classList.add('fa-square');

    checkSortCreated.classList.remove('fa-square-check');
    checkSortCreated.classList.add('fa-square');
    checkCreatedAscDesc.classList.remove('fa-arrow-up-wide-short');
    checkCreatedAscDesc.classList.add('fa-arrow-down-wide-short');
    checkSortModified.classList.remove('fa-square-check');
    checkSortModified.classList.add('fa-square');
    checkModifiedAscDesc.classList.remove('fa-arrow-up-wide-short');
    checkModifiedAscDesc.classList.add('fa-arrow-down-wide-short');
}

docDiv.addEventListener('mouseover', (e) => {
   const section = e.target.closest('section')
   if (!section) return;

   section.querySelector('.fa-trash-can').classList.remove('hidden')
})

docDiv.addEventListener('mouseout', (e) => {
    const section = e.target.closest('section')
    if (!section) return;
 
    section.querySelector('.fa-trash-can').classList.add('hidden')
 })
 