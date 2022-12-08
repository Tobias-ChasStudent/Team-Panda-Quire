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
        let searchResult = documentsArray.filter(myDoc => myDoc.Text.toLowerCase().includes(searchTerm) || myDoc.title.toLowerCase().includes(searchTerm));
        for (let i = 0; i < searchResult.length; i++) {
            //highlight text?
            //change textpreview to display substring where searchTerm is
            if(searchResult[i].Text.toLowerCase().includes(searchTerm) && !searchResult[i].textPreview.toLowerCase().includes(searchTerm)) {
                let hiddenEL = document.createElement('div');
                hiddenEL.style.display = 'none';
                document.getElementsByTagName('body').appendChild(hiddenEL);
                
                let textIndex = searchResult[i].Text.search(searchTerm);
                let slicedText = searchResult[i].Text.textContent.substring(textIndex, (textIndex + 20));
                searchResult[i].textPreview = slicedText;
            } 

            let currentSearch = searchResult.findIndex(searchEl => searchEl.id == currentDoc)

            if(currentSearch == -1) {
            currentDoc = searchResult[0].id;
            } else {
                currentDoc == searchResult[currentSearch].id;
            }
             

            loadAside(searchResult);
        }
    } else {
        console.log('empty')
        loadAside();
    }
    })  

search();