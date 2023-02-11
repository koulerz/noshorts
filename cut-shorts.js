/**
 * DOM:
 *  ytd-grid-video-renderer -> div#dismissible -> ytd-thumbnail -> a:href
 *
 * href:
 *  short: https://www.youtube.com/shorts/oAGpauAhvwo
 *  normal: https://www.youtube.com/watch?v=JJXZeSJzgOg
 */

// videos container DOM
const container = document.querySelector(
  "ytd-two-column-browse-results-renderer ytd-section-list-renderer>#contents"
);

let observer = new MutationObserver((mutations) => {
  console.log("[cut-shorts] observered");
  const vdoms = document.querySelectorAll("ytd-grid-video-renderer");
  for (const v of vdoms) {
    if (isShort(v)) {
      console.log("[cut-shorts] removed");
      v.remove();
    }
  }
});

observer.observe(container, {
  childList: true,
});

// report whether the video is shorts
function isShort(vdom) {
  const a = vdom.querySelector("a");
  const href = a.href;
  return href.startsWith("https://www.youtube.com/shorts");
}
