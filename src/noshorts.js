const pageManagerDOM = document.querySelector(
  "body>ytd-app>#content>ytd-page-manager"
);

// observer whether the header has been rendered
let observerHeader = new MutationObserver((mutations) => {
  const headerDOM = getDOMHeader();
  if (headerDOM) {
    observerHeader.disconnect();
    run();
  }
});

observerHeader.observe(pageManagerDOM, {
  childList: true,
  subtree: true,
});

// run
function run() {
  createTabs();
  initTabEvent();

  // new observer
  let observer = new MutationObserver((mutations) => {
    const activedTab = getDOMActivedTab();
    reRender(activedTab);
  });

  // listen container DOM change
  var containerDOM = getDOMContainer();
  observer.observe(containerDOM, {
    childList: true,
  });
}

// get container of all content
function getDOMContainer() {
  return pageManagerDOM.querySelector(
    "ytd-browse[page-subtype='subscriptions']>ytd-two-column-browse-results-renderer ytd-section-list-renderer>#contents"
  );
}

// get video list of all
function getDOMAllVideos() {
  return pageManagerDOM.querySelectorAll(
    "ytd-browse[page-subtype='subscriptions']>ytd-two-column-browse-results-renderer ytd-section-list-renderer>#contents ytd-grid-video-renderer"
  );
}

// get actived tab
function getDOMActivedTab() {
  const tabs = document.querySelectorAll(".noshorts-tab");
  for (const dom of tabs) {
    if (dom.classList.contains("noshorts-active")) {
      return dom;
    }
  }
}

// get header
function getDOMHeader() {
  return pageManagerDOM.querySelector(
    "ytd-browse[page-subtype='subscriptions']>ytd-two-column-browse-results-renderer>#primary>ytd-section-list-renderer>#header-container>#header"
  );
}

// show video
function showVideo(videoDOM) {
  if (!videoDOM.getAttribute("style")) {
    return;
  }
  videoDOM.removeAttribute("style");
}

// hidden video
function hiddenVideo(videoDOM) {
  if (videoDOM.getAttribute("style")) {
    return;
  }
  videoDOM.setAttribute("style", "display: none;");
}

// report whether the video is shorts
function isShort(videoDOM) {
  const a = videoDOM.querySelector("a");
  const href = a.href;
  return href.startsWith("https://www.youtube.com/shorts");
}

// report whether the video is live
function isLive(videoDOM) {
  const label = videoDOM.querySelector(
    "#text-metadata>ytd-badge-supported-renderer>div.badge>span"
  );
  if (label === null) {
    return false;
  }
  return label.innerHTML === "LIVE";
}

// show all videos
function showAll() {
  const allVideosDOM = getDOMAllVideos();
  for (const v of allVideosDOM) {
    showVideo(v);
  }
}

// show videos only
function showVideosOnly() {
  const allVideosDOM = getDOMAllVideos();
  for (const v of allVideosDOM) {
    if (isShort(v) || isLive(v)) {
      hiddenVideo(v);
    } else {
      showVideo(v);
    }
  }
}

// show shorts and lives only
function showShortsLivesOnly() {
  const allVideosDOM = getDOMAllVideos();
  for (const v of allVideosDOM) {
    if (isShort(v) || isLive(v)) {
      showVideo(v);
    } else {
      hiddenVideo(v);
    }
  }
}

// rerender
function reRender(activedTabDOM) {
  const text = activedTabDOM.innerHTML;
  switch (text) {
    case "All":
      showAll();
      break;
    case "Video":
      showVideosOnly();
      break;
    case "Shorts &amp; Live":
      showShortsLivesOnly();
      break;
    default:
      showAll();
  }
}

// init Tabs click event
function initTabEvent() {
  const doms = document.querySelectorAll(".noshorts-tab");
  for (const v of doms) {
    v.addEventListener("click", tabEventHandler);
  }
}

// Tab click event handler
function tabEventHandler(event) {
  const dom = event.target;
  if (dom.classList.contains("noshorts-active")) {
    return;
  }
  const tabs = document.querySelectorAll(".noshorts-tab");
  for (const item of tabs) {
    if (item.classList.contains("noshorts-active")) {
      item.classList.replace("noshorts-active", "noshorts-noactive");
    }
    if (dom.innerHTML === item.innerHTML) {
      item.classList.replace("noshorts-noactive", "noshorts-active");
    }
  }
  reRender(dom);
}

// create Tabs
function createTabs() {
  const headerDOM = getDOMHeader();
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
        padding: 0 12px;
        border: none;
        border-radius: 8px;
        margin: 12px;
        margin-left: 0;
        letter-spacing: 0.2px;
        font-family: Roboto, Arial, sans-serif;
      }
      .noshorts-active {
        background-color: #0f0f0f;
        color: #fff;
      }
      .noshorts-noactive {
        background-color: rgba(0, 0, 0, 0.05);
        color: #0f0f0f;
      }
      .noshorts-noactive:hover {
        background-color: rgba(0, 0, 0, 0.1);
        transition: background-color 0.5s cubic-bezier(0.05,0,0,1);
        -webkit-transition: background-color 0.5s cubic-bezier(0.05,0,0,1);
      }
      </style>
      <div id="noshorts-tabs">
        <a class="noshorts-tab noshorts-active">All</a>
        <a class="noshorts-tab noshorts-noactive">Video</a>
        <a class="noshorts-tab noshorts-noactive">Shorts & Live</a>
      </div>`;
}
