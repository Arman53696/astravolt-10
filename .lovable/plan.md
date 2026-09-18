# Native mobile screen fit

## What will change
- Lock the Android app to the usable device viewport and disable page-level scrolling, bounce, and accidental zoom.
- Fit the home, loading, gameplay, level-select, shop, settings, and popup screens within the phone display, including notches and navigation areas.
- Keep scrolling only inside content-heavy areas such as the level map, store lists, settings content, and legal text.
- Make the gameplay canvas and HUD resize reliably when Android system bars or orientation viewport measurements change.

## Verification
- Test representative tall and short Android-sized viewports.
- Confirm the outer page never scrolls and main controls stay visible without clipping.
- Confirm intentional inner lists still scroll and gameplay fills the available screen.
