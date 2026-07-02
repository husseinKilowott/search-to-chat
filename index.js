console.log('PROD Environment - Chat Widget Initialized');
// Platform and component detection
// Wix mode: platform: 'wix', component: 'searchBar' | 'chatBubble'
const isWixPlatform = window.chatConfig?.platform === 'wix';
const wixComponent = window.chatConfig?.component || 'both'; // 'searchBar', 'chatBubble', or 'both'

const _host = (window.location.hostname || '').toLowerCase();
const isCustom = _host === 'pointpark.edu' || _host.endsWith('.pointpark.edu');

// Store actual viewport width (from parent window in Wix context)
// This fixes the maximize button visibility issue in Wix iframes
let actualViewportWidth = window.innerWidth;

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
  starterQuestions: [],
};

let chatBubbleMode = null;
// Bubble style settings (new structured fields)
let bubbleWidthPx = 280;
let bubbleIconSizePx = 64;
let bubbleSubtitleText = null;
let backgroundColorEnabled = false;
let backgroundColorHex = null;
let bubblePresetIconUrl = null;
let customImageUrl = null;
let mobileIconUrl = null;
let customImageRenderedWidth = null;
let customImageRenderedHeight = null;
let skillyName = null;

function isCustomImageBubble() {
  return chatBubbleMode === 'custom_image';
}

function isOnMobile() {
  return (isWixPlatform ? actualViewportWidth : window.innerWidth) <= 992;
}

function shouldUseMobilePresetRendering() {
  return isOnMobile() || bubbleWidthPx < 72;
}

function isCustomImageFallbackActive() {
  return (
    isCustomImageBubble() &&
    isOnMobile() &&
    (customImageRenderedWidth !== null || customImageRenderedHeight !== null) &&
    (customImageRenderedWidth > 100 || customImageRenderedHeight > 100)
  );
}

function applyBubbleState() {
  updateButtonStyles();
  updateButtonSize();
}

function preloadOrRenderBubble() {
  if (isCustomImageBubble()) {
    if (!customImageUrl) {
      console.warn(
        'Skilly: Custom image mode active but no image URL provided — falling back to preset icon.'
      );
      customImageRenderedWidth = 0;
      customImageRenderedHeight = 0;
      applyBubbleState();
      return;
    }
    // Render into button and measure after load
    applyBubbleState();
  } else {
    applyBubbleState();
  }
}

let _bubbleResizeTimer = null;
window.addEventListener('resize', () => {
  if (!button.parentNode) return;
  clearTimeout(_bubbleResizeTimer);
  _bubbleResizeTimer = setTimeout(applyBubbleState, 150);
});
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
      case 'dev':
        baseUrl = 'http://localhost:3030';
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
    chatBubbleMode =
      colors.data.bubble_mode ?? colors.data.chatBubbleMode ?? chatBubbleMode;

    // New structured bubble fields
    backgroundColorEnabled =
      colors.data.background_color_enabled ?? backgroundColorEnabled;
    backgroundColorHex = colors.data.background_color_hex;
    mobileIconUrl = colors.data.mobile_icon;
    bubblePresetIconUrl = colors.data.bubble_icon;
    customImageUrl = colors.data.custom_image;
    if (colors.data.bubble_width_px != null)
      bubbleWidthPx = Number(colors.data.bubble_width_px);
    if (colors.data.bubble_icon_size_px != null)
      bubbleIconSizePx = Number(colors.data.bubble_icon_size_px);
    bubbleSubtitleText = colors.data.bubble_subtitle_text ?? null;

    searchBarNav.shape = colors.data.shapeNav;
    searchBarNav.size = colors.data.sizeNav;
    searchBarNav.placeHolderText =
      colors.data.placeholderNav || searchBarNav.placeHolderText;
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

    // Fetch details for chatBubbleMode and optional starter questions
    try {
      const detailsResponse = await fetch(
        `${baseUrl}/api/v1/skilly/${window.chatConfig.chatId}/details`
      );
      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        // chatBubbleMode now comes from style-settings (bubble_mode); details only used for starterQuestions
        if (colors.data.starterQuestionsHero) {
          searchBarHero.starterQuestions =
            detailsData.data?.starterQuestions || [];
        }

        // Fetch skilly name and other details if available
        skillyName = detailsData.data?.skillyName;
        chatColors.AccentColor = detailsData.data?.styleSettings?.accentColor;
      }
    } catch (err) {
      console.warn('Failed to fetch details:', err);
    }

    // Only initialize components based on platform/component config
    if (
      !isWixPlatform ||
      wixComponent === 'chatBubble' ||
      wixComponent === 'both'
    ) {
      appendButton();
      preloadOrRenderBubble();
    }
    if (!isWixPlatform || wixComponent === 'both') {
      updateInputBoxStyles();
      updateMobileButtonStyles();
    }
    return colors;
  } catch (error) {
    // console.error("Error fetching colors:", error);
    if (
      !isWixPlatform ||
      wixComponent === 'chatBubble' ||
      wixComponent === 'both'
    ) {
      appendButton();
      updateDefaultButtonStyles();
    }
    return null; // Fallback to default colors if API call fails
  }
}

