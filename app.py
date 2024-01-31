#!/usr/bin/env python

"""
Simple Web Interface to create labels on a Brother Printer
"""

import sys
from glob import glob
from os.path import basename
from io import BytesIO
import argparse
from datetime import datetime

from PIL import Image
from brother_ql import BrotherQLRaster, create_label
from brother_ql.backends import backend_factory, guess_backend
from brother_ql.devicedependent import models, label_type_specs, label_sizes
from fastapi import FastAPI, Request, File, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

DEBUG = False
MODEL = None
BACKEND_CLASS = None
BACKEND_STRING_DESCR = None
LABEL_SIZES = [(name, label_type_specs[name]['name']) for name in label_sizes]


@app.get('/')
async def do_editor(request: Request):
    """
    The main editor view
    :return:
    """
    return templates.TemplateResponse(
        'index.html',
        {"request": request, "labels": get_labels()}
    )


@app.post('/print')
async def do_print(data: bytes = File(...), size: str = Form(...), allow_red: str = Form(...)):
    """
    Receive the image from the frontend and print it
    :return: string a simple 'ok' when no exception was thrown
    """
    print(data)
    allow_red = allow_red == "true"
    print(f"allow red? {allow_red} {type(allow_red)}")
    im = Image.open(BytesIO(data))
    
    timestamp = datetime.timestamp(datetime.now())
    filename = f"{timestamp}.png"
    im.save(filename)

    # uncomment me to print to printer
    # TODO: add a dev mode?

    await print_label(im, size, allow_red)

    return 'ok'



@app.get('/labels')
async def show_labels():
    """
    List the available label templates
    :return:
    """
    filenames = glob(sys.path[0] + '/static/labels/*.html')
    filenames.sort()
    return [basename(x[:-5]) for x in filenames]


async def print_label(im, size, allow_red):
    qlr = BrotherQLRaster(MODEL)
    create_label(qlr, im, size, threshold=70, cut=True, rotate=90, red=allow_red)

    # noinspection PyCallingNonCallable
    be = BACKEND_CLASS(BACKEND_STRING_DESCR)
    be.write(qlr.data)
    be.dispose()
    del be


def get_labels():
    """
    List the available label templates
    :return:
    """
    # get labels from some the disk?
    filenames = glob(sys.path[0] + '/static/labels/*.html')
    filenames.sort()
    return [basename(x[:-5]) for x in filenames]


def main():
    """
    Initializes the webserver
    :return:
    """
    global DEBUG, MODEL, BACKEND_CLASS, BACKEND_STRING_DESCR
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', default='127.0.0.1', help='The IP the webserver should bind to. Use 0.0.0.0 for all')
    parser.add_argument('--port', default=8013, help='The port the webserver should start on')
    parser.add_argument('--debug', action='store_true', default=False, help='Activate local dev debugging')
    parser.add_argument('--model', default='QL-500', choices=models, help='The model of your printer (default: QL-500)')
    parser.add_argument('printer',
                        help='String descriptor for the printer to use (like tcp://192.168.0.23:9100 or '
                             'file:///dev/usb/lp0)')
    args = parser.parse_args()

    DEBUG = args.debug
    MODEL = args.model

    try:
        selected_backend = guess_backend(args.printer)
        BACKEND_CLASS = backend_factory(selected_backend)['backend_class']
        BACKEND_STRING_DESCR = args.printer
    except:
        parser.error("Couldn't guess the backend to use from the printer string descriptor")


    uvicorn.run(app, host=args.host, port=int(args.port))


if __name__ == "__main__":
    main()
