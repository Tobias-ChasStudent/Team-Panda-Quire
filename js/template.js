
const modal = document.getElementById("myModal");
const btn = document.getElementById("createDoc");
const span = document.getElementsByClassName("close")[0];
const modalButtons = document.querySelectorAll('.modal-content section')

console.log(modalButtons.length)

console.log(modalButtons);
for (let i = 0; i < modalButtons.length; i++) {
    modalButtons[i].addEventListener('click', (e) => {
        console.log(e.target);
        getObjData(e.target.id)
        createDoc();
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
        //console.log(data);
        //console.log(data.cvtemplate)
        editor.innerHTML = data[template];

    }
}




console.log();


