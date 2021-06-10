let page = 2;
const appointment = {
    name: '',
    date: '',
    hour: '',
    services: []
}

document.addEventListener('DOMContentLoaded', function() {
    startApp();
});

function startApp() {
    // All functions here...
    showServices();
    showSection();
    changeTabs();
    pageButtons();
    hiddenButtons();
    clientName();
    clientDate();
    unableLastDay();
    clientTime();
    emptyAlert('',''); // White espace to avoid undefined
    showOverview();
}

let alert = document.createElement('p');

function emptyAlert(text, color) {

    alert.classList.remove('d-none')
    alert.classList.remove('red-alert')
    alert.classList.remove('green-alert')

    alert.textContent = `${text}`;
    alert.classList.add(`${color}-alert`);

    const divTab = document.querySelector(`#tab-${page}`);
    divTab.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('d-none')
    }, 5000)
}

function clientName() {
    formName = document.querySelector('#name');

    formName.addEventListener('input', e => {
        const clientName = e.target.value.trim()

        if (clientName === '' || clientName.length < 3) {
            emptyAlert('Invalid name, too short, unless you are E.T. (I want to go home too)','red')
        } else {
            appointment.name = clientName;
            emptyAlert("That's right, now fill the others please :)",'green')
        }
    })
}

function clientDate() {
    formDate = document.querySelector('#date');

    formDate.addEventListener('input', e => {
        const actualDay = new Date(e.target.value).getUTCDay();

        // No labor days
        if ([3].includes(actualDay)) {
            
            e.preventDefault();
            formDate.value = '';
            emptyAlert('Sorry. We don\'t work on Wednesday :(','red')
        } else {
            appointment.date = formDate.value;
        }

    })
}

function clientTime() {
    formTime = document.querySelector('#time');

    formTime.addEventListener('input', e => {
        
        const chosenTime = e.target.value;
        const chosenHour = chosenTime.split(':');

        if (chosenHour[0] < 09 || chosenHour[0] > 18) {
            emptyAlert('Sorry. We\'re closed at that time :(','red')
            formTime.value = '';
        } else {
            appointment.hour = chosenTime
            emptyAlert("Perfect time :)",'green')
            console.log(appointment)
        }
    })
}

function addService(serviceObj) {
    const {services} = appointment;

    appointment.services = [...services, serviceObj]
}

function removeService(id) {
    const {services} = appointment;
    appointment.services = services.filter( service => service.id !== id);
}

function hiddenButtons() {
    const backButton = document.querySelector('#back-btn');
    const nextButton = document.querySelector('#next-btn');
    if (page === 1) {
        nextButton.classList.remove('hide');
        backButton.classList.add('hide');
    } else if (page === 3) {
        backButton.classList.remove('hide');
        nextButton.classList.add('hide');

        showOverview();
    } else {
        backButton.classList.remove('hide');
        nextButton.classList.remove('hide');
    }
}

function pageButtons() {
    const backButton = document.querySelector('#back-btn');
    const nextButton = document.querySelector('#next-btn');

    backButton.addEventListener('click', backPage)
    nextButton.addEventListener('click', nextPage)
}

function backPage() {
    if (page <= 3 && page >= 2) {
        page--;
        document.querySelector('.show-section').classList.remove('show-section');
        document.querySelector('.active').classList.remove('active');
        showSection();
    }
}

function nextPage() {
    if (page <= 2 && page >= 1) {
        page++;
        document.querySelector('.show-section').classList.remove('show-section');
        document.querySelector('.active').classList.remove('active');
        showSection();
    }
}

function showSection() {
    const actualSection = document.querySelector(`#tab-${page}`);
    actualSection.classList.add('show-section');

    // Add different style to current tab
    const tab = document.querySelector(`[data-tab="${page}"]`);
    tab.classList.add('active');
    hiddenButtons();
}

