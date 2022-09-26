#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-07-14 10:00:38
# @Author  : Diego Brondo (jamesbrond@gmail.com)
# @Version : 0.0.1
"""
Merge two or more photo folders into one renaming phontos based on timestamp
"""

import os
import re
import sys
import shutil
import argparse
import datetime as dt
import tempfile
from pathlib import Path
import json
import exifread
from difPy import dif


IMAGE_EXTENSIONS = ('.jpg', '.jpeg')
EXIF_DATE_TAGS = ['EXIF DateTimeOriginal', 'Image DateTime', 'EXIF DateTimeDigitized']
DATE_ERROR = "999999999999999"


def dir_path(path):
    """Argparse input dir"""
    if not os.path.isdir(path):
        raise NotADirectoryError(path)
    return path


def dir_out_path(path):
    """Argparse output dir"""
    if not os.path.exists(path):
        os.mkdir(path)
        print(f"created {path} folder")
    elif not os.path.isdir(path):
        raise NotADirectoryError(path)
    return path


def argparser():
    """Argparse rules"""
    parser = argparse.ArgumentParser(
        prog="pmerge",
        usage='%(prog)s [options]',
        description='Photo Merge: merge folder of photos in on folder ordering them by timestamp',
        epilog='program realized to remember the Ukraine victims ~@:-]'
    )

    parser.add_argument(
        dest='folders',
        nargs='+',
        help='Two or more folders to merge',
        type=dir_path
    )
    parser.add_argument(
        '-o',
        '--output',
        dest='output',
        default=f"pmerge_{next(tempfile._get_candidate_names())}",  # pylint: disable=protected-access
        help='Output folder, if not exists it will be created',
        type=dir_out_path
    )
    parser.add_argument(
        '-d',
        '--duplicate',
        dest='find_duplicate',
        action='store_true',
        default=True,
        help="Find duplicate image after merge"
    )

    return parser.parse_args()


def folder_files(folder):
    """Loop folder searching fol photo files"""
    for curdir, _, filenames in os.walk(folder):
        return [
            {
                "name": os.path.join(curdir, filename),
                "is_image": filename.lower().endswith(tuple(IMAGE_EXTENSIONS))
            } for filename in filenames
        ]


def str2date(date_str):
    """Convert string to date"""
    return dt.datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')


def date2str(date):
    """Convert date to string"""
    return date.strftime('%Y%m%d%H%M%S')


def output_file(folder, orig):
    """Compute output file name according to the date of the photo"""
    img_basename = os.path.basename(orig['name'])
    path = Path(orig['name'])
    img_folder = os.path.basename(path.parent.absolute())

    date_str = None
    if orig["is_image"]:
        date_str = exif_date(orig['name'])
    if not date_str:
        date_str = guess_date_from_filename(orig['name'])

    return os.path.join(folder, f"{date_str}_{img_folder}-{img_basename}")


def copy_file(orig, dest):
    """Copy file utility with shutil"""
    shutil.copyfile(orig, dest)


def exif_tags(image_file):
    """Read EXIF information from file"""
    with open(image_file, 'rb') as photofile:
        return exifread.process_file(photofile, details=False)


def exif_date(image_file):
    """Get the date of the photo from EXIF information"""
    tags = exif_tags(image_file)
    # print(tags)
    for tag in EXIF_DATE_TAGS:
        date = tags.get(tag)
        if date:
            try:
                return date2str(str2date(str(date)))
            except Exception:
                continue
    return None


def guess_date_from_filename(image_file):
    """Get date of the photo from file name"""
    match = re.search(r'(\d{8})[_-]?(\d*)', image_file)
    return f"{match.group(1)}{match.group(2):0<6}" if match else DATE_ERROR


def merge_folders(folders, output):
    """Merge all photoes in all the folders"""
    for folder in folders:
        merge(folder, output)


def merge(folder, output):
    """Merge all photoes in the folder"""
    print(f"Merge {folder}")
    for curdir in folder_files(folder):
        new_file = output_file(output, curdir)
        print(f"{curdir['name']} -> {new_file}")
        copy_file(curdir['name'], new_file)


def duplicates(folder):
    """Find duplicated images in folder"""
    search = dif(
        folder,
        similarity="normal",
        show_progress=True,
        show_output=False,
        delete=False,
        silent_del=False
    )

    with open(os.path.join(folder, 'duplicates_results.json'), 'w', encoding='utf-8') as out:
        json.dump(search.result, out, ensure_ascii=False, indent=4)
    with open(os.path.join(folder, 'duplicates_lower_quality.txt'), 'w', encoding='utf-8') as out:
        for low in search.lower_quality:
            out.write(low)
    with open(os.path.join(folder, 'duplicates_stats.json'), 'w', encoding='utf-8') as out:
        json.dump(search.stats, out, ensure_ascii=False, indent=4)


def main():
    """Main entry"""
    # 1. parse cmq line arguments
    args = argparser()
    print(f"Merge {args.folders} folders into {args.output} folder")
    # 2. merge photo based on exif or filename
    merge_folders(args.folders, args.output)
    # 3. find duplicates
    if args.find_duplicate:
        duplicates(args.output)
    return 0


if __name__ == "__main__":
    sys.exit(main())

# ~@:-]