// Initialize
fetchColors();

// Create and style the chat button
var button = document.createElement('button');
button.classList.add('open-iframe-btn');
button.setAttribute('aria-label', 'Open chat');
function applyBubbleBackground() {
  if (!shouldUseMobilePresetRendering()) {
    // Desktop card: always white with shadow — not configurable
    button.style.backgroundColor = '#ffffff';
    button.style.padding = '12px 16px';
    button.style.boxShadow = '0px 1px 8px 0px #1F1C261F';
  } else if (backgroundColorEnabled && backgroundColorHex) {
    // Mobile icon-only: custom background for text contrast
    button.style.backgroundColor = backgroundColorHex;
    button.style.padding = '5px';
    button.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
  } else {
    // Mobile icon-only: transparent
    button.style.backgroundColor = 'transparent';
    button.style.padding = '0';
    button.style.boxShadow = 'none';
  }
}

function getPresetIconHtml() {
  const src =
    mobileIconUrl && isOnMobile() ? mobileIconUrl : bubblePresetIconUrl;
  if (src) {
    return `<img src="${src}" alt="chat-icon" style="width:${bubbleIconSizePx}px;height:${bubbleIconSizePx}px;object-fit:contain;" />`;
  }
  return getChatIcon(chatColors.AccentColor);
}

