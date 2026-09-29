// ============================================================
//  CAMPUS FACILITY SYSTEM — CHARTS (Chart.js)
// ============================================================

let chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
}

// ── Shared styles ─────────────────────────────────────────────
const CHART_DEFAULTS = {
  color: '#94a3b8',
  font: { family: 'Inter, sans-serif', size: 12 },
};
Chart.defaults.color = CHART_DEFAULTS.color;
Chart.defaults.font  = CHART_DEFAULTS.font;

// ── Color palette ─────────────────────────────────────────────
const COLORS = {
  cyan:   'rgba(0,212,255,0.85)',
  purple: 'rgba(168,85,247,0.85)',
  green:  'rgba(16,185,129,0.85)',
  amber:  'rgba(245,158,11,0.85)',
  red:    'rgba(239,68,68,0.85)',
  cyanFade:   'rgba(0,212,255,0.15)',
  purpleFade: 'rgba(168,85,247,0.15)',
};

// ── 1. Utilization Bar Chart ──────────────────────────────────
function renderUtilizationChart(canvasId) {
  destroyChart(canvasId);
  const data = Engine.getAllUtilization().slice(0,12);
  const labels = data.map(d => d.facility.id);
  const values = data.map(d => d.rate);
  const bgColors = values.map(v =>
    v > 70 ? COLORS.red : v > 40 ? COLORS.amber : COLORS.cyan
  );
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Utilization %',
        data: values,
        backgroundColor: bgColors,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: {
        callbacks: { label: ctx => ` ${ctx.raw}% utilization` }
      }},
      scales: {
        x: { grid: { color:'rgba(255,255,255,0.05)' }, ticks:{color:'#94a3b8'} },
        y: { grid: { color:'rgba(255,255,255,0.05)' }, ticks:{color:'#94a3b8'}, max:100,
             title:{display:true,text:'Utilization %',color:'#94a3b8'} }
      }
    }
  });
}

// ── 2. Demand Heatmap (hourly bookings) ───────────────────────
function renderDemandChart(canvasId) {
  destroyChart(canvasId);
  const hourData = Engine.getDemandByHour();
  const labels   = Array.from({length:14},(_,i)=>`${String(i+7).padStart(2,'0')}:00`);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Bookings',
        data: hourData,
        borderColor: COLORS.cyan,
        backgroundColor: COLORS.cyanFade,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: COLORS.cyan,
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend:{display:false}, tooltip:{
        callbacks:{ label: c => ` ${c.raw} concurrent bookings` }
      }},
      scales: {
        x: { grid:{color:'rgba(255,255,255,0.05)'}, ticks:{color:'#94a3b8'} },
        y: { grid:{color:'rgba(255,255,255,0.05)'}, ticks:{color:'#94a3b8',stepSize:1},
             title:{display:true,text:'Concurrent Bookings',color:'#94a3b8'} }
      }
    }
  });
}

// ── 3. Facility Type Donut ────────────────────────────────────
function renderTypeChart(canvasId) {
  destroyChart(canvasId);
  const typeCounts = {};
  FACILITIES.forEach(f => { typeCounts[f.type] = (typeCounts[f.type]||0)+1; });
  const labels = Object.keys(typeCounts);
  const values = Object.values(typeCounts);
  const palette = [COLORS.cyan,COLORS.purple,COLORS.green,COLORS.amber,COLORS.red,'rgba(99,102,241,0.85)'];
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: palette,
        borderColor: '#111827',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position:'right', labels:{ color:'#94a3b8', padding:16, boxWidth:14 }},
        tooltip: { callbacks:{ label: c => ` ${c.label}: ${c.raw} facilities` }}
      },
      cutout:'65%'
    }
  });
}

// ── 4. Weekly Booking Trend ────────────────────────────────────
function renderTrendChart(canvasId) {
  destroyChart(canvasId);
  const days = Array.from({length:7},(_,i)=>{
    const d=new Date(TODAY); d.setDate(d.getDate()-3+i); return fmt(d);
  });
  const counts = days.map(day => BOOKINGS.filter(b=>b.date===day && b.status!=='cancelled').length);
  const dayLabels = days.map(d=>{
    const nd=new Date(d);
    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][nd.getDay()];
  });
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dayLabels,
      datasets: [{
        label: 'Bookings',
        data: counts,
        borderColor: COLORS.purple,
        backgroundColor: COLORS.purpleFade,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: COLORS.purple,
        pointRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend:{display:false}, tooltip:{
        callbacks:{ label: c=>`  ${c.raw} bookings` }
      }},
      scales: {
        x: { grid:{color:'rgba(255,255,255,0.05)'}, ticks:{color:'#94a3b8'} },
        y: { grid:{color:'rgba(255,255,255,0.05)'}, ticks:{color:'#94a3b8',stepSize:1} }
      }
    }
  });
}
