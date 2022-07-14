#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-07-14 10:00:38
# @Author  : Diego Brondo (jamesbrond@gmail.com)
# @Version : 0.0.1

import os
import sys
import shutil
import argparse
import datetime as dt
import exifread
import tempfile
from pathlib import Path

IMAGE_EXTENSIONS = ('.jpg', '.jpeg')
EXIF_DATE_TAGS = [ 'EXIF DateTimeOriginal', 'Image DateTime', 'EXIF DateTimeDigitized' ]

def dir_path(path):
    if not os.path.isdir(path):
        raise NotADirectoryError(path)
    return path

def dir_out_path(path):
    if not os.path.exists(path):
        os.mkdir(path)
    elif not os.path.isdir(path):
        raise NotADirectoryError(path)
    return path

def argparser():
    parser = argparse.ArgumentParser(prog="pmerge", usage='%(prog)s [options]', description='Photo Merge: merge folder of photos in on folder ordering them by timestamp', epilog='program realized to remember the Ukraine victims ~@:-]')

    parser.add_argument(dest='folders', nargs='+', help='Folders to merge', type=dir_path)
    parser.add_argument('-o', '--output', dest='output', default=f"pmerge_{next(tempfile._get_candidate_names())}", help='Output folder, if not exists it will be created', type=dir_out_path)

    return parser.parse_args()

def image_files(folder):
    for dir, subfolders, filenames in os.walk(folder):
        images = [os.path.join(dir, filename) for filename in filenames if filename.lower().endswith(tuple(IMAGE_EXTENSIONS))]
    return images

def str2date(date_str):
    return dt.datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')

def date2str(date):
    return date.strftime('%Y%m%d%H%M%S')

def output_file(folder, orig, date):
    img_basename = os.path.basename(orig)
    path = Path(orig)
    img_folder = os.path.basename(path.parent.absolute())
    return os.path.join(folder, f"{date2str(date)}_{img_folder}-{img_basename}")

def copy_file(orig, dest):
    shutil.copyfile(orig, dest)

def exif_tags(image_file):
    with open(image_file, 'rb') as f:
        return exifread.process_file(f, details=True)

def exif_date(image_file):
    tags = exif_tags(image_file)
    # print(tags)
    for tag in EXIF_DATE_TAGS:
        d = tags.get(tag)
        if d:
            return str2date(str(d))

def merge_folders(folders, output):
    for folder in folders:
        merge(folder, output)

def merge(folder, output):
    print(f"Merge {folder}")
    for image in image_files(folder):
        print(f"{image} -> {output_file(output, image, exif_date(image))}")
        copy_file(image, output_file(output, image, exif_date(image)))

def main():
    # 1. parse cmq line arguments
    args = argparser()
    print(f"Merge {args.folders} folders into {args.output} folder")
    # 2. merge photo based on exif
    merge_folders(args.folders, args.output)
    return 0

if __name__ == "__main__":
    sys.exit(main())

# ~@:-]