function updateButtonStyles() {
  const useFallback = isCustomImageFallbackActive();

  if (isCustomImageBubble() && !useFallback && customImageUrl && !(isOnMobile() && mobileIconUrl)) {
    // Custom image mode — desktop, or mobile before measurement (skipped on mobile when mobileIconUrl is set)
    button.classList.remove('preset-bubble-card');
    button.classList.add('custom-image-bubble');
    button.innerHTML = `<img src="${customImageUrl}" class="custom-bubble-img" alt="chat-icon" />`;
    // Measure rendered dimensions after image loads and re-evaluate
    const img = button.querySelector('img.custom-bubble-img');
    img.onload = () => {
      const rect = img.getBoundingClientRect();
      customImageRenderedWidth = rect.width;
      customImageRenderedHeight = rect.height;
      if (isCustomImageFallbackActive()) {
        applyBubbleState();
      }
    };
    img.onerror = () => {
      console.warn(
        'Skilly: Custom bubble image failed to load — falling back to preset icon.'
      );
      customImageUrl = null;
      applyBubbleState();
    };
    // No background for custom image (per spec: no modifications)
    button.style.backgroundColor = 'transparent';
    button.style.boxShadow = 'none';
    button.style.padding = '0';
    return;
  }

  // Preset mode, or custom image fallback (mobile > 100px rendered, or null/load failure)
  if (isCustomImageBubble()) {
    // Fallback path: log warning if image was set but is falling back
    if (customImageUrl && useFallback) {
      console.warn(
        'Skilly: Custom image rendered size exceeds 100px on mobile — falling back to preset icon.'
      );
    }
  }

  button.classList.remove('custom-image-bubble');

  if (!shouldUseMobilePresetRendering()) {
    // Preset desktop pill/card
    const subtitle =
      bubbleSubtitleText ||
      "Ask me a question and I'll help you get the right answer fast.";
    const iconSrc = bubblePresetIconUrl;
    const iconHtml = iconSrc
      ? `<img class="bubble-icon" src="${iconSrc}" alt="" />`
      : `<span class="bubble-icon">${getChatIcon(chatColors.AccentColor)}</span>`;
    button.classList.add('preset-bubble-card');
    button.innerHTML = `
      <div class="bubble-card-inner">
        ${iconHtml}
        <div class="bubble-text">
          <span class="bubble-title">${skillyName ? `Hi there, I'm ${skillyName} 👋` : 'Hi there! 👋'}</span>
          <span class="bubble-subtitle">${subtitle}</span>
        </div>
      </div>`;
  } else {
    // Preset mobile / narrow-width icon-only
    button.classList.remove('preset-bubble-card');
    button.innerHTML = getPresetIconHtml();
  }

  applyBubbleBackground();
}

function updateButtonSize() {
  const useFallback = isCustomImageFallbackActive();
  const isCustomNoFallback =
    isCustomImageBubble() && !useFallback && customImageUrl && !(isOnMobile() && mobileIconUrl);

  button.classList.toggle('custom-image-bubble', isCustomNoFallback);

  if (isCustomNoFallback) {
    button.style.width = 'auto';
    button.style.height = 'auto';
    button.style.borderRadius = '0';
    return;
  }

  if (!isCustomImageBubble() && !shouldUseMobilePresetRendering()) {
    // Preset desktop card
    button.style.width = `${bubbleWidthPx}px`;
    button.style.height = 'auto';
    button.style.borderRadius = '16px';
  } else {
    // Icon-only: preset mobile, narrow preset, or custom fallback
    button.style.width = `${bubbleIconSizePx}px`;
    button.style.height = `${bubbleIconSizePx}px`;
    button.style.borderRadius = '16px';
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

  input.style.setProperty('--placeholder-color', '#77757B');

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
  inputHero.style.setProperty('--placeholder-color', '#77757B');

  // Render starter questions below hero input
  renderStarterQuestions(containerHero);
  sendButtonHero.innerHTML = `
<svg width="22" height="22" viewBox="0 0 22 22" fill=${searchBarHero.accentColor} xmlns="http://www.w3.org/2000/svg">
<path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill=${searchBarHero.accentColor} stroke=${searchBarHero.accentColor} stroke-width="0.15"/>
<path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill=${searchBarHero.accentColor} stroke=${searchBarHero.accentColor} stroke-width="0.15"/>
</svg>`;
}

// Render starter questions as pills below hero input
function renderStarterQuestions(containerHero) {
  if (
    !searchBarHero.starterQuestions ||
    searchBarHero.starterQuestions.length === 0
  )
    return;

  // Remove existing wrapper if present
  const existingWrapper = containerHero.parentElement?.querySelector(
    '.starter-questions-wrapper'
  );
  if (existingWrapper) existingWrapper.remove();

  const wrapper = document.createElement('div');
  wrapper.className = 'starter-questions-wrapper';

  searchBarHero.starterQuestions.forEach(question => {
    const chip = document.createElement('button');
    chip.className = 'starter-question-chip';
    chip.innerHTML = `
      <span class="chip-content">
        <svg class="question-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#77757B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#77757B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 17H12.01" stroke="#77757B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${question}
      </span>
    `;
    chip.addEventListener('click', () => {
      // Trigger the search with this question
      const inputHero = containerHero.querySelector('input');
      if (inputHero) {
        inputHero.value = question;
        // Trigger the iframe with the question
        if (typeof openIframe === 'function') {
          openIframe();
        }
        if (iframe && iframeLoaded) {
          iframe.contentWindow.postMessage(
            { type: 'setInput', value: question },
            '*'
          );
        } else {
          pendingInput = question;
        }
        inputHero.value = '';
      }
    });
    wrapper.appendChild(chip);
  });

  // Insert after the hero container
  containerHero.parentElement?.insertBefore(wrapper, containerHero.nextSibling);
}

// Update default button styles
function updateDefaultButtonStyles() {
  // Variables are already initialized to defaults; delegate to the unified renderer.
  updateButtonStyles();
  updateButtonSize();
}

// Function to create chat icon SVG
function getChatIcon(fillColor) {
  const iconPx = bubbleIconSizePx ? bubbleIconSizePx / 2 : 25;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${iconPx}" height="${iconPx}" viewBox="0 0 39 39"  style="aspect-ratio:1; fill:${fillColor} !important;">
        <path d="M23.6308 7.38462C23.6308 7.93663 23.9465 8.448 24.4375 8.70463L27.9434 10.4566L29.6954 13.9422C29.952 14.4535 30.4634 14.7692 31.0154 14.7692C31.5674 14.7692 32.0788 14.4535 32.3354 13.9422L34.0874 10.4566L37.5932 8.70463C38.0862 8.44801 38.4 7.93663 38.4 7.38462C38.4 6.8326 38.0843 6.32123 37.5932 6.0646L34.0874 4.31262L32.3354 0.827077C31.8425 -0.177231 30.1883 -0.177231 29.6973 0.827077L27.9453 4.31262L24.4394 6.0646C23.9465 6.32122 23.6327 6.8326 23.6327 7.38462H23.6308ZM29.7157 6.73477C29.9908 6.59631 30.2271 6.36 30.3655 6.0646L31.0154 4.78523L31.6652 6.0646C31.8037 6.35999 32.04 6.59629 32.3151 6.73477L33.6148 7.38462L32.3151 8.03446C32.04 8.17292 31.8037 8.40923 31.6652 8.70463L31.0154 9.984L30.3655 8.70463C30.2271 8.40925 29.9908 8.17294 29.7157 8.03446L28.416 7.38462L29.7157 6.73477ZM37.7502 14.2579C38.184 15.8529 38.4 17.5071 38.4 19.2C38.4 29.7951 29.7951 38.4 19.2 38.4C15.8123 38.4 12.504 37.4935 9.57046 35.7803L1.94954 38.3206C1.79262 38.3797 1.63385 38.4 1.47692 38.4C1.08369 38.4 0.708923 38.2431 0.433861 37.9661C0.0406309 37.5729 -0.0978313 36.9822 0.0793995 36.4505L2.61971 28.8295C0.906476 25.896 0 22.5877 0 19.2C0 8.60491 8.60491 0 19.2 0C20.9132 0 22.5877 0.236308 24.2012 0.670169C24.8511 0.827091 25.3237 1.41785 25.3237 2.10834C25.3237 3.05357 24.3581 3.78281 23.4535 3.52618C22.0744 3.15141 20.6566 2.95574 19.2 2.95574C10.2406 2.95389 2.95385 10.2406 2.95385 19.2C2.95385 22.2517 3.81968 25.2462 5.47383 27.864C5.71014 28.2388 5.76922 28.6911 5.63075 29.1249L3.81969 34.5803L9.27509 32.7693C9.70894 32.6308 10.1612 32.6714 10.536 32.9262C13.1557 34.5803 16.1483 35.4462 19.2 35.4462C28.1594 35.4462 35.4462 28.1594 35.4462 19.2C35.4462 17.7434 35.2486 16.3052 34.8757 14.9465C34.837 14.8283 34.8166 14.6899 34.8166 14.5532C34.8166 13.7465 35.4868 13.056 36.2936 13.056C37.0228 13.056 37.6136 13.5674 37.7502 14.2579ZM30.5224 19.2C30.5224 20.5588 29.4203 21.6609 28.0615 21.6609C26.7028 21.6609 25.6006 20.5588 25.6006 19.2C25.6006 17.8412 26.7028 16.7391 28.0615 16.7391C29.4203 16.7391 30.5224 17.8412 30.5224 19.2ZM19.2 16.7391C20.5588 16.7391 21.6609 17.8412 21.6609 19.2C21.6609 20.5588 20.5588 21.6609 19.2 21.6609C17.8412 21.6609 16.7391 20.5588 16.7391 19.2C16.7391 17.8412 17.8412 16.7391 19.2 16.7391ZM10.3385 16.7391C11.6972 16.7391 12.7994 17.8412 12.7994 19.2C12.7994 20.5588 11.6972 21.6609 10.3385 21.6609C8.97969 21.6609 7.87755 20.5588 7.87755 19.2C7.87755 17.8412 8.97969 16.7391 10.3385 16.7391Z"/>
    </svg>
  `;
}

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
button.innerHTML = getChatIcon(chatColors.AccentColor);

// button.innerHTML = chatIcon;
function appendButton() {
  if (document.body) {
    document.body.appendChild(button);
    button.style.backgroundColor = window.chatConfig.color;
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(button);
      button.style.backgroundColor = window.chatConfig.color;
    });
  }
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

