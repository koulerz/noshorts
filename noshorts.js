// do once
removeShorts(document.querySelectorAll("ytd-grid-video-renderer"));

// get videos container DOM
const container = document.querySelector(
  "ytd-two-column-browse-results-renderer ytd-section-list-renderer>#contents"
);

// new observer
let observer = new MutationObserver((mutations) => {
  console.log("[noshorts] container changed");
  const vdoms = document.querySelectorAll("ytd-grid-video-renderer");
  removeShorts(vdoms);
});

// listen container DOM change
observer.observe(container, {
  childList: true,
});

// remove shorts video
function removeShorts(vdom) {
  for (const v of vdom) {
    if (isShort(v)) {
      console.log("[noshorts] short removed");
      v.remove();
    }
  }
}

// report whether the video is shorts
function isShort(vdom) {
  const a = vdom.querySelector("a");
  const href = a.href;
  return href.startsWith("https://www.youtube.com/shorts");
}
