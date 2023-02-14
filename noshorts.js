// do once
showTabs();
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

// 显示 Tabs 栏
function showTabs() {
  const headerDOM = document.querySelector(
    "ytd-page-manager>ytd-browse>ytd-two-column-browse-results-renderer ytd-section-list-renderer>#header-container>#header"
  );
  headerDOM.innerHTML = `
      <style>
      #noshorts-tabs {
        height: 56px;
      }
      .noshorts-tab {
        font-size: 14px;
        font-weight: 400;
        display: block;
        min-width: 12px;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        float: left;
        padding: 0 15px;
        border: none;
        border-radius: 8px;
        margin: 12px;
        margin-left: 0;
        letter-spacing: 0.2px;
        font-family: Roboto, Arial, sans-serif;
      }
      .noshorts-acitve {
        background-color: #0f0f0f;
        color: #fff;
      }
      .noshorts-noactive {
        background-color: rgba(0, 0, 0, 0.05);
        color: #0f0f0f;
        transition: background-color 0.3s;
        -webkit-transition: background-color 0.3s;
      }
      .noshorts-noactive:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
      </style>
      <div id="noshorts-tabs">
        <a class="noshorts-tab noshorts-acitve">All</a>
        <a class="noshorts-tab noshorts-noactive">Video</a>
        <a class="noshorts-tab noshorts-noactive">Shorts</a>
        <a class="noshorts-tab noshorts-noactive">Live</a>
      </div>`;
}
