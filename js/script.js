// Main script for Assignment 4 portfolio
(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // ---- STATE MANAGEMENT ----
  const STATE = {
    theme: localStorage.getItem("theme") || "dark",
    username: localStorage.getItem("username") || "",
    filter: localStorage.getItem("projectFilter") || "all",
    sort: localStorage.getItem("projectSort") || "newest",
    search: "",
    showProjects: localStorage.getItem("showProjects") !== "false",
    experienceLevel: localStorage.getItem("experienceLevel") || "beginner",
    sessionStart: performance.now(),
    skillsFocus: localStorage.getItem("skillsFocus") || "all",
    skillsThreshold: Number(localStorage.getItem("skillsThreshold") || "1"),
    skillsSelection: 0
  };

  // Example project data
  const PROJECTS = [
    {
      id: 1,
      title: "Landing Page UI",
      type: "frontend",
      level: "beginner",
      date: "2024-01-12",
      tags: ["HTML", "CSS", "responsive"]
    },
    {
      id: 2,
      title: "Portfolio Website",
      type: "frontend",
      level: "intermediate",
      date: "2024-02-03",
      tags: ["HTML", "CSS", "JavaScript"]
    },
    {
      id: 3,
      title: "Weather Dashboard",
      type: "fullstack",
      level: "intermediate",
      date: "2024-03-22",
      tags: ["API", "JavaScript", "JSON"]
    },
    {
      id: 4,
      title: "Node.js API Practice",
      type: "practice",
      level: "advanced",
      date: "2024-04-05",
      tags: ["Node.js", "REST", "backend"]
    },
    {
      id: 5,
      title: "JavaScript Mini Games",
      type: "practice",
      level: "beginner",
      date: "2024-01-28",
      tags: ["logic", "DOM", "events"]
    }
  ];

  // Skills heatmap data
  const SKILLS = [
    { name: "HTML and CSS", category: "frontend", strength: 5, note: "Semantic HTML and modern layouts." },
    { name: "Design Systems", category: "frontend", strength: 4, note: "Reusable components and tokens." },
    { name: "Accessibility", category: "frontend", strength: 4, note: "Keyboard-first, semantic patterns." },
    { name: "JavaScript (ESNext)", category: "frontend", strength: 5, note: "State, events, and performance." },
    { name: "APIs and JSON", category: "backend", strength: 4, note: "REST patterns and error handling." },
    { name: "Node.js Basics", category: "backend", strength: 3, note: "Express-style routing and testing." },
    { name: "Data Modeling", category: "backend", strength: 3, note: "Shaping data contracts for UI." },
    { name: "Tooling and DX", category: "tooling", strength: 4, note: "Linters, formatters, and scripts." },
    { name: "Git and Workflow", category: "tooling", strength: 5, note: "Branching, reviews, deployment." }
  ];

  // ---- THEME ----
  const applyTheme = () => {
    document.documentElement.setAttribute("data-theme", STATE.theme);
    const toggleBtn = $("#theme-toggle");
    if (toggleBtn) {
      toggleBtn.textContent = STATE.theme === "dark" ? "moon" : "sun";
      toggleBtn.title = `Switch to ${STATE.theme === "dark" ? "light" : "dark"} mode`;
    }
  };

  const initTheme = () => {
    applyTheme();
    const toggleBtn = $("#theme-toggle");
    if (!toggleBtn) return;
    toggleBtn.addEventListener("click", () => {
      STATE.theme = STATE.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", STATE.theme);
      applyTheme();
    });
  };

  // ---- HERO NAME + GREETING ----
  const initNameForm = () => {
    const heroName = $("#hero-name");
    const nameInput = $("#name-input");
    const nameForm = $("#name-form");
    const feedback = $("#name-feedback");

    if (!nameForm || !nameInput || !heroName) return;

    if (STATE.username) {
      heroName.textContent = STATE.username;
      nameInput.value = STATE.username;
      feedback.textContent = "Welcome back!";
    }

    nameForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = nameInput.value.trim();
      if (!value) {
        feedback.textContent = "Please enter a name.";
        return;
      }
      STATE.username = value;
      localStorage.setItem("username", STATE.username);
      heroName.textContent = STATE.username;
      feedback.textContent = "Nice to meet you!";
    });
  };

  // ---- SESSION TIMER ----
  const initTimer = () => {
    const timerEl = $("#session-timer");
    if (!timerEl) return;

    const update = () => {
      const elapsedMs = performance.now() - STATE.sessionStart;
      const seconds = Math.floor(elapsedMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSec = seconds % 60;
      if (minutes === 0) {
        timerEl.textContent = `You have been here for ${seconds}s.`;
      } else {
        timerEl.textContent = `You have been here for ${minutes}m ${remainingSec}s.`;
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  // ---- EXPERIENCE LEVEL LOGIC ----
  const EXPERIENCE_TEXTS = {
    beginner: "Showing beginner-friendly projects with lots of visual feedback and simple layouts.",
    intermediate: "Showing a mix of real-world and practice projects with some JavaScript logic.",
    advanced: "Highlighting more advanced and technical projects that focus on APIs and architecture."
  };

  const initExperience = () => {
    const buttons = $$(".experience-buttons button");
    const msg = $("#experience-message");
    const filterSelect = $("#filter");

    if (!buttons.length || !msg || !filterSelect) return;

    const applyLevel = (level) => {
      STATE.experienceLevel = level;
      localStorage.setItem("experienceLevel", level);

      buttons.forEach((btn) => {
        const active = btn.dataset.level === level;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", String(active));
      });

      msg.textContent = EXPERIENCE_TEXTS[level];

      // Example complex logic: experience level influences filter.
      if (level === "beginner") {
        STATE.filter = "frontend";
      } else if (level === "intermediate") {
        STATE.filter = "all";
      } else {
        STATE.filter = "fullstack";
      }
      filterSelect.value = STATE.filter;
      localStorage.setItem("projectFilter", STATE.filter);

      renderProjects();
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => applyLevel(btn.dataset.level));
    });

    applyLevel(STATE.experienceLevel);
  };

  // ---- PROJECT RENDERING / COMPLEX LOGIC ----
  const applyProjectFilterSortSearch = () => {
    let list = [...PROJECTS];

    if (STATE.filter !== "all") {
      list = list.filter((p) => p.type === STATE.filter);
    }

    if (STATE.search) {
      const term = STATE.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term))
      );
    }

    list.sort((a, b) => {
      if (STATE.sort === "newest") return new Date(b.date) - new Date(a.date);
      if (STATE.sort === "oldest") return new Date(a.date) - new Date(b.date);
      if (STATE.sort === "az") return a.title.localeCompare(b.title);
      if (STATE.sort === "za") return b.title.localeCompare(a.title);
      return 0;
    });

    return list;
  };

  const renderProjects = () => {
    const container = $("#projects-list");
    const empty = $("#projects-empty");
    const section = $("#projects-section");
    if (!container || !empty || !section) return;

    section.style.display = STATE.showProjects ? "" : "none";
    if (!STATE.showProjects) return;

    const list = applyProjectFilterSortSearch();
    container.innerHTML = "";

    if (!list.length) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");

    list.forEach((p) => {
      const card = document.createElement("article");
      card.className = "project fade-in";
      card.innerHTML = `
        <h3>${p.title}</h3>
        <small class="muted">
          Type: ${p.type} | Level: ${p.level} | Date: ${new Date(p.date).toLocaleDateString()}
        </small>
        <p class="muted">Tags: ${p.tags.join(", ")}</p>
      `;
      container.appendChild(card);
    });

    observeInView();
  };

  const initProjectControls = () => {
    const filterSelect = $("#filter");
    const sortSelect = $("#sort");
    const searchInput = $("#search");
    const toggleBtn = $("#toggle-projects");
    const section = $("#projects-section");

    if (!section) return;

    if (filterSelect) {
      filterSelect.value = STATE.filter;
      filterSelect.addEventListener("change", (e) => {
        STATE.filter = e.target.value;
        localStorage.setItem("projectFilter", STATE.filter);
        renderProjects();
      });
    }

    if (sortSelect) {
      sortSelect.value = STATE.sort;
      sortSelect.addEventListener("change", (e) => {
        STATE.sort = e.target.value;
        localStorage.setItem("projectSort", STATE.sort);
        renderProjects();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        STATE.search = e.target.value.trim();
        renderProjects();
      });
    }

    if (toggleBtn) {
      if (!STATE.showProjects) {
        toggleBtn.textContent = "Show projects";
      }
      toggleBtn.addEventListener("click", () => {
        STATE.showProjects = !STATE.showProjects;
        localStorage.setItem("showProjects", String(STATE.showProjects));
        toggleBtn.textContent = STATE.showProjects ? "Hide projects" : "Show projects";
        renderProjects();
      });
    }

    renderProjects();
  };

  // ---- INTERSECTION OBSERVER FOR FADE-IN ----
  let observer;
  const observeInView = () => {
    if (!("IntersectionObserver" in window)) {
      $$(".fade-in").forEach((el) => el.classList.add("visible"));
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
    }

    $$(".fade-in").forEach((el) => observer.observe(el));
  };

  // ---- CONTACT FORM VALIDATION ----
  const initContactForm = () => {
    const form = $("#contact-form");
    if (!form) return;

    const nameInput = $("#contact-name");
    const emailInput = $("#contact-email");
    const msgInput = $("#contact-message");
    const feedback = $("#contact-feedback");

    const showError = (id, message) => {
      const el = document.querySelector(`[data-error-for="${id}"]`);
      if (el) el.textContent = message || "";
    };

    const validate = () => {
      let valid = true;

      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        showError("contact-name", "Name is required.");
        valid = false;
      } else {
        showError("contact-name", "");
      }

      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        showError("contact-email", "Email is required.");
        valid = false;
      } else if (!emailRegex.test(emailVal)) {
        showError("contact-email", "Please enter a valid email address.");
        valid = false;
      } else {
        showError("contact-email", "");
      }

      const msgVal = msgInput.value.trim();
      if (!msgVal) {
        showError("contact-message", "Message is required.");
        valid = false;
      } else if (msgVal.length < 20) {
        showError("contact-message", "Message should be at least 20 characters long.");
        valid = false;
      } else {
        showError("contact-message", "");
      }

      return valid;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) {
        feedback.textContent = "Please fix the highlighted errors before submitting.";
        return;
      }

      feedback.textContent = "Thank you! Your message has been (pretend) sent.";
      form.reset();
    });
  };

  // ---- GITHUB API INTEGRATION ----
  const initGithubSection = () => {
    const listEl = $("#github-repos");
    const statusEl = $("#github-status");
    const refreshBtn = $("#github-refresh");
    const usernameInput = $("#github-username");

    if (!listEl || !statusEl || !refreshBtn || !usernameInput) return;

    const renderRepos = (repos) => {
      listEl.innerHTML = "";
      if (!repos.length) {
        listEl.innerHTML = '<p class="muted">No public repositories found.</p>';
        return;
      }

      repos.forEach((repo) => {
        const card = document.createElement("article");
        card.className = "project fade-in";
        card.innerHTML = `
          <h4>${repo.name}</h4>
          <p class="muted">${repo.description || "No description provided."}</p>
          <small class="muted">
            Stars: ${repo.stargazers_count} | Updated: ${new Date(
              repo.updated_at
            ).toLocaleDateString()}
          </small>
          <p>
            <a href="${repo.html_url}" target="_blank" rel="noopener">
              View on GitHub
            </a>
          </p>
        `;
        listEl.appendChild(card);
      });

      observeInView();
    };

    const fetchRepos = async () => {
      const username = usernameInput.value.trim();
      if (!username) {
        statusEl.textContent = "Please enter a GitHub username.";
        return;
      }

      statusEl.textContent = "Loading latest repositories...";
      listEl.innerHTML = "";

      try {
        const res = await fetch(
          `https://api.github.com/users/${encodeURIComponent(
            username
          )}/repos?sort=updated&per_page=6`
        );

        if (res.status === 404) {
          statusEl.textContent = "GitHub user not found. Please check the username.";
          return;
        }

        if (!res.ok) {
          throw new Error("GitHub API error: " + res.status);
        }

        const data = await res.json();
        renderRepos(data);
        statusEl.textContent = `Showing most recently updated repositories for @${username}.`;
      } catch (err) {
        console.error(err);
        statusEl.textContent =
          "Sorry, GitHub data is unavailable right now. Please try again later.";
      }
    };

    refreshBtn.addEventListener("click", fetchRepos);
    fetchRepos();
  };

  // ---- SKILLS HEATMAP (unique feature) ----
  const renderSkills = () => {
    const grid = $("#skills-grid");
    const chip = $("#skills-focus-chip");
    const thresholdLabel = $("#skills-threshold-label");
    if (!grid || !chip || !thresholdLabel) return;

    thresholdLabel.textContent = `Showing strength ${STATE.skillsThreshold}+`;

    const filtered = SKILLS.filter(
      (skill) =>
        (STATE.skillsFocus === "all" || skill.category === STATE.skillsFocus) &&
        skill.strength >= STATE.skillsThreshold
    );

    chip.textContent =
      STATE.skillsFocus === "all"
        ? "All focus areas"
        : `Focus pinned: ${STATE.skillsFocus}`;

    grid.innerHTML = "";
    filtered.forEach((skill, index) => {
      const cell = document.createElement("button");
      cell.className = "heatmap-cell fade-in";
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `${skill.name}, strength ${skill.strength} out of 5`);
      cell.dataset.index = String(index);
      cell.dataset.category = skill.category;
      cell.dataset.strength = String(skill.strength);
      cell.tabIndex = 0;
      cell.innerHTML = `
        <div class="heatmap-top">
          <span class="heatmap-name">${skill.name}</span>
          <span class="heatmap-strength">${"#".repeat(skill.strength)}</span>
        </div>
        <p class="muted small">${skill.note}</p>
        <span class="heatmap-category">${skill.category}</span>
      `;
      grid.appendChild(cell);
    });

    STATE.skillsSelection = Math.min(STATE.skillsSelection, filtered.length - 1);
    if (STATE.skillsSelection < 0) STATE.skillsSelection = 0;
    highlightSkill();
    observeInView();
  };

  const highlightSkill = () => {
    const cells = $$(".heatmap-cell");
    cells.forEach((cell, idx) => {
      const active = idx === STATE.skillsSelection;
      cell.classList.toggle("active", active);
      if (active) {
        cell.focus();
      }
    });
  };

  const changeSkillSelection = (delta, columns = 3) => {
    const cells = $$(".heatmap-cell");
    if (!cells.length) return;
    const nextIndex = Math.min(
      Math.max(0, STATE.skillsSelection + delta),
      cells.length - 1
    );
    STATE.skillsSelection = nextIndex;
    highlightSkill();
  };

  const initSkills = () => {
    const focusSelect = $("#skills-focus");
    const thresholdInput = $("#skills-threshold");
    const grid = $("#skills-grid");

    if (!focusSelect || !thresholdInput || !grid) return;

    focusSelect.value = STATE.skillsFocus;
    thresholdInput.value = String(STATE.skillsThreshold);

    focusSelect.addEventListener("change", (e) => {
      STATE.skillsFocus = e.target.value;
      localStorage.setItem("skillsFocus", STATE.skillsFocus);
      STATE.skillsSelection = 0;
      renderSkills();
    });

    thresholdInput.addEventListener("input", (e) => {
      STATE.skillsThreshold = Number(e.target.value);
      localStorage.setItem("skillsThreshold", String(STATE.skillsThreshold));
      STATE.skillsSelection = 0;
      renderSkills();
    });

    grid.addEventListener("keydown", (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowLeft":
          changeSkillSelection(-1);
          break;
        case "ArrowRight":
          changeSkillSelection(1);
          break;
        case "ArrowUp":
          changeSkillSelection(-3);
          break;
        case "ArrowDown":
          changeSkillSelection(3);
          break;
        case "Enter": {
          const cells = $$(".heatmap-cell");
          const active = cells[STATE.skillsSelection];
          if (active && active.dataset.category) {
            const current = STATE.skillsFocus;
            const next =
              current === active.dataset.category ? "all" : active.dataset.category;
            STATE.skillsFocus = next;
            localStorage.setItem("skillsFocus", STATE.skillsFocus);
            focusSelect.value = STATE.skillsFocus;
            STATE.skillsSelection = 0;
            renderSkills();
          }
          break;
        }
        default:
          break;
      }
    });

    renderSkills();
  };

  // ---- INIT ----
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNameForm();
    initTimer();
    initProjectControls();
    initExperience();
    initContactForm();
    initGithubSection();
    initSkills();
    observeInView();
  });
})();
