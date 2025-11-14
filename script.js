import { codes } from './codes.js';

// Calling API----------------------------------------------------------------------------------------------------------------
const url = "https://latest.currency-api.pages.dev/v1/currencies/eur.json";

async function callAPI(fromCurr, toCurr) {

    let response = await fetch(url);
    let data = await response.json();
    document.querySelector('.lastUpdate').innerText = ("Last updated on: " + data.date);
    return [data.eur[fromCurr.toLowerCase()], data.eur[toCurr.toLowerCase()]];
};

const fromCurrSelect = document.querySelector('.fromCurrSelect');
const toCurrSelect = document.querySelector('.toCurrSelect');
const fromCurrName = document.querySelector('.fromCurrName');
const toCurrName = document.querySelector('.toCurrName');
const input = document.querySelector('.inputAmt');


async function update (fromCurr, toCurr, inpVal) {

    //eurVal[0] -> EUR equivalent of from currency
    //eurVal[1] -> EUR equivalent of to currency
    let eurVal = await callAPI(fromCurr, toCurr);
    document.querySelector('.value').innerText = Number(((eurVal[1] / eurVal[0]) * (inpVal))).toFixed(4);

    const equiv = document.querySelector('.equivalenceDiv');
    let equivHTML = "1&nbsp;&nbsp;";
    equivHTML += (fromCurrName.innerHTML + "&nbsp;&nbsp=&nbsp;&nbsp;");
    equivHTML += (Number(((eurVal[1] / eurVal[0]))).toFixed(4) + "&nbsp;&nbsp;");
    equivHTML += (toCurrName.innerHTML);
    equiv.innerHTML = equivHTML;
}

async function updateValue() {

    let fromCurrVal = fromCurrSelect.dataset.value;
    let toCurrVal = toCurrSelect.dataset.value;

    console.log(fromCurrVal + " " + toCurrVal);

    await update(fromCurrVal, toCurrVal, input.value);
}

// Adding currency names and flags-------------------------------------------------------------------------------------------------------

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

document.querySelector('.fromList').innerHTML = fromListHTML;
document.querySelector('.toList').innerHTML = toListHTML;

// To open list and input box on click----------------------------------------------------------------------------------------------------

//to give input to enter curreny name and show list of available currenices
fromCurrName.addEventListener('click', (e) => {

    e.stopPropagation();//This excludes this area for 'Close the list when clicked anywhere'

    fromCurrName.style.display = 'none'; //hides the current currency block
    const input = document.querySelector('.inputFromCurrName');
    input.style.display = 'inline'; //diplays input to enter currency name
    input.focus(); //autofocuses input
    document.querySelector('.fromList').style.visibility = 'visible'; //makes the currency list visible
});

//to give input to enter curreny name and show list of available currenices
toCurrName.addEventListener('click', (e) => {

    e.stopPropagation();//This excludes this area for 'Close the list when clicked anywhere'

    toCurrName.style.display = 'none'; //hides the current currency block
    const input = document.querySelector('.inputToCurrName');
    input.style.display = 'inline'; //diplays input to enter currency name
    input.focus(); //autofocuses input
    document.querySelector('.toList').style.visibility = 'visible'; //makes the currency list visible
});

// Closing lists--------------------------------------------------------------------------------------------------------------------------

function closeLists() {
    
    document.querySelector('.inputFromCurrName').style.display = 'none'; //hides the input
    document.querySelector('.fromList').style.visibility = 'hidden'; //hide the list of currencies
    fromCurrName.style.display = 'flex'; //display the current currency block

    document.querySelector('.inputToCurrName').style.display = 'none'; //hides the input
    document.querySelector('.toList').style.visibility = 'hidden'; //hide the list of currencies
    toCurrName.style.display = 'flex'; //display the current currency block

    document.querySelector('.inputToCurrName').value = ""; //remove previously written text
    document.querySelector('.inputFromCurrName').value = ""; //remove previously written text

    //restore hidden list items
    for(let i = 0; i < 157; i++) {

        document.querySelector(`.toOption${i}`).style.display = '';
        document.querySelector(`.fromOption${i}`).style.display = '';
    }
}

//Hide the list of currencies when clicked anywhere
document.body.addEventListener('click', (e) => {
    
    closeLists();
})

//Selecting currencies from lists-------------------------------------------------------------------------------------------------------------

for (let i = 0; i < 157; i++) {

    const fromOption = document.querySelector(`.fromOption${i}`);
    fromOption.addEventListener('click', async (e) => {
        
        fromCurrName.innerHTML = fromOption.innerHTML;
        fromCurrSelect.setAttribute('data-value', (document.querySelector(`.fromCurrName${i}`).innerText));
        closeLists();

        updateValue();
    });

    const toOption = document.querySelector(`.toOption${i}`);
    toOption.addEventListener('click',  async () => {

        toCurrName.innerHTML = toOption.innerHTML;
        toCurrSelect.setAttribute('data-value', (document.querySelector(`.toCurrName${i}`).innerText));
        closeLists();

        updateValue();
    });
}

// Stop propagation of click from input boxes

document.querySelector('.inputToCurrName').addEventListener('click', (e) => {
    
    e.stopPropagation();
});

document.querySelector('.inputFromCurrName').addEventListener('click', (e) => {
    
    e.stopPropagation();
});

// Match input currency name-------------------------------------------------------------------------------------------------------------

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

document.addEventListener('input', (e) => {

    if (!e.target.matches('.inputToCurrName')) 
        return;

    for (let i = 0; i < 157; i++) {

        const toOption = document.querySelector(`.toCurrName${i}`);

        if(toOption.innerText.toLowerCase().includes(e.target.value.toLowerCase()))
            document.querySelector(`.toOption${i}`).style.display = '';

        else
            document.querySelector(`.toOption${i}`).style.display = 'none';
    }
});

// Update currency equivalent as soon as value entered-----------------------------------------------------------------------------------

input.addEventListener('input', async () => {

    updateValue();
});


// Functioning of exchange button---------------------------------------------------------------------------------------------------------
const exchange = document.querySelector('.exchangeSvg');

exchange.addEventListener('click', async () => {

    let temp1 = fromCurrSelect.dataset.value;
    fromCurrSelect.dataset.value = toCurrSelect.dataset.value;
    toCurrSelect.dataset.value = temp1;

    let temp2 = fromCurrName.innerHTML;
    fromCurrName.innerHTML = toCurrName.innerHTML;
    toCurrName.innerHTML = temp2;

    updateValue();
});


// Dark mode toggle logic-----------------------------------------------------------------------------------------------------------------
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
