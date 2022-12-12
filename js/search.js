let inSearchMode = false;
const searchBar = document.querySelector('#search-bar');
let searchResult = [];

////search 
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


    searchBar.addEventListener('input', (e) => {   
    if(searchBar.value !== '') {
        docDiv.innerHTML = "";
        let searchTerm = e.target.value.trim().toLowerCase();
        localStorage.setItem('previous-searchterm', searchTerm);
        searchResult = documentsArray.filter(myDoc => myDoc.Text.toLowerCase().includes(searchTerm) || myDoc.title.toLowerCase().includes(searchTerm));
        for (let i = 0; i < searchResult.length; i++) {
            //highlight text?
            //change textpreview to display substring where searchTerm is
            if(searchResult[i].Text.toLowerCase().includes(searchTerm)) {
                hiddenEL.innerHTML = searchResult[i].Text;
                const cleanText = hiddenEL.textContent.replace(/\s{2,}/g,' ').trim();

                let textIndex = cleanText.toLowerCase().search(searchTerm);
                let slicedText = cleanText.substring(textIndex, (textIndex + 20));
                searchResult[i].textPreview = slicedText;
                console.log('search array',searchResult[i].textPreview, documentsArray[i].textPreview)
                console.log('index effected by if' , i)
            }

            let currentSearch = searchResult.findIndex(searchEl => searchEl.id == currentDoc)

            if(currentSearch == -1) {
            currentDoc = searchResult[0].id;
            } else {
                currentDoc == searchResult[currentSearch].id;
            }
            loadAside(searchResult);

        }
        console.log('searchjs ' , searchResult[0].textPreview, documentsArray[0].textPreview)
        inSearchMode = true;
        console.log(inSearchMode)
    } else if (searchBar.value == '' || searchBar.value == 'Search') {
        console.log('empty')
        editorStoreValue();
        loadAside();
        inSearchMode = false;
        console.log(inSearchMode)
    }

    })  



let hiddenEL = document.createElement('div');
hiddenEL.id = 'convertToText';
// hiddenEL.style.display = 'none';
const bodyEl = document.querySelector('body');
hiddenEL.style.display = 'none';
bodyEl.appendChild(hiddenEL); 


search();
