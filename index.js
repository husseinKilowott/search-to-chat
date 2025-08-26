const chatColors = {
  BackgroundColor: "#FFFFFF",
  AccentColor: "#007BFF",
  ChatBubbleBackgroundColor: "#ffffff",
  FontColor: "#FFFFFF",
};
let bubbleIconUrl = null;
async function fetchColors() {
  try {
    let baseUrl;
    switch (window.chatConfig.env) {
      case "skillbuilder":
      case "skl":
        baseUrl = "https://api.skillbuilder.io";
        break;      
      case "staging":
        baseUrl = "https://staging-api.skillbuilder.io";
        break;
      default:
        baseUrl = "https://dev-api.skillbuilder.io"; // Default to development
    }
    const response = await fetch(
      `${baseUrl}/api/v1/skilly/external/${window.chatConfig.chatId}/data/style-settings`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch colors: ${response.statusText}`);
    }
    const colors = await response.json();
    chatColors.BackgroundColor =
      colors.data.backgroundColor || chatColors.BackgroundColor;
    chatColors.AccentColor = colors.data.accentColor || chatColors.AccentColor;
    chatColors.ChatBubbleBackgroundColor = colors.data.chatBubbleBackgroundColor || chatColors.ChatBubbleBackgroundColor;
    chatColors.FontColor = colors.data.fontColor || "#FFFFFF";
    bubbleIconUrl = colors.data.bubbleIcon || null;
    appendButton();
    updateButtonStyles();
    return colors; // Assuming the API returns an object with `BackgroundColor` and `AccentColor`
  } catch (error) {
    console.error("Error fetching colors:", error);
    appendButton();
    updateDefaultButtonStyles();
    return null; // Fallback to default colors if API call fails
  }
}
fetchColors();
var button = document.createElement("button");
button.classList.add("open-iframe-btn");
function updateButtonStyles() {
  button.style.backgroundColor = chatColors.ChatBubbleBackgroundColor;
  if (bubbleIconUrl !== null) {
    button.innerHTML = `<img src="${bubbleIconUrl}" alt="chat-icon" />`;
  } else {
    button.innerHTML = isCMU ? cmuIcon : getChatIcon(chatColors.AccentColor);
  }
}
function updateDefaultButtonStyles() {
  button.style.backgroundColor = "#5848F7";
  if (bubbleIconUrl !== null) {
    button.innerHTML = `<img src="${bubbleIconUrl}" alt="chat-icon" />`;
  } else {
    button.innerHTML = isCMU ? cmuIcon : getChatIcon(chatColors.AccentColor);
  }
}
function getChatIcon(fillColor) {
  return `<svg fill="${fillColor}" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" style="aspect-ratio: 1;">
    <path d="M 15.5 5 C 13.2 5 11.179531 6.1997656 10.019531 8.0097656 C 10.179531 7.9997656 10.34 8 10.5 8 L 33.5 8 C 37.64 8 41 11.36 41 15.5 L 41 31.5 C 41 31.66 41.000234 31.820469 40.990234 31.980469 C 42.800234 30.820469 44 28.8 44 26.5 L 44 15.5 C 44 9.71 39.29 5 33.5 5 L 15.5 5 z M 10.5 10 C 6.9280619 10 4 12.928062 4 16.5 L 4 31.5 C 4 35.071938 6.9280619 38 10.5 38 L 11 38 L 11 42.535156 C 11 44.486408 13.392719 45.706869 14.970703 44.558594 L 23.988281 38 L 32.5 38 C 36.071938 38 39 35.071938 39 31.5 L 39 16.5 C 39 12.928062 36.071938 10 32.5 10 L 10.5 10 z M 10.5 13 L 32.5 13 C 34.450062 13 36 14.549938 36 16.5 L 36 31.5 C 36 33.450062 34.450062 35 32.5 35 L 23.5 35 A 1.50015 1.50015 0 0 0 22.617188 35.287109 L 14 41.554688 L 14 36.5 A 1.50015 1.50015 0 0 0 12.5 35 L 10.5 35 C 8.5499381 35 7 33.450062 7 31.5 L 7 16.5 C 7 16.256242 7.0241227 16.018071 7.0703125 15.789062 C 7.3936413 14.186005 8.7936958 13 10.5 13 z"></path>
  </svg>`;
}
const cmuIcon = `<svg  fill=${chatColors.BackgroundColor} xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 80 80"><defs><style>.cls-1{fill:#ee3441;}.cls-2{fill:url(#linear-gradient-2);}.cls-3{fill:#fff;}.cls-4{fill:none;}.cls-5{fill:url(#linear-gradient);}.cls-6{clip-path:url(#clippath);}</style><clipPath id="clippath"><rect class="cls-4" x="-836.69" y="-354.19" width="612" height="792"/></clipPath><linearGradient id="linear-gradient" x1="16.29" y1="-59.1" x2="17.29" y2="-59.1" gradientTransform="translate(-17227.25 -58738.13) scale(994.62 -994.62)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#001541"/><stop offset="0" stop-color="#001541"/><stop offset=".25" stop-color="#043573"/><stop offset=".85" stop-color="#c41230"/><stop offset="1" stop-color="#ef3a47"/></linearGradient><linearGradient id="linear-gradient-2" x1="4.91" y1="45.32" x2="33.95" y2="29.75" gradientUnits="userSpaceOnUse"><stop offset=".12" stop-color="#ee3441"/><stop offset="1" stop-color="#ba2025"/></linearGradient></defs><g class="cls-6"><rect class="cls-5" x="-1031.14" y="-442.69" width="1000.9" height="969" transform="translate(-238.46 -403.14) rotate(-52.2)"/></g><path class="cls-3" d="M16.99,58.1c-.12,0-.24-.02-.36-.07-.41-.15-.67-.55-.66-.98l.29-8.26h-.32c-5.29,0-9.59-4.3-9.59-9.59v-13.55c0-5.29,4.3-9.59,9.59-9.59h26.03c5.29,0,9.59,4.3,9.59,9.59v13.55c0,5.29-4.3,9.59-9.59,9.59h-16.9l-7.3,8.93c-.2.24-.49.37-.78.37Z"/><path class="cls-2" d="M16.99,58.1c-.12,0-.24-.02-.36-.07-.41-.15-.67-.55-.66-.98l.29-8.26h-.32c-5.29,0-9.59-4.3-9.59-9.59v-13.55c0-5.29,4.3-9.59,9.59-9.59h26.03c5.29,0,9.59,4.3,9.59,9.59v13.55c0,5.29-4.3,9.59-9.59,9.59h-16.9l-7.3,8.93c-.2.24-.49.37-.78.37Z"/><path class="cls-1" d="M40.93,26.91h24.69c5.11,0,9.25,4.14,9.25,9.25v12.21c0,5.11-4.14,9.25-9.25,9.25h0c-.38,0-.69.32-.67.7l.23,6.61c.02.64-.79.95-1.2.45l-6.14-7.51c-.13-.16-.32-.25-.52-.25h-16.39c-5.11,0-9.25-4.14-9.25-9.25v-12.21c0-5.11,4.14-9.25,9.25-9.25Z"/><circle class="cls-3" cx="42.49" cy="41.65" r="3.06"/><circle class="cls-3" cx="52.86" cy="41.65" r="3.06"/><circle class="cls-3" cx="63.32" cy="41.63" r="2.96"/></svg>`;
const closeIcon = `<svg fill="${chatColors.BackgroundColor}" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
  <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
  </svg>`;
const isCMU = window.location.href.includes("cmu.edu");
if (bubbleIconUrl !== null) {
    button.innerHTML = `<img src="${bubbleIconUrl}" alt="chat-icon" />`;
  } else {
    button.innerHTML = isCMU ? cmuIcon : getChatIcon(chatColors.AccentColor);
}
// button.innerHTML = chatIcon;
function appendButton() {
  document.body.appendChild(button);
  button.style.backgroundColor = window.chatConfig.color;
}
var iframeContainer; // Declared without initialization
var iframe; // Declared without initialization
window.addEventListener("message", (event) => {
  const { prevSessionId } = event.data;
  if(prevSessionId) {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 60);
    document.cookie = `__prevSessionId=${prevSessionId}; path=/; expires=${expireDate.toUTCString()}; Secure; SameSite=Lax`;
  } 
  // return event.data;
});
function getCookie(name) {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return value;
    }
  }
  return null;
}
const prevSessionId = getCookie("__prevSessionId");



