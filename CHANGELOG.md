# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] — 2026-07-20

### Added
- Initial public release of the portfolio site: Home, Projects, and Certifications pages.
- `README.md`, `LICENSE` (MIT), `CONTRIBUTING.md`, `SECURITY.md`.
- `manifest.json`, `robots.txt`, and `sitemap.xml` for SEO and PWA metadata.
- Open Graph and Twitter Card meta tags for link previews.

### Changed
- Reorganized the project into `assets/`, `css/`, and `js/` folders for a clearer, maintainable structure.
- Renamed asset files to descriptive, consistent names (e.g. `google-ae.png` → `assets/certificates/google-agile-essentials.png`).
- Losslessly recompressed images to reduce page weight without any visible change in quality.

### Fixed
- Corrected certificate alt text that mismatched the actual credential (Agile/Prompting cards were both labeled "AI Essentials").
- Fixed a CSS background-image reference broken by the folder reorganization.
- Improved a generic image alt attribute ("Project Preview") to be more descriptive.
