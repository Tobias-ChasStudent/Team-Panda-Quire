const modal = document.getElementById("myModal");
const btn = document.getElementById("createDoc");
const span = document.getElementsByClassName("close")[0];
const modalButtons = document.querySelectorAll('#myModal section')

for (let i = 0; i < modalButtons.length; i++) {
    modalButtons[i].addEventListener('click', (e) => {
        getObjData(e.target.id)
        createDoc();

        if (e.target.id == "recipetemplate") {
            console.log("Recipe")
            docTitle.value = "Recipe";
        } else if (e.target.id == "cvtemplate") {
            docTitle.value = "Resume - Ben Dover";
        } else if (e.target.id == "lettertemplate") {
            docTitle.value = "Letter"
        } else if (e.target.id == "emptytemplate") {
            docTitle.value = "New Document"
            editor.innerHTML = ""
        }
        modal.close();
    })
}

btn.onclick = function () {
    modal.showModal();
}

span.onclick = function () {
    modal.close();
}

let url = "json/template.json"

async function getObjData(template) {
    let response = await fetch(url);
    if (response.ok) {
        let data = await response.json();
        editor.innerHTML = data[template];
    }
}



