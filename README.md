# Brother Label Printer UI

This is a very simple web interface to create text labels on a Brother QL series label printers supported by [pklaus/brother_ql](https://github.com/pklaus/brother_ql).

## Installation

Create a virtual environment and install the requirements

    $> virtualenv3 env
    $> . env/bin/activate
    $env> pip install -r requirements.txt

## Running

Start the server by providing the model and connection string

    $env> ./app.py --model QL-500 tcp://192.168.1.1:9100

Run `app.py -h` for more info.

## Using

Open your browser on the shown URL (defaults to `http://127.0.0.1:8013/`). The application uses modern JavaScript (promises, blobs, etc) and requires a modern browser. It was tested with Chrome only, but probably works in Firefox, too.

## Label Templates

Labels are based on HTML templates located in the `static/labels/` directory. Templates need to start with a supported label size followed by an underscore. See [pklaus/brother_ql](https://github.com/pklaus/brother_ql) for a list of supported sizes.

The templates need to contain exactly one root element, specifying the exact size of the label in pixels (again, check the above site for proper values).

Elements containing an `input` class can be edited through the form.

## Feedback

Please feel free to submit feedback in the form of pull requests.

## Credits

Many thanks to the following projects:

* [pklaus/brother_ql](https://github.com/pklaus/brother_ql)
* [tsayen/dom-to-image](https://github.com/tsayen/dom-to-image)
* [oxalorg/sakura](https://github.com/oxalorg/sakura)