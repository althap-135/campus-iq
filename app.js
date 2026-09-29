// ============================================================
//  CAMPUS FACILITY SYSTEM — MAIN APPLICATION LOGIC
// ============================================================

// ── Clock ──────────────────────────────────────────────────────
// ── Clock & Date Updater ───────────────────────────────────────
function updateClock() {
  const clockEl   = document.getElementById('live-clock');
  const heroTime  = document.getElementById('hero-time');
  const heroDate  = document.getElementById('hero-date');
  const now = new Date();

  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase();
  }
  if (heroTime) {
    heroTime.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  if (heroDate) {
    heroDate.textContent = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }
}
setInterval(updateClock, 1000);
// ── Navigation Configuration ──────────────────────────────────
const PAGE_TITLES = {
  dashboard: { icon: '🏛️', title: 'Campus Resource Dashboard' },
  book:      { icon: '📅', title: 'Smart Facility Allocation & Booking' },
  schedule:  { icon: '🗓️', title: 'Campus Master Schedule' },
  conflicts: { icon: '⚠️', title: 'Conflict Management & Resolution' },
  analytics: { icon: '📊', title: 'Utilization & Demand Analytics' },
  admin:     { icon: '🔧', title: 'System Administration' }
};

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  const meta = PAGE_TITLES[page];
  if (meta) {
    const titleEl = document.getElementById('topbar-title');
    if (titleEl) titleEl.textContent = meta.title;
  }

  const contentArea = document.querySelector('.content');
  if (contentArea) contentArea.scrollTo(0, 0);
  window.scrollTo(0, 0);

  // Lazy-render
  switch(page) {
    case 'dashboard':  renderDashboard();  break;
    case 'book':       renderBook();       break;
    case 'schedule':   renderSchedule();   break;
    case 'conflicts':  renderConflicts();  break;
    case 'analytics':  renderAnalytics();  break;
    case 'admin':      renderAdmin();      break;
  }
}
window.navigate = navigate;

// Bulletproof event delegation for nav-link clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('.nav-link');
  if (link && link.dataset.page) {
    navigate(link.dataset.page);
  }
});

// ── Toast System ───────────────────────────────────────────────
function toast(msg, type='info') {
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}
window.toast = toast;

// ── Helpers ────────────────────────────────────────────────────
const typeIcon = t => ({
  'Classroom':       '🏫',
  'Laboratory':      '🔬',
  'Seminar Hall':    '🎤',
  'Sports Facility': '⚽',
  'Conference Room': '💼',
  'Auditorium':      '🎭'
}[t] || '🏢');
window.typeIcon = typeIcon;

const purposeIcon = p => ({
  'Lecture':     '📚',
  'Lab Session': '🔬',
  'Seminar':     '🎤',
  'Workshop':    '🛠️',
  'Meeting':     '💼',
  'Exam':        '📝',
  'Event':       '🎉',
  'Sports':      '⚽',
  'Research':    '🧪',
  'Other':       '📌'
}[p] || '📌');
window.purposeIcon = purposeIcon;

