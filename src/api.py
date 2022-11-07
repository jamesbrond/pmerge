"""APIs"""
import os
import eel
import cv2
import base64
from config import Config
import pmerge


@eel.expose
def roots():
    """Method to get contents from all root input folders"""
    cfg = Config()
    return [{
        "name": folder,
        "path": os.path.abspath(folder),
        "is_dir": os.path.isdir(folder),
        "readonly": True
    } for folder in cfg.folders["input_list"]]


@eel.expose
def files(folder):
    files = os.listdir(folder)
    return [{
        "name": f,
        "path": os.path.abspath(os.path.join(folder, f)),
        "is_dir": os.path.isdir(os.path.join(folder, f)),
        "readonly": False
    } for f in files]


@eel.expose
def image(path):
    img = cv2.imread(path)
    jpg_img = cv2.imencode('.jpg', img)
    return f"data:image/jpeg;base64,{base64.b64encode(jpg_img[1]).decode('utf-8')}"


@eel.expose
def output():
    """Method to get output folder"""
    return Config().folders["output"]


@eel.expose
def merge(inputs, output):
    """Merge two or more folder into one"""
    return pmerge.merge_folders(inputs, output)


@eel.expose
def duplicates(output):
    """Find duplicated images"""
    return pmerge.duplicates(output, False)

@eel.expose
def delete(files):
    for file in files:
        if os.path.isfile(file):
            os.remove(file)
        elif os.path.isdir(file):
            os.rmdir(file)