var closeIframeButton;
function openIframe() {
  // Check if iframeContainer is already created
  if (!iframeContainer) {
    iframeContainer = document.createElement("div");
    iframeContainer.id = "iframeContainer";
    iframeContainer.classList.add("iframe-container");

    iframe = document.createElement("iframe");
    iframe.id = "iframeElement";
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";

    // Set iframe src dynamically based on the environment
    if (window.chatConfig.env == "skillbuilder" || window.chatConfig.env == "skl") {
      iframe.src = prevSessionId
        ? `https://skillbuilder.io/external-ai-chat/${window.chatConfig.chatId}?prevSessionId=${prevSessionId}`
        : `https://skillbuilder.io/external-ai-chat/${window.chatConfig.chatId}`;
    } else {
      iframe.src = prevSessionId
        ? `https://${window.chatConfig.env}.skillbuilder.io/external-ai-chat/${window.chatConfig.chatId}?prevSessionId=${prevSessionId}`
        : `https://${window.chatConfig.env}.skillbuilder.io/external-ai-chat/${window.chatConfig.chatId}`;
    }

    closeIframeButton = document.createElement("button");
    closeIframeButton.innerHTML = closeIcon;
    closeIframeButton.classList.add("new-iframe-btn");
    iframeContainer.appendChild(closeIframeButton);
    iframeContainer.appendChild(iframe);
    document.body.appendChild(iframeContainer);

    // Attach listeners only once here
    closeIframeButton.addEventListener("click", function () {
      iframeContainer.style.display = "none";
      document.body.style.overflow = "";
      button.style.display = "flex";
    });

    button.addEventListener("click", function () {
      iframeContainer.style.display = "block";
      document.body.style.overflow = "";
      button.style.display = "none";
    });
  }

  // Always just show iframe
  button.style.display = "none";
  iframeContainer.style.display = "block";
  iframeContainer.style.bottom = "5px";
  document.body.style.overflow = "hidden";
}
button.addEventListener("click", openIframe);






