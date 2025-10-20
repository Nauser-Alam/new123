/* action.js
  Simple front-end logic:
  - manages tabs, registration modal, question modal
  - draws charts with Chart.js
  - calls backend endpoints for register, fetch dashboard, submit answer
*/

const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbwev7s1R2kyfhYYS9VSNHuxzN1Mo6paAJLhkvWEtt1hWtUsQMZiiaZtD36zH-cnn0qHWQ/exec"; // <-- REPLACE

// Basic state
let currentUser = null;
let questionsDB = {
  History: [
    {
      id: "hist-1",
      title: "Explain the law making process in India. (100 words)",
      text: "Explain the law making process in India.(100 words)",
    },
    {
      id: "hist-2",
      title:
        "Describe the member distribution and their election process in each of the union and state. (100 words)",
      text: "Describe the member distribution and their election process in each of the union and state. (100 words)",
    },
    {
      id: "hist-3",
      title:
        "Explain the objective resolution of the Indian constitution. (100 words)",
      text: "Explain the objective resolution of the Indian constitution. (100 words)",
    },
    {
      id: "hist-4",
      title:
        "Balance of power takes place in written and unwritten constitution? (100 words)",
      text: "Balance of power takes place in written and unwritten constitution? (100 words)",
    },
  ],
  Polity: [
    {
      id: "poly-1",
      title: "Explain separation of powers in Indian Constitution.",
      text: "Explain separation of powers in Indian Constitution.",
    },
    {
      id: "poly-2",
      title:
        "Explain the concept of Constitutionalism and factors affecting it.",
      text: "Explain the concept of Constitutionalism and factors affecting it.",
    },
    {
      id: "poly-3",
      title:
        "Recently, the Supreme Court struck down the Electoral Bonds Scheme (2024 judgment) citing violation of voters’ right to information. In light of this, analyse the constitutional tools of transparency in India. To what extent do they succeed in ensuring accountability? What further reforms are needed to strengthen transparency in political financing?",
      text: "Recently, the Supreme Court struck down the Electoral Bonds Scheme (2024 judgment) citing violation of voters’ right to information. In light of this, analyse the constitutional tools of transparency in India. To what extent do they succeed in ensuring accountability? What further reforms are needed to strengthen transparency in political financing?",
    },
    {
      id: "poly-4",
      title:
        "Preamble is merely an ornament part of Constitution. Critically examine.",
      text: "Preamble is merely an ornament part of Constitution. Critically examine.",
    },
    {
      id: "poly-5",
      title: "Explain Presidental and parliamentary form of givernment.",
      text: "Explain Presidental and parliamentary form of givernment.",
    },
    {
      id: "poly-6",
      title: "Critically analyse the preamble of Indian Constitution.",
      text: "Critically analyse the preamble of Indian Constitution.",
    },
    {
      id: "poly-7",
      title: "Explain the Sovereign model of India.",
      text: "Explain the Sovereign model of India.",
    },
    {
      id: "poly-8",
      title: "Explain the Secular model of India.",
      text: "Explain the Secular model of India.",
    },
    {
      id: "poly-9",
      title: "Critically analyze the Socilaist model of India.",
      text: "Critically analyze the Socilaist model of India.",
    },
    {
      id: "poly-10",
      title:
        "The Indian democratic model is often described as a unique blend of representative democracy with federal features, social justice orientation, and constitutional morality. In light of recent political, social and economic developments, critically examine whether the Indian democratic model has been able to balance inclusivity, stability, and accountability.",
      text: "The Indian democratic model is often described as a unique blend of representative democracy with federal features, social justice orientation, and constitutional morality. In light of recent political, social and economic developments, critically examine whether the Indian democratic model has been able to balance inclusivity, stability, and accountability.",
    },
    {
      id: "poly-11",
      title:
        "Discuss the role of media in strengthening democracy in India. Critically analyze the challenges faced by Indian media today.",
      text: "Discuss the role of media in strengthening democracy in India. Critically analyze the challenges faced by Indian media today.",
    },
    {
      id: "poly-12",
      title:
        "Discuss the significance of the Preamble in the Constitution of India. Do you think that it is enforceable in a court of law?",
      text: "Discuss the significance of the Preamble in the Constitution of India. Do you think that it is enforceable in a court of law?",
    },
    {
      id: "poly-13",
      title:
        "Discuss each adjective attached to the word ‘Republic’ in the Preamble. Are they defendable in the present circumstances? (2016, GS Paper-2)",
      text: "Discuss each adjective attached to the word ‘Republic’ in the Preamble. Are they defendable in the present circumstances? (2016, GS Paper-2)",
    },
    {
      id: "poly-14",
      title:
        "Discuss the constitutional and legal framework of citizenship in India. Critically analyze the implications of the Citizenship (Amendment) Act, 2019 on India’s secular fabric.",
      text: "Discuss the constitutional and legal framework of citizenship in India. Critically analyze the implications of the Citizenship (Amendment) Act, 2019 on India’s secular fabric.",
    },
    {
      id: "poly-15",
      title:
        "The Indian Constitution is neither rigid nor flexible, but a synthesis of both. Discuss.",
      text: "The Indian Constitution is neither rigid nor flexible, but a synthesis of both. Discuss.",
    },
    {
      id: "poly-16",
      title:
        "The Indian Constitution has features of both a unitary and a federal Constitution. Discuss. (GS Paper-2, 2018)",
      text: "The Indian Constitution has features of both a unitary and a federal Constitution. Discuss. (GS Paper-2, 2018)",
    },
    {
      id: "poly-17",
      title:
        "Fundamental Duties are not merely constitutional ideals but essential instruments for ensuring responsible citizenship. Critically analyze in the light of recent socio-political developments in India",
      text: "Fundamental Duties are not merely constitutional ideals but essential instruments for ensuring responsible citizenship. Critically analyze in the light of recent socio-political developments in India",
    },
    {
      id: "poly-18",
      title:
        "“Fundamental Rights are constitutional guarantees, whereas ordinary rights are creations of statutes.”Examine this statement with relevant examples and judicial interpretations.",
      text: "“Fundamental Rights are constitutional guarantees, whereas ordinary rights are creations of statutes.”Examine this statement with relevant examples and judicial interpretations.",
    },
    {
      id: "poly-19",
      title:
        "“The Doctrine of Eclipse demonstrates the Indian Constitution’s flexibility in harmonizing pre-constitutional laws with the Fundamental Rights regime.” Discuss with reference to judicial interpretations in Bhikaji Narain Dhakras, Deep Chand, and Ambika Mills cases.",
      text: "“The Doctrine of Eclipse demonstrates the Indian Constitution’s flexibility in harmonizing pre-constitutional laws with the Fundamental Rights regime.” Discuss with reference to judicial interpretations in Bhikaji Narain Dhakras, Deep Chand, and Ambika Mills cases.",
    },
    {
      id: "poly-20",
      title:
        "“The Constitution guarantees equality before law, yet it consciously creates exceptions to promote substantive equality and social justice.” Critically examine this statement with reference to Articles 15(1), 15(4), 19(1)(g), 19(6), and the Ninth Schedule.",
      text: "“The Constitution guarantees equality before law, yet it consciously creates exceptions to promote substantive equality and social justice.” Critically examine this statement with reference to Articles 15(1), 15(4), 19(1)(g), 19(6), and the Ninth Schedule.",
    },
    {
      id: "poly-21",
      title:
        "“From Shankari Prasad to Golaknath and beyond, the Supreme Court has redefined the limits of Parliament’s amending power to protect the Constitution’s Basic Structure.” Analyse this statement in the light of judicial developments up to I.R. Coelho v. State of Tamil Nadu (2007).",
      text: "“From Shankari Prasad to Golaknath and beyond, the Supreme Court has redefined the limits of Parliament’s amending power to protect the Constitution’s Basic Structure.” Analyse this statement in the light of judicial developments up to I.R. Coelho v. State of Tamil Nadu (2007).",
    },
    {
      id: "poly-22",
      title:
        "“Article 14 does not mandate absolute equality, but ensures equality among equals.” Examine this statement in the context of reasonable classification and intelligible differentia tests developed by the judiciary.",
      text: "“Article 14 does not mandate absolute equality, but ensures equality among equals.” Examine this statement in the context of reasonable classification and intelligible differentia tests developed by the judiciary.",
    },
    {
      id: "poly-23",
      title:
        "“Freedom of speech and expression under Article 19(1)(a) is not an absolute right; it carries with it duties and responsibilities.” Discuss in light of recent developments concerning freedom of the press, social media regulation, and public order.",
      text: "“Freedom of speech and expression under Article 19(1)(a) is not an absolute right; it carries with it duties and responsibilities.” Discuss in light of recent developments concerning freedom of the press, social media regulation, and public order.",
    },
    {
      id: "poly-24",
      title:
        "“The right to privacy is a fundamental right under Article 21, but it is not absolute and can be restricted for compelling state interests.” Critically analyze this statement with reference to the Puttaswamy judgment and subsequent developments in data protection and surveillance laws.",
      text: "“The right to privacy is a fundamental right under Article 21, but it is not absolute and can be restricted for compelling state interests.” Critically analyze this statement with reference to the Puttaswamy judgment and subsequent developments in data protection and surveillance laws.",
    },
    {
      id: "poly-25",
      title:
        "Critically examine the significance of Article 20 in ensuring fairness in India’s criminal justice system. How do the protections against ex post facto laws, double jeopardy, and self-incrimination reflect the broader ideals of rule of law and human dignity?",
      text: "Critically examine the significance of Article 20 in ensuring fairness in India’s criminal justice system. How do the protections against ex post facto laws, double jeopardy, and self-incrimination reflect the broader ideals of rule of law and human dignity?",
    },
    {
      id: "poly-26",
      title:
        "“The Right to Education under Article 21A is a transformative right, but its realization remains uneven.” Examine the constitutional, legislative, and administrative measures taken to implement this right, highlighting challenges in achieving quality and inclusivity in education.",
      text: "“The Right to Education under Article 21A is a transformative right, but its realization remains uneven.” Examine the constitutional, legislative, and administrative measures taken to implement this right, highlighting challenges in achieving quality and inclusivity in education.",
    },
  ],
  Geography: [
    {
      id: "geo-1",
      title: "Explain monsoon mechanism for Indian subcontinent.",
      text: "Explain monsoon mechanism for Indian subcontinent.",
    },
    {
      id: "geo-2",
      title: "Discuss distribution of natural vegetation in India.",
      text: "Discuss distribution of natural vegetation in India.",
    },
    {
      id: "geo-3",
      title: "Examine the factors influencing settlement patterns in India.",
      text: "Examine the factors influencing settlement patterns in India.",
    },
  ],
  Economics: [
    {
      id: "eco-1",
      title: "Explain inflation targeting and its pros/cons.",
      text: "Explain inflation targeting and its pros/cons.",
    },
    {
      id: "eco-2",
      title: "Discuss LPG reforms of 1991 and their impact.",
      text: "Discuss LPG reforms of 1991 and their impact.",
    },
    {
      id: "eco-3",
      title: "Examine the problem of unemployment in India.",
      text: "Examine the problem of unemployment in India.",
    },
  ],
  Sociology: [
    {
      id: "soc-1",
      title: "Discuss urbanization trends and impact in India.",
      text: "Discuss urbanization trends and impact in India.",
    },
    {
      id: "soc-2",
      title: "Examine caste and class as determinants of social structure.",
      text: "Examine caste and class as determinants of social structure.",
    },
    {
      id: "soc-3",
      title: "Explain role of media in social change.",
      text: "Explain role of media in social change.",
    },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  checkLocalUser();
  initCharts();
  fetchDashboard(); // pull existing data if any
});

