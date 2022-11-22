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
infoCheckbox.addEventListener('click', () => {
    isChecked();
})

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

//scroll through modal content
const previousButton = document.querySelector('.previous-button');
const nextButton = document.querySelector('.next-button');
const cardIndex = document.querySelector('.card-index');

let slideIndex = 1;

previousButton.addEventListener('click', function() {
    plusDivs(-1);
});

nextButton.addEventListener('click', function() {
    plusDivs(1);
});

showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(slideIndex) {
  let i;
  let x = document.querySelectorAll(".my-slides");

  for(i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
}

  x[slideIndex-1].style.display = "block";  

  if(slideIndex==1) {
    previousButton.classList.add('hide');
  } else if(slideIndex > 1) {
    previousButton.classList.remove('hide');
  }
  
  if(slideIndex == x.length) {
    nextButton.classList.add('hide');
  } else if (slideIndex < x.length) {
    nextButton.classList.remove('hide');
  }

  //display where user is in info-content
  cardIndex.textContent = slideIndex + '/' + x.length;
}