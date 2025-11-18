// Constants and default values
const chatColors = {
  BackgroundColor: '#FFFFFF',
  AccentColor: '#007BFF',
  ChatBubbleBackgroundColor: '#ffffff',
  FontColor: '#FFFFFF',
};

let searchBarNav = {
  accentColor: '#1D4ED8',
  shape: 0,
  size: 40,
  placeHolderText: 'Ask me anything...',
  backgroundColor: '#ffffff',
  fontColor: '#000000',
};

let searchBarHero = {
  accentColor: '#1D4ED8',
  shape: 0,
  size: 40,
  placeHolderText: 'Ask me anything...',
  backgroundColor: '#ffffff',
  fontColor: '#000000',
};

let chatBubbleBackgroundColorEnabled = true;

// Fetch colors from API
let bubbleIconUrl = null;
async function fetchColors() {
  try {
    let baseUrl;
    switch (window.chatConfig.env) {
      case 'skillbuilder':
      case 'skl':
        baseUrl = 'https://api.skillbuilder.io';
        break;
      case 'staging':
        baseUrl = 'https://staging-api.skillbuilder.io';
        break;
      default:
        baseUrl = 'https://dev-api.skillbuilder.io'; // Default to development
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
    chatColors.ChatBubbleBackgroundColor =
      colors.data.chatBubbleBackgroundColor ||
      chatColors.ChatBubbleBackgroundColor;
    chatColors.FontColor = colors.data.fontColor || '#FFFFFF';
    bubbleIconUrl = colors.data.bubbleIcon || null;
    chatBubbleBackgroundColorEnabled =
      colors.data.chatBubbleBackgroundColorEnabled ??
      chatBubbleBackgroundColorEnabled;

    searchBarNav.shape = colors.data.shapeNav;
    searchBarNav.size = colors.data.sizeNav;
    searchBarNav.placeHolderText =
      colors.data.placeholderText || searchBarNav.placeHolderText;
    searchBarNav.backgroundColor =
      colors.data.backgroundColorNav || searchBarNav.backgroundColor;
    searchBarNav.accentColor =
      colors.data.accentColorNav || searchBarNav.accentColor;
    searchBarNav.fontColor = colors.data.fontColorNav || searchBarNav.fontColor;

    searchBarHero.shape = colors.data.shapeHero || searchBarHero.shape;
    searchBarHero.size = colors.data.sizeHero || searchBarHero.size;
    searchBarHero.placeHolderText =
      colors.data.placeholderHero || searchBarHero.placeHolderText;
    searchBarHero.backgroundColor =
      colors.data.backgroundColorHero || searchBarHero.backgroundColor;
    searchBarHero.accentColor =
      colors.data.accentColorHero || searchBarHero.accentColor;
    searchBarHero.fontColor =
      colors.data.fontColorHero || searchBarHero.fontColor;

    appendButton();
    updateButtonStyles();
    updateInputBoxStyles();
    updateMobileButtonStyles();
    return colors;
  } catch (error) {
    // console.error("Error fetching colors:", error);
    appendButton();
    updateDefaultButtonStyles();
    return null; // Fallback to default colors if API call fails
  }
}

// Initialize
fetchColors();

// Create and style the chat button
var button = document.createElement('button');
button.classList.add('open-iframe-btn');
function updateButtonStyles() {
  if (chatBubbleBackgroundColorEnabled) {
    // Normal styling with background color and shadow
    button.style.backgroundColor = chatColors.ChatBubbleBackgroundColor;
    button.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
    button.style.borderRadius = '50%';
  } else {
    // Transparent background and no shadow
    button.style.backgroundColor = 'transparent';
    button.style.boxShadow = 'none';
    button.style.borderRadius = 'none';
  }
  if (bubbleIconUrl !== null) {
    button.innerHTML = `<img src="${bubbleIconUrl}" alt="chat-icon" />`;
  } else {
    button.innerHTML = isCMU ? cmuIcon : getChatIcon(chatColors.AccentColor);
  }
}

// Update mobile button styles
function updateMobileButtonStyles() {
  let heroSearchIcon = document.querySelector('.hero-section-btn');

  heroSearchIcon.innerHTML = `
<svg width="40" height="40" viewBox="0 0 22 22" fill=${searchBarHero.accentColor} xmlns="http://www.w3.org/2000/svg">
<path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${searchBarHero.accentColor} stroke=${searchBarHero.accentColor} stroke-width="0.15"/>
<path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${searchBarHero.accentColor} stroke=${searchBarHero.accentColor} stroke-width="0.15"/>
</svg>`;

  let searchNavButton = document.querySelector('.search-icon-btn-nav');

  // console.log("searchNavButton", searchNavButton);
  searchNavButton.innerHTML = `
<svg width="40" height="40" viewBox="0 0 22 22" fill=${searchBarNav.accentColor} xmlns="http://www.w3.org/2000/svg">
<path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${searchBarNav.accentColor} stroke=${searchBarNav.accentColor} stroke-width="0.15"/>
<path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${searchBarNav.accentColor} stroke=${searchBarNav.accentColor} stroke-width="0.15"/>
</svg>`;
}

// Update input box styles
function updateInputBoxStyles() {
  const container = document.querySelector('.input-container');
  if (!container) return;

  container.style.borderRadius = `${searchBarNav.shape}px`;
  container.style.height = `${searchBarNav.size}px`;
  container.style.border = `1px solid ${searchBarNav.accentColor}`;
  container.style.backgroundColor = searchBarNav.backgroundColor;
  const input = container.querySelector('input');
  input.style.backgroundColor = searchBarNav.backgroundColor;
  input.style.setProperty('::placeholder', searchBarNav.fontColor, 'important');
  input.placeholder = searchBarNav.placeHolderText;

  input.style.setProperty('--placeholder-color', searchBarNav.fontColor);

  const sendButton = document.getElementsByClassName('send-button')[0];
  sendButton.innerHTML = `
<svg width="22" height="22" viewBox="0 0 22 22" fill=${searchBarNav.accentColor} xmlns="http://www.w3.org/2000/svg">
<path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${searchBarNav.accentColor} stroke=${searchBarNav.accentColor} stroke-width="0.15"/>
<path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${searchBarNav.accentColor} stroke=${searchBarNav.accentColor} stroke-width="0.15"/>
</svg>`;

  const containerHero = document.querySelector('.hero-input');
  if (!containerHero) return;

  containerHero.style.borderRadius = `${searchBarHero.shape}px`;
  containerHero.style.height = `${searchBarHero.size}px`;
  containerHero.style.border = `1px solid ${searchBarHero.accentColor}`;
  containerHero.style.backgroundColor = searchBarHero.backgroundColor;
  const inputHero = containerHero.querySelector('input');
  inputHero.style.backgroundColor = searchBarHero.backgroundColor;
  inputHero.placeholder = searchBarHero.placeHolderText;
  inputHero.style.setProperty(
    '::placeholder',
    searchBarHero.fontColor,
    'important'
  );
  const sendButtonHero = document.getElementsByClassName('send-button-hero')[0];
  inputHero.style.setProperty('--placeholder-color', searchBarHero.fontColor);
  sendButtonHero.innerHTML = `
<svg width="22" height="22" viewBox="0 0 22 22" fill=${searchBarHero.accentColor} xmlns="http://www.w3.org/2000/svg">
<path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${searchBarHero.accentColor} stroke=${searchBarHero.accentColor} stroke-width="0.15"/>
<path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${searchBarHero.accentColor} stroke=${searchBarHero.accentColor} stroke-width="0.15"/>
</svg>`;
}

// Update default button styles
function updateDefaultButtonStyles() {
  if (chatBubbleBackgroundColorEnabled) {
    button.style.backgroundColor =
      chatColors.ChatBubbleBackgroundColor || '#5848F7';
    button.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
    button.style.borderRadius = '50%';
  } else {
    button.style.backgroundColor = 'transparent';
    button.style.boxShadow = 'none';
    button.style.borderRadius = 'none';
  }
  if (bubbleIconUrl !== null) {
    button.innerHTML = `<img src="${bubbleIconUrl}" alt="chat-icon" />`;
  } else {
    button.innerHTML = isCMU ? cmuIcon : getChatIcon(chatColors.AccentColor);
  }
}

// Function to create chat icon SVG
function getChatIcon(fillColor) {
  return `<svg fill="${fillColor}" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" style="aspect-ratio: 1;">
    <path d="M 15.5 5 C 13.2 5 11.179531 6.1997656 10.019531 8.0097656 C 10.179531 7.9997656 10.34 8 10.5 8 L 33.5 8 C 37.64 8 41 11.36 41 15.5 L 41 31.5 C 41 31.66 41.000234 31.820469 40.990234 31.980469 C 42.800234 30.820469 44 28.8 44 26.5 L 44 15.5 C 44 9.71 39.29 5 33.5 5 L 15.5 5 z M 10.5 10 C 6.9280619 10 4 12.928062 4 16.5 L 4 31.5 C 4 35.071938 6.9280619 38 10.5 38 L 11 38 L 11 42.535156 C 11 44.486408 13.392719 45.706869 14.970703 44.558594 L 23.988281 38 L 32.5 38 C 36.071938 38 39 35.071938 39 31.5 L 39 16.5 C 39 12.928062 36.071938 10 32.5 10 L 10.5 10 z M 10.5 13 L 32.5 13 C 34.450062 13 36 14.549938 36 16.5 L 36 31.5 C 36 33.450062 34.450062 35 32.5 35 L 23.5 35 A 1.50015 1.50015 0 0 0 22.617188 35.287109 L 14 41.554688 L 14 36.5 A 1.50015 1.50015 0 0 0 12.5 35 L 10.5 35 C 8.5499381 35 7 33.450062 7 31.5 L 7 16.5 C 7 16.256242 7.0241227 16.018071 7.0703125 15.789062 C 7.3936413 14.186005 8.7936958 13 10.5 13 z"></path>
  </svg>`;
}

// CMU Icon SVG
const cmuIcon = `<svg  fill=${chatColors.BackgroundColor} xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 80 80"><defs><style>.cls-1{fill:#ee3441;}.cls-2{fill:url(#linear-gradient-2);}.cls-3{fill:#fff;}.cls-4{fill:none;}.cls-5{fill:url(#linear-gradient);}.cls-6{clip-path:url(#clippath);}</style><clipPath id="clippath"><rect class="cls-4" x="-836.69" y="-354.19" width="612" height="792"/></clipPath><linearGradient id="linear-gradient" x1="16.29" y1="-59.1" x2="17.29" y2="-59.1" gradientTransform="translate(-17227.25 -58738.13) scale(994.62 -994.62)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#001541"/><stop offset="0" stop-color="#001541"/><stop offset=".25" stop-color="#043573"/><stop offset=".85" stop-color="#c41230"/><stop offset="1" stop-color="#ef3a47"/></linearGradient><linearGradient id="linear-gradient-2" x1="4.91" y1="45.32" x2="33.95" y2="29.75" gradientUnits="userSpaceOnUse"><stop offset=".12" stop-color="#ee3441"/><stop offset="1" stop-color="#ba2025"/></linearGradient></defs><g class="cls-6"><rect class="cls-5" x="-1031.14" y="-442.69" width="1000.9" height="969" transform="translate(-238.46 -403.14) rotate(-52.2)"/></g><path class="cls-3" d="M16.99,58.1c-.12,0-.24-.02-.36-.07-.41-.15-.67-.55-.66-.98l.29-8.26h-.32c-5.29,0-9.59-4.3-9.59-9.59v-13.55c0-5.29,4.3-9.59,9.59-9.59h26.03c5.29,0,9.59,4.3,9.59,9.59v13.55c0,5.29-4.3,9.59-9.59,9.59h-16.9l-7.3,8.93c-.2.24-.49.37-.78.37Z"/><path class="cls-2" d="M16.99,58.1c-.12,0-.24-.02-.36-.07-.41-.15-.67-.55-.66-.98l.29-8.26h-.32c-5.29,0-9.59-4.3-9.59-9.59v-13.55c0-5.29,4.3-9.59,9.59-9.59h26.03c5.29,0,9.59,4.3,9.59,9.59v13.55c0,5.29-4.3,9.59-9.59,9.59h-16.9l-7.3,8.93c-.2.24-.49.37-.78.37Z"/><path class="cls-1" d="M40.93,26.91h24.69c5.11,0,9.25,4.14,9.25,9.25v12.21c0,5.11-4.14,9.25-9.25,9.25h0c-.38,0-.69.32-.67.7l.23,6.61c.02.64-.79.95-1.2.45l-6.14-7.51c-.13-.16-.32-.25-.52-.25h-16.39c-5.11,0-9.25-4.14-9.25-9.25v-12.21c0-5.11,4.14-9.25,9.25-9.25Z"/><circle class="cls-3" cx="42.49" cy="41.65" r="3.06"/><circle class="cls-3" cx="52.86" cy="41.65" r="3.06"/><circle class="cls-3" cx="63.32" cy="41.63" r="2.96"/></svg>`;

// Close icon SVG
const closeIcon = `<svg fill="none" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32">
    <rect x="0.6" y="0.6" width="30.8" height="30.8" rx="15.4" stroke="white" stroke-width="1.2"/>
    <path d="M10.1667 16H21.8334" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

// Max icon SVG
const maxIcon = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.6" y="0.6" width="30.8" height="30.8" rx="15.4" stroke="white" stroke-width="1.2"/>
    <path d="M17.6667 14.3333L23.5 8.5M23.5 8.5H18.5M23.5 8.5V13.5M14.3333 17.6667L8.5 23.5M8.5 23.5H13.5M8.5 23.5L8.5 18.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

// Min icon SVG
const minIcon = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.6" y="0.6" width="30.8" height="30.8" rx="15.4" stroke="white" stroke-width="1.2"/>
  <path d="M9.33333 17.6667H14.3333M14.3333 17.6667V22.6667M14.3333 17.6667L8.5 23.5M22.6667 14.3333H17.6667M17.6667 14.3333V9.33333M17.6667 14.3333L23.5 8.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Create chat button
const isCMU = window.location.href.includes('cmu.edu');
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
window.addEventListener('message', event => {
  const { prevSessionId } = event.data;
  if (prevSessionId) {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 60);
    document.cookie = `__prevSessionId=${prevSessionId}; path=/; expires=${expireDate.toUTCString()}; Secure; SameSite=Lax`;
  }
  // return event.data;
});

// Copy to clipboard function
window.addEventListener('message', async event => {
  if (event.data.type === 'copy') {
    // navigator.clipboard.writeText(event.data.content);
    const plainTextContent = event.data.content.replace(/<[^>]*>?/gm, '');
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([event.data.content], { type: 'text/html' }),
        'text/plain': new Blob([plainTextContent], { type: 'text/plain' }),
      }),
    ]);
  }
});

// Function to get cookie by name
function getCookie(name) {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
}
// Get previous session ID from cookie
const prevSessionId = getCookie('__prevSessionId');

function checkParentWidth() {
  try {
    // use iframe’s document width
    const parentWidth = window.innerWidth;

    if (parentWidth <= 992) {
      // console.log("Mobile view detected");
    } else {
      // console.log("Desktop view detected");
    }
    return parentWidth;
  } catch (e) {
    // console.warn("Error checking width:", e);
  }
}

// Run on load + resize
window.addEventListener('load', checkParentWidth);
window.addEventListener('resize', checkParentWidth);

// Iframe setup
let iframeLoaded = false;
let pendingInput = null;
var closeIframeButton;
var maximizeBtn;

// Function to setup mutation observer for iframe content changes
function setupIframeMutationObserver() {
  try {
    // Check if we can access iframe content (same-origin)
    if (iframe.contentDocument) {
      // console.log("Setting up iframe content mutation observer");

      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // console.log("Iframe content changed - new nodes added:", mutation.addedNodes);
          }
          if (mutation.type === 'attributes') {
            // console.log("Iframe content changed - attribute modified:", mutation.attributeName);
          }
          if (mutation.type === 'characterData') {
            // console.log("Iframe content changed - text content modified");
          }
        });
      });

      // Start observing the iframe document
      observer.observe(iframe.contentDocument.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      // console.log("Iframe mutation observer started successfully");
    } else {
      // console.log("Cannot access iframe content (cross-origin) - using postMessage listener instead");

      // Alternative: Listen for postMessage events from iframe
      window.addEventListener('message', event => {
        // Verify origin if needed
        if (event.source === iframe.contentWindow) {
          // console.log("Iframe content communicated via postMessage:", event.data);
          checkParentWidth();
        }
      });
    }
  } catch (error) {
    // console.warn("Error setting up iframe mutation observer:", error);
    // console.log("Falling back to postMessage listener for cross-origin iframe");

    // Fallback: Listen for postMessage events
    window.addEventListener('message', event => {
      if (event.source === iframe.contentWindow) {
        // console.log("Iframe content change detected via postMessage:", event.data);
      }
    });
  }
}

// Setup iframe on load
function setupIframeOnLoad() {
  if (!iframeContainer) {
    iframeContainer = document.createElement('div');
    iframeContainer.id = 'iframeContainer';
    iframeContainer.classList.add('iframe-container');

    iframe = document.createElement('iframe');
    iframe.id = 'iframeElement';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';

    iframe.addEventListener('load', function () {
      iframeLoaded = true;
      if (pendingInput !== null) {
        iframe.contentWindow.postMessage(
          { type: 'setInput', value: pendingInput },
          '*'
        );
        pendingInput = null;
      }

      // Set up mutation observer for iframe content changes
      setupIframeMutationObserver();
    });

    const parentWidth = checkParentWidth() ?? 0;
    // console.log('parentWidth', parentWidth);
    if (window.chatConfig.env == 'dev') {
      iframe.src = prevSessionId
        ? `http://localhost:3000/external-ai-chat/${window.chatConfig.chatId}?prevSessionId=${prevSessionId}&fromIframeParentWidth=${parentWidth}`
        : `http://localhost:3000/external-ai-chat/${window.chatConfig.chatId}?fromIframeParentWidth=${parentWidth}`;
    } else if (
      window.chatConfig.env == 'skillbuilder' ||
      window.chatConfig.env == 'skl'
    ) {
      iframe.src = prevSessionId
        ? `https://skillbuilder.io/external-ai-chat/${window.chatConfig.chatId}?prevSessionId=${prevSessionId}&fromIframeParentWidth=${parentWidth}`
        : `https://skillbuilder.io/external-ai-chat/${window.chatConfig.chatId}?fromIframeParentWidth=${parentWidth}`;
    } else {
      iframe.src = prevSessionId
        ? `https://${window.chatConfig.env}.skillbuilder.io/external-ai-chat/${window.chatConfig.chatId}?prevSessionId=${prevSessionId}&fromIframeParentWidth=${parentWidth}`
        : `https://${window.chatConfig.env}.skillbuilder.io/external-ai-chat/${window.chatConfig.chatId}?fromIframeParentWidth=${parentWidth}`;
    }
    // create close button
    closeIframeButton = document.createElement('button');
    closeIframeButton.innerHTML = closeIcon;
    closeIframeButton.classList.add('new-iframe-btn');
    iframeContainer.appendChild(closeIframeButton);

    iframe.allow = `clipboard-read * self ${iframe.src}; clipboard-write *`;

    // create maximize button
    maximizeBtn = document.createElement('button');
    maximizeBtn.classList.add('maximize-iframe-btn');
    maximizeBtn.setAttribute('aria-label', 'Toggle iframe width');
    maximizeBtn.innerHTML = maxIcon;
    iframeContainer.appendChild(maximizeBtn); // add before iframe
    iframeContainer.appendChild(iframe);

    function sendIframeParentWidth() {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: 'fromIframeParentWidth',
            width: document.documentElement.clientWidth,
          },
          '*'
        );
      }
    }

    // Attach listeners only after appending
    iframe.addEventListener('load', sendIframeParentWidth);
    window.addEventListener('resize', sendIframeParentWidth);

    // toggle logic - default to normal mode (not maximized)
    let isWide = false;
    // Don't add wide class by default - iframe starts in normal size
    //iframeContainer.classList.add('wide');
    maximizeBtn.innerHTML = isWide ? minIcon : maxIcon;
    maximizeBtn.addEventListener('click', () => {
      isWide = !isWide;
      maximizeBtn.innerHTML = isWide ? minIcon : maxIcon;
      iframeContainer.classList.toggle('wide', isWide);
      checkParentWidth();
    });

    document.body.appendChild(iframeContainer);

    closeIframeButton.addEventListener('click', function () {
      iframeContainer.style.display = 'none';
      document.body.style.overflow = '';
      button.style.display = 'flex';
      // Reset to normal mode when closing
      isWide = false;
      maximizeBtn.innerHTML = maxIcon;
      iframeContainer.classList.remove('wide');
    });

    button.addEventListener('click', function () {
      iframeContainer.style.display = 'block';
      document.body.style.overflow = '';
      button.style.display = 'none';
    });
  }
  // Hide iframe container by default
  iframeContainer.style.display = 'none';
}

