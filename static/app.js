const labelSelect = document.getElementById('sel-label');
const wrapper = document.getElementById('wrapper');
const form = document.getElementById('form');
const button = document.getElementById('btn');

/**
 * Load a template
 */
if (labelSelect) {
    labelSelect.onchange = function loadTemplate() {
        fetch(window.location.pathname + '/static/labels/' + labelSelect.value + '.html')
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
                buildDate();
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
                alert(error)
            })
        ;
    };
    labelSelect.onchange(); // first load
}


// let datePicker = document.createElement('input');

// // Set the type to 'date'
// datePicker.type = 'date';

// // Set other properties
// datePicker.id = 'datePicker';
// datePicker.value = '2023-08-10';
// datePicker.min = '2020-01-01';
// datePicker.max = '2025-12-31';
/**
 * Create the input form for the loaded template
 */
function buildForm() {
    const inputs = wrapper.querySelectorAll('.input');
    form.innerHTML = '';

    const currentDate = new Date();
    const currentDateString = currentDate.toString();

    // inputs is the preview
    // inp is the form
    for (let input of inputs) {

        console.log(input.classList);
        let inp;
        if (input.classList.contains('date')) {
            inp = document.createElement('input');
            inp.type = 'date';
            console.log("this is a date object");
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');  // Get day and format to 2 digits
            let mm = String(today.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and format to 2 digits
            let yyyy = today.getFullYear();
            inp.value = yyyy + '-' + mm + '-' + dd;
            input.innerText = inp.value;
        } else {
            inp = document.createElement('textarea');
        }

        if (input.dataset.value) {
            console.log("if");
            inp.placeholder = input.dataset.value;
            console.log(input.date);
            if (input.date) {
                inp.placeholder = input.date;
                inp.value = input.date;
                inp.dataset.value = input.date;
            }

            inp.oninput = function () {
                input.dataset.value = inp.value;
                if (input.date) {
                    inp.placeholder = input.date;
                    inp.value = input.date;
                    inp.dataset.value = input.date;
                }

                if (input.qrcode) {
                    input.qrcode.makeCode(inp.value);
                }
            };
        } else {
            console.log("else");
            inp.placeholder = input.innerText;
            inp.oninput = function () {
                input.innerText = inp.value;
            };
        }
        form.appendChild(inp);
    }
    // Create a new checkbox input element
    const red_check = document.createElement('input');

    // Set the type to 'checkbox'
    red_check.type = 'checkbox';

    // Optionally, set other attributes
    red_check.id = 'allow_red';
    red_check.value = 'false';

    // Optionally, create and append a label
    const label = document.createElement('label');
    label.htmlFor = red_check.id;
    label.appendChild(documemyCheckboxnt.createTextNode('Using Red/Black Paper? Yes or No?'));

    // Append the checkbox and label to the parent element
    form.appendChild(red_check);
    form.appendChild(label);

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

            // Capture the checkbox value
            const checkboxValue = document.getElementById('allow_red').checked;
            fd.append('allow_red', checkboxValue);  // Add checkbox value to FormData

            console.log(fd);
            // TODO: do something here to pass down whether to print red or not
            return fetch(window.location.pathname + '/print', {
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
        alert("label printed")
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

