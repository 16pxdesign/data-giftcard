.PHONY: chart clean generate check

generate: process_data.js
	node process_data.js > temp_data.json && node generate.js

check: check_tesco.js
	node check_tesco.js

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  chart     - Generate chart data and open chart.html in browser"
	@echo "  generate  - Regenerate chart data and embed in chart.html"
	@echo "  check     - Check Tesco rewards and notify if conditions met"
	@echo "  clean     - Remove generated files"
	@echo "  help      - Show this help"