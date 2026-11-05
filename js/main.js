(() => {
  const NUMBER = "233241280476";            // WhatsApp number, international format, no + or spaces
  const OPEN_DAYS = [5, 6, 0];              // Fri, Sat, Sun (0 = Sunday)
  const OPEN_MIN = 12 * 60, CLOSE_MIN = 20 * 60;
  const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  /* WhatsApp links: pre-fill the message with the category and spice level */
  const heatInputs = document.querySelectorAll('input[name="heat"]');
  const waLinks = document.querySelectorAll("[data-wa]");
  function updateLinks() {
    const heat = document.querySelector('input[name="heat"]:checked').value;
    document.body.dataset.heat = heat.toLowerCase();
    waLinks.forEach(a => {
      const cat = a.dataset.wa;
      const msg = cat
        ? `Hi RISA, I’d like to order from ${cat}. Spice level: ${heat}.`
        : `Hi RISA, I’d like to place an order. Spice level: ${heat}.`;
      a.href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(msg)}`;
      a.target = "_blank"; a.rel = "noopener";
    });
  }
  heatInputs.forEach(i => i.addEventListener("change", updateLinks));
  updateLinks();

  /* Open / closed badge, always calculated in Ghana time */
  function updateStatus() {
    const el = document.getElementById("status");
    try {
      const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Accra", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23"
      }).formatToParts(new Date()).map(x => [x.type, x.value]));
      const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(p.weekday);
      const mins = (+p.hour) * 60 + (+p.minute);
      const openToday = OPEN_DAYS.includes(day);
      el.className = "status";
      if (openToday && mins >= OPEN_MIN && mins < CLOSE_MIN) { el.classList.add("open"); el.textContent = "Open now, delivering until 8pm"; }
      else if (openToday && mins < OPEN_MIN) { el.textContent = "Opens today at 12pm"; }
      else {
        let n = 1; while (!OPEN_DAYS.includes((day + n) % 7)) n++;
        el.textContent = "Opens " + (n === 1 ? "tomorrow" : DAY_NAMES[(day + n) % 7]) + " at 12pm";
      }
    } catch (e) { el.textContent = "Friday to Sunday, 12pm to 8pm"; }
  }
  updateStatus(); setInterval(updateStatus, 60000);

  /* Gentle parallax on menu photos (skipped for reduced motion) */
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const shots = [...document.querySelectorAll(".shot")];
    let ticking = false;
    const run = () => {
      const vh = innerHeight;
      shots.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        s.style.setProperty("--p", ((r.top + r.height / 2) / vh - 0.5).toFixed(3));
      });
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }
})();