// Wix parent viewport width handler
// This receives the actual browser viewport width from the Wix parent page
// Required to fix the maximize button visibility issue (Issue #3)
window.addEventListener('message', event => {
  if (event.data.type === 'wix_viewport_width') {
    actualViewportWidth = event.data.width;
    updateResponsiveElements();
  }
});

// Update responsive elements based on actual viewport width (for Wix compatibility)
// This fixes Issue #3: maximize button not showing due to CSS media queries using iframe width
function updateResponsiveElements() {
  const width = isWixPlatform ? actualViewportWidth : window.innerWidth;

  // Update maximize button visibility based on actual viewport
  if (maximizeBtn) {
    if (width <= 992) {
      maximizeBtn.style.display = 'none';
    } else {
      maximizeBtn.style.display = 'flex';
    }
  }

  // Update iframe container styles for mobile
  if (iframeContainer) {
    if (width <= 992) {
      iframeContainer.classList.add('mobile-view');
    } else {
      iframeContainer.classList.remove('mobile-view');
    }
  }

  // Re-evaluate custom image fallback when viewport changes (Wix context)
  if (
    isCustomImageBubble() &&
    (customImageRenderedWidth !== null || customImageRenderedHeight !== null)
  ) {
    applyBubbleState();
  }
}

// Wix integration: Listen for messages from Wix parent (relayed from search bar)
if (
  isWixPlatform &&
  (wixComponent === 'chatBubble' || wixComponent === 'both')
) {
  window.addEventListener('message', event => {
    if (event.data && event.data.type === 'skilly_open_chat') {
      // Open the chat iframe with the query from search bar
      if (typeof openIframe === 'function') {
        openIframe();
      }
      if (iframe && iframeLoaded) {
        iframe.contentWindow.postMessage(
          { type: 'setInput', value: event.data.query },
          '*'
        );
      } else {
        pendingInput = event.data.query;
      }
    }
  });
}

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
window.addEventListener('load', () => {
  checkParentWidth();
  // Request viewport width from Wix parent on load
  if (isWixPlatform) {
    window.parent.postMessage({ type: 'skilly_request_viewport_width' }, '*');
  }
  // Initial responsive update
  updateResponsiveElements();
});
window.addEventListener('resize', () => {
  checkParentWidth();
  updateResponsiveElements();
});

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
      if (iframe.contentDocument.body) {
        console.log('iframe.contentDocument:', iframe.contentDocument);
        console.log(
          'iframe.contentDocument.body:',
          iframe.contentDocument?.body
        );
        observer.observe(iframe.contentDocument.body, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
        });
        // console.log("Iframe mutation observer started successfully");
      } else {
        console.warn('iframe.contentDocument.body is null - cannot observe');
      }

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

    // Add Wix-specific class for styling (used in CSS selectors)
    if (isWixPlatform) {
      iframeContainer.classList.add('wix-mode');
    }

    iframe = document.createElement('iframe');
    iframe.id = 'iframeElement';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.title = 'Chat assistant';
    iframe.tabIndex = 0;

    iframe.addEventListener('load', function () {
      iframeLoaded = true;
      // Notify Wix parent that chat is ready (if in Wix mode)
      if (isWixPlatform) {
        window.parent.postMessage({ type: 'skilly_chat_ready' }, '*');
      }
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
        ? `https://skillyai.com/external-ai-chat/${window.chatConfig.chatId}?prevSessionId=${prevSessionId}&fromIframeParentWidth=${parentWidth}`
        : `https://skillyai.com/external-ai-chat/${window.chatConfig.chatId}?fromIframeParentWidth=${parentWidth}`;
    } else {
      iframe.src = prevSessionId
        ? `https://${window.chatConfig.env}.skillyai.com/external-ai-chat/${window.chatConfig.chatId}?prevSessionId=${prevSessionId}&fromIframeParentWidth=${parentWidth}`
        : `https://${window.chatConfig.env}.skillyai.com/external-ai-chat/${window.chatConfig.chatId}?fromIframeParentWidth=${parentWidth}`;
    }
    // create close button
    closeIframeButton = document.createElement('button');
    closeIframeButton.innerHTML = closeIcon;
    closeIframeButton.classList.add('new-iframe-btn');
    closeIframeButton.setAttribute('aria-label', 'Close chat');
    closeIframeButton.setAttribute('tabindex', '0');
    closeIframeButton.setAttribute('role', 'button');

    iframe.allow = `clipboard-read * self ${iframe.src}; clipboard-write *; microphone *`;

    // create maximize button
    maximizeBtn = document.createElement('button');
    maximizeBtn.classList.add('maximize-iframe-btn');
    maximizeBtn.setAttribute('aria-label', 'Maximize chat window');
    maximizeBtn.setAttribute('tabindex', '0');
    maximizeBtn.setAttribute('role', 'button');
    maximizeBtn.innerHTML = maxIcon;

    // Append iframe first, then buttons for proper tab navigation
    // (focus flows from iframe content -> close -> maximize)
    iframeContainer.appendChild(iframe);
    iframeContainer.appendChild(closeIframeButton);
    iframeContainer.appendChild(maximizeBtn);

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

    const toggleMaximize = () => {
      isWide = !isWide;
      maximizeBtn.innerHTML = isWide ? minIcon : maxIcon;
      maximizeBtn.setAttribute(
        'aria-label',
        isWide ? 'Minimize chat window' : 'Maximize chat window'
      );
      iframeContainer.classList.toggle('wide', isWide);
      checkParentWidth();
    };

    maximizeBtn.addEventListener('click', toggleMaximize);

    maximizeBtn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMaximize();
      }
    });

    if (document.body) {
      document.body.appendChild(iframeContainer);
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(iframeContainer);
      });
    }

    const closeIframe = () => {
      iframeContainer.style.display = 'none';
      document.body.style.overflow = '';
      button.style.display = 'flex';
      // Reset to normal mode when closing
      isWide = false;
      maximizeBtn.innerHTML = maxIcon;
      maximizeBtn.setAttribute('aria-label', 'Maximize chat window');
      iframeContainer.classList.remove('wide');
      // Return focus to chat bubble for accessibility
      button.focus();
    };

    closeIframeButton.addEventListener('click', closeIframe);

    closeIframeButton.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeIframe();
      }
    });

    button.addEventListener('click', function () {
      iframeContainer.style.display = 'block';
      document.body.style.overflow = '';
      button.style.display = 'none';
      // Focus iframe for accessibility - allows tab navigation within iframe
      if (iframe) {
        iframe.focus();
      }
    });
  }
  // Hide iframe container by default
  iframeContainer.style.display = 'none';
}

