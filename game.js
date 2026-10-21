/* Caravan and Sea Routes: screens. Rules are in core.js, content is in data.js.
   No accounts and no tracking. A game in progress is saved only in this browser. */
(function () {
  "use strict";
  var D = window.CARAVAN, MAP = window.MAP, CC = window.CaravanCore;
  var app = document.getElementById("app");
  var S = null, phase = "title", overlay = null, cur = null, focusSel = null;
  var SAVE = "caravanGame_v1";
  var HOMES = ["timbuktu", "cairo", "quanzhou", "venice"];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function save() { try { localStorage.setItem(SAVE, JSON.stringify(S)); } catch (e) {} }
  function loadSave() { try { var r = localStorage.getItem(SAVE); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function clearSave() { try { localStorage.removeItem(SAVE); } catch (e) {} }
  function stars(n) { return "★".repeat(n) + "☆".repeat(3 - n); }
  function proj(lon, lat) { return [(lon - MAP.lon0) * MAP.scale, (MAP.lat1 - lat) * MAP.scale]; }
  function go(p) { phase = p; render(); }

  /* ---------- the map ---------- */
  function routePath(r) {
    var A = CC.city(r.a), B = CC.city(r.b), pts = [[A.lon, A.lat]].concat(r.via || []).concat([[B.lon, B.lat]]);
    return "M" + pts.map(function (p) { var q = proj(p[0], p[1]); return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join("L");
  }
  var SEA_LABELS = [["Mediterranean Sea", 17, 35.2], ["Arabian Sea", 62, 15.5], ["Indian Ocean", 70, 3], ["South China Sea", 112, 11], ["Atlantic Ocean", -13, 38]];
  var LAND_LABELS = [["SAHARA DESERT", 8, 24], ["ARABIAN DESERT", 45, 25.5], ["CENTRAL ASIA", 74, 47], ["CHINA", 106, 41], ["INDIA", 80, 21], ["EUROPE", 14, 51]];
  function mapSVG(showHere) {
    var cur = S ? S.city : null, reach = {};
    if (S) CC.routesFrom(S.city).forEach(function (rt) { reach[rt.to] = rt; });
    var h = '<svg class="map" viewBox="0 0 ' + MAP.w + " " + MAP.h + '" role="img" aria-label="Map of medieval trade routes from West Africa to China">';
    h += '<rect width="' + MAP.w + '" height="' + MAP.h + '" class="sea"/><path class="land" d="' + MAP.land + '"/>';
    SEA_LABELS.forEach(function (l) { var q = proj(l[1], l[2]); h += '<text class="lbl-sea" x="' + q[0] + '" y="' + q[1] + '">' + l[0] + "</text>"; });
    LAND_LABELS.forEach(function (l) { var q = proj(l[1], l[2]); h += '<text class="lbl-land" x="' + q[0] + '" y="' + q[1] + '">' + l[0] + "</text>"; });
    D.routes.forEach(function (r) {
      var act = S && (r.a === cur || r.b === cur);
      h += '<path class="route ' + (r.sea ? "sea-route" : "land-route") + (act ? " active" : "") + '" d="' + routePath(r) + '"><title>' + esc(r.name) + "</title></path>";
    });
    D.cities.forEach(function (c) {
      var q = proj(c.lon, c.lat), here = S && c.id === cur, can = reach[c.id], seen = S && S.visited[c.id];
      var cls = "city" + (here ? " here" : "") + (can ? " reach" : "") + (seen ? " seen" : "");
      var attrs = can ? ' tabindex="0" role="button" data-act="plan" data-to="' + c.id + '" aria-label="Plan a trip to ' + esc(c.name) + '"' : "";
      h += '<g class="' + cls + '"' + attrs + '><circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (here ? 11 : 8) + '"/>';
      if (here) h += '<text class="pin" x="' + q[0] + '" y="' + (q[1] - 16) + '">📍</text>';
      h += '<text class="lbl-city" x="' + (q[0] + c.lx) + '" y="' + (q[1] + c.ly) + '" text-anchor="' + c.anchor + '">' + esc(c.name) + "</text></g>";
    });
    return h + "</svg>";
  }

  /* ---------- small pieces ---------- */
  function statusBar() {
    var left = CC.daysLeft(S), c = CC.city(S.city);
    return '<header class="status"><div class="here"><span class="k">You are in</span><strong>' + esc(c.name) + '</strong></div>' +
      '<div><span class="k">Coins</span><strong>🪙 ' + S.coins + '</strong></div>' +
      '<div><span class="k">Days left</span><strong>' + left + '</strong></div>' +
      '<div><span class="k">Month</span><strong>' + CC.monthName(S.day) + '</strong></div>' +
      '<div class="btns"><button class="btn small" data-act="journal" type="button">📖 Journal (' + S.journal.length + ')</button>' +
      '<button class="btn small ghost" data-act="home" type="button">Quit</button></div></header>';
  }
  /* ---------- screens ---------- */
  function viewTitle() {
    var saved = loadSave();
    var h = '<div class="titlewrap"><h1>' + esc(D.title) + '</h1><p class="lead">' + esc(D.subtitle) + "</p>" + mapSVG() + D.intro.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    h += '<aside class="note"><h3>About this game</h3><p>' + esc(D.aboutNote) + "</p></aside>";
    h += '<div class="row wrap"><button class="btn ghost" data-act="glossary" type="button">📚 Words to know</button><button class="btn ghost" data-act="teacher" type="button">Teacher notes</button></div>';
    h += '<h2>Choose your home city</h2><div class="homes">';
    HOMES.forEach(function (id) {
      var c = CC.city(id);
      h += '<button class="homecard" data-act="start" data-home="' + id + '" type="button"><strong>' + esc(c.name) + "</strong><span>" + esc(c.homeBlurb) + "</span></button>";
    });
    h += "</div>";
    if (saved && !saved.over) h += '<p><button class="btn" data-act="continue" type="button">Continue my trip (' + esc(CC.city(saved.city).name) + ", " + CC.daysLeft(saved) + " days left)</button></p>";
    return h + "</div>";
  }

  function viewCard() {
    var c = CC.city(S.city), q = c.quiz, h = statusBar() + '<section class="card big"><p class="era">' + esc(c.era) + "</p><h2>" + esc(c.card.title) + "</h2>";
    if (c.say) h += '<p class="say">Say it: ' + esc(c.say) + "</p>";
    h += "<p>" + esc(c.card.text) + '</p></section><section class="card"><h3>Merchant\'s question</h3><p>' + esc(q.q) + '</p><div class="choices">';
    q.options.forEach(function (o, i) {
      var cls = "choice";
      if (cur.picked !== null) { cls += i === q.answer ? " right" : (i === cur.picked ? " wrong" : " dim"); }
      h += '<button class="' + cls + '" data-act="answer" data-i="' + i + '" type="button"' + (cur.picked !== null ? " disabled" : "") + ">" + esc(o) + "</button>";
    });
    h += "</div>";
    if (cur.picked !== null) {
      h += '<p class="feedback ' + (cur.picked === q.answer ? "ok" : "no") + '">' + (cur.picked === q.answer ? "★ Correct! " : "Not quite. ") + esc(q.explain) + '</p><p><button class="btn primary" data-act="after-card" type="button">Continue to the market</button></p>';
    }
    return h + "</section>";
  }

  function viewMansa() {
    var m = D.mansa;
    return statusBar() + '<section class="card big"><p class="era">Cairo, a historical event</p><h2>👑 ' + esc(m.title) + "</h2><p>" + esc(m.text) + '</p><p class="lesson">' + esc(m.lesson) +
      '</p><p><button class="btn primary" data-act="after-mansa" type="button">Go to the market</button></p></section>';
  }

  function viewMarket() {
    var c = CC.city(S.city), h = statusBar();
    if (S.note) h += '<p class="banner">' + esc(S.note) + "</p>";
    h += '<div class="cols"><div class="left"><section class="card flush">' + mapSVG(true) + '<p class="legend"><span class="lg land-route"></span> Land route <span class="lg sea-route"></span> Sea route</p></section>';
    h += '<section class="card"><h2>Where will you go?</h2>' + travelList() + "</section></div>";
    h += '<div class="right"><section class="card nopad"><div class="mkthead"><h2>Market in ' + esc(c.name) + '</h2><p class="muted">The ruler\'s market tax: ' + Math.round(c.tax * 100) + "% of what you sell.</p>" + cargoBar() + "</div>" + marketTable();
    h += '<p class="mktfoot"><button class="btn small" data-act="upgrade" type="button"' + (CC.canUpgrade(S) ? "" : " disabled") + ">🐪 Hire more pack animals or cargo space (+" + D.upgrade.extra + " space, " + D.upgrade.cost + " coins)" + (S.upgrades >= D.upgrade.max ? " (maximum)" : "") + "</button></p></section></div></div>";
    return h;
  }
  function cargoBar() {
    var used = CC.load(S), pct = Math.round(used / S.cap * 100), rs = CC.reserve(S);
    return '<div class="cargo"><div class="row"><strong>Cargo space</strong><span>' + used + " of " + S.cap + ' used</span><strong class="coinsline">🪙 ' + S.coins + " coins</strong></div>" +
      '<div class="bar" role="img" aria-label="Cargo space ' + used + " of " + S.cap + '"><div class="fill" style="width:' + pct + '%"></div></div>' +
      (rs ? '<p class="reserve">🧭 The game keeps <strong>' + rs + " coins</strong> in your purse for the cheapest trip from here, so you can always travel.</p>" : "") + "</div>";
  }
  function marketTable() {
    var rs = CC.reserve(S), h = '<div class="mt"><div class="mh">Good</div><div class="mh">Price here</div><div class="mh">You have</div><div class="mh">Trade</div>';
    D.goods.forEach(function (g) {
      var lab = CC.priceLabel(S, g.id), n = S.cargo[g.id], p = CC.price(S, g.id), sp = CC.sellPrice(S, g.id);
      var canBuy = S.coins - p >= rs && CC.room(S) >= g.w;
      h += '<div class="mname"><span class="emo" aria-hidden="true">' + g.emoji + "</span><div><strong>" + g.name + '</strong><small>Space: ' + g.w + " each</small></div></div>";
      h += '<div class="mprice"><strong>' + p + '</strong> <span class="chip ' + lab + '">' + (lab === "cheap" ? "Cheap here" : lab === "high" ? "Wanted here" : "Fair price") + "</span><small>Sells for " + sp + " after tax</small></div>";
      h += '<div class="mhave"><strong>' + n + "</strong>" + (n ? "<small>You paid about " + CC.avgPaid(S, g.id) + " each</small>" : "") + "</div>";
      h += '<div class="mbtn"><button class="btn tiny" data-act="buy" data-g="' + g.id + '" data-n="1" type="button"' + (canBuy ? "" : " disabled") + ' aria-label="Buy 1 ' + g.name + '">Buy 1</button>' +
        '<button class="btn tiny" data-act="buy" data-g="' + g.id + '" data-n="5" type="button"' + (canBuy ? "" : " disabled") + ' aria-label="Buy up to 5 ' + g.name + '">Buy 5</button>' +
        '<button class="btn tiny alt" data-act="sell" data-g="' + g.id + '" data-n="1" type="button"' + (n ? "" : " disabled") + ' aria-label="Sell 1 ' + g.name + '">Sell 1</button>' +
        '<button class="btn tiny alt" data-act="sell" data-g="' + g.id + '" data-n="99" type="button"' + (n ? "" : " disabled") + ' aria-label="Sell all ' + g.name + '">Sell all</button></div>';
    });
    return h + "</div>";
  }
  function travelList() {
    var routes = CC.routesFrom(S.city), h = '<ul class="trips">', any = false;
    routes.forEach(function (rt) {
      var to = CC.city(rt.to), r = rt.route, w = CC.wind(S, rt), enoughDays = CC.daysLeft(S) >= r.days, enoughCoins = S.coins >= r.cost;
      var ok = enoughDays && enoughCoins; if (ok) any = true;
      var hint = CC.hints(rt.to).wanted.map(function (x) { return x.emoji + " " + x.name + (S.cargo[x.id] > 0 ? " ✓" : ""); });
      h += '<li><button class="trip" data-act="plan" data-to="' + rt.to + '" type="button"' + (ok ? "" : " disabled") + "><strong>→ " + esc(to.name) + "</strong>" +
        "<span>" + r.days + " days, " + r.cost + " coins</span>" +
        (w.sea ? '<span class="chip ' + (w.ok ? "cheap" : "high") + '">' + (w.ok ? "Winds favor sailing" : "Winds against you") + "</span>" : "") +
        (!enoughDays ? '<span class="chip high">Not enough days left</span>' : !enoughCoins ? '<span class="chip high">Need ' + r.cost + " coins</span>" : "") +
        (hint.length ? '<span class="want">Merchants there want: ' + esc(hint.join(", ")) + "</span>" : "") + "</button></li>";
    });
    h += "</ul>";
    if (!any) h += '<p class="banner warn">You can\'t make another trip from here. ' + (CC.daysLeft(S) < 20 ? "Not enough days are left." : "Try selling some goods for coins.") + "</p>";
    h += '<div class="row wrap"><button class="btn small" data-act="guide" type="button">📜 Merchants\' price guide</button><button class="btn small ghost" data-act="finish" type="button">Finish my journey</button></div>';
    return h;
  }

  function viewDepart() {
    var rt = cur.rt, to = CC.city(rt.to), r = rt.route, w = CC.wind(S, rt), from = CC.city(S.city);
    var h = statusBar() + '<section class="card big"><p class="era">' + esc(r.name) + "</p><h2>" + esc(from.name) + " → " + esc(to.name) + "</h2>";
    h += "<p>The trip takes about <strong>" + r.days + " days</strong> and costs <strong>" + r.cost + " coins</strong> for supplies and guides. You have " + S.coins + " coins and " + CC.daysLeft(S) + " days left.</p>";
    var hz = { sahara: "Desert crossing: sandstorms and little water.", desert: "Desert road: heat, sandstorms, little water.", mountain: "Mountain roads: snow, steep passes, robbers.", road: "Roads and rivers.", sea_med: "Sea voyage: storms, calms, and pirates.", sea_ocean: "Ocean voyage: storms, calms, and pirates." }[r.type];
    h += '<p class="muted">Likely troubles: ' + esc(hz) + "</p>";
    if (w.sea && r.wind) {
      h += '<div class="windbox ' + (w.ok ? "good" : "bad") + '"><h3>🌬️ Season check</h3><p>' + esc(r.windNote) + "</p><p><strong>It is " + CC.monthName(S.day) + ". " + (w.ok ? "Winds favor you now." : "Winds are against you now.") + "</strong></p>";
      if (!w.ok) {
        var firstGood = CC.monthName(S.day + w.waitDays);
        h += "<p>Good winds start in <strong>" + firstGood + "</strong>, about " + w.waitDays + " days from now.</p>";
        var canWait = CC.daysLeft(S) >= w.waitDays + r.days;
        h += '<div class="row wrap"><button class="btn primary" data-act="wait-go" type="button"' + (canWait ? "" : " disabled") + ">Wait " + w.waitDays + " days in port, then sail</button>" +
          '<button class="btn" data-act="sail-anyway" type="button">Sail now anyway (the trip takes about 40% longer, and a storm is likely)</button></div>';
      }
      h += "</div>";
    }
    if (!w.sea || !r.wind || w.ok) h += '<p><button class="btn primary" data-act="depart" type="button">Depart</button></p>';
    h += '<p><button class="btn ghost" data-act="cancel-trip" type="button">Stay and keep trading</button></p></section>';
    return h;
  }

  function viewEvent() {
    var ev = cur.ev, h = statusBar() + '<section class="card big"><p class="era">On the road to ' + esc(CC.city(S.trip.to).name) + "</p><h2>" + ev.emoji + " " + esc(ev.title) + "</h2><p>" + esc(ev.text) + "</p>";
    if (!cur.result) {
      h += '<div class="choices">';
      ev.choices.forEach(function (c, i) { h += '<button class="choice" data-act="choice" data-i="' + i + '" type="button"><strong>' + esc(c.label) + "</strong><span>" + esc(c.desc) + "</span></button>"; });
      h += "</div>";
    } else {
      h += '<p class="feedback ok">' + esc(cur.result.text) + "</p>";
      if (cur.result.report.length) h += '<ul class="report">' + cur.result.report.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      h += '<p><button class="btn primary" data-act="arrive" type="button">Continue the journey</button></p>';
    }
    return h + "</section>";
  }

  function viewFinal() {
    var sc = CC.score(S), f = cur.fin;
    var h = '<div class="titlewrap"><h1>Your journey ends</h1>';
    if (f.soldList.length) h += '<p class="muted">Your last goods (' + esc(f.soldList.join(", ")) + ") were sold at the market for " + f.soldTotal + " coins.</p>";
    h += '<section class="card big"><div class="results">';
    h += '<div><h3>🪙 Fortune</h3><p class="big">' + stars(sc.fortune) + "</p><p>You ended with <strong>" + sc.coins + "</strong> coins (you started with " + D.start.coins + ").</p></div>";
    h += '<div><h3>📖 Knowledge</h3><p class="big">' + stars(sc.knowledge) + "</p><p>Your Journal has <strong>" + sc.entries + "</strong> entries and you earned <strong>" + S.quizStars + "</strong> quiz stars.</p></div>";
    h += '<div><h3>🧭 Travel</h3><p class="big">' + stars(sc.travel) + "</p><p>You visited <strong>" + sc.cities + "</strong> of " + D.cities.length + " cities.</p></div></div></section>";
    h += '<section class="card"><h2>Think about it</h2><ul class="think">' + D.final.reflection.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ul></section>";
    h += '<aside class="note"><h3>What this game leaves out</h3><p>' + esc(D.final.leftOut) + "</p></aside>";
    h += '<div class="row wrap"><button class="btn" data-act="journal" type="button">📖 Open my Journal</button><button class="btn primary" data-act="again" type="button">Play again</button></div></div>';
    return h;
  }

  /* ---------- overlays ---------- */
  function overlayHTML() {
    if (!overlay) return "";
    var h = '<div class="overlay" role="dialog" aria-modal="true"><div class="sheet">';
    h += '<button class="btn small closebtn" data-act="close" type="button">Close ✕</button>';
    if (overlay.type === "journal") {
      h += "<h2>📖 Merchant's Journal</h2>";
      if (!S || !S.journal.length) h += "<p>Nothing here yet. Visit cities and sell goods to discover stories.</p>";
      else S.journal.forEach(function (j) {
        if (j.type === "city") { var c = CC.city(j.id); h += '<article class="entry"><p class="era">' + esc(c.era) + "</p><h3>" + esc(c.card.title) + "</h3><p>" + esc(c.card.text) + "</p></article>"; }
        else if (j.type === "idea") { var sp = D.spreads[j.id]; h += '<article class="entry idea"><p class="era">💡 An idea travels</p><h3>' + esc(sp.title) + "</h3><p>" + esc(sp.text) + "</p></article>"; }
        else { h += '<article class="entry idea"><p class="era">👑 A historical event</p><h3>' + esc(D.mansa.title) + "</h3><p>" + esc(D.mansa.text) + "</p><p>" + esc(D.mansa.lesson) + "</p></article>"; }
      });
      var left = D.cities.length + D.spreads.length + 1 - (S ? S.journal.length : 0);
      if (left > 0) h += '<p class="muted">' + left + " more entries are waiting to be discovered.</p>";
    } else if (overlay.type === "guide") {
      var known = CC.guideKnown(S);
      h += "<h2>📜 Merchants' price guide</h2><p class=\"muted\">News travels along the trade routes. You know about the cities you have visited and the cities next to them.</p>";
      h += '<div class="gtable"><div class="gh"></div>' + D.goods.map(function (x) { return '<div class="gh" title="' + x.name + '">' + x.emoji + "<small>" + x.name + "</small></div>"; }).join("");
      D.cities.forEach(function (c) {
        h += '<div class="gc">' + esc(c.name) + "</div>";
        D.goods.forEach(function (x) {
          if (!known[c.id]) { h += '<div class="gx q">?</div>'; return; }
          var k = CC.guideCell(c.id, x.id);
          h += '<div class="gx ' + k + '">' + (k === "cheap" ? "⬇ cheap" : k === "high" ? "⬆ wanted" : "•") + "</div>";
        });
      });
      h += '</div><p class="muted">⬇ cheap: plentiful there, so it costs less. ⬆ wanted: scarce there, so people pay more. Buy cheap, then carry goods to a city that wants them.</p>';
    } else if (overlay.type === "glossary") {
      h += "<h2>📚 Words to know</h2><dl>" + D.glossary.map(function (g) { return "<dt>" + esc(g.word) + "</dt><dd>" + esc(g.meaning) + "</dd>"; }).join("") + "</dl>";
    } else if (overlay.type === "spread") {
      var s2 = overlay.sp; h += '<p class="era">💡 An idea travels with your goods</p><h2>' + esc(s2.title) + "</h2><p>" + esc(s2.text) + '</p><p class="muted">Added to your Journal.</p>';
    } else if (overlay.type === "teacher") {
      h += "<h2>Teacher notes</h2><p><strong>Standards:</strong> " + esc(D.teacher.standards) + "</p><h3>Simplifications to know about</h3><ul>" + D.teacher.simplifications.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        "<p>All content lives in <code>data.js</code>, where wording, prices, routes, and events can be reviewed and edited.</p>";
    } else if (overlay.type === "rescue") {
      h += "<h2>🤝 A helping hand</h2><p>You have no coins and nothing to sell, so you can't pay for another trip. A fellow merchant lends you <strong>" + D.rescue.coins + " coins</strong> to get you moving again. Merchants often relied on partners and lenders this way. (This can happen only once.)</p>";
    } else if (overlay.type === "confirm-quit") {
      h += "<h2>Leave the game?</h2><p>Your trip is saved. You can continue it later from the title screen.</p><p><button class=\"btn primary\" data-act=\"quit-yes\" type=\"button\">Leave</button> <button class=\"btn\" data-act=\"close\" type=\"button\">Keep playing</button></p>";
    }
    return h + "</div></div>";
  }

  /* ---------- render ---------- */
  var lastPhase = null;
  function render() {
    var h = "", L = document.querySelector(".left"), R = document.querySelector(".right");
    var keep = (phase === lastPhase) ? { l: L ? L.scrollTop : 0, r: R ? R.scrollTop : 0, w: window.pageYOffset } : null;
    if (phase === "title") h = viewTitle();
    else if (phase === "card") h = viewCard();
    else if (phase === "mansa") h = viewMansa();
    else if (phase === "market") h = viewMarket();
    else if (phase === "depart") h = viewDepart();
    else if (phase === "event") h = viewEvent();
    else if (phase === "final") h = viewFinal();
    app.className = phase === "market" ? "fixed" : "";
    app.innerHTML = h + overlayHTML();
    if (keep) {
      var L2 = document.querySelector(".left"), R2 = document.querySelector(".right");
      if (L2) L2.scrollTop = keep.l; if (R2) R2.scrollTop = keep.r; if (!L2) window.scrollTo(0, keep.w);
    } else window.scrollTo(0, 0);
    lastPhase = phase;
    if (focusSel) { var el = document.querySelector(focusSel); if (el) el.focus({ preventScroll: true }); focusSel = null; }
    else { var o = document.querySelector(".overlay .closebtn"); if (o) o.focus({ preventScroll: true }); }
    if (S && phase === "market" && !S.over) save();
  }

  /* ---------- flow ---------- */
  function enterCity() {                                  // called after arriving or starting
    var first = CC.noteFirstVisit(S);
    S.note = S.note || "";
    if (first) { cur = { picked: null }; go("card"); return; }
    afterCard();
  }
  function afterCard() {
    if (CC.mansaDue(S)) { go("mansa"); return; }
    marketEnter();
  }
  function marketEnter() {
    if (CC.daysLeft(S) <= 0) { finish(); return; }
    cur = null;
    if (CC.stuck(S) && !S.rescued) { CC.rescue(S); overlay = { type: "rescue" }; }
    go("market");
  }
  function finish() {
    var fin = CC.finish(S); clearSave(); cur = { fin: fin }; overlay = null; go("final");
  }

  app.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act]"); if (!t || t.disabled) return;
    var a = t.getAttribute("data-act");
    if (a === "start") { S = CC.newGame(t.getAttribute("data-home")); S.note = "You set out as a merchant of " + CC.city(S.home).name + "."; enterCity(); }
    else if (a === "continue") { S = loadSave(); if (S) { phase = "market"; render(); } }
    else if (a === "journal") { overlay = { type: "journal" }; render(); }
    else if (a === "glossary") { overlay = { type: "glossary" }; render(); }
    else if (a === "guide") { overlay = { type: "guide" }; render(); }
    else if (a === "teacher") { overlay = { type: "teacher" }; render(); }
    else if (a === "close") { overlay = null; render(); }
    else if (a === "home") { overlay = { type: "confirm-quit" }; render(); }
    else if (a === "quit-yes") { overlay = null; S = null; go("title"); }
    else if (a === "answer") {
      var i = +t.getAttribute("data-i"), q = CC.city(S.city).quiz; cur.picked = i;
      if (i === q.answer) S.quizStars++;
      render();
    }
    else if (a === "after-card") { afterCard(); }
    else if (a === "after-mansa") { CC.applyMansa(S); marketEnter(); }
    else if (a === "buy") {
      var g = t.getAttribute("data-g"), rs = CC.reserve(S), got = CC.buy(S, g, +t.getAttribute("data-n"), rs);
      focusSel = '[data-act="buy"][data-g="' + g + '"][data-n="' + t.getAttribute("data-n") + '"]';
      S.note = got ? "" : (CC.room(S) < CC.good(g).w ? "Your cargo space is full." : "You need to keep " + rs + " coins for your next trip, so you can't buy more " + CC.good(g).name.toLowerCase() + ".");
      render();
    }
    else if (a === "sell") {
      var g2 = t.getAttribute("data-g"), res = CC.sell(S, g2, +t.getAttribute("data-n")), sp = CC.spreadFor(S, g2);
      S.note = res.n ? "Sold " + res.n + " " + CC.good(g2).name.toLowerCase() + " for " + res.revenue + " coins." : "";
      focusSel = '[data-act="sell"][data-g="' + g2 + '"][data-n="' + t.getAttribute("data-n") + '"]';
      if (sp) { overlay = { type: "spread", sp: sp }; focusSel = null; }
      render();
    }
    else if (a === "upgrade") { if (CC.upgrade(S)) S.note = "You hired more pack animals and cargo space."; focusSel = '[data-act="upgrade"]'; render(); }
    else if (a === "plan") {
      var to = t.getAttribute("data-to"), rts = CC.routesFrom(S.city), rt = null;
      rts.forEach(function (x) { if (x.to === to) rt = x; });
      if (!rt) return;
      if (!CC.canTravel(S, rt)) { S.note = S.coins < rt.route.cost ? "You need " + rt.route.cost + " coins for that trip. Try selling some goods." : "Not enough days are left for that trip."; render(); return; }
      cur = { rt: rt }; go("depart");
    }
    else if (a === "cancel-trip") { cur = null; go("market"); }
    else if (a === "wait-go") { var w = CC.wind(S, cur.rt); CC.wait(S, w.waitDays); S.note = "You waited " + w.waitDays + " days in port for the winds to change."; leave(false); }
    else if (a === "sail-anyway") { leave(true); }
    else if (a === "depart") { leave(false); }
    else if (a === "choice") {
      var ch = cur.ev.choices[+t.getAttribute("data-i")], o = CC.pickOutcome(ch);
      cur.result = { text: o.text, report: CC.applyEffects(S, o.effects) };
      render();
    }
    else if (a === "arrive") { doArrive(); }
    else if (a === "finish") { finish(); }
    else if (a === "again") { S = null; cur = null; clearSave(); go("title"); }
  });
  app.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.getAttribute && e.target.getAttribute("role") === "button" && e.target.tagName !== "BUTTON") { e.preventDefault(); e.target.dispatchEvent(new MouseEvent("click", { bubbles: true })); }
    if (e.key === "Escape" && overlay) { overlay = null; render(); }
  });

  function leave(anyway) {
    var rt = cur.rt; CC.startTrip(S, rt, anyway);
    var ev = CC.pickEvent(S);
    if (ev) { S.lastEvent = ev.id; cur = { ev: ev, result: null }; go("event"); }
    else doArrive();
  }
  function doArrive() {
    var t = S.trip, days = t.days + t.extra, toName = CC.city(t.to).name;
    CC.arrive(S);
    S.note = "You arrived in " + toName + " after " + days + " days.";
    if (CC.daysLeft(S) <= 0) { finish(); return; }
    enterCity();
  }

  go("title");
})();
