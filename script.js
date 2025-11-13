import { codes } from './codes.js';

const url = "https://latest.currency-api.pages.dev/v1/currencies/eur.json";

let data;

async function callAPI(fromCurr, toCurr) {

    let response = await fetch(url);
    data = await response.json();
    document.querySelector('.lastUpdate').innerText = ("Last updated on: " + data.date);
    return [data.eur[fromCurr.toLowerCase()], data.eur[toCurr.toLowerCase()]];
};

async function update (fromCurr, toCurr, value) {

    let x = await callAPI(fromCurr, toCurr);
    value = Number(((x[1] / x[0]) * (input.value))).toFixed(4);
    document.querySelector('.value').innerText = value;

    let equiv = document.querySelector('.equivalenceDiv');
    let equivHTML = "1&nbsp;&nbsp;";
    equivHTML += (fromCurrSelect.innerHTML + "&nbsp;&nbsp=&nbsp;&nbsp;");
    equivHTML += (Number(((x[1] / x[0]))).toFixed(4) + "&nbsp;&nbsp;");
    equivHTML += (toCurrSelect.innerHTML);
    equiv.innerHTML = equivHTML;
}

let fromList = document.querySelector('.fromList');
let toList = document.querySelector('.toList');

let id = 0;

let fromListHTML =  `<div class="fromOptions fromOption0">
                        <img class="flags" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/330px-Flag_of_Europe.svg.png" alt="flag">
                        <div class="fromCurrNames fromCurrName0">EUR</div>
                    </div>`;

let toListHTML =    `<div class="toOptions toOption0">
                        <img class="flags" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/330px-Flag_of_Europe.svg.png" alt="flag">
                        <div class="toCurrNames toCurrName0">EUR</div>
                    </div>`;

id++;

for (let curr in codes) {

    fromListHTML += `<div class="fromOptions fromOption${id}">
                        <img class="flags" src="https://flagsapi.com/${codes[curr][0]}/flat/64.png" alt="flag">
                        <div class="fromCurrNames fromCurrName${id}">${curr.toUpperCase()}</div>
                    </div>`;

    toListHTML += `<div class="toOptions toOption${id}">
                        <img class="flags" src="https://flagsapi.com/${codes[curr][0]}/flat/64.png" alt="flag">
                        <div class="toCurrNames toCurrName${id}">${curr.toUpperCase()}</div>
                    </div>`;

    id++;
}

fromList.innerHTML = fromListHTML;
toList.innerHTML = toListHTML;

let fromCurrSelect = document.querySelector('.fromCurrSelect');
let toCurrSelect = document.querySelector('.toCurrSelect');

let isFromDropped = false;
let isToDropped = false;

let prevFromInnerHTML;
let prevToInnerHTML;

fromCurrSelect.addEventListener('click', () => {

    if (isFromDropped == false) {

        document.querySelector('.fromList').style.visibility = 'visible';
        isFromDropped = true;
        prevFromInnerHTML = fromCurrSelect.innerHTML;
        fromCurrSelect.innerHTML = '<input class="inputFromCurrName" width="100px" type="text" placeholder="Currency" autofocus>';
        document.querySelector('.inputFromCurrName').style.display = 'inline';
        document.querySelector('.inputFromCurrName').focus();
    }

    else {

        document.querySelector('.fromList').style.visibility = 'hidden';
        isFromDropped = false;
        fromCurrSelect.innerHTML = prevFromInnerHTML;
        for(let i = 0; i < 157; i++)
        document.querySelector(`.fromOption${i}`).style.display = '';
    }
});
        
document.addEventListener('input', (e) => {

    if (!e.target.matches('.inputFromCurrName')) 
        return;

    for (let i = 0; i < 157; i++) {

        const fromOption = document.querySelector(`.fromCurrName${i}`);

        if(fromOption.innerText.toLowerCase().includes(e.target.value.toLowerCase()))
            document.querySelector(`.fromOption${i}`).style.display = '';

        else
            document.querySelector(`.fromOption${i}`).style.display = 'none';
    }
});

toCurrSelect.addEventListener('click', () => {

    if (isToDropped === false) {

        document.querySelector('.toList').style.visibility = 'visible';
        isToDropped = true;
        prevToInnerHTML = toCurrSelect.innerHTML;
        toCurrSelect.innerHTML = '<input class="inputToCurrName" width="100px" type="text" placeholder="Currency" autofocus>';
        document.querySelector('.inputToCurrName').style.display = 'inline';
        document.querySelector('.inputToCurrName').focus(); 
    }

    else {

        document.querySelector('.toList').style.visibility = 'hidden';
        isToDropped = false;
        toCurrSelect.innerHTML = prevToInnerHTML;
        for(let i = 0; i < 157; i++)
        document.querySelector(`.toOption${i}`).style.display = '';
    }
});

