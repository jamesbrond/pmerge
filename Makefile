# This is an example of Makefile

PACKAGE         := pmerge
PYTHON          := /cygdrive/c/Users/320072283/bin/python/python.exe
VERSION_EXP     := ^( *)([0-9.]+)(.*)
VERSION_FILE    := .version
BUILD_DIR       := .build
DIST_DIR        := dist
MAKE_DIR        := $(BUILD_DIR)/.make
NG_DIR          := web

DIRS = $(MAKE_DIR)

SHELL:=/bin/bash

-include $(MAKE_DIR)/misc.mk
-include $(MAKE_DIR)/git.mk
-include $(MAKE_DIR)/py.mk
-include $(MAKE_DIR)/angular.mk

$(MAKE_DIR)/%.mk: | $(MAKE_DIR)
	@URL=$$(echo "https://raw.githubusercontent.com/jamesbrond/jamesbrond/main/Makefile/.make/$(@F)"); \
	echo "get $$URL"; \
	curl -s -H 'Cache-Control: no-cache, no-store' $${URL} -o $@

.PHONY: build clean distclean dist init lint test
.DEFAULT_GOAL := help

$(DIRS):
	@$(call log-debug,MAKE,make '$@' folder)
	@mkdir -p $@

build:: ## Compile the entire program
	@$(call log-info,MAKE,$@ done)

clean:: ## Delete all files created by this makefile, however don’t delete the files that record configuration or environment
	@$(call log-info,MAKE,$@ done)

distclean:: clean ## Delete all files in the current directory (or created by this makefile) that are created by configuring or building the program
	@-$(RMDIR) $(BUILD_DIR) $(NULL_STDERR)
	@-$(RMDIR) $(DIST_DIR) $(NULL_STDERR)
	@-$(RMDIR) $(MAKE_DIR) $(NULL_STDERR)
	@$(call log-info,MAKE,$@ done)

dist:: build ## Create a distribution file or files for this program
	@$(call log-info,MAKE,$@ done)

init:: ## Initialize development environment
	@$(call log-info,MAKE,$@ done)

lint:: ## Perform static linting
	@$(call log-info,MAKE,$@ done)

run: build
	@$(call prompt-info,Run photomerge)
	@$(PYENV)/python src/photomerge.py

# ~@:-]