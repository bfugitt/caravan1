/* Caravan and Sea Routes: game rules (no screen code here, so it can be tested on its own). */
(function (root) {
  "use strict";
  var D = root.CARAVAN;
  var CC = {};
  CC.rng = Math.random;

  function cityById(id) { for (var i = 0; i < D.cities.length; i++) if (D.cities[i].id === id) return D.cities[i]; return null; }
  function goodById(id) { for (var i = 0; i < D.goods.length; i++) if (D.goods[i].id === id) return D.goods[i]; return null; }
  CC.city = cityById; CC.good = goodById;

  CC.newGame = function (homeId) {
    var S = {
      home: homeId, city: homeId, day: 0, coins: D.start.coins, cap: D.start.capacity, upgrades: 0,
      cargo: {}, basis: {}, prices: {}, visited: {}, journal: [], quizStars: 0, spreadSeen: {}, shocks: [],
      mansaDone: false, lastEvent: null, trip: null, trips: 0, over: false, rescued: false, note: ""
    };
    D.goods.forEach(function (g) { S.cargo[g.id] = 0; S.basis[g.id] = 0; });
    CC.genPrices(S, homeId);
    return S;
  };

  CC.monthIdx = function (day) { return (D.start.startMonth + Math.floor(day / 30)) % 12; };
  CC.monthName = function (day) { return D.months[CC.monthIdx(day)]; };
  CC.daysLeft = function (S) { return Math.max(0, D.start.days - S.day); };

  /* ---------- prices ---------- */
  CC.genPrices = function (S, cityId) {
    var c = cityById(cityId); S.prices = {};
    D.goods.forEach(function (g) {
      var p = g.base * (c.mult[g.id] || 1) * (0.9 + CC.rng() * 0.2);
      S.shocks.forEach(function (sh) { if (sh.city === cityId && sh.good === g.id && S.day < sh.until) p *= sh.mult; });
      S.prices[g.id] = p;
    });
  };
  CC.price = function (S, gid) { return Math.max(1, Math.round(S.prices[gid])); };
  CC.sellPrice = function (S, gid) { return Math.max(1, Math.round(S.prices[gid] * (1 - cityById(S.city).tax))); };
  CC.priceLabel = function (S, gid) {
    var r = S.prices[gid] / goodById(gid).base;
    return r < 0.75 ? "cheap" : r > 1.3 ? "high" : "fair";
  };

  /* ---------- cargo ---------- */
  CC.load = function (S) { var t = 0; D.goods.forEach(function (g) { t += S.cargo[g.id] * g.w; }); return t; };
  CC.room = function (S) { return S.cap - CC.load(S); };
  CC.buy = function (S, gid, n, reserve) {      // reserve = coins to keep back for travel
    var g = goodById(gid), bought = 0; reserve = reserve || 0;
    for (var i = 0; i < n; i++) {
      var p = CC.price(S, gid);
      if (S.coins - p < reserve || CC.room(S) < g.w) break;
      S.coins -= p; S.cargo[gid]++; S.basis[gid] += p; S.prices[gid] *= (1 + D.priceStep); bought++;
    }
    return bought;
  };
  CC.sell = function (S, gid, n) {
    var sold = 0, revenue = 0;
    n = Math.min(n, S.cargo[gid]);
    for (var i = 0; i < n; i++) {
      var p = CC.sellPrice(S, gid), avg = S.cargo[gid] ? S.basis[gid] / S.cargo[gid] : 0;
      S.coins += p; revenue += p; S.cargo[gid]--; S.basis[gid] = Math.max(0, S.basis[gid] - avg);
      S.prices[gid] *= (1 - D.priceStep); sold++;
    }
    if (S.cargo[gid] === 0) S.basis[gid] = 0;
    return { n: sold, revenue: revenue };
  };
  CC.avgPaid = function (S, gid) { return S.cargo[gid] ? Math.round(S.basis[gid] / S.cargo[gid]) : 0; };
  CC.canUpgrade = function (S) { return S.upgrades < D.upgrade.max && S.coins >= D.upgrade.cost; };
  CC.upgrade = function (S) { if (!CC.canUpgrade(S)) return false; S.coins -= D.upgrade.cost; S.cap += D.upgrade.extra; S.upgrades++; return true; };

  /* ---------- journal and spreads ---------- */
  function addJournal(S, type, id) {
    for (var i = 0; i < S.journal.length; i++) if (S.journal[i].type === type && S.journal[i].id === id) return false;
    S.journal.push({ type: type, id: id }); return true;
  }
  CC.addJournal = addJournal;
  CC.noteFirstVisit = function (S) { var f = !S.visited[S.city]; S.visited[S.city] = true; if (f) addJournal(S, "city", S.city); return f; };
  CC.spreadFor = function (S, gid) {
    for (var i = 0; i < D.spreads.length; i++) {
      var sp = D.spreads[i];
      if (sp.good === gid && sp.city === S.city && !S.spreadSeen[i]) { S.spreadSeen[i] = true; addJournal(S, "idea", i); return sp; }
    }
    return null;
  };
  CC.mansaDue = function (S) { var m = D.mansa; return !S.mansaDone && S.city === m.city && S.day >= m.afterDay; };
  CC.applyMansa = function (S) {
    var m = D.mansa; S.mansaDone = true; addJournal(S, "mansa", 0);
    S.shocks.push({ city: m.city, good: "gold", mult: m.shockPct, until: S.day + m.shockDays });
    CC.genPrices(S, S.city);
  };

  /* ---------- routes and travel ---------- */
  CC.routesFrom = function (cityId) {
    var out = [];
    D.routes.forEach(function (r, i) {
      if (r.a === cityId) out.push({ route: r, idx: i, to: r.b, dir: "ab" });
      else if (r.b === cityId) out.push({ route: r, idx: i, to: r.a, dir: "ba" });
    });
    return out;
  };
  CC.wind = function (S, rt) {      // rt = element from routesFrom
    var r = rt.route;
    if (!r.wind) return { sea: !!r.sea, ok: true, waitDays: 0 };
    var good = r.wind[rt.dir], m = CC.monthIdx(S.day);
    if (good.indexOf(m) >= 0) return { sea: true, ok: true, waitDays: 0, months: good };
    var d = 1; while (d < 400 && good.indexOf(CC.monthIdx(S.day + d)) < 0) d++;
    return { sea: true, ok: false, waitDays: d, months: good };
  };
  CC.canTravel = function (S, rt) {
    return S.coins >= rt.route.cost && CC.daysLeft(S) >= rt.route.days;
  };
  CC.wait = function (S, days) { S.day += days; };

  CC.startTrip = function (S, rt, sailAnyway) {
    var r = rt.route, w = CC.wind(S, rt);
    var against = r.wind && !w.ok && sailAnyway;
    S.coins -= r.cost;
    S.trip = { to: rt.to, from: S.city, route: r, days: Math.round(r.days * (against ? 1.4 : 1)), extra: 0, against: !!against };
    return S.trip;
  };
  CC.pickEvent = function (S) {
    var t = S.trip, r = t.route;
    if (t.against && r.sea) { for (var i = 0; i < D.events.length; i++) if (D.events[i].id === "storm") return D.events[i]; }
    if (CC.rng() > 0.8) return null;
    var pool = D.events.filter(function (e) { return e.types.indexOf(r.type) >= 0 && e.id !== S.lastEvent; });
    if (!pool.length) return null;
    return pool[Math.floor(CC.rng() * pool.length)];
  };
  CC.pickOutcome = function (choice) {
    var x = CC.rng(), acc = 0;
    for (var i = 0; i < choice.outcomes.length; i++) { acc += choice.outcomes[i].p; if (x <= acc) return choice.outcomes[i]; }
    return choice.outcomes[choice.outcomes.length - 1];
  };
  CC.applyEffects = function (S, fx) {
    var report = [];
    if (fx.coins) S.coins = Math.max(0, S.coins + fx.coins);
    if (fx.coinsPct) { var c = Math.max(15, Math.round(S.coins * fx.coinsPct)); c = Math.min(c, S.coins); S.coins -= c; report.push("Paid " + c + " coins."); }
    if (fx.days) { S.trip.extra += fx.days; if (fx.days > 0) report.push("Lost " + fx.days + " days."); else report.push("Saved " + (-fx.days) + " days."); }
    if (fx.lossPct) {
      var lost = [];
      D.goods.forEach(function (g) {
        var n = S.cargo[g.id]; if (!n) return;
        var l = Math.min(n, Math.floor(n * fx.lossPct + CC.rng()));
        if (l > 0) { var avg = S.basis[g.id] / n; S.cargo[g.id] -= l; S.basis[g.id] = Math.max(0, S.basis[g.id] - avg * l); lost.push(l + " " + g.name.toLowerCase()); }
      });
      report.push(lost.length ? "Lost cargo: " + lost.join(", ") + "." : "You had no cargo to lose.");
    }
    return report;
  };
  CC.arrive = function (S) {
    var t = S.trip;
    S.day += t.days + t.extra; S.city = t.to; S.trips++; S.trip = null;
    CC.genPrices(S, S.city);
    return { first: CC.noteFirstVisit(S) };
  };

  CC.reserve = function (S) { var m = CC.minTripCost(S); return m === 1e9 ? 0 : m; };
  CC.hints = function (cityId) {          // what merchants say is wanted or plentiful in a city
    var c = cityById(cityId), g = D.goods.slice();
    var wanted = g.filter(function (x) { return (c.mult[x.id] || 1) >= 1.3; }).sort(function (a, b) { return (c.mult[b.id] || 1) - (c.mult[a.id] || 1); }).slice(0, 3);
    var cheap = g.filter(function (x) { return (c.mult[x.id] || 1) <= 0.75; }).sort(function (a, b) { return (c.mult[a.id] || 1) - (c.mult[b.id] || 1); }).slice(0, 3);
    return { wanted: wanted, cheap: cheap };
  };
  CC.guideKnown = function (S) {          // cities you have visited, plus their neighbors (news travels along routes)
    var k = {};
    Object.keys(S.visited).forEach(function (id) { k[id] = true; CC.routesFrom(id).forEach(function (rt) { k[rt.to] = true; }); });
    return k;
  };
  CC.guideCell = function (cityId, gid) { var m = cityById(cityId).mult[gid] || 1; return m <= 0.75 ? "cheap" : m >= 1.3 ? "high" : "fair"; };
  CC.minTripCost = function (S) {
    var m = 1e9; CC.routesFrom(S.city).forEach(function (rt) { if (CC.daysLeft(S) >= rt.route.days) m = Math.min(m, rt.route.cost); });
    return m;
  };
  CC.stuck = function (S) {      // no coins to travel and nothing to sell
    var m = CC.minTripCost(S); if (m === 1e9) return false;
    var hasCargo = false; D.goods.forEach(function (g) { if (S.cargo[g.id] > 0) hasCargo = true; });
    return S.coins < m && !hasCargo;
  };
  CC.rescue = function (S) { if (S.rescued) return false; S.rescued = true; S.coins += D.rescue.coins; return true; };

  /* ---------- finish ---------- */
  CC.finish = function (S) {
    var sold = [], total = 0;
    D.goods.forEach(function (g) {
      var n = S.cargo[g.id]; if (!n) return;
      var r = CC.sell(S, g.id, n); total += r.revenue; sold.push(r.n + " " + g.name.toLowerCase());
    });
    S.over = true;
    return { soldList: sold, soldTotal: total };
  };
  CC.score = function (S) {
    var fortune = S.coins >= D.stars.fortune[1] ? 3 : S.coins >= D.stars.fortune[0] ? 2 : 1;
    var entries = S.journal.length, know = entries >= D.stars.knowledge[1] ? 3 : entries >= D.stars.knowledge[0] ? 2 : 1;
    var seen = Object.keys(S.visited).length, travel = seen >= D.stars.travel[1] ? 3 : seen >= D.stars.travel[0] ? 2 : 1;
    return { fortune: fortune, knowledge: know, travel: travel, entries: entries, cities: seen, coins: S.coins };
  };

  root.CaravanCore = CC;
})(typeof window !== "undefined" ? window : global);