// Initialize iframe only for chat bubble component (or both/non-Wix)
if (
  !isWixPlatform ||
  wixComponent === 'chatBubble' ||
  wixComponent === 'both'
) {
  setupIframeOnLoad();
}

// Function to open iframe
function openIframe() {
  if (!button || !iframeContainer) return;
  button.style.display = 'none';
  iframeContainer.style.display = 'block';
  iframeContainer.style.bottom = '5px';
  document.body.style.overflow = 'hidden';
  // Focus iframe for accessibility - allows tab navigation within iframe
  if (iframe) {
    iframe.focus();
  }
}

if (
  !isWixPlatform ||
  wixComponent === 'chatBubble' ||
  wixComponent === 'both'
) {
  button.addEventListener('click', openIframe);
}

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

        let iconSize;
        switch (searchBarNav.size) {
          case 40:
            iconSize = 16;
            break;
          case 48:
            iconSize = 20;
            break;
          case 56:
            iconSize = 28;
            break;
          default:
            iconSize = 20;
            break;
        }

        searchIcon.innerHTML = `
        <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 28 28" fill="${searchBarNav.accentColor}!important" xmlns="http://www.w3.org/2000/svg">
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
    container.style.padding = '0 0 0 8px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = searchBarNav.placeHolderText || 'Ask Anything';

    function triggerIframe() {
      if (!input.value.trim()) return;
      const query = input.value.trim();

      // Wix mode: Send message to parent for relay to chat bubble
      if (isWixPlatform && wixComponent === 'searchBar') {
        window.parent.postMessage(
          {
            type: 'skilly_open_chat',
            query: query,
          },
          '*'
        );
      } else {
        // Standard mode: Direct communication
        openIframe(query);
        if (iframeLoaded) {
          iframe.contentWindow.postMessage(
            { type: 'setInput', value: query },
            '*'
          );
        } else {
          pendingInput = query;
        }
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

// Initial call to set up the input box and observer (skip for Wix chat bubble only)
if (!isWixPlatform || wixComponent === 'both') {
  observeChatInput();
  // Add resize listener for responsive behavior
  window.addEventListener('resize', handleResize);
}

// Wix search bar only mode: Create standalone search bar
if (isWixPlatform && wixComponent === 'searchBar') {
  function createWixSearchBar() {
    const container = document.createElement('div');
    container.className = 'input-container wix-search-bar';
    container.style.borderRadius = `${searchBarNav.shape}px`;
    container.style.height = `${searchBarNav.size}px`;
    container.style.backgroundColor = searchBarNav.backgroundColor;
    container.style.border = `1px solid ${searchBarNav.accentColor}`;
    container.style.padding = '0 0 0 8px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.maxWidth = '400px';
    container.style.minWidth = '200px';
    container.style.flexDirection = 'row-reverse';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = searchBarNav.placeHolderText || 'Ask me anything...';
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.width = '100%';
    input.style.fontSize = '14px';
    input.style.fontFamily = 'Manrope, sans-serif';
    input.style.color = '#77757B';
    input.style.marginRight = '10px';
    input.style.backgroundColor = searchBarNav.backgroundColor;

    function submitSearch() {
      const query = input.value.trim();
      if (!query) return;
      // Send message to Wix parent for relay to chat bubble
      window.parent.postMessage(
        {
          type: 'skilly_open_chat',
          query: query,
        },
        '*'
      );
      input.value = '';
    }

    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') submitSearch();
    });

    const sendBtn = document.createElement('button');
    sendBtn.className = 'send-button';
    sendBtn.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 22 22" fill="${searchBarNav.accentColor}" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.4175 4.82227C10.7557 4.82227 11.0495 5.05692 11.1245 5.38672L11.6636 7.76074C11.8234 8.46347 12.3729 9.01208 13.0757 9.17188L15.4497 9.71191C15.7794 9.78692 16.0131 10.0799 16.0132 10.418C16.0132 10.7562 15.7795 11.05 15.4497 11.125L13.0757 11.6641C12.3729 11.8239 11.8234 12.3734 11.6636 13.0762L11.1245 15.4502C11.0495 15.78 10.7557 16.0137 10.4175 16.0137C10.0794 16.0136 9.78643 15.7799 9.71143 15.4502L9.17139 13.0762C9.01159 12.3734 8.46298 11.8239 7.76025 11.6641L5.38623 11.125C5.05643 11.05 4.82178 10.7562 4.82178 10.418C4.82189 10.0798 5.05651 9.78688 5.38623 9.71191L7.76025 9.17188C8.46284 9.01201 9.01152 8.46333 9.17139 7.76074L9.71143 5.38672C9.78639 5.057 10.0794 4.82238 10.4175 4.82227ZM10.4175 8.60742C10.0805 9.42815 9.42766 10.0809 8.60693 10.418C9.42733 10.7548 10.0803 11.4073 10.4175 12.2275C10.7545 11.4077 11.4072 10.755 12.2271 10.418C11.4069 10.0808 10.7543 9.42782 10.4175 8.60742Z" fill="${searchBarNav.accentColor}" stroke="${searchBarNav.accentColor}" stroke-width="0.15"/>
        <path d="M3.70312 3.70312C7.40706 -0.000780503 13.4123 -0.000781082 17.1162 3.70312C20.6476 7.23469 20.8102 12.8568 17.6074 16.583L20.8623 19.8379C21.1453 20.1208 21.1453 20.5794 20.8623 20.8623C20.5794 21.1453 20.1208 21.1453 19.8379 20.8623L16.583 17.6074C12.8568 20.8102 7.23469 20.6476 3.70312 17.1162C-0.000781082 13.4123 -0.000780503 7.40706 3.70312 3.70312ZM16.0918 4.72754C12.9537 1.58948 7.86557 1.58948 4.72754 4.72754C1.58948 7.86557 1.58948 12.9537 4.72754 16.0918C7.86558 19.2297 12.9538 19.2298 16.0918 16.0918C19.2298 12.9538 19.2297 7.86558 16.0918 4.72754Z" fill="${searchBarNav.accentColor}" stroke="${searchBarNav.accentColor}" stroke-width="0.15"/>
      </svg>
    `;
    sendBtn.addEventListener('click', submitSearch);

    container.appendChild(input);
    container.appendChild(sendBtn);

    if (document.body) {
      document.body.appendChild(container);
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(container);
      });
    }
  }

  // Create search bar after styles are fetched
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWixSearchBar);
  } else {
    createWixSearchBar();
  }
}

