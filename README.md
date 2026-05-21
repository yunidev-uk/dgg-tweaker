# DGG Tweaks

- Hover over the top of the screen while in Cinema Mode to show the menu bar
- Hover over the bottom of the screen while in Cinema Mode to show stream controls
- Increase link hitbox size
- Button to view mentions
- Collect recent links from chat in one place

## Userscript

This project builds a userscript for Violentmonkey or Tampermonkey.

```sh
npm run build
```

Install `dist/dgg-tweaks.user.js` in your userscript manager.

The userscript loads Popper and Tippy through pinned, unminified `@require` dependencies instead of bundling their code.

All features can be toggled from the DGG chat settings menu.

If you have any feature suggestions, feel free to add a GitHub issue.
