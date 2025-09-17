const chatColors = {
  BackgroundColor: "#FFFFFF",
  AccentColor: "#007BFF",
  ChatBubbleBackgroundColor: "#ffffff",
  FontColor: "#FFFFFF",
};


let searchBarNav = {
  accentColor: "#1D4ED8",
  shape: 0, 
  size: 40,  
  placeHolderText: "Ask me anything...", 
  backgroundColor:"#ffffff",
  fontColor: "#000000"
};

let searchBarHero = {
  accentColor: "#1D4ED8",
  shape: 0, 
  size: 40,  
  placeHolderText: "Ask me anything...", 
  backgroundColor:"#ffffff",
  fontColor: "#000000",
  starterQuestionsHero: false,
};

let bubbleIconUrl = null;
let starterQuestions = [];

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

    searchBarNav.shape = colors.data.shapeNav
        searchBarNav.size = colors.data.sizeNav
        searchBarNav.placeHolderText = colors.data.placeholderText || searchBarNav.placeHolderText;
        searchBarNav.backgroundColor = colors.data.backgroundColorNav || searchBarNav.backgroundColor;
        searchBarNav.accentColor = colors.data.accentColorNav || searchBarNav.accentColor;
        searchBarNav.fontColor = colors.data.fontColorNav || searchBarNav.fontColor;

        searchBarHero.shape = colors.data.shapeHero || searchBarHero.shape;
        searchBarHero.size = colors.data.sizeHero || searchBarHero.size;
        searchBarHero.placeHolderText = colors.data.placeholderHero || searchBarHero.placeHolderText;
        searchBarHero.backgroundColor = colors.data.backgroundColorHero || searchBarHero.backgroundColor;
        searchBarHero.accentColor = colors.data.accentColorHero || searchBarHero.accentColor;
        searchBarHero.fontColor = colors.data.fontColorHero || searchBarHero.fontColor;
        searchBarHero.starterQuestionsHero = colors.data.starterQuestionsHero || false;

    appendButton();
    updateButtonStyles();
    updateInputBoxStyles()
    updateMobileButtonStyles()
    return colors; 
  } catch (error) {
    console.error("Error fetching colors:", error);
    appendButton();
    updateDefaultButtonStyles();
    return null; // Fallback to default colors if API call fails
  }
}

async function getStarterQuestions() {
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
        baseUrl = "https://dev-api.skillbuilder.io";
    }
    const detailsResponse = await fetch(
      `${baseUrl}/api/v1/skilly/${window.chatConfig.chatId}/details`
    );
    if (!detailsResponse.ok) {
      throw new Error(`Failed to fetch details: ${detailsResponse.statusText}`);
    }
    const details = await detailsResponse.json();
    starterQuestions = details.data?.starterQuestions || [];
    // Assuming starter questions are in details.data.starterQuestions
    return details.data?.starterQuestions || [];
  } catch (error) {
    console.error("Error fetching starter questions:", error);
    return [];
  }
}


async function main() {
  await fetchColors();
  starterQuestions = await getStarterQuestions();
  renderStarterQuestions(starterQuestions);
}

main();
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

function updateMobileButtonStyles() {
  let heroSearchIcon =document.querySelector(".hero-section-btn")
  
heroSearchIcon.innerHTML =`
<svg width="40" height="40" viewBox="0 0 22 22" fill=${searchBarHero.accentColor} xmlns="http://www.w3.org/2000/svg">
<path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${searchBarHero.accentColor} stroke=${searchBarHero.accentColor} stroke-width="0.15"/>
<path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${searchBarHero.accentColor} stroke=${searchBarHero.accentColor} stroke-width="0.15"/>
</svg>`;

  let searchNavButton =document.querySelector(".search-icon-btn-nav")

console.log("searchNavButton",searchNavButton)
searchNavButton.innerHTML =`
<svg width="40" height="40" viewBox="0 0 22 22" fill=${searchBarNav.accentColor} xmlns="http://www.w3.org/2000/svg">
<path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${searchBarNav.accentColor} stroke=${searchBarNav.accentColor} stroke-width="0.15"/>
<path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${searchBarNav.accentColor} stroke=${searchBarNav.accentColor} stroke-width="0.15"/>
</svg>`;

}

