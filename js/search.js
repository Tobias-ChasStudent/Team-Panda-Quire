let inSearchMode = false;
const searchBar = document.querySelector('#search-bar');
let searchResult = [];

////search 
function search() {
    searchBar.addEventListener('click', () => {
            let previousSearchterm = localStorage.getItem('previous-searchterm');
            if(previousSearchterm !== '' && searchBar.value !== '') {
                searchBar.value = previousSearchterm;
            } else if (previousSearchterm == '' || searchBar.value == 'Search') { 
            searchBar.value = ''; 
            loadAside(documentsArray);
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
    }
    
    sessionStorage.setItem('reloaded', 'yes'); 
    documentsArray = JSON.parse(localStorage.getItem("Documents"))
    
    searchBar.addEventListener('input', (e) => {   
    if(searchBar.value !== '') {
        docDiv.innerHTML = "";
        let searchTerm = e.target.value.trim().toLowerCase();
        localStorage.setItem('previous-searchterm', searchTerm);
        searchResult = documentsArray.filter(myDoc => myDoc.Text.toLowerCase().includes(searchTerm) || myDoc.title.toLowerCase().includes(searchTerm));
        
        if(searchResult.length == 0) {
            // load currentdoc to aside
            let index = documentsArray.findIndex(el => el.id == currentDoc)
            loadAside([documentsArray[index]])

            let notFoundEl = document.createElement('p');
            notFoundEl.textContent = "No search results"
            notFoundEl.style.margin = '1rem'
            notFoundEl.style.textAlign = 'center'
            notFoundEl.style.fontSize = '1.5rem'
            docDiv.appendChild(notFoundEl)
        }


        for (let i = 0; i < searchResult.length; i++) {
            //change textpreview to display substring where searchTerm is
            if(searchResult[i].Text.toLowerCase().includes(searchTerm)) {
                hiddenEL.innerHTML = searchResult[i].Text;
                const cleanText = hiddenEL.textContent.replace(/\s{2,}/g,' ').trim();

                let textIndex = cleanText.toLowerCase().search(searchTerm);
                let slicedText = cleanText.substring(textIndex, (textIndex + 25));
                searchResult[i].textPreview = slicedText;
            } 
            loadAside(searchResult);

        }
        inSearchMode = true;
    } else if (searchBar.value == '' || searchBar.value == 'Search') {
        editorStoreValue();
        loadAside(documentsArray);
        inSearchMode = false;
    }

    })  

let hiddenEL = document.createElement('div');
hiddenEL.id = 'convertToText';
const bodyEl = document.querySelector('body');
hiddenEL.style.display = 'none';
bodyEl.appendChild(hiddenEL); 

search();
