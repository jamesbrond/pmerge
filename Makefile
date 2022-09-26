# This is an example of Makefile

PACKAGE         := pmerge
PY_HOME         := /cygdrive/c/Users/320072283/bin/python
VERSION_EXP     := [0-9\.]+
VERSION_FILE    := .version

-include .make/misc.mk
-include .make/py.mk
-include .make/git.mk


PHONY: clean clean-dist lint
.DEFAULT_GOAL := dist


clean-dist: clean clean-source-dist py-clean-venv ## Clean-up the entire solution

clean: py-clean-cache ## Clean-up latex build artifacts

lint: py-lint ## Run lint analysis

# ~@:-]