function initUI() {
  const tabHome = document.getElementById("tab-home");
  const tabRevision = document.getElementById("tab-revision");
  const home = document.getElementById("home");
  const revision = document.getElementById("revision");

  tabHome.onclick = () => {
    setActiveTab("home");
  };
  tabRevision.onclick = () => {
    setActiveTab("revision");
  };

  document
    .getElementById("subjectSelect")
    .addEventListener("change", buildQuestionList);
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document
    .getElementById("submitAnswerBtn")
    .addEventListener("click", submitAnswerHandler);
  document
    .getElementById("registerBtn")
    .addEventListener("click", registerUser);

  // if first time, open register modal
  if (!localStorage.getItem("upsc_user")) {
    openRegisterModal();
  } else {
    currentUser = JSON.parse(localStorage.getItem("upsc_user"));
    updateWelcome();
  }
}

function setActiveTab(name) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".page").forEach((p) => p.classList.add("hidden"));
  if (name === "home") {
    document.getElementById("tab-home").classList.add("active");
    document.getElementById("home").classList.remove("hidden");
  } else {
    document.getElementById("tab-revision").classList.add("active");
    document.getElementById("revision").classList.remove("hidden");
  }
}

function openRegisterModal() {
  document.getElementById("registerModal").classList.remove("hidden");
}
function closeRegisterModal() {
  document.getElementById("registerModal").classList.add("hidden");
}

