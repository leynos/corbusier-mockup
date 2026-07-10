.PHONY: check-fmt typecheck lint spelling test

TYPOS_VERSION ?= 1.48.0
TYPOS := uv tool run typos@$(TYPOS_VERSION)

check-fmt:
	bun fmt

typecheck:
	bun check:types

lint:
	bun lint

## Enforce en-GB-oxendict spelling in Markdown prose
spelling:
	@uv run scripts/generate_typos_config.py
	@find . -type f -name '*.md' -not -path './node_modules/*' -print0 | \
		xargs -0 -r $(TYPOS) --config typos.toml --force-exclude

test:
	bun test
