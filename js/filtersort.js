const btnSortCreated = document.getElementById('sortCreated');
const checkSortCreated = document.querySelector('#labelCheckCreated');
const checkCreatedAscDesc = document.querySelector('#labelCreatedAscDesc');

const btnSortModified = document.getElementById('sortModified');
const checkSortModified = document.querySelector('#labelCheckModified');
const checkModifiedAscDesc = document.querySelector('#labelModifiedAscDesc');


const clearSortFilter = function () {
    // clear all other sort and filter options
 
}

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
            sortDocs();
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
            sortDocs();
            sortModifiedState = 0;
            checkSortModified.classList.toggle('fa-square-check');
            checkSortModified.classList.toggle('fa-square');
            checkModifiedAscDesc.classList.toggle('fa-arrow-down-wide-short');
            checkModifiedAscDesc.classList.toggle('fa-arrow-up-wide-short');
            break;
    }
});