function changeTabs() {
    const tabs = document.querySelectorAll('.tabs button');
    tabs.forEach(tab => {
        tab.addEventListener('click', e => {
            e.preventDefault();

            page = parseInt(e.target.dataset.tab);

            document.querySelector('.show-section').classList.remove('show-section');
            document.querySelector('.active').classList.remove('active');
            
            const section = document.querySelector(`#tab-${page}`);
            section.classList.add('show-section');
            const tab = document.querySelector(`[data-tab="${page}"]`);
            tab.classList.add('active');
            hiddenButtons();
        })
    })
}

async function showServices() {
    try {
        const file = await fetch('./servicios.json');
        const db = await file.json();

        const { servicios } = db;

        servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio
            
            /* DOM Scripting */
            const serviceName = document.createElement('p');
            serviceName.textContent = nombre;
            serviceName.classList.add('service-name');

            const servicePrice = document.createElement('p');
            servicePrice.textContent = `$ ${precio} MXN`;
            servicePrice.classList.add('service-price');

            const serviceContainer = document.createElement('div');
            serviceContainer.classList.add('service');

            serviceContainer.onclick = clickService;
            serviceContainer.dataset.serviceId = id;

            serviceContainer.appendChild(serviceName);
            serviceContainer.appendChild(servicePrice);

            const serviceList = document.querySelector('.services-list');
            serviceList.appendChild(serviceContainer);
        });

    } catch (error) {
        console.log(error)
    }
}

function clickService(e) {
    let element;

    if (e.target.tagName === 'P') {
        element = e.target.parentElement;
    } else {
        element = e.target;
    }

    if (element.classList.contains('select')) {
        element.classList.remove('select');
    
        const id = parseInt(element.dataset.serviceId)
        removeService(id);
    } else {
        element.classList.add('select');

        const serviceObj = {
            id: parseInt(element.dataset.serviceId),
            name: element.firstChild.textContent,
            price: element.firstChild.nextElementSibling.textContent
        }

        addService(serviceObj);
    }
}

function unableLastDay() {
    const inputForm = document.querySelector('#date')

    const actualDay = new Date();
    const year = actualDay.getFullYear();
    const month = actualDay.getMonth() + 1;
    const day = actualDay.getDate() + 1;

    // Format YYYY-MM-DD, we need two digits, adding with ternary operator
    const minDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
    inputForm.min = minDate;
}

function showOverview() {
    const overviewDiv = document.querySelector('.overview-content')
    // overviewDiv.innerHTML = '';
    while (overviewDiv.firstChild) {
        overviewDiv.removeChild(overviewDiv.firstChild);
    }

    const headingInfo = document.createElement('h3')
    const headingServices = document.createElement('h3')

    headingInfo.textContent = 'Contact information';
    headingServices.textContent = 'Chosen services';
    overviewDiv.appendChild(headingInfo)
    headingInfo.classList.add('d-none')

    const msg = document.createElement('p');
    msg.classList.add('overview-text');
    msg.classList.add('text-center');
    overviewDiv.appendChild(msg);

    if(Object.values(appointment).includes('')){
        msg.textContent = 'You must fill all the fields to see this section...';
        return;
    }

    headingInfo.classList.remove('d-none')
    msg.classList.remove('text-center');
    const {name, date, hour, services} = appointment;

    msg.innerHTML = `<strong>Name:</strong> ${name}. <br>
    <strong>Date:</strong> ${date}. <br>
    <strong>Hour:</strong> ${hour}. <br>`

    const servicesList = document.createElement('ul');
    servicesList.classList.add('overview-list')

    total = 0
    services.forEach(service => {
        const { name, price } = service;
        const serviceItem = document.createElement('li');
        serviceItem.classList.add('overview-item')
        serviceItem.innerHTML = `${name}. <br> <strong>${price}</strong>`;
        servicesList.appendChild(serviceItem);

        // Sum of total amount
        priceArray = price.split(' ');

        total += parseInt(priceArray[1]);
    });
    const totalAmount = document.createElement('p');
    totalAmount.innerHTML = `<strong>Total:</strong> $ ${total} MXN`;
    totalAmount.classList.add('total')

    overviewDiv.appendChild(headingServices);
    overviewDiv.appendChild(servicesList);
    overviewDiv.appendChild(totalAmount)
}