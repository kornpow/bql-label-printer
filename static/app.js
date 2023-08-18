const labelSelect = document.getElementById('sel-label');
const wrapper = document.getElementById('wrapper');
const form = document.getElementById('form');
const button = document.getElementById('btn');

/**
 * Load a template
 */
if (labelSelect) {
    labelSelect.onchange = function loadTemplate() {
        fetch('/static/labels/' + labelSelect.value + '.html')
            .then(function (response) {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Network response was not ok.');
            })
            .then(function (text) {
                wrapper.innerHTML = text;

                if (wrapper.firstChild.hasAttribute('data-scale')) {
                    wrapper.style.transform = 'scale(' + wrapper.firstChild.getAttribute('data-scale') + ')';
                } else {
                    wrapper.style.transform = '';
                }

                buildForm();
                buildQR();
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
                alert(error)
            })
        ;
    };
    labelSelect.onchange(); // first load
}

/**
 * Create the input form for the loaded template
 */
function buildForm() {
    const inputs = wrapper.querySelectorAll('.input');
    form.innerHTML = '';

    const currentDate = new Date();
    const currentDateString = currentDate.toString();

    for (let input of inputs) {

        let inp = document.createElement('textarea');

        if (input.dataset.value) {
            inp.placeholder = input.dataset.value;
            if (input.date) {
                inp.placeholder = input.date;
            }
            inp.oninput = function () {
                input.dataset.value = inp.value;
                if (input.qrcode) {
                    input.qrcode.makeCode(inp.value);
                }
            };
        } else {
            inp.placeholder = input.innerText;
            if (input.date) {
                inp.placeholder = input.date;
                inp.value = input.date;
            }
            inp.oninput = function () {
                input.innerText = inp.value;
            };
        }
        form.appendChild(inp);
    }
}

/**
 * Attach QR code handling
 */
function buildQR() {
    const inputs = wrapper.querySelectorAll('.qrcode');

    for (let input of inputs) {
        input.qrcode = new QRCode(input, {width: input.offsetWidth, height: input.offsetWidth});
        input.qrcode.makeCode(input.dataset.value);
    }
}

function buildDate() {
    const inputs = wrapper.querySelectorAll('.date');

    for (let input of inputs) {
        const currentDate = new Date();
        const currentDateString = currentDate.toString();
    
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed in JavaScript
        const day = String(currentDate.getDate()).padStart(2, '0');
    
        const customDateString = `${year}-${month}-${day}`;
        console.log(customDateString);  // e.g., '2021-08-04'


        input.date = customDateString;
    }
}


/**
 * Return the currently used label size
 *
 * @return {string}
 */
function getSize() {
    if(labelSelect) {
        return labelSelect.value.split('_')[0];
    } else {
        return FIXEDSIZE; // custom interfaces can set a global fixed size
    }
}

/**
 * Print the label
 */
button.onclick = function () {
    //const node = document.getElementById('label');
    const node = wrapper.querySelector(':first-child');
    console.log(node);
    domtoimage.toBlob(node)
        .then(function (blob) {
            const fd = new FormData();
            fd.append('data', blob);
            fd.append('size', getSize());

            return fetch('/print', {
                method: 'POST',
                body: fd
            });
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Printing failed');
            }
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
            alert(error)
        })
    ;

    /* debugging:
    domtoimage.toPng(node)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            document.body.appendChild(img);
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
    */
};