// Initialize
setupIframeOnLoad();

// Function to open iframe
function openIframe() {
  button.style.display = 'none';
  iframeContainer.style.display = 'block';
  iframeContainer.style.bottom = '5px';
  document.body.style.overflow = 'hidden';
}
button.addEventListener('click', openIframe);

// Create and style the chat button
let sendBtn;

// Modify the injectChatInputBox function to handle both locations
function injectChatInputBox() {
  const targetDivs = [
    document.getElementById('skl_id_search'),
    document.getElementById('skl_id_search_hero_section'),
  ];

  targetDivs.forEach(targetDiv => {
    if (!targetDiv) return;

    let isHeroSection = targetDiv.id === 'skl_id_search_hero_section';
    
    // Skip mobile search icon behavior for hero section - hero should always show input
    if (isHeroSection) {
      // Always show input container for hero section
      const existing = targetDiv.querySelector('.input-container');
      if (existing) {
        existing.style.display = 'flex';
        return;
      }
      // Hide any search icons in hero section
      const searchIcon = targetDiv.querySelector('.search-icon-btn');
      if (searchIcon) {
        searchIcon.style.display = 'none';
      }
      // Continue to create the input container for hero section
    }

    // Apply mobile search icon behavior only to non-hero sections
    if (window.innerWidth <= 650 && !isHeroSection) {
      // Hide existing input container
      const existing = targetDiv.querySelector('.input-container');
      if (existing) existing.style.display = 'none';

      // Show/create search icon for non-hero sections only
      let searchIcon = targetDiv.querySelector('.search-icon-btn');
      if (!searchIcon) {
        searchIcon = document.createElement('button');
        searchIcon.className = 'search-icon-btn search-icon-btn-nav';
        
        searchIcon.innerHTML = `
        <svg width="25" height="25" viewBox="0 0 28 28" fill="${searchBarNav.accentColor}" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0722 6.16342C13.978 5.74951 13.61 5.45576 13.1855 5.45576C12.761 5.45576 12.393 5.74951 12.2988 6.16342L11.543 9.48724C11.3103 10.5106 10.5112 11.3097 9.48792 11.5423L6.16411 12.2982C5.7502 12.3923 5.45645 12.7603 5.45645 13.1848C5.45645 13.6093 5.7502 13.9774 6.16411 14.0715L9.48792 14.8273C10.5112 15.06 11.3103 15.8591 11.543 16.8824L12.2988 20.2062C12.393 20.6201 12.761 20.9139 13.1855 20.9139C13.61 20.9139 13.978 20.6201 14.0722 20.2062L14.828 16.8824C15.0607 15.8591 15.8597 15.06 16.8831 14.8273L20.2069 14.0715C20.6208 13.9774 20.9145 13.6093 20.9145 13.1848C20.9145 12.7603 20.6208 12.3923 20.2069 12.2982L16.8831 11.5423C15.8597 11.3097 15.0607 10.5106 14.828 9.48724L14.0722 6.16342ZM10.3528 13.1848C11.6838 12.7305 12.7312 11.6831 13.1855 10.3522C13.6398 11.6831 14.6872 12.7305 16.0181 13.1848C14.6872 13.6391 13.6398 14.6865 13.1855 16.0175C12.7312 14.6865 11.6838 13.6391 10.3528 13.1848Z" fill="${searchBarNav.accentColor}"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4882 3.85835C17.3437 -1.28612 9.00285 -1.28612 3.85835 3.85835C-1.28612 9.00285 -1.28612 17.3437 3.85835 22.4882C8.78671 27.4165 16.6486 27.6236 21.8234 23.1093L26.4477 27.7337C26.8028 28.0888 27.3786 28.0888 27.7337 27.7337C28.0888 27.3786 28.0888 26.8028 27.7337 26.4477L23.1093 21.8234C27.6236 16.6486 27.4165 8.78671 22.4882 3.85835ZM5.14433 5.14433C9.57857 0.710037 16.768 0.710037 21.2022 5.14433C25.6365 9.57857 25.6365 16.768 21.2022 21.2022C16.768 25.6365 9.57857 25.6365 5.14433 21.2022C0.710037 16.768 0.710037 9.57857 5.14433 5.14433Z" fill="${searchBarNav.accentColor}"/>
        </svg>
        `;
        searchIcon.style.background = 'none';
        searchIcon.style.border = 'none';
        searchIcon.style.cursor = 'pointer';
        searchIcon.style.padding = '0';
        searchIcon.style.margin = '0 8px 0 0';
        searchIcon.style.display = 'flex';
        searchIcon.style.alignItems = 'center';
        searchIcon.style.justifyContent = 'center';
        
        // Add click event to open iframe for non-hero sections only
        searchIcon.addEventListener('click', openIframe);
        targetDiv.appendChild(searchIcon);
      } else {
        searchIcon.style.display = 'flex';
      }
      return;
    } else if (!isHeroSection) {
      // Hide search icon on larger screens for non-hero sections
      const searchIcon = targetDiv.querySelector('.search-icon-btn');
      if (searchIcon) {
        searchIcon.style.display = 'none';
      }
      
      // Show/create input container on larger screens for non-hero sections
      const existing = targetDiv.querySelector('.input-container');
      if (existing) {
        existing.style.display = 'flex';
        return;
      }
    }

    // Create container for input box
    const container = document.createElement('div');
    container.className =
      targetDiv.id === 'skl_id_search_hero_section'
        ? 'input-container hero-input'
        : 'input-container';

    container.style.borderRadius = `${searchBarNav.shape}px`;
    container.style.height = `${searchBarNav.size}px`;
    container.style.backgroundColor = searchBarNav.backgroundColor;
    container.style.fontFamily = searchBarNav.fontFamily;
    container.style.color = searchBarNav.fontColor;
    container.style.border = `1px solid ${searchBarNav.accentColor}`;
    container.style.padding = '0 0 0 4px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = searchBarNav.placeHolderText || 'Ask Anything';

    function triggerIframe() {
      if (!input.value.trim()) return;
      openIframe(input.value.trim());
      if (iframeLoaded) {
        iframe.contentWindow.postMessage(
          { type: 'setInput', value: input.value.trim() },
          '*'
        );
      } else {
        pendingInput = input.value.trim();
      }
      input.value = '';
    }

    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        triggerIframe();
      }
    });

    const sendBtn = document.createElement('button');
    sendBtn.className =
      targetDiv.id === 'skl_id_search_hero_section'
        ? 'send-button send-button-hero'
        : 'send-button';
    sendBtn.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 22 22" fill=${chatColors.AccentColor} xmlns="http://www.w3.org/2000/svg">
        <path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${chatColors.AccentColor} stroke=${chatColors.AccentColor} stroke-width="0.15"/>
        <path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${chatColors.AccentColor} stroke=${chatColors.AccentColor} stroke-width="0.15"/>
      </svg>
    `;
    sendBtn.addEventListener('click', triggerIframe);

    container.appendChild(input);
    container.appendChild(sendBtn);

    // Remove existing input container if present
    const existing = targetDiv.querySelector('.input-container');
    if (existing) existing.remove();

    targetDiv.appendChild(container);
  });
}

// Observe changes in the target divs to re-inject input box if necessary
function observeChatInput() {
  const observer = new MutationObserver(() => {
    const targetDiv = document.getElementById('skl_id_search');
    if (targetDiv && !targetDiv.querySelector('.input-container')) {
      injectChatInputBox();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  injectChatInputBox();
}

// Handle window resize to toggle between search icon and input box
function handleResize() {
  injectChatInputBox();
}

// Initial call to set up the input box and observer
observeChatInput();

// Add resize listener for responsive behavior
window.addEventListener('resize', handleResize);

// Add styles
var style = document.createElement('style');
style.innerHTML = `
.new-iframe-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  cursor: pointer;
  z-index: 10000;
  background: transparent;
  padding: 0;
  border-radius: 50px;
}
  .new-iframe-btn svg {
    fill: none !important;
  }
