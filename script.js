(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Typed role text ---------- */
  var roles = [
    "Manual Testing",
    "Device Testing",
    "Thermal Testing",
    "Regression Testing",
    "Linux & Scripts",
    "Automation Debugging"
  ];
  var typedEl = document.getElementById("typed");
  var r = 0, c = 0, deleting = false;

  function typeLoop() {
    var word = roles[r];
    typedEl.textContent = word.slice(0, c);
    if (!deleting && c < word.length) { c++; setTimeout(typeLoop, 85); }
    else if (!deleting) { deleting = true; setTimeout(typeLoop, 1500); }
    else if (c > 0) { c--; setTimeout(typeLoop, 40); }
    else { deleting = false; r = (r + 1) % roles.length; setTimeout(typeLoop, 300); }
  }
  if (reduceMotion) { typedEl.textContent = roles[0]; } else { typeLoop(); }

  /* ---------- Fake test run in the terminal ---------- */
  var lines = [
    ["t-dim",  "$ ./run_tests.sh --suite candidate_profile"],
    ["t-info", "[INFO] Loading test suite: thanush_raj_s"],
    ["t-info", "[INFO] Environment: Linux | Kindle | Chipset lab"],
    ["",       ""],
    ["t-pass", "[PASS] TC_001  Writes clear test cases ............ ok"],
    ["t-pass", "[PASS] TC_002  Finds bugs early ................... ok"],
    ["t-pass", "[PASS] TC_003  Regression & smoke testing ......... ok"],
    ["t-pass", "[PASS] TC_004  Thermal tests on Linux ............. ok"],
    ["t-warn", "[WARN] TC_005  Automation run failed, debugging..."],
    ["t-info", "[INFO]         Kiro: root cause found, re-running"],
    ["t-pass", "[PASS] TC_005  Automation run ..................... ok"],
    ["t-pass", "[PASS] TC_006  SQL data validation ................ ok"],
    ["t-pass", "[PASS] TC_007  Automates repeated manual work ..... ok"],
    ["",       ""],
    ["t-pass", "Result: 7/7 passed. Candidate ready to hire. \u2714"]
  ];
  var term = document.getElementById("termBody");

  function addLine(i) {
    if (i >= lines.length) { setTimeout(function () { term.innerHTML = ""; addLine(0); }, 6000); return; }
    var span = document.createElement("span");
    span.className = lines[i][0];
    span.textContent = lines[i][1] + "\n";
    term.appendChild(span);
    setTimeout(function () { addLine(i + 1); }, lines[i][0] === "t-warn" ? 1200 : 420);
  }
  if (reduceMotion) {
    lines.forEach(function (l) {
      var s = document.createElement("span"); s.className = l[0]; s.textContent = l[1] + "\n"; term.appendChild(s);
    });
  } else {
    setTimeout(function () { addLine(0); }, 600);
  }

  /* ---------- Reveal on scroll + number counters ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduceMotion) { el.textContent = target.toLocaleString(); return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      e.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- Scroll progress + nav border ---------- */
  var bar = document.getElementById("progress");
  var nav = document.getElementById("nav");
  window.addEventListener("scroll", function () {
    var h = document.documentElement;
    var pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = pct + "%";
    nav.classList.toggle("scrolled", h.scrollTop > 10);
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  var links = document.getElementById("navLinks");
  document.getElementById("menuBtn").addEventListener("click", function () { links.classList.toggle("open"); });
  links.addEventListener("click", function (e) { if (e.target.tagName === "A") links.classList.remove("open"); });

  /* ---------- Skill filters ---------- */
  var chips = document.querySelectorAll("#filters .chip");
  var skills = document.querySelectorAll("#skillCloud span");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (x) { x.classList.remove("active"); });
      chip.classList.add("active");
      var f = chip.getAttribute("data-f");
      skills.forEach(function (s) { s.classList.toggle("dim", f !== "all" && s.getAttribute("data-c") !== f); });
    });
  });

  /* ---------- Card spotlight follows mouse ---------- */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
      card.style.setProperty("--my", (e.clientY - rect.top) + "px");
    });
  });

  /* ---------- Copy email ---------- */
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 400); }, 1800);
  }
  document.getElementById("copyEmail").addEventListener("click", function () {
    var email = "thanushrajs016@gmail.com";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(function () { toast("Email copied!"); }, function () { toast(email); });
    } else { toast(email); }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
