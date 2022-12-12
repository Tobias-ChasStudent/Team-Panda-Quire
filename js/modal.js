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
  } else if (infoCheckbox.checked == false) {
    localStorage.setItem('info-checkbox', 'false');
  }
}

//remove modal next time if checkbox checked
const clickedInfoCheckbox = localStorage.getItem('info-checkbox');
if(clickedInfoCheckbox == "true") {
    infoModal.close();
    infoCheckbox.checked = true;
} else if(infoCheckbox.checked == "false") {
  infoCheckbox.showModal();
  infoCheckbox.checked = false;
}


//scroll through modal content
const previousButton = document.querySelector('.previous-button');
const previousButtonGhost = document.querySelector('.previous-button-ghost');
const nextButton = document.querySelector('.next-button');
const cardIndex = document.querySelector('.card-index');
const labelInfoCheckbox = document.querySelector('#label-info-checkbox');

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
    previousButtonGhost.classList.remove('hide');
  } else if(slideIndex > 1) {
    previousButton.classList.remove('hide');
    previousButtonGhost.classList.add('hide');
    previousButtonGhost.classList.add('make-invisible');
  }
  
  if(slideIndex == x.length) {
    nextButton.classList.add('hide');
    closeModalBtn.classList.remove('hide');
    infoCheckbox.classList.remove('hide');
    labelInfoCheckbox.classList.remove('hide');
    
  } else if (slideIndex < x.length) {
    nextButton.classList.remove('hide');
    closeModalBtn.classList.add('hide');
    infoCheckbox.classList.add('hide');
    labelInfoCheckbox.classList.add('hide');
  }

  cardIndex.innerHTML = null;

  for(i = 0; i < x.length; i++) {
    let navDot = document.createElement('div');
    navDot.className = "nav-dot";
    cardIndex.appendChild(navDot);
  }

  let navDotArray = Array.from(document.querySelectorAll('.nav-dot'));
  navDotArray[slideIndex-1].classList.add('nav-dot-current');
}