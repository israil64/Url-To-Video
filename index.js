const videoForm = document.getElementById("videoForm");
const videoContainer = document.getElementById("videoContainer");
const videoInputUrl = document.getElementById("videoInputUrl");
const error = document.getElementById("error");
const submit = document.getElementById("submit");
const deletes = document.getElementById("delete");

// Keep track of added video id
let idStore = [];

videoForm.addEventListener("submit", handleVideo);
deletes.addEventListener("click", handleDelete);

function handleVideo(e) {
  e.preventDefault();
  try {
    let embeddedVideoId = extracVideoIDFromUrl(videoInputUrl.value);
    console.log("this is video Id:", embeddedVideoId);
    if (embeddedVideoId) {
      let embeddedVideoUrl = `https://www.youtube.com/embed/${embeddedVideoId}`;

      let iframe = document.createElement("iframe");
      iframe.src = embeddedVideoUrl;
      iframe.height = "420 px";
      iframe.width = "520 px";
      iframe.style.padding = "10px";
      iframe.id = Math.floor(Math.random() * 10 + 1);
      idStore.push(iframe.id);
      videoContainer.appendChild(iframe);
      console.log("successfull");
      videoInputUrl.value = "";
      //* error hide
      error.textContent = "";
      error.classList.add("hide");
    } else {
      error.textContent = `Your URL is invalid!`;
      error.classList.remove("hide");
    }
  } catch (error) {
    console.error(error);
  }
}

function extracVideoIDFromUrl(url) {
  // Regular expression to match YouTube video ID
  let regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

  let match = url.match(regExp);
  console.log("match is", match);

  // If there's a match, return the video ID, otherwise return null
  if (match && match[2].length === 11) {
    return match[2];
  } else {
    return null;
  }
}

function handleDelete() {
  if (idStore.length > 0) {
    let removeId = idStore.shift();
    console.log("removeId is", removeId);
    let iframeToRemove = document.getElementById(removeId);
    if (iframeToRemove) {
      iframeToRemove.remove();
    }
  }
}

// I will be expore it
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        return caches.open("dynamic-cache").then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );

  // Ensure that the service worker waits for the fetch event to complete
  event
    .waitUntil
    // Perform additional tasks, such as caching or logging
    ();
});