function updateInputBoxStyles() {
  const container = document.querySelector(".input-container");
  if (!container) return;

  container.style.borderRadius = `${searchBarNav.shape}px`;
  container.style.height = `${searchBarNav.size}px`;
  container.style.border = `1px solid ${searchBarNav.accentColor}`;
  container.style.backgroundColor = searchBarNav.backgroundColor;
  const input = container.querySelector("input");
  input.style.backgroundColor = searchBarNav.backgroundColor;
input.style.setProperty("::placeholder", searchBarNav.fontColor, "important");
 input.placeholder = searchBarNav.placeHolderText;

   input.style.setProperty("--placeholder-color", searchBarNav.fontColor);

const sendButton = document.getElementsByClassName("send-button")[0];
sendButton.innerHTML = `
<svg width="22" height="22" viewBox="0 0 22 22" fill=${searchBarNav.accentColor} xmlns="http://www.w3.org/2000/svg">
<path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${searchBarNav.accentColor} stroke=${searchBarNav.accentColor} stroke-width="0.15"/>
<path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${searchBarNav.accentColor} stroke=${searchBarNav.accentColor} stroke-width="0.15"/>
</svg>`;


const containerHero = document.querySelector(".hero-input");
  if (!containerHero) return;

  containerHero.style.borderRadius = `${searchBarHero.shape}px`;
  containerHero.style.height = `${searchBarHero.size}px`;
  containerHero.style.border = `1px solid ${searchBarHero.accentColor}`;
  containerHero.style.backgroundColor = searchBarHero.backgroundColor;
  const inputHero = containerHero.querySelector("input");
  inputHero.style.backgroundColor = searchBarHero.backgroundColor;
  inputHero.placeholder = searchBarHero.placeHolderText;
  inputHero.style.setProperty("::placeholder", searchBarHero.fontColor, "important");
  const sendButtonHero = document.getElementsByClassName("send-button-hero")[0];
   inputHero.style.setProperty("--placeholder-color", searchBarHero.fontColor);
sendButtonHero.innerHTML = `
<svg width="22" height="22" viewBox="0 0 22 22" fill=${searchBarHero.accentColor} xmlns="http://www.w3.org/2000/svg">
<path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${searchBarHero.accentColor} stroke=${searchBarHero.accentColor} stroke-width="0.15"/>
<path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${searchBarHero.accentColor} stroke=${searchBarHero.accentColor} stroke-width="0.15"/>
</svg>`;
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


let iframeLoaded = false;
let pendingInput = null;
var closeIframeButton;
function setupIframeOnLoad() {
  if (!iframeContainer) {
    iframeContainer = document.createElement("div");
    iframeContainer.id = "iframeContainer";
    iframeContainer.classList.add("iframe-container");

    iframe = document.createElement("iframe");
    iframe.id = "iframeElement";
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";

    iframe.addEventListener("load", function () {
      iframeLoaded = true;
      if (pendingInput !== null) {
        iframe.contentWindow.postMessage({ type: "setInput", value: pendingInput }, "*");
        pendingInput = null;
      }
    });

    if (window.chatConfig.env == "dev") {
      iframe.src = prevSessionId
        ? `http://localhost:3000/external-ai-chat/${window.chatConfig.chatId}?prevSessionId=${prevSessionId}`
        : `http://localhost:3000/external-ai-chat/${window.chatConfig.chatId}`;
    } else if (window.chatConfig.env == "skillbuilder" || window.chatConfig.env == "skl") {
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
  // Hide iframe container by default
  iframeContainer.style.display = "none";
}
setupIframeOnLoad();

function openIframe() {
  button.style.display = "none";
  iframeContainer.style.display = "block";
  iframeContainer.style.bottom = "5px";
  document.body.style.overflow = "hidden";
}
button.addEventListener("click", openIframe);


let sendBtn;

// function injectChatInputBox() {
//   const targetDiv = document.getElementById("skl_id_search");
//   if (!targetDiv) return;

//   if (window.innerWidth <= 500) {
//     const existing = targetDiv.querySelector(".input-container");
//     if (existing) existing.remove();

//     // Inject search icon
//     let searchIcon = targetDiv.querySelector(".search-icon-btn");
//     if (!searchIcon) {
//       searchIcon = document.createElement("button");
//       searchIcon.className = "search-icon-btn";
//       searchIcon.innerHTML = `
//       <svg width="35" height="35" viewBox="0 0 28 28" fill="green" xmlns="http://www.w3.org/2000/svg">
// <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0722 6.16342C13.978 5.74951 13.61 5.45576 13.1855 5.45576C12.761 5.45576 12.393 5.74951 12.2988 6.16342L11.543 9.48724C11.3103 10.5106 10.5112 11.3097 9.48792 11.5423L6.16411 12.2982C5.7502 12.3923 5.45645 12.7603 5.45645 13.1848C5.45645 13.6093 5.7502 13.9774 6.16411 14.0715L9.48792 14.8273C10.5112 15.06 11.3103 15.8591 11.543 16.8824L12.2988 20.2062C12.393 20.6201 12.761 20.9139 13.1855 20.9139C13.61 20.9139 13.978 20.6201 14.0722 20.2062L14.828 16.8824C15.0607 15.8591 15.8597 15.06 16.8831 14.8273L20.2069 14.0715C20.6208 13.9774 20.9145 13.6093 20.9145 13.1848C20.9145 12.7603 20.6208 12.3923 20.2069 12.2982L16.8831 11.5423C15.8597 11.3097 15.0607 10.5106 14.828 9.48724L14.0722 6.16342ZM10.3528 13.1848C11.6838 12.7305 12.7312 11.6831 13.1855 10.3522C13.6398 11.6831 14.6872 12.7305 16.0181 13.1848C14.6872 13.6391 13.6398 14.6865 13.1855 16.0175C12.7312 14.6865 11.6838 13.6391 10.3528 13.1848Z" fill="#5848f7"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4882 3.85835C17.3437 -1.28612 9.00285 -1.28612 3.85835 3.85835C-1.28612 9.00285 -1.28612 17.3437 3.85835 22.4882C8.78671 27.4165 16.6486 27.6236 21.8234 23.1093L26.4477 27.7337C26.8028 28.0888 27.3786 28.0888 27.7337 27.7337C28.0888 27.3786 28.0888 26.8028 27.7337 26.4477L23.1093 21.8234C27.6236 16.6486 27.4165 8.78671 22.4882 3.85835ZM5.14433 5.14433C9.57857 0.710037 16.768 0.710037 21.2022 5.14433C25.6365 9.57857 25.6365 16.768 21.2022 21.2022C16.768 25.6365 9.57857 25.6365 5.14433 21.2022C0.710037 16.768 0.710037 9.57857 5.14433 5.14433Z" fill="#5848f7"/>
// </svg>
//       `;
//       searchIcon.style.background = "none";
//       searchIcon.style.border = "none";
//       searchIcon.style.cursor = "pointer";
//       searchIcon.style.padding = "0";
//       searchIcon.style.margin = "0 8px 0 0";
//       searchIcon.style.display = "flex";
//       searchIcon.style.alignItems = "center";
//       searchIcon.style.justifyContent = "center";
//       searchIcon.addEventListener("click", openIframe);
//       targetDiv.appendChild(searchIcon);
//     }
//     return;
//   }

//   // ...existing code for desktop input box...
//   const container = document.createElement("div");
//   container.className = "input-container";

//  container.style.borderRadius = `${searchBarNav.shape}px`;
//   container.style.height = `${searchBarNav.size}px`;
//   container.style.backgroundColor = searchBarNav.backgroundColor;
//   container.style.fontFamily = searchBarNav.fontFamily;
//   container.style.color = searchBarNav.fontColor;
//   container.style.border = `1px solid ${searchBarNav.accentColor}`;
//   container.style.padding = "0 14px";


//   const input = document.createElement("input");
//   input.type = "text";
//   input.placeholder = searchBarNav.placeHolderText || "Ask Anything";

//   function triggerIframe() {
//     if (!input.value.trim()) return;
//     openIframe(input.value.trim());
//     if (iframeLoaded) {
//       iframe.contentWindow.postMessage({ type: "setInput", value: input.value.trim() }, "*");
//     } else {
//       pendingInput = input.value.trim();
//     }
//     input.value = "";
//   }

//   input.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//       triggerIframe();
//     }
//   });

//   sendBtn = document.createElement("button");
//   sendBtn.className = "send-button";
  
// sendBtn.innerHTML = `
// <svg width="22" height="22" viewBox="0 0 22 22" fill=${chatColors.AccentColor} xmlns="http://www.w3.org/2000/svg">
// <path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${chatColors.AccentColor} stroke=${chatColors.AccentColor} stroke-width="0.15"/>
// <path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${chatColors.AccentColor} stroke=${chatColors.AccentColor} stroke-width="0.15"/>
// </svg>
// `;
//   sendBtn.addEventListener("click", openIframe);

//   container.appendChild(input);
//   container.appendChild(sendBtn);
//   targetDiv.appendChild(container);
// }

// Modify the injectChatInputBox function to handle both locations
function injectChatInputBox() {
  const targetDivs = [
    document.getElementById("skl_id_search"),
    document.getElementById("skl_id_search_hero_section")
  ];

  targetDivs.forEach(targetDiv => {
    if (!targetDiv) return;

    if (window.innerWidth <= 500) {
      const existing = targetDiv.querySelector(".input-container");
      if (existing) existing.remove();

      // Inject search icon
      let searchIcon = targetDiv.querySelector(".search-icon-btn");
      if (!searchIcon) {
        let isHeroSection = targetDiv.id === "skl_id_search_hero_section";
        searchIcon = document.createElement("button");
        searchIcon.className = isHeroSection? "search-icon-btn hero-section-btn" : "search-icon-btn search-icon-btn-nav";
        searchIcon.innerHTML = `
        <svg width="35" height="35" viewBox="0 0 28 28" fill="green" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0722 6.16342C13.978 5.74951 13.61 5.45576 13.1855 5.45576C12.761 5.45576 12.393 5.74951 12.2988 6.16342L11.543 9.48724C11.3103 10.5106 10.5112 11.3097 9.48792 11.5423L6.16411 12.2982C5.7502 12.3923 5.45645 12.7603 5.45645 13.1848C5.45645 13.6093 5.7502 13.9774 6.16411 14.0715L9.48792 14.8273C10.5112 15.06 11.3103 15.8591 11.543 16.8824L12.2988 20.2062C12.393 20.6201 12.761 20.9139 13.1855 20.9139C13.61 20.9139 13.978 20.6201 14.0722 20.2062L14.828 16.8824C15.0607 15.8591 15.8597 15.06 16.8831 14.8273L20.2069 14.0715C20.6208 13.9774 20.9145 13.6093 20.9145 13.1848C20.9145 12.7603 20.6208 12.3923 20.2069 12.2982L16.8831 11.5423C15.8597 11.3097 15.0607 10.5106 14.828 9.48724L14.0722 6.16342ZM10.3528 13.1848C11.6838 12.7305 12.7312 11.6831 13.1855 10.3522C13.6398 11.6831 14.6872 12.7305 16.0181 13.1848C14.6872 13.6391 13.6398 14.6865 13.1855 16.0175C12.7312 14.6865 11.6838 13.6391 10.3528 13.1848Z" fill="#5848f7"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4882 3.85835C17.3437 -1.28612 9.00285 -1.28612 3.85835 3.85835C-1.28612 9.00285 -1.28612 17.3437 3.85835 22.4882C8.78671 27.4165 16.6486 27.6236 21.8234 23.1093L26.4477 27.7337C26.8028 28.0888 27.3786 28.0888 27.7337 27.7337C28.0888 27.3786 28.0888 26.8028 27.7337 26.4477L23.1093 21.8234C27.6236 16.6486 27.4165 8.78671 22.4882 3.85835ZM5.14433 5.14433C9.57857 0.710037 16.768 0.710037 21.2022 5.14433C25.6365 9.57857 25.6365 16.768 21.2022 21.2022C16.768 25.6365 9.57857 25.6365 5.14433 21.2022C0.710037 16.768 0.710037 9.57857 5.14433 5.14433Z" fill="#5848f7"/>
        </svg>
        `;
        searchIcon.style.background = "none";
        searchIcon.style.border = "none";
        searchIcon.style.cursor = "pointer";
        searchIcon.style.padding = "0";
        searchIcon.style.margin = "0 8px 0 0";
        searchIcon.style.display = "flex";
        searchIcon.style.alignItems = "center";
        searchIcon.style.justifyContent = "center";
        searchIcon.addEventListener("click", openIframe);
        targetDiv.appendChild(searchIcon);
      }
      return;
    }

    // Create container for input box
    const container = document.createElement("div");
    container.className = targetDiv.id === "skl_id_search_hero_section" ? 
      "input-container hero-input" : "input-container";

    container.style.borderRadius = `${searchBarNav.shape}px`;
    container.style.height = `${searchBarNav.size}px`;
    container.style.backgroundColor = searchBarNav.backgroundColor;
    container.style.fontFamily = searchBarNav.fontFamily;
    container.style.color = searchBarNav.fontColor;
    container.style.border = `1px solid ${searchBarNav.accentColor}`;
    container.style.padding = "0 14px";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = searchBarNav.placeHolderText || "Ask Anything";

    function triggerIframe() {
      if (!input.value.trim()) return;
      openIframe(input.value.trim());
      if (iframeLoaded) {
        iframe.contentWindow.postMessage({ type: "setInput", value: input.value.trim() }, "*");
      } else {
        pendingInput = input.value.trim();
      }
      input.value = "";
    }

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        triggerIframe();
      }
    });

    const sendBtn = document.createElement("button");
sendBtn.className = targetDiv.id === "skl_id_search_hero_section"
  ? "send-button send-button-hero"
  : "send-button";
    sendBtn.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 22 22" fill=${chatColors.AccentColor} xmlns="http://www.w3.org/2000/svg">
        <path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${chatColors.AccentColor} stroke=${chatColors.AccentColor} stroke-width="0.15"/>
        <path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${chatColors.AccentColor} stroke=${chatColors.AccentColor} stroke-width="0.15"/>
      </svg>
    `;
    sendBtn.addEventListener("click", triggerIframe);

    container.appendChild(input);
    container.appendChild(sendBtn);
    
    // Remove existing input container if present
    const existing = targetDiv.querySelector(".input-container");
    if (existing) existing.remove();
    
    targetDiv.appendChild(container);
  });
}

function renderStarterQuestions(questions) {
  fetchColors();
  if (!searchBarHero.starterQuestionsHero) return;
  const targetDiv = document.getElementById("skl_id_search_hero_section");
  if (!targetDiv) return;

  // Remove existing starter questions container if present
  let existing = targetDiv.querySelector(".starter-questions-container");
  if (existing) existing.remove();

  // Create the container
  const container = document.createElement("div");
  container.className = "starter-questions-container";

  // Add pills for each question
  questions.forEach(q => {
    const pill = document.createElement("button");
    pill.className = "starter-question-pill";

    // Create a span to hold the icon and text
    const pillContent = document.createElement("span");
    pillContent.className = "starter-pill-content";

    // SVG icon
    pillContent.innerHTML = `
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
        <path d="M4.545 4.5C4.66255 4.16583 4.89458 3.88405 5.19998 3.70457C5.50538 3.52508 5.86445 3.45947 6.21359 3.51936C6.56273 3.57924 6.87941 3.76076 7.10754 4.03176C7.33567 4.30277 7.46053 4.64576 7.46 5C7.46 6 5.96 6.5 5.96 6.5M6 8.5H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="#77757B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="starter-pill-text">${q}</span>
    `;

    pill.appendChild(pillContent);

    pill.onclick = () => {
      const input = targetDiv.querySelector("input");
      if (input) {
        input.value = q;
        input.focus();
        // Directly trigger the chat message
        openIframe(q);
        if (iframeLoaded) {
          iframe.contentWindow.postMessage({ type: "setInput", value: q }, "*");
        } else {
          pendingInput = q;
        }
        input.value = "";
      }
    };
    container.appendChild(pill);
  });

  // Insert after the input container
  const inputContainer = targetDiv.querySelector(".input-container");
  if (inputContainer) {
    inputContainer.insertAdjacentElement("afterend", container);
  } else {
    targetDiv.appendChild(container);
  }
}

var pillStyle = document.createElement("style");
pillStyle.innerHTML = `
.starter-questions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.starter-question-pill {
  background: #fff;
  color: #79777D;
  border: none;
  border-radius: 16px;
  padding: 5.5px 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-family: "Manrope", sans-serif;
  display: flex;
  align-items: center;
}
.starter-question-pill:hover {
  background: #f7f7f8;
  color: #79777D;
}
.starter-pill-content {
  display: flex;
  align-items: center;
  gap: 4px;
}
.starter-pill-text {
  display: inline-block;
}
`;
document.head.appendChild(pillStyle);

function observeChatInput() {
  const observer = new MutationObserver(() => {
    const targetDiv = document.getElementById("skl_id_search");
    if (targetDiv && !targetDiv.querySelector(".input-container")) {
      injectChatInputBox();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  injectChatInputBox();
}

observeChatInput();


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
  box-sizing: border-box;
  overflow: hidden;
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
  padding: 5px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s linear;
  outline: none;
}
  .search-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-family:Manrope, sans-serif;
  color: #77757B;
}
.send-button {
    background: none;
    border: none;
    cursor: pointer;
}
.send-button svg {
  width: 20px;
  height: 20px;
  fill: white;
}
  
.input-container input::placeholder {
  color: var(--placeholder-color, #888);
}
.hero-input input::placeholder {
  color: var(--placeholder-color, #888);
}`;
document.head.appendChild(style);