const termService = document.querySelector('.term-service');
const modal = document.querySelector('.service-modal');
const modalClose = document.querySelector('.modal-close');
const modalContainer = document.querySelector('.modal-container');

// show service modal
function showTermOfServices() {
    modal.classList.add('open');
};

// hide service modal
function hideTermOfServices() {
    modal.classList.remove('open');
};

// call show function
termService.addEventListener('click', showTermOfServices);

// call hide function
modalClose.addEventListener('click', hideTermOfServices);

// hide modal when clicking out of modal area
modal.addEventListener('click', hideTermOfServices);
modalContainer.addEventListener('click', function (event) {
    event.stopPropagation()
});