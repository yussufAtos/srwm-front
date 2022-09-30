.PHONY:build

VERSION=$(shell grep 'version' apps/webstory/VERSION.json | sed -e 's/.*: //')
RELEASE=1

DIST=..

MANIFEST_JSON=$(DIST)/manifest.json
ARCHIVE=webstory-frontend.zip

WORKSPACE?=$(shell pwd)
APP_DIR=/apps/webstory

BUILD_NUMBER?=$$(date +%Y%m%d%H%M%S)

BUILD_ROOT=$(WORKSPACE)/dist/rpm/$(APP_DIR)/build-$(VERSION)-$(RELEASE)-$(BUILD_NUMBER)
RPM_DIR=$(WORKSPACE)/dist/rpm/$(APP_DIR)
SPECS=$(WORKSPACE)/dist/rpm/$(APP_DIR)/webstory-frontend.spec
ZIP_DIR=$(WORKSPACE)/dist/$(ARCHIVE)
RPM_BASH_DIR=$(WORKSPACE)/$(APP_DIR)/rpm/rpm.sh

.DEFAULT_GOAL := help
.PHONY: help

##
## Build Webstory frontend rpm
## ------------------------
##


zip: $(DIST)/$(ARCHIVE) ## Create zip for rpm

$(DIST)/$(ARCHIVE):;
##@npm run zip il faut node 16 ou npm 8 préciser dans le makefile

rpm: $(DIST)/$(ARCHIVE) ## Create rpm
	@echo "Using build root $(BUILD_ROOT)"
	@rm -fr $(BUILD_ROOT) $(RPM_DIR)
	@mkdir -p $(BUILD_ROOT) $(RPM_DIR)/SOURCES
	@cp -p $(ZIP_DIR) $(RPM_DIR)/SOURCES/
	@RPM_DIR="$(RPM_DIR)" sh $(RPM_BASH_DIR) $(RPM_DIR)/SOURCES/$(ARCHIVE) $(VERSION) $(RELEASE) > $(SPECS)
	@rpmbuild --buildroot $(BUILD_ROOT) --define "_sourcedir $(RPM_DIR)/SOURCES" -bb --clean $(SPECS)

help:
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "; printf "\n  \033[33mUsage:\033[0m\n    make \033[32m[target]\033[0m\n\n"}; {printf "  \033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m## /[33m/'

