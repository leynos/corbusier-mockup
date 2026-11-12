# `make fmt` and `make check-fmt` call mdtablefix directly. `--git` selects the
# Markdown files Git tracks and `--include-untracked` adds the untracked files
# Git does not ignore, so a new document is formatted before it is staged.
# Both modes need mdtablefix 0.6.0 or later.
MDLINT ?= markdownlint-cli2
MDTABLEFIX ?= mdtablefix
MDTABLEFIX_SELECT = --git --include-untracked
MDTABLEFIX_RULES = --wrap --renumber --breaks --ellipsis --fences

.PHONY: fmt check-fmt typecheck lint interrogate spelling test

TYPOS_VERSION ?= 1.48.0
TYPOS := uv tool run typos@$(TYPOS_VERSION)

fmt:
	bun run fmt
	$(MDTABLEFIX) --in-place $(MDTABLEFIX_SELECT) $(MDTABLEFIX_RULES)
	$(MDLINT) --fix "**/*.md"

check-fmt:
	bun fmt
	$(MDTABLEFIX) --check $(MDTABLEFIX_SELECT) $(MDTABLEFIX_RULES)

typecheck:
	bun check:types

# Interrogate scans each target recursively, subject to its default exclusions
# (check a new file against the verbose report). The repository's only Python
# is the typos tooling under scripts/; add a new Python directory to the
# targets.
INTERROGATE_VERSION ?= 1.7.0
INTERROGATE_TARGETS ?= scripts
# Level 2 prints a MISSED row per undocumented definition, which the
# `interrogate` target fails on: the rounded percentage alone can pass a lone
# gap.
INTERROGATE_FLAGS ?= -vv --no-color --fail-under 100
INTERROGATE ?= uv tool run --python 3.13 --from 'interrogate==$(INTERROGATE_VERSION)' interrogate

# `grep` reads the whole report, so an early exit cannot break the pipe.
interrogate: ## Enforce complete Python docstring coverage
	@set -eu; \
	  status=0; \
	  report="$$($(INTERROGATE) $(INTERROGATE_FLAGS) $(INTERROGATE_TARGETS))" || status=$$?; \
	  printf '%s\n' "$$report"; \
	  test "$$status" -eq 0 || exit "$$status"; \
	  found=0; \
	  printf '%s\n' "$$report" | grep '| *MISSED *|' >/dev/null || found=$$?; \
	  if test "$$found" -ne 1; then \
	    printf '%s\n' 'interrogate: undocumented definitions remain (or the MISSED check failed); see above' >&2; \
	    exit 1; \
	  fi

lint: interrogate
	bun lint

## Enforce en-GB-oxendict spelling in Markdown prose
spelling:
	@uv run scripts/generate_typos_config.py
	@find . -type f -name '*.md' -not -path './node_modules/*' -print0 | \
		xargs -0 -r $(TYPOS) --config typos.toml --force-exclude

test:
	bun test
