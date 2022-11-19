//select modal elements
const openModalBtn = document.querySelector('.open-modal-btn');
const closeModalBtn = document.querySelector('.close-modal-btn');
const infoModal = document.querySelector('#info-modal');
const infoCheckbox = document.querySelector('#info-checkbox');

//open modal on default when entering page 
infoModal.showModal();

//open info-modal
openModalBtn.addEventListener('click', () => {
    infoModal.showModal();
})

//close info-modal
closeModalBtn.addEventListener('click', () => {
    infoModal.close();
})

//check if checkbox for dontshowagain is checked
function isChecked() {
if(infoCheckbox.checked) {
    localStorage.setItem('info-checkbox', 'true');
}
}

//remove modal next time if checkbox checked
const clickedInfoCheckbox = localStorage.getItem('info-checkbox');
if(clickedInfoCheckbox) {
    infoModal.close();
}

localStorage.clear();