function checkLocalUser() {
  const u = localStorage.getItem("upsc_user");
  if (u) {
    currentUser = JSON.parse(u);
    updateWelcome();
  }
}

// ===== Registration Modal Handling =====
function openRegisterModal() {
  const modal = document.getElementById("registerModal");
  if (modal) modal.classList.remove("hidden");
}

function closeRegisterModal() {
  const modal = document.getElementById("registerModal");
  if (modal) modal.classList.add("hidden");
}

function registerUser() {
  const name = document.getElementById("regName").value.trim();
  if (!name) {
    alert("Please enter your name.");
    return;
  }
  const user = {
    id: "user_" + Date.now(),
    name,
    branch: document.getElementById("regBranch").value || "",
    sem: document.getElementById("regSem").value || "",
  };
  currentUser = user;
  localStorage.setItem("upsc_user", JSON.stringify(user));
  updateWelcome();
  closeRegisterModal();

  const params = new URLSearchParams({
    action: "register",
    user: JSON.stringify(user),
  });
  fetch(BACKEND_URL + "?" + params.toString())
    .then((resp) => resp.json())
    .then((data) => console.log("Registered:", data))
    .catch((err) => console.warn("register backend failed", err));
}

function updateWelcome() {
  if (currentUser)
    document.getElementById(
      "welcome"
    ).textContent = `Welcome ${currentUser.name}`;
}