// Add styles
var style = document.createElement('style');
style.innerHTML = `
.new-iframe-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none!important;
  cursor: pointer;
  z-index: 10000;
  background: transparent;
  padding: 0!important;
  border-radius: 50px;
  min-height: auto!important;
}

.iframe-container .new-iframe-btn {
  &:hover {
    background-color: rgba(255, 255, 255, 0.2)!important;
    transform: scale(1.05);
  }
  &:focus-visible{
    outline: 2px solid #ffffff!important;
    outline-offset: 2px!important;
    background-color: rgba(255, 255, 255, 0.15)!important;
  }
  &:focus {
    outline: 2px solid #ffffff!important;
    outline-offset: 2px!important;
  }
}

.iframe-container .new-iframe-btn svg {
    fill: none !important;
    padding-left: 0 !important;
    :hover {
      background-color: transparent!important;
    }
  }
.open-iframe-btn {
  box-sizing: border-box;
  overflow: hidden;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  z-index: 9999999;
  bottom: ${isCustom ? '90px' : '20px'};
  right: 20px;
  padding: 5px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  outline: none;
}
.open-iframe-btn:focus-visible {
  outline: 2px solid #005fcc !important;
  outline: none;
  outline-offset: 2px !important;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(0, 95, 204, 0.3) !important;
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
.open-iframe-btn.custom-image-bubble img {
  width: auto;
  height: auto;
  max-width: 100%;
  display: block;
}
.open-iframe-btn.custom-image-bubble {
  padding: 0;
}
@keyframes bubble-shine {
  0%   { transform: translate(-150%, -150%); }
  60%  { transform: translate(200%, 200%); }
  100% { transform: translate(200%, 200%); }
}
.open-iframe-btn:not(.custom-image-bubble)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 55%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.5) 50%,
    rgba(255,255,255,0) 100%
  );
  transform: translate(-150%, -150%);
  animation: bubble-shine 4s ease-in-out 2s infinite;
  pointer-events: none;
}
.open-iframe-btn.preset-bubble-card {
  width: auto;
  height: auto;
  border-radius: 16px;
  padding: 12px 16px;
  box-sizing: border-box;
  overflow: hidden;
}
.open-iframe-btn.preset-bubble-card .bubble-card-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: none;
}
.open-iframe-btn.preset-bubble-card .bubble-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  object-fit: contain;
  display: flex;
  align-items: center;
  justify-content: center;
}
.open-iframe-btn.preset-bubble-card .bubble-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
  font-family: Manrope, sans-serif;
}
.open-iframe-btn.preset-bubble-card .bubble-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
  color: #1F1C26;
}
.open-iframe-btn.preset-bubble-card .bubble-subtitle {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  opacity: 0.85;
  white-space: normal;
  color: #77757B;
}
.custom-bubble-img {
  display: block;
  max-width: 100%;
}
.iframe-container {
  display: none;
  position: fixed;
  top: 20px;
  right: 20px;
  width: 650px;
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
  border: none!important;
  background: transparent;
  padding: 0!important;
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  z-index: 100001;
  background: transparent;
  min-height: auto!important;
}

.iframe-container .maximize-iframe-btn {
  &:hover {
    background-color: rgba(255, 255, 255, 0.2)!important;
    transform: scale(1.05);
    background: transparent!important;
    min-height: auto!important;
  }
  &:focus-visible {
    outline: 2px solid #ffffff!important;
    outline-offset: 2px!important;
    background-color: rgba(255, 255, 255, 0.15)!important;
  }
  &:focus {
    outline: 2px solid #ffffff!important;
    outline-offset: 2px!important;
  }
}

.maximize-iframe-btn svg {
  fill: none !important;
  padding-right: 0!important;
  :hover {
    background-color: transparent!important;
  }
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
  flex-direction: row-reverse;
}
.input-container input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  font-family:Manrope, sans-serif;
  color: #77757B;
  margin-right: 10px;
}
.send-button {
    background: none!important;
    border: none;
    cursor: pointer;
    height: 21px;
}
.send-button svg {
  width: 20px;
  height: 20px;
  fill: white;
}

/* Mobile responsive styles - only affects non-hero input containers */
@media (max-width: 650px) {
  .input-container:not(.hero-input):not(.wix-search-bar) {
    display: none !important;
  }
  
  .search-icon-btn-nav {
    display: flex !important;
  }
  
  /* Hero input should always be visible */
  .hero-input {
    display: flex !important;
  }
  
  .wix-search-bar {
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

/* Mobile view class - applied via JS for Wix to use actual viewport width */
/* This fixes Issue #3: maximize button visibility in Wix iframes */
.iframe-container.mobile-view {
  width: calc(100% - 3px);
  height: calc(100dvh - 3px);
  top: 0px;
  right: 0px;
}
.iframe-container.mobile-view .maximize-iframe-btn {
  display: none;
}
.iframe-container.mobile-view.wide {
  width: calc(100% - 20px);
  height: calc(100vh - 20px);
  top: 10px;
  right: 10px;
}

/* Non-Wix: use CSS media queries for responsive behavior */
/* In Wix mode, responsive behavior is handled by JS using actual viewport width */
@media (max-width: 992px){
  .iframe-container:not(.wix-mode) .maximize-iframe-btn {
    display: none;
  }
  .iframe-container:not(.wix-mode) {
    width: calc(100% - 3px);
    height: calc(100dvh - 3px);
    top: 0px;
    right: 0px;
  }
  .iframe-container:not(.wix-mode).wide {
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

/* Starter Questions Styles */
.starter-questions-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 12px;
  justify-content: flex-start;
}

.starter-question-chip {
  background-color: #ffffff;
  color: #77757B;
  padding: 5.5px 10px;
  border: 1px solid #E5E5E5;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  font-family: Manrope, sans-serif;
  cursor: pointer;
  max-width: 300px;
  min-width: 100px;
  white-space: normal;
  height: auto;
  text-align: left;
  transition: background-color 0.2s ease;
}

.starter-question-chip:hover {
  background-color: #F5F5F5;
}

.starter-question-chip:focus {
  outline: 2px solid #5848f7;
  outline-offset: 2px;
}

.starter-question-chip .chip-content {
  display: flex;
  align-items: center;
  gap: 4px;
  word-break: break-word;
  white-space: normal;
  text-align: left;
  width: 100%;
}

.starter-question-chip .question-icon {
  flex-shrink: 0;
}

@media (max-width: 650px) {
  .starter-question-chip {
    max-width: 100%;
  }
}

/* Style for OpenResourcesBtn */
.OpenResourcesBtn {
  background-color: red !important;
  color: #fff !important;
}`;

// Add Wix-specific styles
if (isWixPlatform) {
  style.innerHTML += `
/* Wix-specific styles */
body {
  margin: 0;
  padding: 0;
}
`;

  // Search bar only mode: center the search bar
  if (wixComponent === 'searchBar') {
    style.innerHTML += `
body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
}
.input-container {
  display: flex !important;
  margin: 0 auto;
}
`;
  }
}
if (document.head) {
  document.head.appendChild(style);
} else {
  window.addEventListener('DOMContentLoaded', () => {
    document.head.appendChild(style);
  });
}