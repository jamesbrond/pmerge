# This is an example of Makefile

PACKAGE      := pmerge
PYTHON       := /usr/bin/python3.10
VERSION_EXP  := [0-9\.]+
VERSION_FILE := .version
BUILD_DIR    := build
DIST_DIR     := dist
NG_DIR       := web

SHELL:=/bin/bash

-include .make/misc.mk
-include .make/py.mk
-include .make/git.mk
-include .make/angular.mk

MAKE_INCLUDES = $(shell grep -E '^-include .*\s$$' Makefile | awk 'BEGIN {FS = " "}; {print $$2}')
$(MAKE_INCLUDES):
	@mkdir -p $$(dirname $@); \
	NAME=$$(basename $@); \
	URL=$$(echo "https://raw.githubusercontent.com/jamesbrond/jamesbrond/main/Makefile/$$NAME"); \
	echo "get $$URL"; \
	curl -s -H 'Cache-Control: no-cache, no-store' $${URL} -o $@


PHONY: clean clean-dist lint
.DEFAULT_GOAL := help

$(BUILD_DIR):
	@mkdir -p $@

clean-dist: clean clean-source-dist py-clean-venv ## Clean-up the entire solution

clean: py-clean-cache ## Clean-up latex build artifacts

compile: $(BUILD_DIR) ng-compile

deps: py-deps ## Install dependencies

devdeps: py-devdeps ## Install dependencies for depveloper

lint: py-lint ng-lint ## Run lint analysis

run: compile
	@$(call prompt-info,Run photomerge)
	@src/photomerge.py

# ~@:-]