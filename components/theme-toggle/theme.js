// web-kit 0.1.0 · components/theme-toggle/theme.js
// Flips [data-theme] on <html> and remembers it; CSS picks the icon and palette.
// Wrapped in a block so it can be pasted into a site's existing script file.
{
  const root = document.documentElement;
  const toggle = document.querySelector(".wk-theme-toggle");
  const media = matchMedia("(prefers-color-scheme: dark)");
  // No explicit choice → the OS decides, so ask the OS, not the attribute.
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : media.matches);
  const sync = () => toggle.setAttribute("aria-pressed", isDark());

  if (toggle) {
    sync();
    toggle.addEventListener("click", () => {
      const theme = isDark() ? "light" : "dark";
      root.dataset.theme = theme; // flip first: must not depend on storage
      sync();
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        // Storage denied — works for this page load, doesn't persist.
      }
    });
    media.addEventListener("change", () => {
      if (!root.dataset.theme) sync();
    });
  }
}
