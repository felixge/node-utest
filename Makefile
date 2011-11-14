SHELL := /bin/bash

test:
	@find test -name test-*.js -type f | xargs -tn1 node

.PHONY: test
