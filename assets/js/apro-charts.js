/* APRO blog charts: small dependency-free SVG line + dumbbell charts with tabs, legend highlight and hover tooltips.
   Usage: AproCharts.line(elementId, {panels: [...], starToggle?: label; panel.stars = [{key, at: {index: value}}]}) / AproCharts.dumbbell(elementId, {panels: [...]}). */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var MODELS = {
    argon: { name: "Gemini 4 Argon", c: 1 },
    sol: { name: "GPT-6 Sol", c: 2 },
    opus: { name: "Claude Opus 5.5", c: 3 },
    flash: { name: "Gemini 3.8 Flash", c: 4 },
    q27: { name: "Qwen3.5-27B", c: 5 },
    q9: { name: "Qwen3.5-9B", c: 6 },
    deepseek: { name: "DeepSeek-VL2", c: 7 },
  };

  function svg(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) {
      e.setAttribute(k, attrs[k]);
    }
    if (parent) {
      parent.appendChild(e);
    }
    return e;
  }
  function div(cls, parent, html) {
    var e = document.createElement("div");
    if (cls) {
      e.className = cls;
    }
    if (html !== undefined) {
      e.innerHTML = html;
    }
    if (parent) {
      parent.appendChild(e);
    }
    return e;
  }
  function color(key) {
    return key === "mean" ? "var(--ac-ink)" : "var(--ac-s" + MODELS[key].c + ")";
  }
  function name(key) {
    return MODELS[key] ? MODELS[key].name : key;
  }
  function fmt(v) {
    return (Math.round(v * 10) / 10).toString();
  }

  /* Shared frame: tabs row, chart area, legend, tooltip; redraws on tab change and resize. */
  function frame(id, cfg, draw) {
    var root = document.getElementById(id);
    if (!root) {
      return;
    }
    root.classList.add("apro-chart");
    var state = { panel: 0, focus: null, extra: !!cfg.extraDefault };
    var top = div("ac-top", root);
    var tabs = div("ac-tabs", top);
    if (cfg.panels.length > 1) {
      cfg.panels.forEach(function (p, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = p.tab;
        b.addEventListener("click", function () {
          state.panel = i;
          render();
        });
        tabs.appendChild(b);
      });
    }
    if (cfg.extraToggle) {
      var lab = document.createElement("label");
      lab.className = "ac-toggle";
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = state.extra;
      cb.addEventListener("change", function () {
        state.extra = cb.checked;
        render();
      });
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(" " + cfg.extraToggle));
      top.appendChild(lab);
    }
    if (cfg.starToggle) {
      var sb = document.createElement("button");
      sb.type = "button";
      sb.className = "ac-star-btn";
      sb.innerHTML = '<span class="ac-star-ico">&#9733;</span> ' + cfg.starToggle;
      sb.addEventListener("click", function () {
        state.stars = !state.stars;
        render();
      });
      top.appendChild(sb);
      state.starBtn = sb;
    }
    var area = div("ac-area", root);
    var legend = div("ac-legend", root);
    var note = div("ac-note", root);
    var tip = div("ac-tip", root);
    function render() {
      var bs = tabs.querySelectorAll("button");
      for (var i = 0; i < bs.length; i++) {
        bs[i].className = i === state.panel ? "on" : "";
      }
      area.innerHTML = "";
      legend.innerHTML = "";
      tip.style.display = "none";
      var p = cfg.panels[state.panel];
      if (state.starBtn) {
        state.starBtn.className = "ac-star-btn" + (state.stars ? " on" : "");
      }
      note.innerHTML = p.note || "";
      draw({ root: root, area: area, legend: legend, note: note, tip: tip, panel: p, state: state, rerender: render });
    }
    var w = 0;
    window.addEventListener("resize", function () {
      if (Math.abs(root.clientWidth - w) > 20) {
        w = root.clientWidth;
        render();
      }
    });
    w = root.clientWidth;
    render();
  }

  function legendChips(ctx, keys, opts) {
    keys.forEach(function (k) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "ac-chip" + (ctx.state.focus === k ? " on" : "");
      var sw = '<span class="ac-sw' + (k === "mean" ? " mean" : "") + '" style="background:' + color(k) + '"></span>';
      chip.innerHTML = sw + (k === "mean" ? opts.meanName : name(k));
      chip.addEventListener("click", function () {
        ctx.state.focus = ctx.state.focus === k ? null : k;
        ctx.rerender();
      });
      chip.addEventListener("mouseenter", function () {
        if (opts.hover) {
          opts.hover(k);
        }
      });
      chip.addEventListener("mouseleave", function () {
        if (opts.hover) {
          opts.hover(null);
        }
      });
      ctx.legend.appendChild(chip);
    });
  }

  function placeTip(ctx, x, y, html) {
    var t = ctx.tip;
    t.innerHTML = html;
    t.style.display = "block";
    var r = ctx.root.getBoundingClientRect(),
      a = ctx.area.getBoundingClientRect();
    var left = a.left - r.left + x + 14,
      tw = t.offsetWidth;
    if (left + tw > ctx.root.clientWidth) {
      left = a.left - r.left + x - tw - 14;
    }
    t.style.left = Math.max(0, left) + "px";
    t.style.top = a.top - r.top + y + "px";
  }

  /* ---------- line chart ---------- */
  function line(id, cfg) {
    frame(id, cfg, function (ctx) {
      var p = ctx.panel,
        W = ctx.area.clientWidth,
        H = p.height || 290;
      var m = { l: 40, r: 14, t: 14, b: p.xTitle ? 58 : 44 };
      var s = svg("svg", { width: W, height: H, viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": p.aria || "" }, ctx.area);
      var iw = W - m.l - m.r,
        ih = H - m.t - m.b,
        n = p.x.length;
      var X = function (i) {
        return m.l + (n === 1 ? iw / 2 : (i * iw) / (n - 1));
      };
      var Y = function (v) {
        return m.t + ih - (v / 100) * ih;
      };
      // grid + y axis
      [0, 25, 50, 75, 100].forEach(function (v) {
        svg("line", { x1: m.l, x2: m.l + iw, y1: Y(v), y2: Y(v), class: "ac-grid" }, s);
        svg("text", { x: m.l - 7, y: Y(v) + 4, class: "ac-ytick", "text-anchor": "end" }, s).textContent = v + "%";
      });
      // x labels (\n = second line)
      p.x.forEach(function (lab, i) {
        var t = svg("text", { x: X(i), y: m.t + ih + 18, class: "ac-xtick", "text-anchor": "middle" }, s);
        String(lab)
          .split("\n")
          .forEach(function (part, j) {
            var ts = svg("tspan", { x: X(i), dy: j === 0 ? 0 : 13 }, t);
            ts.textContent = part;
          });
      });
      if (p.xTitle) {
        svg("text", { x: m.l + iw / 2, y: H - 6, class: "ac-xtitle", "text-anchor": "middle" }, s).textContent = p.xTitle;
      }
      if (p.chance !== undefined) {
        svg("line", { x1: m.l, x2: m.l + iw, y1: Y(p.chance), y2: Y(p.chance), class: "ac-chance" }, s);
        svg("text", { x: m.l + iw - 2, y: Y(p.chance) - 5, class: "ac-chance-lab", "text-anchor": "end" }, s).textContent = p.chanceLabel || "random";
      }
      var series = p.series.slice();
      if (ctx.state.extra && p.extra) {
        series = series.concat(p.extra);
      }
      var hasMean = !!p.mean;
      var groups = {};
      function drawSeries(sr, isMean) {
        var key = isMean ? "mean" : sr.key,
          g = svg("g", { class: "ac-series", "data-key": key }, s);
        groups[key] = groups[key] || [];
        groups[key].push(g);
        var pts = [];
        sr.values.forEach(function (v, i) {
          if (v !== null && v !== undefined) {
            pts.push([X(i), Y(v)]);
          }
        });
        if (!pts.length) {
          return;
        }
        var d = pts
          .map(function (q, i) {
            return (i ? "L" : "M") + q[0].toFixed(1) + "," + q[1].toFixed(1);
          })
          .join("");
        svg(
          "path",
          {
            d: d,
            fill: "none",
            stroke: color(key),
            "stroke-width": isMean ? 3.2 : 2,
            "stroke-dasharray": sr.dashed ? "5 4" : "none",
            "stroke-linejoin": "round",
            "stroke-linecap": "round",
            class: isMean ? "ac-line mean" : hasMean ? "ac-line faint" : "ac-line",
          },
          g
        );
        pts.forEach(function (q) {
          svg(
            "circle",
            {
              cx: q[0],
              cy: q[1],
              r: isMean ? 4.5 : 3.6,
              fill: sr.dashed ? "var(--ac-surface)" : color(key),
              stroke: sr.dashed ? color(key) : "var(--ac-surface)",
              "stroke-width": sr.dashed ? 2 : 1.6,
              class: isMean ? "" : hasMean ? "faint" : "",
            },
            g
          );
        });
      }
      series.forEach(function (sr) {
        drawSeries(sr, false);
      });
      if (hasMean) {
        drawSeries(p.mean, true);
      }
      var showStars = ctx.state.stars && p.stars;
      function starPath(cx, cy, R) {
        var d = "",
          r2 = R * 0.45;
        for (var i = 0; i < 10; i++) {
          var a = -Math.PI / 2 + (i * Math.PI) / 5,
            rr = i % 2 ? r2 : R;
          d += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1);
        }
        return d + "Z";
      }
      if (showStars) {
        p.stars.forEach(function (st) {
          var g = svg("g", { class: "ac-series", "data-key": st.key }, s);
          groups[st.key] = groups[st.key] || [];
          groups[st.key].push(g);
          Object.keys(st.at).forEach(function (ix) {
            var i = +ix,
              v = st.at[ix],
              base = null;
            p.series.forEach(function (sr) {
              if (sr.key === st.key) {
                base = sr.values[i];
              }
            });
            if (base !== null && base !== undefined && Math.abs(base - v) > 1) {
              svg(
                "line",
                {
                  x1: X(i),
                  x2: X(i),
                  y1: Y(base),
                  y2: Y(v),
                  stroke: color(st.key),
                  "stroke-width": 2,
                  "stroke-dasharray": "2 3",
                  class: "ac-star-link",
                },
                g
              );
            }
            svg("path", { d: starPath(X(i), Y(v), 9), fill: color(st.key), stroke: "var(--ac-surface)", "stroke-width": 1.4, class: "ac-star" }, g);
          });
        });
      }
      function applyFocus(k) {
        var f = k || ctx.state.focus;
        Object.keys(groups).forEach(function (key) {
          groups[key].forEach(function (g) {
            g.setAttribute("class", "ac-series" + (f ? (key === f ? " focus" : " dim") : ""));
          });
        });
      }
      applyFocus(null);
      var keys = [];
      series.forEach(function (sr) {
        if (keys.indexOf(sr.key) < 0) {
          keys.push(sr.key);
        }
      });
      if (hasMean) {
        keys.push("mean");
      }
      legendChips(ctx, keys, { meanName: p.mean ? p.mean.name : "", hover: applyFocus });
      if (ctx.state.extra && p.extra) {
        div("ac-legend-note", ctx.legend, p.extraLegend || "");
      }
      if (showStars) {
        div("ac-legend-note", ctx.legend, "&#9733; oracle setting (k = 1 and k = " + n + ")");
        var last = n - 1,
          items = [];
        p.stars.forEach(function (st) {
          if (st.at[last] === undefined) {
            return;
          }
          var b = null;
          p.series.forEach(function (sr) {
            if (sr.key === st.key) {
              b = sr.values[last];
            }
          });
          var d = st.at[last] - b,
            cls = d > 0 ? "up" : d < 0 ? "down" : "same";
          items.push(
            '<span class="ac-star-sum"><span class="ac-sw" style="background:' +
              color(st.key) +
              '"></span>' +
              name(st.key) +
              " " +
              fmt(b) +
              " &rarr; " +
              fmt(st.at[last]) +
              '% <b class="' +
              cls +
              '">(' +
              (d > 0 ? "+" : d < 0 ? "&minus;" : "&plusmn;") +
              fmt(Math.abs(d)) +
              ")</b></span>"
          );
        });
        ctx.note.innerHTML = '<div class="ac-star-sums">At k = ' + n + ", without &rarr; with oracle: " + items.join("") + "</div>" + (p.note || "");
      }
      // hover crosshair
      var cross = svg("line", { y1: m.t, y2: m.t + ih, class: "ac-cross", visibility: "hidden" }, s);
      var hit = svg("rect", { x: m.l - 10, y: m.t, width: iw + 20, height: ih, fill: "transparent" }, s);
      function move(ev) {
        var r = s.getBoundingClientRect(),
          cx = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
        var i = Math.max(0, Math.min(n - 1, Math.round(((cx - m.l) / iw) * (n - 1))));
        cross.setAttribute("x1", X(i));
        cross.setAttribute("x2", X(i));
        cross.setAttribute("visibility", "visible");
        var rows = [];
        if (hasMean) {
          var mv = p.mean.values[i],
            prev = i > 0 ? p.mean.values[i - 1] : null;
          var dlt =
            prev !== null && prev !== undefined && mv !== null
              ? ' <span class="ac-delta">(' + (mv - prev >= 0 ? "+" : "") + fmt(mv - prev) + ")</span>"
              : "";
          rows.push(
            '<div class="ac-row strong"><span class="ac-sw mean" style="background:var(--ac-ink)"></span>' +
              p.mean.name +
              "<b>" +
              fmt(mv) +
              "%" +
              dlt +
              "</b></div>"
          );
        }
        var list = series
          .map(function (sr) {
            return { sr: sr, v: sr.values[i] };
          })
          .filter(function (o) {
            return o.v !== null && o.v !== undefined;
          });
        list.sort(function (a, b) {
          return b.v - a.v;
        });
        list.forEach(function (o) {
          rows.push(
            '<div class="ac-row"><span class="ac-sw' +
              (o.sr.dashed ? " hollow" : "") +
              '" style="background:' +
              color(o.sr.key) +
              ";border-color:" +
              color(o.sr.key) +
              '"></span>' +
              name(o.sr.key) +
              (o.sr.label ? " " + o.sr.label : "") +
              "<b>" +
              fmt(o.v) +
              "%</b></div>"
          );
        });
        if (showStars) {
          p.stars.forEach(function (st) {
            if (st.at[i] !== undefined) {
              rows.push(
                '<div class="ac-row"><span style="color:' +
                  color(st.key) +
                  ';margin-right:6px">&#9733;</span>' +
                  name(st.key) +
                  " (oracle)<b>" +
                  fmt(st.at[i]) +
                  "%</b></div>"
              );
            }
          });
        }
        var head = p.tipX ? p.tipX(i) : String(p.x[i]).replace("\n", " ");
        placeTip(ctx, X(i), m.t, '<div class="ac-tip-h">' + head + "</div>" + rows.join(""));
      }
      function leave() {
        cross.setAttribute("visibility", "hidden");
        ctx.tip.style.display = "none";
      }
      hit.addEventListener("mousemove", move);
      hit.addEventListener("touchstart", move, { passive: true });
      hit.addEventListener("mouseleave", leave);
    });
  }

  /* ---------- dumbbell (before -> after per model) ---------- */
  function dumbbell(id, cfg) {
    frame(id, cfg, function (ctx) {
      var p = ctx.panel,
        W = ctx.area.clientWidth,
        rowH = 34;
      var labW = Math.min(140, Math.max(118, W * 0.24));
      var m = { l: labW, r: 52, t: 10, b: 30 },
        H = m.t + m.b + rowH * p.rows.length;
      var s = svg("svg", { width: W, height: H, viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": p.aria || "" }, ctx.area);
      var max = p.max || 100,
        iw = W - m.l - m.r;
      var X = function (v) {
        return m.l + (v / max) * iw;
      };
      var ticks = p.ticks || [0, 25, 50, 75, 100];
      ticks.forEach(function (v) {
        svg("line", { x1: X(v), x2: X(v), y1: m.t, y2: H - m.b, class: "ac-grid" }, s);
        svg("text", { x: X(v), y: H - m.b + 18, class: "ac-ytick", "text-anchor": "middle" }, s).textContent = v + (p.unit || "");
      });
      p.rows.forEach(function (r, i) {
        var y = m.t + rowH * i + rowH / 2,
          up = r.to > r.from,
          same = r.to === r.from;
        var g = svg("g", { class: "ac-db-row" }, s);
        svg("rect", { x: 0, y: y - rowH / 2, width: W, height: rowH, fill: "transparent" }, g);
        svg("text", { x: m.l - 12, y: y + 4, class: "ac-db-lab", "text-anchor": "end" }, g).textContent = name(r.key);
        svg("line", { x1: X(r.from), x2: X(r.to), y1: y, y2: y, class: "ac-db-bar " + (same ? "same" : up ? "up" : "down") }, g);
        svg("circle", { cx: X(r.from), cy: y, r: 6, class: "ac-db-from" }, g);
        svg("circle", { cx: X(r.to), cy: y, r: 7, fill: color(r.key), stroke: "var(--ac-surface)", "stroke-width": 2 }, g);
        var d = r.to - r.from;
        svg("text", { x: W - m.r + 10, y: y + 4, class: "ac-db-delta " + (same ? "same" : up ? "up" : "down") }, g).textContent =
          (same ? "±0" : (d > 0 ? "+" : "−") + fmt(Math.abs(d))) + (p.deltaUnit || "");
        g.addEventListener("mousemove", function () {
          placeTip(
            ctx,
            X(Math.max(r.from, r.to)),
            y - 10,
            '<div class="ac-tip-h">' +
              name(r.key) +
              "</div>" +
              '<div class="ac-row">' +
              p.fromName +
              "<b>" +
              fmt(r.from) +
              (p.unit || "") +
              "</b></div>" +
              '<div class="ac-row">' +
              p.toName +
              "<b>" +
              fmt(r.to) +
              (p.unit || "") +
              "</b></div>"
          );
        });
        g.addEventListener("mouseleave", function () {
          ctx.tip.style.display = "none";
        });
      });
      ctx.legend.innerHTML =
        '<span class="ac-key"><span class="ac-db-from-key"></span>' +
        p.fromName +
        "</span>" +
        '<span class="ac-key"><span class="ac-db-to-key"></span>' +
        p.toName +
        " (model colour)</span>";
    });
  }

  /* ---------- image tabs (e.g. success vs fail frames per task) ---------- */
  function imageTabs(id) {
    var root = document.getElementById(id);
    if (!root) {
      return;
    }
    var bs = root.querySelectorAll(".ac-tabs button"),
      panes = root.querySelectorAll("[data-pane]");
    function show(i) {
      for (var j = 0; j < bs.length; j++) {
        bs[j].className = j === i ? "on" : "";
        panes[j].style.display = j === i ? "" : "none";
      }
    }
    for (var i = 0; i < bs.length; i++) {
      (function (k) {
        bs[k].addEventListener("click", function () {
          show(k);
        });
      })(i);
    }
    show(0);
  }

  window.AproCharts = { line: line, dumbbell: dumbbell, imageTabs: imageTabs };
})();