function buildQuestionList() {
  const subj = document.getElementById("subjectSelect").value;
  const container = document.getElementById("questionList");
  container.innerHTML = "";
  if (!subj) return;
  const arr = questionsDB[subj] || [];
  arr.forEach((q) => {
    const item = document.createElement("div");
    item.className = "question-item";
    item.dataset.id = q.id;
    item.dataset.subj = subj;
    item.innerHTML = `<div class="title">${q.title}</div><div class="meta">▶</div>`;
    item.onclick = () => openQuestionModal(subj, q);
    container.appendChild(item);
  });
}

function openQuestionModal(subject, question) {
  // Close any open modals first
  document.querySelectorAll(".modal").forEach((m) => m.classList.add("hidden"));

  document.getElementById(
    "modalSubject"
  ).textContent = `${subject} — ${question.title}`;
  document.getElementById("questionText").textContent = question.text;
  document.getElementById("answerText").value = "";
  document.getElementById("evalResult").textContent = "";
  document.getElementById("questionModal").classList.remove("hidden");

  window._currentQuestion = { ...question, subject };
}

/////////////// Charting ///////////////////////
let lineChart = null;
let pieChart = null;

function initCharts() {
  // Destroy old charts if they exist (prevents stacking & height issue)
  if (lineChart) lineChart.destroy();
  if (pieChart) pieChart.destroy();

  // ✅ Default 7 days (all zeros)
  const defaultLineLabels = [
    "Day-6",
    "Day-5",
    "Day-4",
    "Day-3",
    "Day-2",
    "Day-1",
    "Today",
  ];
  const defaultLineData = Array(7).fill(0);

  const lineCtx = document.getElementById("scoreLineChart").getContext("2d");
  lineChart = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: defaultLineLabels,
      datasets: [
        {
          label: "Score",
          data: defaultLineData,
          fill: false,
          tension: 0.2,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true, // always start from 0
          suggestedMax: 100, // keep consistent scale
        },
      },
    },
  });

  // ✅ Default subjects (all zeros)
  const defaultPieLabels = [
    "History",
    "Polity",
    "Geography",
    "Economics",
    "Sociology",
  ];
  const defaultPieData = Array(defaultPieLabels.length).fill(0);

  const pieCtx = document.getElementById("subjectPie").getContext("2d");
  pieChart = new Chart(pieCtx, {
    type: "pie",
    data: { labels: defaultPieLabels, datasets: [{ data: defaultPieData }] },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            padding: 10,
          },
        },
      },
    },
  });

  // create dummy daily stack UI
  buildDummyStack();
}

