const loginToggle = document.getElementById("loginToggle");
const agentInput = document.getElementById("agentInput");
const sendAgent = document.getElementById("sendAgent");
const chatReply = document.getElementById("chatReply");
const promptButtons = [...document.querySelectorAll("[data-question]")];
const treeNodes = [...document.querySelectorAll(".tree-node")];
const loginOverlay = document.getElementById("loginOverlay");
const loginClose = document.getElementById("loginClose");
const loginSubmit = document.getElementById("loginSubmit");
const loginUser = document.getElementById("loginUser");

let isLoggedIn = false;

const operationWords = [
  "展示",
  "显示",
  "打开",
  "加载",
  "勾选",
  "选中",
  "查看地图",
  "地图",
  "地形图",
  "图层",
  "定位",
  "叠加",
  "呈现",
  "标出",
  "画出",
];

function isMapOperationQuestion(text) {
  return operationWords.some((word) => text.includes(word));
}

function setReply(text, type = "normal") {
  chatReply.textContent = text;
  chatReply.classList.add("show");
  chatReply.dataset.type = type;
}

function setLoginState(nextValue) {
  isLoggedIn = nextValue;
  loginToggle.classList.toggle("logged-in", isLoggedIn);
  loginToggle.setAttribute("aria-pressed", String(isLoggedIn));
  loginToggle.textContent = isLoggedIn ? "已登录" : "登录 CHGIS";
  setReply(isLoggedIn ? "已登录 CHGIS 平台。现在 agent 可以为您勾选资源目录并展示地图。" : "已退出登录。涉及地图展示的操作将需要先登录。");
}

function openLoginModal() {
  loginOverlay.classList.add("show");
  loginOverlay.setAttribute("aria-hidden", "false");
  loginUser.focus();
}

function closeLoginModal() {
  loginOverlay.classList.remove("show");
  loginOverlay.setAttribute("aria-hidden", "true");
}

function pickLikelyMapLayer(text) {
  treeNodes.forEach((node) => node.classList.remove("agent-picked"));
  const target =
    treeNodes.find((node) => text.includes("民国") && node.textContent.includes("民国时期五万")) ||
    treeNodes.find((node) => text.includes("地形") && node.textContent.includes("全国配准")) ||
    treeNodes.find((node) => text.includes("CHGIS") && node.textContent.includes("CHGIS")) ||
    treeNodes.find((node) => node.textContent.includes("古旧地图")) ||
    treeNodes[1];
  if (target) target.classList.add("agent-picked");
}

function submitQuestion(rawText) {
  const text = rawText.trim();
  if (!text) {
    setReply("请输入您的问题。");
    return;
  }

  if (isMapOperationQuestion(text) && !isLoggedIn) {
    setReply("如需 agent 为您展示或勾选地图，请先登录 CHGIS 平台。", "warning");
    openLoginModal();
    return;
  }

  if (isMapOperationQuestion(text) && isLoggedIn) {
    pickLikelyMapLayer(text);
    setReply("已根据您的问题在资源目录中勾选相关地图资源，并准备在地图区域展示。", "success");
    return;
  }

  setReply("我可以回答这个历史地理问题；若需要我直接展示地图或勾选资源，请先确认已登录 CHGIS 平台。");
}

loginToggle.addEventListener("click", () => {
  if (isLoggedIn) {
    setLoginState(false);
    return;
  }
  openLoginModal();
});
loginClose.addEventListener("click", closeLoginModal);
loginOverlay.addEventListener("click", (event) => {
  if (event.target === loginOverlay) closeLoginModal();
});
loginSubmit.addEventListener("click", () => {
  setLoginState(true);
  closeLoginModal();
});
sendAgent.addEventListener("click", () => submitQuestion(agentInput.value));
agentInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submitQuestion(agentInput.value);
  }
});

promptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    agentInput.value = button.dataset.question;
    submitQuestion(button.dataset.question);
  });
});