let sendBtn;
function injectChatInputBox() {
  const targetDiv = document.getElementById("skl_id_search");
  if (!targetDiv) return;

  const container = document.createElement("div");
  container.className = "input-container";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Ask Anything";

    function triggerIframe() {
    if (!input.value.trim()) return; // don't trigger empty
    openIframe(input.value.trim());
    input.value = ""; // clear input after submit
  }

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      triggerIframe();
    }
  });

  sendBtn = document.createElement("button");
  sendBtn.className = "send-button";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M2 21l21-9L2 3v7l15 2-15 2z");
  svg.appendChild(path);
  sendBtn.appendChild(svg);

  sendBtn.addEventListener("click", openIframe);

  container.appendChild(input);
  container.appendChild(sendBtn);
  targetDiv.appendChild(container);
}
injectChatInputBox();



var style = document.createElement("style");
style.innerHTML = `
.new-iframe-btn {
  position: fixed;
  bottom: 96.2vh;
  right: 20px;
  width: 35px;
  height: 35px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10000;
  padding: 7px;
}
.open-iframe-btn {
  color: white;
  width: 55px;
  height: 55px;
  font-size: 24px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 10000;
  bottom: 20px;
  right: 20px;
  padding: 12px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s linear;
  outline: none;
}
.open-iframe-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.iframe-container {
  display: none;
  position: fixed;
  bottom: 95px;
  right: 20px;
  width: 500px;
  height: 95vh;
  border: 2px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
  z-index: 99999;
}
.close-iframe-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 35px;
  height: 35px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
}
@media (max-width: 1367px) {
  .iframe-container {
    height: 92vh;
  }
  .new-iframe-btn {
    bottom: 93.6vh;
  }
}
@media (max-width: 768px) {
  .iframe-container {
    width: 100vw;
    height: 82vh;
    right: 0px;
    bottom: 0px!important;
  }
  .new-iframe-btn {
    top: calc(100px - 85px);
  }
}
.input-container {
  display: flex;
  align-items: center;
  border: 1px solid #5848f7;
  border-radius: 25px;
  padding: 8px 14px;
  width: 400px;
}
.input-container input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: #333;
}
.send-button {
  background-color: #5848f7;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.send-button svg {
  width: 14px;
  height: 14px;
  fill: white;
}`;
document.head.appendChild(style);