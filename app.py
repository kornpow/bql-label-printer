#!/usr/bin/env python

"""
Web Interface for Label Design - printing handled by separate services
"""

import sys
from glob import glob
from os.path import basename
import argparse

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

DEBUG = False


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

@app.get('/labels')
async def show_labels():
    """
    List the available label templates
    :return:
    """
    filenames = glob(sys.path[0] + '/static/labels/*.html')
    filenames.sort()
    return [basename(x[:-5]) for x in filenames]


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
    global DEBUG
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', default='127.0.0.1', help='The IP the webserver should bind to. Use 0.0.0.0 for all')
    parser.add_argument('--port', default=8013, help='The port the webserver should start on')
    parser.add_argument('--debug', action='store_true', default=False, help='Activate local dev debugging')
    args = parser.parse_args()

    DEBUG = args.debug

    uvicorn.run(app, host=args.host, port=int(args.port))


if __name__ == "__main__":
    main()
