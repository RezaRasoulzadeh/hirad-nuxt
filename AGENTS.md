# Repository instructions

## UI work

Before changing any user-facing layout, styling, navigation, or copy, read
[UI_CONTEXT.md](UI_CONTEXT.md) and inspect the relevant reference components it links to.
Use that document as the project's design baseline unless the current user explicitly
requests a different direction.

Reuse the existing theme, layout, typography, and components. Match the current public
homepage for brand styling; use `ResourcePage.vue` for the approved Resources page
structure. Preserve the centered Resources heroes and centered section navigation.

Keep changes within the requested scope and preserve unrelated work in the diff.
Do not implement planned engineering tools or datasets merely because their directory
cards exist. When a user approves a lasting design change, update `UI_CONTEXT.md` so
future work follows it.

For implementation changes, run the relevant validation described in `UI_CONTEXT.md`.
Documentation-only changes need link and consistency checks, not a frontend build.