function updateLineChart(labels, data) {
  // ✅ Always enforce 7 days, even if empty or partial
  const fixedLabels =
    labels && labels.length === 7
      ? labels
      : ["Day-6", "Day-5", "Day-4", "Day-3", "Day-2", "Day-1", "Today"];

  const fixedData = data && data.length === 7 ? data : Array(7).fill(0);

  lineChart.data.labels = fixedLabels;
  lineChart.data.datasets[0].data = fixedData;
  lineChart.update();
}

function updatePieChart(labels, data) {
  const defaultLabels = [
    "History",
    "Polity",
    "Geography",
    "Economics",
    "Sociology",
  ];
  const fixedLabels = labels && labels.length > 0 ? labels : defaultLabels;

  // ✅ pad with zeros if fewer subjects provided
  const fixedData =
    data && data.length === fixedLabels.length
      ? data
      : Array(fixedLabels.length).fill(0);

  pieChart.data.labels = fixedLabels;
  pieChart.data.datasets[0].data = fixedData;
  pieChart.update();
}

function buildDummyStack(dailyActivity = []) {
  const grid = document.getElementById("stackGrid");
  grid.innerHTML = "";

  // fallback: 56 empty
  const activity =
    dailyActivity.length === 56
      ? dailyActivity.slice().reverse()
      : Array(56).fill(0);

  activity.forEach((count) => {
    const div = document.createElement("div");
    let levelClass = "";

    if (count > 0) {
      if (count >= 5) levelClass = "level-3"; // high activity
      else if (count >= 3) levelClass = "level-2"; // medium
      else levelClass = "level-1"; // low
    }

    div.className = "stack-day " + levelClass;
    grid.appendChild(div);
  });
}

/////////////// Backend calls ////////////////////