.open-iframe-btn {
  box-sizing: border-box;
  overflow: hidden;
  color: white;
  width: 55px;
  height: 55px;
  font-size: 24px;
  border: none;
  cursor: pointer;
  z-index: 9999999;
  bottom: 20px;
  right: 20px;
  padding: 5px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
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
  transition: all 0.2s ease;
}
.search-icon-btn:hover {
  opacity: 0.7;
  transform: scale(1.05);
}
.open-iframe-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.iframe-container {
  display: none;
  position: fixed;
  top: 20px;
  right: 20px;
  width: 500px;
  height: calc(100vh - 40px);
  border: 2px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
  z-index: 9999999;
  background-color: #fff;
}
.iframe-container.wide {
  width: calc(100% - 40px);
  right: 20px;
  border-radius: 8px;
  z-index: 999999;
}
.maximize-iframe-btn {
  position: absolute;
  top: 12px;
  right: 56px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0;
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  z-index: 100001;
  padding: 0;
}
.maximize-iframe-btn svg {
  fill: none !important;
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
.input-container {
  display: flex;
  align-items: center;
  border: 1px solid #5848f7;
  border-radius: 25px;
  padding: 8px 2px 8px 14px;
  max-width: 400px;
  min-width: 200px;
}
.input-container input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  font-family:Manrope, sans-serif;
  color: #77757B;
}
.send-button {
    background: none!important;
    border: none;
    cursor: pointer;
}
.send-button svg {
  width: 20px;
  height: 20px;
  fill: white;
}

/* Mobile responsive styles - only affects non-hero input containers */
@media (max-width: 650px) {
  .input-container:not(.hero-input) {
    display: none !important;
  }
  
  .search-icon-btn-nav {
    display: flex !important;
  }
  
  /* Hero input should always be visible */
  .hero-input {
    display: flex !important;
  }
}

@media (min-width: 651px) {
  .search-icon-btn-nav {
    display: none !important;
  }
  
  .input-container {
    display: flex !important;
  }
}

@media (max-width: 992px){
  .maximize-iframe-btn {
    display: none;
  }
  .iframe-container {
    width: calc(100% - 3px);
    height: calc(100dvh - 3px);
    top: 0px;
    right: 0px;
  }
  .iframe-container.wide {
    width: calc(100% - 20px);
    height: calc(100vh - 20px);
    top: 10px;
    right: 10px;
  }
}
  
.input-container input::placeholder {
  color: var(--placeholder-color, #888);
}
.hero-input input::placeholder {
  color: var(--placeholder-color, #888);
}

/* Style for OpenResourcesBtn */
.OpenResourcesBtn {
  background-color: red !important;
  color: #fff !important;
}`;
document.head.appendChild(style);