document.addEventListener('input', (e) => {

    if (!e.target.matches('.inputToCurrName')) 
        return;

    for (let i = 0; i < 157; i++) {

        const fromOption = document.querySelector(`.toCurrName${i}`);

        if(fromOption.innerText.toLowerCase().includes(e.target.value.toLowerCase()))
            document.querySelector(`.toOption${i}`).style.display = '';

        else
            document.querySelector(`.toOption${i}`).style.display = 'none';
    }
});

for (let i = 0; i < 157; i++) {

    let fromOption = document.querySelector(`.fromOption${i}`);

    fromOption.addEventListener('click', async (e) => {
        
        fromCurrSelect.innerHTML = fromOption.innerHTML;
        prevFromInnerHTML = fromCurrSelect.innerHTML;
        fromCurrSelect.setAttribute('data-value', (document.querySelector(`.fromCurrName${i}`).innerText));
        document.querySelector('.fromList').style.visibility = 'hidden';

        let fromCurr = fromCurrSelect.dataset.value;
        let toCurr = toCurrSelect.dataset.value;
        let value;

        await update(fromCurr, toCurr, value);
    });

    let toOption = document.querySelector(`.toOption${i}`);

    toOption.addEventListener('click',  async () => {

        toCurrSelect.innerHTML = toOption.innerHTML;
        prevToInnerHTML = toCurrSelect.innerHTML;
        toCurrSelect.setAttribute('data-value', (document.querySelector(`.toCurrName${i}`).innerText));
        document.querySelector('.toList').style.visibility = 'hidden';

        let fromCurr = fromCurrSelect.dataset.value;
        let toCurr = toCurrSelect.dataset.value;
        let value;

        await update(fromCurr, toCurr, value);
    });
}

document.querySelector('.amount').addEventListener('click', () => {

    fromCurrSelect.innerHTML = prevFromInnerHTML;
    for(let i = 0; i < 157; i++)
    document.querySelector(`.fromOption${i}`).style.display = '';
    document.querySelector('.fromList').style.visibility = 'hidden';

    toCurrSelect.innerHTML = prevToInnerHTML;
    for(let i = 0; i < 157; i++)
    document.querySelector(`.toOption${i}`).style.display = '';
    document.querySelector('.toList').style.visibility = 'hidden';
});

let input = document.querySelector('.inputAmt');

input.addEventListener('input', async () => {

    let fromCurr = fromCurrSelect.dataset.value;
    let toCurr = toCurrSelect.dataset.value;
    let value;

    await update(fromCurr, toCurr, value);
});

let exchange = document.querySelector('.exchangeSvg');

exchange.addEventListener('click', async () => {

    let temp1 = fromCurrSelect.dataset.value;
    fromCurrSelect.dataset.value = toCurrSelect.dataset.value;
    toCurrSelect.dataset.value = temp1;

    let temp2 = fromCurrSelect.innerHTML;
    fromCurrSelect.innerHTML = toCurrSelect.innerHTML;
    toCurrSelect.innerHTML = temp2;

    prevFromInnerHTML = fromCurrSelect.innerHTML;
    prevToInnerHTML = toCurrSelect.innerHTML;

    let fromCurr = fromCurrSelect.dataset.value;
    let toCurr = toCurrSelect.dataset.value;
    let value;

    await update(fromCurr, toCurr, value);
});

let isLight = true;

let toggleButton = document.querySelector('.darkModeToggle');

toggleButton.addEventListener('click', () => {

    document.body.classList.toggle('dark');
    let circle = document.querySelector('.circle');
    let darkModeToggle = document.querySelector('.darkModeToggle');

    if(isLight === true) {

        isLight = false;
        circle.style.animation = 'none'; 
        darkModeToggle.style.animation = 'none';
        void circle.offsetWidth; 
        void darkModeToggle.offsetWidth;
        circle.style.animation = 'toggleCircle 500ms ease-in-out 0s forwards';
        darkModeToggle.style.animation = 'toggleDiv 500ms ease-out 0s forwards';
    }

    else {
        
        isLight = true;
        circle.style.animation = 'none'; 
        darkModeToggle.style.animation = 'none';
        void circle.offsetWidth; 
        void darkModeToggle.offsetWidth;
        circle.style.animation = 'toggleCircle 500ms ease-in-out 0s reverse forwards';
        darkModeToggle.style.animation = 'toggleDiv 500ms ease-out 0s reverse forwards';
    }
});
