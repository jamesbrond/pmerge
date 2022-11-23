#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-11-02
# @Author  : Diego Brondo (jamesbrond@gmail.com)
# @Version : 0.0.1
"""Entry file"""

import eel
from config import Config
import api


if __name__ == "__main__":
    cfg = Config()

    try:
        eel.init('build/ng', allowed_extensions=['.js', '.html'])

        eel.start(
            'index.html',
            host=cfg.service["host"],
            port=cfg.service["port"],
            mode=cfg.service["mode"],
            cmdline_args=[]
        )
    except (SystemExit, MemoryError, KeyboardInterrupt):
        pass

# ~@:-]