async function fetchDashboard() {
  if (!currentUser) return;
  // call backend to get dashboard data (scores over time, subject stats, suggestions)
  try {
    const resp = await fetch(
      BACKEND_URL +
        `?action=getDashboard&userid=${encodeURIComponent(currentUser.id)}`
    );
    if (!resp.ok) throw new Error("network");
    const json = await resp.json();
    // expected shape: {scores:{labels:[],values:[]}, subjectStats:{labels:[],values:[]}, suggestions: "..." }
    if (json.scores) {
      updateLineChart(
        json.scores.labels || [],
        json.scores.values || json.scores.data || []
      );
    }
    if (json.subjectStats) {
      updatePieChart(
        json.subjectStats.labels || [],
        json.subjectStats.values || []
      );
    }
    if (json.suggestions) {
      document.getElementById("suggestions").textContent = json.suggestions;
    }
    if (json.dailyActivity) {
      buildDummyStack(json.dailyActivity);
    }
  } catch (e) {
    // fall back to demo data when offline
    const labels = [
      "Day-6",
      "Day-5",
      "Day-4",
      "Day-3",
      "Day-2",
      "Day-1",
      "Today",
    ];
    const values = [60, 64, 62, 70, 68, 72, 75];
    updateLineChart(labels, values);
    updatePieChart(
      ["History", "Polity", "Geography", "Economics", "Sociology"],
      [12, 8, 6, 5, 4]
    );
  }
}

async function submitAnswerHandler() {
  if (!currentUser) {
    alert("Please register first.");
    openRegisterModal();
    return;
  }
  const answer = document.getElementById("answerText").value.trim();
  if (!answer) {
    alert("Write an answer first");
    return;
  }
  const q = window._currentQuestion;
  if (!q) return;

  document.getElementById("submitAnswerBtn").disabled = true;
  document.getElementById("evalResult").textContent = "Evaluating...";

  const payload = {
    action: "submitAnswer",
    userid: currentUser.id,
    userName: currentUser.name,
    questionId: q.id,
    subject: q.subject,
    questionText: q.text,
    answerText: answer,
    timestamp: new Date().toISOString(),
  };

  try {
    const params = new URLSearchParams(payload);
    const res = await fetch(BACKEND_URL + "?" + params.toString());
    if (!res.ok) throw new Error("server error");
    const result = await res.json();

    document.getElementById(
      "evalResult"
    ).textContent = `Score: ${result.score}\nFeedback: ${result.feedback}`;

    if (result.updatedDashboard) {
      if (result.updatedDashboard.scores) {
        updateLineChart(
          result.updatedDashboard.scores.labels,
          result.updatedDashboard.scores.values
        );
      }
      if (result.updatedDashboard.subjectStats) {
        updatePieChart(
          result.updatedDashboard.subjectStats.labels,
          result.updatedDashboard.subjectStats.values
        );
      }
      if (result.updatedDashboard.suggestions) {
        document.getElementById("suggestions").textContent =
          result.updatedDashboard.suggestions;
      }
      if (result.updatedDashboard.dailyActivity) {
        buildDummyStack(result.updatedDashboard.dailyActivity);
      }
    }
  } catch (err) {
    console.error(err);
    alert("Failed to evaluate. Check console and backend URL.");
  } finally {
    document.getElementById("submitAnswerBtn").disabled = false;
  }
}
// Get modal and close button elements
const modal = document.getElementById("questionModal");
const closeBtn = document.getElementById("closeModal");

// Close modal when clicking on the close button
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden"); // hides modal
});
document.getElementById("themeToggle").addEventListener("click", () => {
  const root = document.documentElement;
  const isDark = root.getAttribute("data-theme") === "dark";
  root.setAttribute("data-theme", isDark ? "light" : "dark");

  // Optional: persist preference in localStorage
  localStorage.setItem("theme", isDark ? "light" : "dark");
});

// Load saved preference on startup
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  }
});
function getChartColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    bg: styles.getPropertyValue("--chart-bg").trim(),
    grid: styles.getPropertyValue("--chart-grid").trim(),
    label: styles.getPropertyValue("--chart-label").trim(),
  };
}