function getFacilityStatusToday(facilityId) {
  const fac = getFacilityById(facilityId);
  if (!fac || fac.status === 'maintenance') return 'maint';
  const now = new Date();
  const hm  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const todays = getTodayBookings().filter(b => b.facilityId===facilityId && ['approved','conflict'].includes(b.status));
  const active = todays.filter(b => Engine.timesOverlap(b.startTime,b.endTime,hm,hm+'1'));
  if (active.length) return 'busy';
  if (todays.length) return 'partial';
  return 'free';
}
window.getFacilityStatusToday = getFacilityStatusToday;
function getRoomIllustration(f) {
  if (f.type === FACILITY_TYPES.LAB) {
    return `<svg viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="90" fill="#0a1d15"/>
      <path d="M0 65 L200 65" stroke="#10b981" stroke-width="1" opacity="0.2"/>
      <rect x="18" y="44" width="46" height="22" rx="3" fill="#06130e" stroke="#10b981" stroke-width="1" opacity="0.7"/>
      <rect x="26" y="26" width="30" height="18" rx="2" fill="#0e2c20" stroke="#34d399" stroke-width="1.5"/>
      <line x1="41" y1="44" x2="41" y2="52" stroke="#34d399" stroke-width="2"/>
      <rect x="77" y="44" width="46" height="22" rx="3" fill="#06130e" stroke="#10b981" stroke-width="1" opacity="0.7"/>
      <rect x="85" y="26" width="30" height="18" rx="2" fill="#0e2c20" stroke="#34d399" stroke-width="1.5"/>
      <line x1="100" y1="44" x2="100" y2="52" stroke="#34d399" stroke-width="2"/>
      <rect x="136" y="44" width="46" height="22" rx="3" fill="#06130e" stroke="#10b981" stroke-width="1" opacity="0.7"/>
      <rect x="144" y="26" width="30" height="18" rx="2" fill="#0e2c20" stroke="#34d399" stroke-width="1.5"/>
      <line x1="159" y1="44" x2="159" y2="52" stroke="#34d399" stroke-width="2"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="90" fill="#091a13"/>
    <rect x="50" y="8" width="100" height="30" rx="3" fill="#06130e" stroke="#10b981" stroke-width="1.5" opacity="0.9"/>
    <line x1="60" y1="18" x2="140" y2="18" stroke="#34d399" stroke-width="1.2" opacity="0.6"/>
    <line x1="60" y1="26" x2="115" y2="26" stroke="#34d399" stroke-width="1" opacity="0.4"/>
    <rect x="22" y="48" width="42" height="16" rx="2" fill="#0d2b1f" stroke="#10b981" stroke-width="1" opacity="0.5"/>
    <rect x="79" y="48" width="42" height="16" rx="2" fill="#0d2b1f" stroke="#10b981" stroke-width="1" opacity="0.5"/>
    <rect x="136" y="48" width="42" height="16" rx="2" fill="#0d2b1f" stroke="#10b981" stroke-width="1" opacity="0.5"/>
    <rect x="88" y="70" width="24" height="16" rx="2" fill="#133d2c" stroke="#34d399" stroke-width="1"/>
  </svg>`;
}

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════
function renderDashboard() {
  const stats = Engine.getStats();
  const conflicts = Engine.detectAllConflicts();

  // 5 Stat Cards with Exact Waves
  document.getElementById('dash-stats').innerHTML = `
    <!-- Card 1: Active Facilities -->
    <div class="stat-card">
      <div class="stat-left">
        <div class="stat-icon-wrap green">
          <i class="fa-solid fa-building-columns"></i>
        </div>
        <div>
          <div class="stat-val">${stats.activeFacilities}</div>
          <div class="stat-label">Active Facilities</div>
          <div class="stat-sub">${stats.maintenanceFacilities} under maintenance</div>
        </div>
      </div>
      <div class="stat-sparkline">
        <svg viewBox="0 0 70 35" fill="none"><path d="M0 24 Q18 8 36 20 T70 12" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/><path d="M0 24 Q18 8 36 20 T70 12 V35 H0 Z" fill="#10b981" opacity="0.15"/></svg>
      </div>
    </div>

    <!-- Card 2: Today's Bookings -->
    <div class="stat-card">
      <div class="stat-left">
        <div class="stat-icon-wrap cyan">
          <i class="fa-solid fa-calendar-check"></i>
        </div>
        <div>
          <div class="stat-val">${stats.todayBookings}</div>
          <div class="stat-label">Today's Bookings</div>
          <div class="stat-sub up">▲ ${stats.pendingApprovals} pending</div>
        </div>
      </div>
      <div class="stat-sparkline">
        <svg viewBox="0 0 70 35" fill="none"><path d="M0 26 Q18 6 40 22 T70 10" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round"/><path d="M0 26 Q18 6 40 22 T70 10 V35 H0 Z" fill="#06b6d4" opacity="0.15"/></svg>
      </div>
    </div>

    <!-- Card 3: Active Conflicts -->
    <div class="stat-card">
      <div class="stat-left">
        <div class="stat-icon-wrap red">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div>
          <div class="stat-val" style="color: #f43f5e;">${stats.activeConflicts}</div>
          <div class="stat-label">Active Conflicts</div>
          <div class="stat-sub red-alert">Needs resolution</div>
        </div>
      </div>
      <div class="stat-sparkline">
        <svg viewBox="0 0 70 35" fill="none"><path d="M0 26 Q20 34 45 12 T70 18" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round"/><path d="M0 26 Q20 34 45 12 T70 18 V35 H0 Z" fill="#f43f5e" opacity="0.15"/></svg>
      </div>
    </div>

    <!-- Card 4: Avg Utilization -->
    <div class="stat-card">
      <div class="stat-left">
        <div class="stat-icon-wrap teal">
          <i class="fa-solid fa-chart-simple"></i>
        </div>
        <div>
          <div class="stat-val">${stats.avgUtilization}%</div>
          <div class="stat-label">Avg Utilization</div>
          <div class="stat-sub">${stats.underutilizedCount} underutilized</div>
        </div>
      </div>
      <div class="stat-sparkline">
        <svg viewBox="0 0 70 35" fill="none"><path d="M0 20 Q18 30 42 12 T70 20" stroke="#14b8a6" stroke-width="2.5" stroke-linecap="round"/><path d="M0 20 Q18 30 42 12 T70 20 V35 H0 Z" fill="#14b8a6" opacity="0.15"/></svg>
      </div>
    </div>

    <!-- Card 5: High-Demand -->
    <div class="stat-card">
      <div class="stat-left">
        <div class="stat-icon-wrap orange">
          <i class="fa-solid fa-fire"></i>
        </div>
        <div>
          <div class="stat-val">${stats.overdemandedCount}</div>
          <div class="stat-label">High-Demand</div>
          <div class="stat-sub">facilities > 70% usage</div>
        </div>
      </div>
      <div class="stat-sparkline">
        <svg viewBox="0 0 70 35" fill="none"><path d="M0 22 Q25 32 50 10 T70 16" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/><path d="M0 22 Q25 32 50 10 T70 16 V35 H0 Z" fill="#f97316" opacity="0.15"/></svg>
      </div>
    </div>
  `;

  // Visual Facility Status Grid (showing 6 top facilities as in the screenshot)
  const displayFacilities = FACILITIES.slice(0, 6);
  const gridEl = document.getElementById('facility-grid-dash');
  gridEl.innerHTML = displayFacilities.map(f => {
    const st = getFacilityStatusToday(f.id);
    const badgeLabel = { free: 'Available', busy: 'In Use', partial: 'Partial', maint: 'Maintenance' }[st];
    const badgeClass = { free: 'available', busy: 'partial', partial: 'partial', maint: 'maintenance' }[st];
    const borderClass = st === 'maint' ? 'border-gray' : st === 'partial' || st === 'busy' ? 'border-amber' : 'border-green';

    return `
      <div class="fac-visual-card ${borderClass}" onclick="showFacilityModal('${f.id}')">
        <div class="fac-img-header">
          ${getRoomIllustration(f)}
          <span class="fac-badge-overlay ${badgeClass}">${badgeLabel}</span>
          <div class="fac-menu-dots">⋮</div>
        </div>
        <div class="fac-body">
          <div class="fac-id-row">
            <span>${typeIcon(f.type)}</span>
            <span>${f.id}</span>
          </div>
          <div class="fac-title-sub">${f.name}</div>
          <div class="fac-meta-row">
            <i class="fa-solid fa-users" style="font-size: 10px;"></i>
            <span>${f.capacity} capacity · ${f.building}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Today's timeline
  renderTimelineFor(TODAY_STR, 'timeline-today');

  // Conflict summary matching the exact screenshot design
  const confEl = document.getElementById('dash-conflicts');
  if (conflicts.length === 0) {
    confEl.innerHTML = `<div style="color: #10b981; text-align: center; padding: 20px 0; font-size: 12.5px;">✅ No active conflicts detected</div>`;
  } else {
    confEl.innerHTML = conflicts.slice(0, 2).map((c, idx) => {
      const f = getFacilityById(c.facilityId);
      const duration = idx === 0 ? 90 : 60;
      return `
        <div class="conflict-item-card">
          <div class="conflict-head">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>${f.name} — ${c.date}</span>
          </div>
          <div class="conflict-desc">
            ${c.booking1.title} (${c.booking1.startTime}–${c.booking1.endTime}) conflicts with ${c.booking2.title} (${c.booking2.startTime}–${c.booking2.endTime})
          </div>
          <div class="conflict-foot">
            <div class="conflict-duration">
              <i class="fa-regular fa-clock"></i>
              <span>Conflict duration: ${duration} minutes</span>
            </div>
            <button class="btn-resolve-green" onclick="navigate('conflicts')">
              Resolve →
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Activity feed
  const recentBookings = [...BOOKINGS]
    .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
    .slice(0, 5);
  document.getElementById('activity-feed').innerHTML = recentBookings.map(b => {
    const f = getFacilityById(b.facilityId);
    const u = getUserById(b.userId);
    const dotColor = b.status === 'conflict' ? '#f43f5e' : b.status === 'approved' ? '#10b981' : '#f59e0b';
    return `
      <div style="display: flex; gap: 10px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <div style="width: 7px; height: 7px; border-radius: 50%; background: ${dotColor}; margin-top: 6px; flex-shrink: 0;"></div>
        <div>
          <div style="font-size: 12px; font-weight: 600; color: #ffffff;">${b.title} · <span style="color: var(--text-muted);">${f.id}</span></div>
          <div style="font-size: 10.5px; color: var(--text-dim); margin-top: 2px;">${u.name} · ${b.startTime}–${b.endTime}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
//  TIMELINE RENDERER
// ═══════════════════════════════════════════════════════════════
function renderTimelineFor(date, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const bookings = getBookingsByDate(date).filter(b => b.status !== 'cancelled');
  const facIds   = [...new Set(bookings.map(b=>b.facilityId))];
  const startH=7, endH=20, totalH=endH-startH;
  const hourLabels = Array.from({length:totalH},(_,i)=>`${String(i+startH).padStart(2,'0')}:00`);

  const hoursHtml = hourLabels.map(h=>`<div class="timeline-hour">${h}</div>`).join('');
  const rows = facIds.map(fid => {
    const f   = getFacilityById(fid);
    const fbs = bookings.filter(b=>b.facilityId===fid);
    const events = fbs.map(b => {
      const [sh,sm]=b.startTime.split(':').map(Number);
      const [eh,em]=b.endTime.split(':').map(Number);
      const left  = ((sh*60+sm - startH*60)/(totalH*60))*100;
      const width = ((eh*60+em - sh*60-sm)/(totalH*60))*100;
      const cls   = {approved:'ev-approved',pending:'ev-pending',conflict:'ev-conflict',completed:'ev-completed'}[b.status]||'ev-approved';
      return `<div class="timeline-event ${cls}" style="left:${left.toFixed(2)}%;width:${width.toFixed(2)}%" title="${b.title} (${b.startTime}–${b.endTime})">${b.title}</div>`;
    }).join('');
    return `
      <div class="timeline-row">
        <div class="timeline-label">${f.id}<br><span style="color:var(--text3);font-size:10px">${f.type.split(' ')[0]}</span></div>
        <div class="timeline-track">${events}</div>
      </div>
    `;
  }).join('') || `<div style="text-align:center;color:var(--text3);padding:20px">No bookings for this date</div>`;

  el.innerHTML = `
    <div class="timeline-wrap">
      <div class="timeline-hours"><div style="width:120px;flex-shrink:0"></div>${hoursHtml}</div>
      ${rows}
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════
//  FACILITY DETAIL MODAL
// ═══════════════════════════════════════════════════════════════
function showFacilityModal(facilityId) {
  const f = getFacilityById(facilityId);
  const st= getFacilityStatusToday(facilityId);
  const todayBks = getTodayBookings().filter(b=>b.facilityId===facilityId);
  const util  = Engine.getAllUtilization().find(u=>u.facility.id===facilityId);
  const utilPct = util ? util.rate : 0;
  const fillClass = utilPct>70?'red':utilPct>40?'amber':'';

  showModal(`
    <div class="modal-header">
      <div class="modal-title">${typeIcon(f.type)} ${f.name}</div>
      <span class="modal-close" onclick="closeModal()">✕</span>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      <span class="status status-${st==='maint'?'maintenance':st==='free'?'active':st}">${st==='free'?'Available':st==='busy'?'In Use':st==='partial'?'Partial Day':f.status}</span>
      <span class="role-banner role-faculty">${f.type}</span>
      <span class="role-banner role-student">${f.building} · Floor ${f.floor}</span>
    </div>
    <div class="two-col" style="gap:12px;margin-bottom:16px">
      <div class="card" style="padding:12px">
        <div class="stat-label">Capacity</div>
        <div style="font-size:22px;font-weight:700">👥 ${f.capacity}</div>
      </div>
      <div class="card" style="padding:12px">
        <div class="stat-label">7-day Utilization</div>
        <div style="font-size:22px;font-weight:700;color:${utilPct>70?'var(--red)':utilPct>40?'var(--amber)':'var(--cyan)'}">${utilPct}%</div>
        <div class="util-bar"><div class="util-fill ${fillClass}" style="width:${utilPct}%"></div></div>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <div class="form-label">Amenities</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${f.amenities.map(a=>`<span class="sch-pill" style="background:var(--cyan-fade);color:var(--cyan);border:1px solid rgba(0,212,255,.2)">${a}</span>`).join('')}
      </div>
    </div>
    <div>
      <div class="form-label">Today's Schedule (${todayBks.length} bookings)</div>
      ${todayBks.length ? todayBks.map(b=>`
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:18px">${purposeIcon(b.purpose)}</span>
          <div style="flex:1">
            <div style="font-size:12px;font-weight:600">${b.title}</div>
            <div style="font-size:11px;color:var(--text2)">${b.startTime}–${b.endTime} · ${b.attendees} attendees</div>
          </div>
          <span class="status status-${b.status}">${b.status}</span>
        </div>
      `).join('') : '<div style="color:var(--text3);font-size:12px">No bookings today</div>'}
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="closeModal();navigate('book');prefillFacility('${f.id}')">Book This Facility</button>
    </div>
  `);
}

// ═══════════════════════════════════════════════════════════════
//  BOOK FACILITY
// ═══════════════════════════════════════════════════════════════
let selectedFacilityId = null;

function renderBook() {
  const formHtml = `
    <div class="card card-glow-cyan" style="padding:24px">
      <div class="section-title"><i class="fa-solid fa-calendar-plus"></i> Booking Request</div>
      <div class="form-group">
        <label class="form-label">Event Title *</label>
        <input class="form-control" id="bk-title" placeholder="e.g. Machine Learning Lecture" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Facility Type</label>
          <select class="form-control" id="bk-type" onchange="runRecommend()">
            <option value="Any">Any Type</option>
            ${Object.values(FACILITY_TYPES).map(t=>`<option value="${t}">${typeIcon(t)} ${t}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Purpose</label>
          <select class="form-control" id="bk-purpose">
            ${PURPOSES.map(p=>`<option>${p}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Date *</label>
          <input class="form-control" id="bk-date" type="date" value="${TODAY_STR}" onchange="runRecommend()" />
        </div>
        <div class="form-group">
          <label class="form-label">Expected Attendees *</label>
          <input class="form-control" id="bk-attendees" type="number" min="1" placeholder="e.g. 45" onchange="runRecommend()" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Start Time *</label>
          <select class="form-control" id="bk-start" onchange="runRecommend()">
            ${TIME_SLOTS_START.map(t=>`<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">End Time *</label>
          <select class="form-control" id="bk-end" onchange="runRecommend()">
            ${TIME_SLOTS_END.map(t=>`<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Required Amenities</label>
        <div style="display:flex;flex-wrap:wrap;gap:8px" id="amenity-checks">
          ${['Projector','AC','Smart Board','Sound System','30 PCs','Equipment','Video Conf'].map(a=>`
            <label style="display:flex;align-items:center;gap:5px;font-size:12px;cursor:pointer">
              <input type="checkbox" class="amenity-cb" value="${a}" onchange="runRecommend()" /> ${a}
            </label>
          `).join('')}
        </div>
      </div>
      <button class="btn btn-primary btn-full" onclick="submitBooking()">
        <i class="fa-solid fa-bolt"></i> Confirm Booking
      </button>
    </div>
  `;

  const recHtml = `
    <div>
      <div class="card card-glow-purple" style="padding:20px;margin-bottom:16px">
        <div class="section-title" style="margin-bottom:12px"><i class="fa-solid fa-robot"></i> AI Recommendations</div>
        <div id="rec-results">
          <div style="text-align:center;color:var(--text3);padding:30px 0;font-size:13px">
            Fill in the form to get smart facility recommendations
          </div>
        </div>
      </div>
      <div class="card" style="padding:16px">
        <div class="section-title" style="font-size:13px;margin-bottom:10px"><i class="fa-solid fa-info-circle"></i> How AI Scoring Works</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.8">
          Our engine scores each facility on:<br>
          🎯 <strong>Capacity Fit</strong> (30%) — Not too big, not too small<br>
          🏷️ <strong>Type Match</strong> (30%) — Right facility for your need<br>
          📅 <strong>Availability</strong> (25%) — No conflicts in your slot<br>
          📊 <strong>Utilization</strong> (10%) — Prefer underused rooms<br>
          🔧 <strong>Amenities</strong> (5%) — Your required features
        </div>
      </div>
    </div>
  `;

  document.getElementById('book-container').innerHTML = `
    <div class="book-layout">
      ${formHtml}
      ${recHtml}
    </div>
  `;

  // Set default end time
  document.getElementById('bk-end').value = TIME_SLOTS_END[2]; // 10:00
  runRecommend();
}

function getBookingReq() {
  const amenities = [...document.querySelectorAll('.amenity-cb:checked')].map(c=>c.value);
  return {
    type:      document.getElementById('bk-type')?.value || 'Any',
    date:      document.getElementById('bk-date')?.value || TODAY_STR,
    startTime: document.getElementById('bk-start')?.value || '09:00',
    endTime:   document.getElementById('bk-end')?.value   || '10:00',
    attendees: parseInt(document.getElementById('bk-attendees')?.value)||30,
    amenities,
  };
}

function runRecommend() {
  const req = getBookingReq();
  if (!req.attendees || req.startTime >= req.endTime) return;
  const {available, alternatives} = Engine.recommend(req);
  const recEl = document.getElementById('rec-results');
  if (!recEl) return;

  const makeCard = (r, isAlt=false) => {
    const fillClass = r.score>70?'':'amber';
    const sel = selectedFacilityId===r.facility.id;
    return `
      <div class="rec-card ${isAlt?'unavailable':''} ${sel?'selected':''}"
           onclick="${isAlt?'':'selectFacility(\''+r.facility.id+'\')'}" >
        <div style="display:flex;align-items:flex-start;gap:10px">
          <div>
            <div class="rec-score" style="color:${r.score>70?'var(--cyan)':r.score>50?'var(--amber)':'var(--red)'}">${r.score}</div>
            <div style="font-size:10px;color:var(--text3)">score</div>
          </div>
          <div style="flex:1;min-width:0">
            <div class="rec-name">${typeIcon(r.facility.type)} ${r.facility.name}</div>
            <div class="rec-meta">${r.facility.id} · ${r.facility.building} · 👥 ${r.facility.capacity}</div>
            <div class="rec-meta" style="margin-top:3px">${r.facility.amenities.slice(0,3).join(' · ')}</div>
            <div class="score-bar-wrap"><div class="score-bar ${fillClass}" style="width:${r.score}%"></div></div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            ${isAlt
              ? '<span class="status status-conflict" style="font-size:10px">Booked</span>'
              : `<span class="status status-approved" style="font-size:10px">Free</span>`
            }
            ${sel?'<div style="color:var(--cyan);font-size:18px">✓</div>':''}
          </div>
        </div>
      </div>
    `;
  };

  let html = '';
  if (available.length) {
    html += available.map(r=>makeCard(r,false)).join('');
  } else {
    html += `<div style="color:var(--amber);font-size:12px;margin-bottom:10px">⚠️ No available facilities for this slot</div>`;
  }
  if (alternatives.length) {
    html += `<div style="font-size:11px;font-weight:600;color:var(--text2);margin:10px 0 6px">ALTERNATIVES (currently booked)</div>`;
    html += alternatives.map(r=>makeCard(r,true)).join('');
  }
  recEl.innerHTML = html;
}

function selectFacility(id) {
  selectedFacilityId = id;
  runRecommend();
  toast(`Selected: ${getFacilityById(id).name}`, 'info');
}

function prefillFacility(id) {
  selectedFacilityId = id;
  setTimeout(()=>{ renderBook(); selectFacility(id); }, 100);
}

function submitBooking() {
  const req = getBookingReq();
  const title = document.getElementById('bk-title')?.value?.trim();
  const purpose = document.getElementById('bk-purpose')?.value;

  if (!title) { toast('Please enter an event title', 'error'); return; }
  if (!selectedFacilityId) { toast('Please select a facility from recommendations', 'warning'); return; }
  if (!req.attendees || req.attendees < 1) { toast('Please enter number of attendees', 'error'); return; }
  if (req.startTime >= req.endTime) { toast('End time must be after start time', 'error'); return; }

  const f = getFacilityById(selectedFacilityId);
  if (req.attendees > f.capacity) {
    toast(`Attendees (${req.attendees}) exceeds capacity (${f.capacity})`, 'warning');
    return;
  }

  const result = Engine.book({ ...req, facilityId:selectedFacilityId, title, purpose });
  if (result.hasConflict) {
    toast(`Booking created with CONFLICT! ⚠️ ${f.name} has an overlapping booking.`, 'warning');
  } else {
    toast(`✅ Booking confirmed! ${f.name} on ${req.date}`, 'success');
  }

  selectedFacilityId = null;
  renderBook();
  renderConflicts();
}

// ═══════════════════════════════════════════════════════════════
//  SCHEDULE VIEW
// ═══════════════════════════════════════════════════════════════
let scheduleDate = TODAY_STR;
let schedFilterType = 'All';

function renderSchedule() {
  const el = document.getElementById('schedule-container');
  const bks = getBookingsByDate(scheduleDate).filter(b=>b.status!=='cancelled');
  const filtered = schedFilterType==='All' ? bks : bks.filter(b=>{
    const f=getFacilityById(b.facilityId); return f.type===schedFilterType;
  });

  el.innerHTML = `
    <div class="filter-bar">
      <input type="date" value="${scheduleDate}" onchange="scheduleDate=this.value;renderSchedule()"
             style="background:var(--card);border:1px solid var(--border);color:var(--text);padding:7px 12px;border-radius:var(--radius-sm)">
      <select onchange="schedFilterType=this.value;renderSchedule()"
              style="background:var(--card);border:1px solid var(--border);color:var(--text);padding:7px 12px;border-radius:var(--radius-sm)">
        <option value="All">All Types</option>
        ${Object.values(FACILITY_TYPES).map(t=>`<option ${schedFilterType===t?'selected':''}>${t}</option>`).join('')}
      </select>
      <button class="btn btn-sm btn-secondary" onclick="scheduleDate=TODAY_STR;renderSchedule()">Today</button>
      <span style="color:var(--text2);font-size:13px;margin-left:auto">${filtered.length} bookings</span>
    </div>
    <div class="card" style="padding:16px;margin-bottom:16px">
      <div class="section-title"><i class="fa-solid fa-clock"></i> Timeline View</div>
      <div id="timeline-sch" class="timeline-container"></div>
    </div>
    <div class="card">
      <div class="section-title"><i class="fa-solid fa-list"></i> Booking List</div>
      <div class="schedule-grid">
        <table class="sch-table">
          <thead><tr>
            <th>Booking ID</th><th>Facility</th><th>Title</th><th>Time</th>
            <th>Attendees</th><th>Booked By</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            ${filtered.length ? filtered.sort((a,b)=>a.startTime.localeCompare(b.startTime)).map(b=>{
              const f=getFacilityById(b.facilityId);
              const u=getUserById(b.userId);
              return `
                <tr>
                  <td><code style="color:var(--cyan)">${b.id}</code></td>
                  <td><strong>${f.id}</strong><br><span style="color:var(--text2);font-size:11px">${f.type}</span></td>
                  <td>${b.title}</td>
                  <td>${b.startTime}–${b.endTime}</td>
                  <td>👥 ${b.attendees}</td>
                  <td><div style="display:flex;align-items:center;gap:6px">
                    <div class="avatar" style="width:22px;height:22px;font-size:9px">${u.avatar}</div>
                    <span style="font-size:12px">${u.name}</span>
                  </div></td>
                  <td><span class="status status-${b.status}">${b.status}</span></td>
                  <td>
                    ${b.status==='pending'?`<button class="btn btn-sm btn-primary" onclick="approveBooking('${b.id}')">Approve</button>`:''}
                    ${['approved','pending','conflict'].includes(b.status)?`<button class="btn btn-sm btn-danger" style="margin-left:4px" onclick="cancelBooking('${b.id}')">Cancel</button>`:''}
                  </td>
                </tr>
              `;
            }).join('') : `<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:30px">No bookings for this date</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
  renderTimelineFor(scheduleDate, 'timeline-sch');
}

function approveBooking(id) {
  const b = BOOKINGS.find(x=>x.id===id);
  if (b) { b.status='approved'; renderSchedule(); toast(`Booking ${id} approved`, 'success'); }
}
function cancelBooking(id) {
  const b = BOOKINGS.find(x=>x.id===id);
  if (b) { b.status='cancelled'; Engine.refreshConflictStatuses(); renderSchedule(); renderConflicts(); toast(`Booking ${id} cancelled`, 'warning'); }
}

// ═══════════════════════════════════════════════════════════════
//  CONFLICTS
// ═══════════════════════════════════════════════════════════════
function renderConflicts() {
  const conflicts = Engine.detectAllConflicts();
  const el = document.getElementById('conflicts-container');

  if (conflicts.length === 0) {
    el.innerHTML = `
      <div style="text-align:center;padding:60px 20px">
        <div style="font-size:56px;margin-bottom:16px">✅</div>
        <div style="font-size:20px;font-weight:700;color:var(--green)">No Active Conflicts!</div>
        <div style="color:var(--text2);margin-top:8px">All facility bookings are conflict-free.</div>
      </div>
    `;
    return;
  }

  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <div style="background:var(--red-fade);border:1px solid rgba(239,68,68,.3);border-radius:99px;padding:6px 16px;color:var(--red);font-weight:600;font-size:13px">
        ⚠️ ${conflicts.length} Conflict${conflicts.length>1?'s':''} Detected
      </div>
      <span style="color:var(--text2);font-size:12px">Select which booking to keep and resolve</span>
    </div>
    ${conflicts.map((c,i) => {
      const f  = getFacilityById(c.facilityId);
      const u1 = getUserById(c.booking1.userId);
      const u2 = getUserById(c.booking2.userId);
      return `
        <div class="conflict-card">
          <div class="conflict-title">
            ⚠️ Conflict #${i+1} — ${typeIcon(f.type)} ${f.name}
            <span style="font-size:11px;font-weight:400;color:var(--text2);margin-left:8px">${c.date}</span>
          </div>
          <div class="conflict-items">
            <div class="conflict-item" style="border-color:rgba(16,185,129,.3)">
              <div style="font-size:10px;color:var(--green);font-weight:700;margin-bottom:4px">BOOKING A</div>
              <div class="conflict-item-title">${c.booking1.title}</div>
              <div class="conflict-item-meta">
                🕐 ${c.booking1.startTime} – ${c.booking1.endTime}<br>
                👥 ${c.booking1.attendees} attendees<br>
                👤 ${u1.name} (${u1.role})<br>
                🏷️ ${c.booking1.purpose}
              </div>
            </div>
            <div class="conflict-item" style="border-color:rgba(239,68,68,.3)">
              <div style="font-size:10px;color:var(--red);font-weight:700;margin-bottom:4px">BOOKING B</div>
              <div class="conflict-item-title">${c.booking2.title}</div>
              <div class="conflict-item-meta">
                🕐 ${c.booking2.startTime} – ${c.booking2.endTime}<br>
                👥 ${c.booking2.attendees} attendees<br>
                👤 ${u2.name} (${u2.role})<br>
                🏷️ ${c.booking2.purpose}
              </div>
            </div>
          </div>
          <div class="conflict-actions">
            <button class="btn btn-sm btn-secondary" onclick="resolveAndSuggest('${c.booking1.id}','${c.booking2.id}','${c.facilityId}','${c.date}')">
              Keep A, Move B →
            </button>
            <button class="btn btn-sm btn-secondary" onclick="resolveAndSuggest('${c.booking2.id}','${c.booking1.id}','${c.facilityId}','${c.date}')">
              Keep B, Move A →
            </button>
            <button class="btn btn-sm btn-danger" onclick="cancelBooking('${c.booking1.id}');renderConflicts()">
              Cancel A
            </button>
            <button class="btn btn-sm btn-danger" onclick="cancelBooking('${c.booking2.id}');renderConflicts()">
              Cancel B
            </button>
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function resolveAndSuggest(keepId, removeId, facilityId, date) {
  const removed = BOOKINGS.find(b=>b.id===removeId);
  const {available} = Engine.recommend({
    type:      getFacilityById(facilityId).type,
    date,
    startTime: removed.startTime,
    endTime:   removed.endTime,
    attendees: removed.attendees,
    amenities: [],
  });
  Engine.resolveConflict(keepId, removeId);
  renderConflicts();
  toast(`Booking ${keepId} kept. Booking ${removeId} cancelled.`, 'success');
  if (available.length) {
    toast(`Suggestion for ${removeId}: ${available[0].facility.name} (score: ${available[0].score})`, 'info');
  }
}

// ═══════════════════════════════════════════════════════════════
//  ANALYTICS
// ═══════════════════════════════════════════════════════════════
function renderAnalytics() {
  const utilData = Engine.getAllUtilization();
  const stats    = Engine.getStats();
  const el = document.getElementById('analytics-container');

  el.innerHTML = `
    <div class="stat-grid" style="margin-bottom:20px">
      <div class="stat-card" style="--accent-color:var(--cyan)">
        <div class="stat-icon" style="background:var(--cyan-fade)">📊</div>
        <div class="stat-info">
          <div class="stat-val">${stats.avgUtilization}%</div>
          <div class="stat-label">Average Utilization</div>
        </div>
      </div>
      <div class="stat-card" style="--accent-color:var(--green)">
        <div class="stat-icon" style="background:var(--green-fade)">✅</div>
        <div class="stat-info">
          <div class="stat-val">${BOOKINGS.filter(b=>b.status==='completed').length}</div>
          <div class="stat-label">Completed Bookings</div>
        </div>
      </div>
      <div class="stat-card" style="--accent-color:var(--amber)">
        <div class="stat-icon" style="background:var(--amber-fade)">⚠️</div>
        <div class="stat-info">
          <div class="stat-val">${stats.underutilizedCount}</div>
          <div class="stat-label">Underutilized (< 20%)</div>
        </div>
      </div>
      <div class="stat-card" style="--accent-color:var(--red)">
        <div class="stat-icon" style="background:var(--red-fade)">🔥</div>
        <div class="stat-info">
          <div class="stat-val">${stats.overdemandedCount}</div>
          <div class="stat-label">High Demand (> 70%)</div>
        </div>
      </div>
    </div>
    <div class="analytics-grid">
      <div>
        <div class="chart-card">
          <div class="chart-title">📊 Facility Utilization Rate (7 Days)</div>
          <div style="height:260px"><canvas id="chart-util"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-title">📈 Demand by Hour of Day</div>
          <div style="height:220px"><canvas id="chart-demand"></canvas></div>
        </div>
      </div>
      <div>
        <div class="chart-card">
          <div class="chart-title">🏷️ Facility Type Distribution</div>
          <div style="height:220px"><canvas id="chart-type"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-title">📅 Weekly Booking Trend</div>
          <div style="height:200px"><canvas id="chart-trend"></canvas></div>
        </div>
      </div>
    </div>
    <div class="two-col" style="gap:16px;margin-top:16px">
      <div class="card">
        <div class="section-title"><i class="fa-solid fa-arrow-trend-up" style="color:var(--red)"></i> Over-Demanded Facilities</div>
        ${utilData.filter(u=>u.rate>70).length ? utilData.filter(u=>u.rate>70).map(u=>`
          <div class="alert-row">
            <div>
              <div style="font-size:13px;font-weight:600">${u.facility.name}</div>
              <div style="font-size:11px;color:var(--text2)">${u.facility.type} · ${u.facility.building}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:16px;font-weight:700;color:var(--red)">${u.rate}%</div>
              <div class="util-bar" style="width:80px"><div class="util-fill red" style="width:${u.rate}%"></div></div>
            </div>
          </div>
        `).join('') : '<div style="color:var(--text3);font-size:12px">No over-demanded facilities</div>'}
      </div>
      <div class="card">
        <div class="section-title"><i class="fa-solid fa-arrow-trend-down" style="color:var(--amber)"></i> Underutilized Facilities</div>
        ${utilData.filter(u=>u.rate<20).length ? utilData.filter(u=>u.rate<20).map(u=>`
          <div class="alert-row">
            <div>
              <div style="font-size:13px;font-weight:600">${u.facility.name}</div>
              <div style="font-size:11px;color:var(--text2)">${u.facility.type} · Capacity: ${u.facility.capacity}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:16px;font-weight:700;color:var(--amber)">${u.rate}%</div>
              <div class="util-bar" style="width:80px"><div class="util-fill amber" style="width:${Math.max(u.rate,5)}%"></div></div>
            </div>
          </div>
        `).join('') : '<div style="color:var(--text3);font-size:12px">No underutilized facilities</div>'}
      </div>
    </div>
  `;

  setTimeout(() => {
    renderUtilizationChart('chart-util');
    renderDemandChart('chart-demand');
    renderTypeChart('chart-type');
    renderTrendChart('chart-trend');
  }, 50);
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PANEL
// ═══════════════════════════════════════════════════════════════
let adminTab = 'facilities';

function renderAdmin() {
  document.getElementById('admin-container').innerHTML = `
    <div class="admin-tabs">
      <div class="admin-tab ${adminTab==='facilities'?'active':''}" onclick="switchAdminTab('facilities')">🏛️ Facilities</div>
      <div class="admin-tab ${adminTab==='bookings'?'active':''}"   onclick="switchAdminTab('bookings')">📅 All Bookings</div>
      <div class="admin-tab ${adminTab==='users'?'active':''}"     onclick="switchAdminTab('users')">👤 Users</div>
      <div class="admin-tab ${adminTab==='reports'?'active':''}"   onclick="switchAdminTab('reports')">📋 Reports</div>
    </div>
    <div id="admin-content"></div>
  `;
  renderAdminTab();
}

function switchAdminTab(tab) { adminTab=tab; renderAdmin(); }

function renderAdminTab() {
  const el = document.getElementById('admin-content');
  if (adminTab==='facilities') {
    el.innerHTML = `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div class="section-title" style="margin:0"><i class="fa-solid fa-building"></i> All Facilities (${FACILITIES.length})</div>
          <button class="btn btn-primary btn-sm" onclick="toast('Add facility form coming soon!','info')"><i class="fa-solid fa-plus"></i> Add Facility</button>
        </div>
        <div class="schedule-grid">
          <table class="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Building</th><th>Capacity</th><th>Amenities</th><th>Status</th><th>7d Util%</th><th>Actions</th></tr></thead>
            <tbody>
              ${FACILITIES.map(f=>{
                const util = Engine.getAllUtilization().find(u=>u.facility.id===f.id);
                const utilPct = util?util.rate:0;
                return `
                  <tr>
                    <td><code style="color:var(--cyan)">${f.id}</code></td>
                    <td><strong>${f.name}</strong></td>
                    <td>${typeIcon(f.type)} ${f.type}</td>
                    <td>${f.building}</td>
                    <td>👥 ${f.capacity}</td>
                    <td style="max-width:150px;white-space:normal">
                      ${f.amenities.slice(0,2).map(a=>`<span class="sch-pill" style="background:var(--cyan-fade);color:var(--cyan);font-size:10px">${a}</span>`).join('')}
                      ${f.amenities.length>2?`<span style="color:var(--text3);font-size:10px">+${f.amenities.length-2}</span>`:''}
                    </td>
                    <td><span class="status status-${f.status}">${f.status}</span></td>
                    <td>
                      <div style="display:flex;align-items:center;gap:6px;min-width:80px">
                        <span style="font-size:12px;font-weight:600;color:${utilPct>70?'var(--red)':utilPct>40?'var(--amber)':'var(--cyan)'}">${utilPct}%</span>
                        <div class="util-bar" style="flex:1"><div class="util-fill ${utilPct>70?'red':utilPct>40?'amber':''}" style="width:${utilPct}%"></div></div>
                      </div>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-secondary" onclick="toggleMaintenance('${f.id}')">${f.status==='maintenance'?'Activate':'Maintenance'}</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (adminTab==='bookings') {
    const sorted = [...BOOKINGS].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
    el.innerHTML = `
      <div class="card">
        <div class="section-title"><i class="fa-solid fa-calendar-check"></i> All Bookings (${BOOKINGS.length})</div>
        <div class="schedule-grid">
          <table class="data-table">
            <thead><tr><th>ID</th><th>Title</th><th>Facility</th><th>Date</th><th>Time</th><th>User</th><th>Purpose</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${sorted.map(b=>{
                const f=getFacilityById(b.facilityId); const u=getUserById(b.userId);
                return `<tr>
                  <td><code style="color:var(--cyan)">${b.id}</code></td>
                  <td><strong>${b.title}</strong></td>
                  <td>${f.id}</td>
                  <td>${b.date}</td>
                  <td>${b.startTime}–${b.endTime}</td>
                  <td>${u.name}</td>
                  <td>${purposeIcon(b.purpose)} ${b.purpose}</td>
                  <td><span class="status status-${b.status}">${b.status}</span></td>
                  <td>
                    ${b.status==='pending'?`<button class="btn btn-sm btn-primary" onclick="approveBooking('${b.id}');renderAdmin()">Approve</button>`:''}
                    ${['approved','pending','conflict'].includes(b.status)?`<button class="btn btn-sm btn-danger" style="margin-left:4px" onclick="cancelBooking('${b.id}');renderAdmin()">Cancel</button>`:''}
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (adminTab==='users') {
    el.innerHTML = `
      <div class="card">
        <div class="section-title"><i class="fa-solid fa-users"></i> System Users (${USERS.length})</div>
        <table class="data-table">
          <thead><tr><th>Avatar</th><th>Name</th><th>Role</th><th>Department</th><th>Email</th><th>Priority</th><th>Switch To</th></tr></thead>
          <tbody>
            ${USERS.map(u=>`<tr>
              <td><div class="avatar">${u.avatar}</div></td>
              <td><strong>${u.name}</strong>${u.id===CURRENT_USER.id?' <span style="color:var(--cyan);font-size:11px">(You)</span>':''}</td>
              <td><span class="role-banner role-${u.role}">${u.role}</span></td>
              <td>${u.dept}</td>
              <td style="color:var(--text2);font-size:12px">${u.email}</td>
              <td><span class="sch-pill" style="background:var(--purple-fade);color:var(--purple)">${['','Student','Faculty','Admin'][u.priority]}</span></td>
              <td>${u.id!==CURRENT_USER.id?`<button class="btn btn-sm btn-secondary" onclick="switchUser('${u.id}')">Switch</button>`:'-'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (adminTab==='reports') {
    const stats = Engine.getStats();
    const byType = {};
    BOOKINGS.forEach(b=>{
      const f=getFacilityById(b.facilityId);
      byType[f.type]=(byType[f.type]||0)+1;
    });
    el.innerHTML = `
      <div class="two-col" style="gap:16px">
        <div class="card">
          <div class="section-title"><i class="fa-solid fa-chart-bar"></i> System Summary</div>
          ${[
            ['Total Facilities',stats.totalFacilities,'🏛️'],
            ['Active Facilities',stats.activeFacilities,'✅'],
            ['Under Maintenance',stats.maintenanceFacilities,'🔧'],
            ['Total Bookings',BOOKINGS.length,'📅'],
            ['Today\'s Bookings',stats.todayBookings,'📌'],
            ['Active Conflicts',stats.activeConflicts,'⚠️'],
            ['Pending Approvals',stats.pendingApprovals,'🕐'],
            ['Avg Utilization',stats.avgUtilization+'%','📊'],
          ].map(([l,v,i])=>`
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
              <span style="color:var(--text2);font-size:13px">${i} ${l}</span>
              <strong style="color:var(--cyan)">${v}</strong>
            </div>
          `).join('')}
          <button class="btn btn-primary btn-full" style="margin-top:16px" onclick="toast('Exporting report... (simulated)','success')">
            <i class="fa-solid fa-download"></i> Export PDF Report
          </button>
        </div>
        <div class="card">
          <div class="section-title"><i class="fa-solid fa-tag"></i> Bookings by Facility Type</div>
          ${Object.entries(byType).sort((a,b)=>b[1]-a[1]).map(([type,count])=>{
            const pct=Math.round(count/BOOKINGS.length*100);
            return `
              <div style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
                  <span>${typeIcon(type)} ${type}</span>
                  <strong>${count} (${pct}%)</strong>
                </div>
                <div class="util-bar"><div class="util-fill" style="width:${pct*2}%"></div></div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

function toggleMaintenance(id) {
  const f = getFacilityById(id);
  f.status = f.status==='maintenance' ? 'active' : 'maintenance';
  toast(`${f.name} set to ${f.status}`, f.status==='active'?'success':'warning');
  renderAdmin();
}

function switchUser(userId) {
  CURRENT_USER = getUserById(userId);

  // Update topbar elements
  const topName   = document.getElementById('topbar-user-name');
  const topRole   = document.getElementById('topbar-user-role');
  const topAvatar = document.getElementById('topbar-avatar');
  if (topName)   topName.textContent   = CURRENT_USER.name;
  if (topRole)   topRole.textContent   = CURRENT_USER.role.charAt(0).toUpperCase() + CURRENT_USER.role.slice(1);
  if (topAvatar) topAvatar.textContent = CURRENT_USER.avatar;

  // Update sidebar elements
  const sbName    = document.getElementById('sb-user-name');
  const sbRole    = document.getElementById('sb-user-role');
  const sbAvatar  = document.getElementById('sb-user-avatar');
  if (sbName)    sbName.textContent    = CURRENT_USER.name;
  if (sbRole)    sbRole.textContent    = CURRENT_USER.role.charAt(0).toUpperCase() + CURRENT_USER.role.slice(1);
  if (sbAvatar)  sbAvatar.textContent  = CURRENT_USER.avatar;

  toast(`Switched to ${CURRENT_USER.name} (${CURRENT_USER.role})`, 'info');
  renderAdmin();
}

function showUserSwitchModal() {
  showModal(`
    <div class="modal-header">
      <div class="modal-title">Switch User Role / Identity</div>
      <span class="modal-close" onclick="closeModal()">✕</span>
    </div>
    <div style="margin-bottom:14px;color:var(--text-muted);font-size:12.5px">
      Simulate testing as different student, faculty, or administrator personas.
    </div>
    ${USERS.map(u=>`
      <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:10px;cursor:pointer;transition:all .2s;border:1px solid ${u.id===CURRENT_USER.id?'#10b981':'rgba(255,255,255,0.06)'};background:${u.id===CURRENT_USER.id?'rgba(16,185,129,0.12)':'transparent'};margin-bottom:8px"
           onclick="switchUser('${u.id}');closeModal()">
        <div class="sb-user-avatar" style="width:32px;height:32px;font-size:11px">${u.avatar}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:13px;color:#ffffff">${u.name}</div>
          <div style="font-size:11px;color:var(--text-muted)">${u.dept} · ${u.email}</div>
        </div>
        <span class="status status-${u.role==='admin'?'conflict':u.role==='faculty'?'pending':'approved'}">${u.role.toUpperCase()}</span>
        ${u.id===CURRENT_USER.id?'<span style="color:#10b981;font-weight:bold;margin-left:6px;">✓</span>':''}
      </div>
    `).join('')}
  `);
}

// ═══════════════════════════════════════════════════════════════
//  MODAL SYSTEM
// ═══════════════════════════════════════════════════════════════
function showModal(html) {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.onclick = e => { if(e.target===overlay) closeModal(); };
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  overlay.style.display = 'flex';
}
function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════
navigate('dashboard');
