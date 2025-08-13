const labelSelect = document.getElementById('sel-label');
const wrapper = document.getElementById('wrapper');
const form = document.getElementById('form');
const button = document.getElementById('btn');
const downloadButton = document.getElementById('btn-download');

const backendSelect = document.getElementById('sel-backend');
const printBackendUrl = backendSelect.options[backendSelect.selectedIndex].value;



/**
 * Load a template
 */
if (labelSelect) {
    labelSelect.onchange = function loadTemplate() {
        console.log(window.location);
        console.log(window.location.pathname + '/static/labels/' + labelSelect.value + '.html')
        fetch(window.location.origin + '/static/labels/' + labelSelect.value + '.html')
        // fetch(window.location.pathname + '/static/labels/' + labelSelect.value + '.html')
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

    // #### We dont need red/black checkbox now since it is embedded in the template
    // // Create a new checkbox input element
    // const red_check = document.createElement('input');
    // red_check.type = 'checkbox';
    // red_check.id = 'myCheckbox';
    // red_check.value = 'false';

    // // Optionally, create and append a label
    // const red_check_label = document.createElement('label');
    // red_check_label.htmlFor = red_check.id;
    // red_check_label.appendChild(document.createTextNode('Using Red/Black Paper? Yes or No?'));

    // // Append the checkbox and label to the parent element
    // form.appendChild(red_check);
    // form.appendChild(red_check_label);

    // Create a new number input element for count
    const countInput = document.createElement('input');
    countInput.type = 'number';
    countInput.id = 'countInput';
    countInput.name = 'count';
    countInput.value = '1'; // Default value
    countInput.min = '1'; // Minimum value to allow only positive numbers

    // Optionally, create and append a label for the count input
    const countLabel = document.createElement('label');
    countLabel.htmlFor = countInput.id;
    countLabel.appendChild(document.createTextNode('Count: '));

    // Append the count input and label to the form
    form.appendChild(countLabel);
    form.appendChild(countInput);

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
    console.log("saving dom to image!");
    console.log(node);
    domtoimage.toBlob(node, {
            bgcolor: '#ffffff'
        })
        .then(function (blob) {


            
            const fd = new FormData();
            fd.append('file', blob);

            // const reader = new FileReader();
            // reader.onload = function(event) {
            //     const base64Data = event.target.result;
            //     localStorage.setItem('savedImage', base64Data);
            //     console.log('Image saved to local storage');

            //     const dataUrl = event.target.result;

            //     // Create an anchor element
            //     const link = document.createElement('a');
            //     link.href = dataUrl;
            //     link.download = 'label.png';

            //     // Append the link to the body (required for Firefox)
            //     document.body.appendChild(link);

            //     // Programmatically click the link to trigger the download
            //     link.click();

            //     // Remove the link from the document
            //     document.body.removeChild(link);
            // };
            // reader.readAsDataURL(blob);
            // console.log(blob.data);

            // Capture the checkbox value
            // const checkboxValue = document.getElementById('myCheckbox').checked;
            // fd.append('allow_red', checkboxValue);  // Add checkbox value to FormData
            
            // TODO: handle the rotation with a checkbox or something
            should_rotate = document.getElementById("rotate").value === "true";
            tape_config = document.getElementById("tape_config").value;
            countValue = document.getElementById('countInput').value;

            fd.append('tape_config', tape_config);  // Add checkbox value to FormData
            fd.append('rotate', should_rotate);
            fd.append('count', countValue);
            
            console.log("DO THIS!");
            console.log(fd);
            const print_url_endpoint = printBackendUrl + '/print-label'
            console.log("Sending a print request to url: " + print_url_endpoint);
            const timeout = 3000; // 3 seconds
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            return fetch(print_url_endpoint, {
                method: 'POST',
                body: fd,
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));
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
        
        // Generate preview image for history
        domtoimage.toPng(node, {
                bgcolor: '#ffffff'
            })
            .then(function (dataUrl) {
                // Add to history with image preview
                const historySection = document.querySelector('.history tbody');
                const newRow = document.createElement('tr');
                
                // Preview cell with thumbnail
                const previewCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = dataUrl;
                img.style.maxWidth = '80px';
                img.style.maxHeight = '40px';
                img.style.objectFit = 'contain';
                img.style.border = '1px solid #e5e7eb';
                img.style.borderRadius = '4px';
                img.style.cursor = 'pointer';
                img.title = 'Click to view full size';
                
                // Click to view full size
                img.onclick = function() {
                    const modal = document.createElement('div');
                    modal.style.cssText = `
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background: rgba(0,0,0,0.8); display: flex; align-items: center;
                        justify-content: center; z-index: 1000; cursor: pointer;
                    `;
                    
                    const fullImg = document.createElement('img');
                    fullImg.src = dataUrl;
                    fullImg.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 8px;';
                    
                    modal.appendChild(fullImg);
                    modal.onclick = () => document.body.removeChild(modal);
                    document.body.appendChild(modal);
                };
                
                previewCell.appendChild(img);
                
                // Date cell
                const dateCell = document.createElement('td');
                dateCell.textContent = new Date().toLocaleString();
                
                // Label type cell
                const labelCell = document.createElement('td');
                labelCell.textContent = getSize();
                
                // Content cell
                const contentCell = document.createElement('td');
                const textarea = document.querySelector('textarea');
                contentCell.textContent = textarea ? textarea.value.trim() : '';
                contentCell.style.maxWidth = '200px';
                contentCell.style.overflow = 'hidden';
                contentCell.style.textOverflow = 'ellipsis';
                contentCell.style.whiteSpace = 'nowrap';
                contentCell.title = contentCell.textContent; // Show full text on hover
                
                newRow.appendChild(previewCell);
                newRow.appendChild(dateCell);
                newRow.appendChild(labelCell);
                newRow.appendChild(contentCell);
                
                historySection.insertBefore(newRow, historySection.firstChild);
            })
            .catch(function (error) {
                console.error('Failed to generate preview:', error);
                // Still add history entry without image
                const historySection = document.querySelector('.history tbody');
                const newRow = document.createElement('tr');
                
                const previewCell = document.createElement('td');
                previewCell.textContent = 'No preview';
                previewCell.style.color = '#9ca3af';
                
                const dateCell = document.createElement('td');
                dateCell.textContent = new Date().toLocaleString();
                
                const labelCell = document.createElement('td');
                labelCell.textContent = getSize();
                
                const contentCell = document.createElement('td');
                const textarea = document.querySelector('textarea');
                contentCell.textContent = textarea ? textarea.value.trim() : '';
                
                newRow.appendChild(previewCell);
                newRow.appendChild(dateCell);
                newRow.appendChild(labelCell);
                newRow.appendChild(contentCell);
                
                historySection.insertBefore(newRow, historySection.firstChild);
            });
};

/**
 * Download the label as an image
 */
if (downloadButton) {
    downloadButton.onclick = function () {
        const node = wrapper.querySelector(':first-child');
        console.log("downloading label as image!");
        
        domtoimage.toPng(node, {
                bgcolor: '#ffffff'
            })
            .then(function (dataUrl) {
                // Create filename with current date and label type
                const now = new Date();
                const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
                const labelType = getSize();
                const filename = `label-${labelType}-${timestamp}.png`;
                
                // Create download link
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                console.log(`Label downloaded as ${filename}`);
            })
            .catch(function (error) {
                console.error('Download failed:', error);
                alert('Failed to download label image');
            });
    };
}