function buildLineChart(ctx, data) {
  const colors = getChartColors();
  return new Chart(ctx, {
    type: "line",
    data,
    options: {
      plugins: {
        legend: {
          labels: { color: colors.label },
        },
      },
      scales: {
        x: {
          ticks: { color: colors.label },
          grid: { color: colors.grid },
        },
        y: {
          ticks: { color: colors.label },
          grid: { color: colors.grid },
        },
      },
    },
  });
}

function buildPieChart(ctx, data) {
  const colors = getChartColors();
  return new Chart(ctx, {
    type: "pie",
    data,
    options: {
      plugins: {
        legend: {
          labels: { color: colors.label },
        },
      },
    },
  });
}
document.getElementById("themeToggle").addEventListener("click", () => {
  const root = document.documentElement;
  const isDark = root.getAttribute("data-theme") === "dark";
  root.setAttribute("data-theme", isDark ? "light" : "dark");

  // refresh chart colors
  lineChart.options.scales.x.ticks.color = getChartColors().label;
  lineChart.options.scales.y.ticks.color = getChartColors().label;
  lineChart.options.scales.x.grid.color = getChartColors().grid;
  lineChart.options.scales.y.grid.color = getChartColors().grid;
  lineChart.options.plugins.legend.labels.color = getChartColors().label;
  lineChart.update();

  pieChart.options.plugins.legend.labels.color = getChartColors().label;
  pieChart.update();

  localStorage.setItem("theme", isDark ? "light" : "dark");
});
///////////////////////////////////
function applyCanvasBackground(ctx) {
  const styles = getComputedStyle(document.documentElement);
  ctx.canvas.style.background = styles
    .getPropertyValue("--chart-canvas-bg")
    .trim();
}

function buildLineChart(ctx, data) {
  const colors = getChartColors();
  applyCanvasBackground(ctx);

  return new Chart(ctx, {
    type: "line",
    data,
    options: {
      plugins: {
        legend: {
          labels: { color: colors.label },
        },
      },
      scales: {
        x: {
          ticks: { color: colors.label },
          grid: { color: colors.grid },
        },
        y: {
          ticks: { color: colors.label },
          grid: { color: colors.grid },
        },
      },
    },
  });
}

function buildPieChart(ctx, data) {
  const colors = getChartColors();
  applyCanvasBackground(ctx);

  return new Chart(ctx, {
    type: "pie",
    data,
    options: {
      plugins: {
        legend: {
          labels: { color: colors.label },
        },
      },
    },
  });
}
////////////////////////////////
document.getElementById("themeToggle").addEventListener("click", () => {
  const root = document.documentElement;
  const isDark = root.getAttribute("data-theme") === "dark";
  root.setAttribute("data-theme", isDark ? "light" : "dark");

  const colors = getChartColors();

  // Update line chart
  applyCanvasBackground(lineChart.ctx);
  lineChart.options.scales.x.ticks.color = colors.label;
  lineChart.options.scales.y.ticks.color = colors.label;
  lineChart.options.scales.x.grid.color = colors.grid;
  lineChart.options.scales.y.grid.color = colors.grid;
  lineChart.options.plugins.legend.labels.color = colors.label;
  lineChart.update();

  // Update pie chart
  applyCanvasBackground(pieChart.ctx);
  pieChart.options.plugins.legend.labels.color = colors.label;
  pieChart.update();

  localStorage.setItem("theme", isDark ? "light" : "dark");
});
////////////////////////////////////
// Registration modal
const registerModal = document.getElementById("registerModal");
const closeRegisterModalBtn = document.getElementById("closeRegisterModal");

// Open modal function (example)
function openRegisterModal() {
  registerModal.classList.remove("hidden");
}

// Close modal on clicking the close button
closeRegisterModalBtn.addEventListener("click", () => {
  registerModal.classList.add("hidden");
});

// Optional: close modal on clicking outside the modal content
registerModal.addEventListener("click", (e) => {
  if (e.target === registerModal) {
    registerModal.classList.add("hidden");
  }
});
