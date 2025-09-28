/* action.js
  Simple front-end logic:
  - manages tabs, registration modal, question modal
  - draws charts with Chart.js
  - calls backend endpoints for register, fetch dashboard, submit answer
*/

const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbyrf6W0jnJcejhTPL7V8bTAf2jggbtC6aLToJXmCFluQRZheaChUXLR-nc86OZK1_5Ivg/exec"; // <-- REPLACE

// Basic state
let currentUser = null;
let questionsDB = {
  History: [
    {
      id: "hist-1",
      title: "Discuss causes of decline of Mauryan Empire.",
      text: "Discuss causes of decline of Mauryan Empire.",
    },
    {
      id: "hist-2",
      title: "Assess causes of 1857 revolt.",
      text: "Assess causes of 1857 revolt.",
    },
  ],
  Polity: [
    {
      id: "poly-1",
      title: "Explain separation of powers in Indian Constitution.",
      text: "Explain separation of powers in Indian Constitution.",
    },
  ],
  Geography: [
    {
      id: "geo-1",
      title: "Explain monsoon mechanism for Indian subcontinent.",
      text: "Explain monsoon mechanism for Indian subcontinent.",
    },
  ],
  Economics: [
    {
      id: "eco-1",
      title: "Explain inflation targeting and its pros/cons.",
      text: "Explain inflation targeting and its pros/cons.",
    },
  ],
  Sociology: [
    {
      id: "soc-1",
      title: "Discuss urbanization trends and impact in India.",
      text: "Discuss urbanization trends and impact in India.",
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

  // ✅ Close the modal after registration
  closeRegisterModal();

  // send to backend (store in sheet)
  fetch(BACKEND_URL + "?action=register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user }),
  }).catch((err) => console.warn("register backend failed", err));
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
    options: { responsive: true, maintainAspectRatio: false },
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

function buildDummyStack() {
  const grid = document.getElementById("stackGrid");
  grid.innerHTML = "";
  // create 14 columns x 4 rows => 56 days approx
  for (let i = 0; i < 56; i++) {
    const div = document.createElement("div");
    const level = 0; // ✅ start with all empty (no activity yet)
    div.className = "stack-day " + (level > 0 ? `level-${level}` : "");
    grid.appendChild(div);
  }
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
      updateLineChart(json.scores.labels || [], json.scores.values || []);
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

  try {
    // send to backend; backend will call Gemini & update sheet
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

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("server error");
    const result = await res.json();
    // result expected: {score: x, feedback: "...", updatedDashboard: {...} }
    document.getElementById(
      "evalResult"
    ).textContent = `Score: ${result.score}\nFeedback: ${result.feedback}`;
    // update dashboard client-side if returned
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
    }
  } catch (err) {
    console.error(err);
    alert("Failed to evaluate. Check console and backend URL.");
  } finally {
    document.getElementById("submitAnswerBtn").disabled = false;
  }
}
