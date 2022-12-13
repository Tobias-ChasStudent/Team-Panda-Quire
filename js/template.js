const modal = document.getElementById("myModal");
const btn = document.getElementById("createDoc");
const span = document.getElementsByClassName("close")[0];
const modalButtons = document.querySelectorAll('#myModal section')

let url = "json/template.json"

const applyTemplates = (data, template) => {
    console.log('in apllytemp',data)
    if (template == "recipetemplate") {
        createDoc(data[template]);

    } else if (template == "cvtemplate") {
        createDoc(data[template]);

    } else if (template == "lettertemplate") {
        createDoc(data[template]);

    } else if (template == "newdocument") {
        console.log(data[template])

        createDoc(data[template]);
    }
    modal.close();
    displayTagsInEditor(currentDoc);
}

async function getObjData(template) {
    let response = await fetch(url);
    if (response.ok) {
        let data = await response.json();
        console.log('in async',data, template)

        applyTemplates(data, template)
    }
}


for (let i = 0; i < modalButtons.length; i++) {
    modalButtons[i].addEventListener('click', (e) => {
        const template = e.target.id;
        getObjData(template)
    })
}

btn.onclick = function () {
    modal.showModal();
}

span.onclick = function () {
    modal.close();
}





