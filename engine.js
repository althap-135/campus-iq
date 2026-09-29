// ============================================================
//  CAMPUS FACILITY SYSTEM — AI ALLOCATION ENGINE
// ============================================================

const Engine = (() => {

  // ── Weights for scoring ──────────────────────────────────────
  const W = { capacity:0.30, typeMatch:0.30, availability:0.25, utilization:0.10, amenities:0.05 };

  // ── Time overlap check ───────────────────────────────────────
  function timesOverlap(s1, e1, s2, e2) {
    const toMin = t => { const [h,m] = t.split(':').map(Number); return h*60+m; };
    return toMin(s1) < toMin(e2) && toMin(e1) > toMin(s2);
  }

  // ── Get active bookings for a facility on a date ─────────────
  function getActiveBookings(facilityId, date) {
    return BOOKINGS.filter(b =>
      b.facilityId === facilityId &&
      b.date === date &&
      ['approved','pending','conflict'].includes(b.status)
    );
  }

  // ── Check if facility is free for a slot ────────────────────
  function isFacilityFree(facilityId, date, startTime, endTime, excludeBookingId=null) {
    const existing = getActiveBookings(facilityId, date)
      .filter(b => b.id !== excludeBookingId);
    return !existing.some(b => timesOverlap(startTime, endTime, b.startTime, b.endTime));
  }

  // ── Score a facility against requirements ────────────────────
  function scoreFacility(facility, req) {
    if (facility.status !== 'active') return 0;

    // 1. Capacity fit: prefer slightly bigger than needed (0-1)
    let capScore = 0;
    if (facility.capacity >= req.attendees) {
      const ratio = req.attendees / facility.capacity;
      capScore = ratio >= 0.5 ? 1 : ratio + 0.3; // penalize huge rooms
      capScore = Math.min(capScore, 1);
    }

    // 2. Type match (exact = 1, related = 0.5, any = 0.2)
    let typeScore = 0;
    if (!req.type || req.type === 'Any') {
      typeScore = 0.8;
    } else if (facility.type === req.type) {
      typeScore = 1;
    } else {
      typeScore = 0.1;
    }

    // 3. Availability (0 or 1)
    const avail = isFacilityFree(facility.id, req.date, req.startTime, req.endTime) ? 1 : 0;

    // 4. Utilization (prefer less-used rooms)
    const utilRate = getUtilizationRate(facility.id, 7);
    const utilScore = 1 - utilRate;

    // 5. Amenities match
    let amenScore = 0;
    if (req.amenities && req.amenities.length > 0) {
      const matched = req.amenities.filter(a =>
        facility.amenities.some(fa => fa.toLowerCase().includes(a.toLowerCase()))
      ).length;
      amenScore = matched / req.amenities.length;
    } else {
      amenScore = 1;
    }

    const total = W.capacity      * capScore
                + W.typeMatch     * typeScore
                + W.availability  * avail
                + W.utilization   * utilScore
                + W.amenities     * amenScore;

    return { score: Math.round(total * 100), avail: avail===1, capScore, typeScore, amenScore };
  }

  // ── Recommend facilities ─────────────────────────────────────
  function recommend(req) {
    const results = FACILITIES.map(f => {
      const s = scoreFacility(f, req);
      return { facility: f, ...s };
    })
    .filter(r => r.score > 0)
    .sort((a,b) => b.score - a.score);

    const available = results.filter(r => r.avail);
    const alternatives = results.filter(r => !r.avail).slice(0, 3);
    return { available: available.slice(0,5), alternatives };
  }

  // ── Detect all conflicts ─────────────────────────────────────
  function detectAllConflicts() {
    const conflicts = [];
    const byFacDate = {};
    BOOKINGS.forEach(b => {
      if (!['approved','pending','conflict'].includes(b.status)) return;
      const key = `${b.facilityId}__${b.date}`;
      if (!byFacDate[key]) byFacDate[key] = [];
      byFacDate[key].push(b);
    });

    Object.values(byFacDate).forEach(group => {
      for (let i=0; i<group.length; i++) {
        for (let j=i+1; j<group.length; j++) {
          const a=group[i], b=group[j];
          if (timesOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) {
            const existing = conflicts.find(c =>
              (c.booking1.id===a.id && c.booking2.id===b.id) ||
              (c.booking1.id===b.id && c.booking2.id===a.id)
            );
            if (!existing) {
              conflicts.push({ booking1:a, booking2:b, facilityId:a.facilityId, date:a.date });
            }
          }
        }
      }
    });
    return conflicts;
  }

  // ── Utilization rate (0‒1) for N past days ──────────────────
  function getUtilizationRate(facilityId, days=7) {
    const slots = days * 13; // ~13 usable hours/day
    const used  = BOOKINGS.filter(b =>
      b.facilityId === facilityId &&
      ['approved','completed'].includes(b.status)
    ).reduce((acc,b) => {
      const [sh,sm]=b.startTime.split(':').map(Number);
      const [eh,em]=b.endTime.split(':').map(Number);
      return acc + ((eh*60+em)-(sh*60+sm))/60;
    }, 0);
    return Math.min(used / slots, 1);
  }

  // ── Utilization % per facility ────────────────────────────────
  function getAllUtilization() {
    return FACILITIES.map(f => ({
      facility: f,
      rate: Math.round(getUtilizationRate(f.id, 7) * 100)
    })).sort((a,b) => b.rate - a.rate);
  }

  // ── Demand heatmap (bookings per hour of day) ─────────────────
  function getDemandByHour() {
    const hours = Array(14).fill(0); // 07:00–20:00
    BOOKINGS.forEach(b => {
      if (!['approved','completed','conflict'].includes(b.status)) return;
      const [sh] = b.startTime.split(':').map(Number);
      const [eh] = b.endTime.split(':').map(Number);
      for (let h=sh; h<eh; h++) {
        const idx = h - 7;
        if (idx >= 0 && idx < 14) hours[idx]++;
      }
    });
    return hours;
  }

  // ── Booking stats ─────────────────────────────────────────────
  function getStats() {
    const today = getTodayBookings();
    const conflicts = detectAllConflicts();
    const active = FACILITIES.filter(f => f.status==='active').length;
    const maintenance = FACILITIES.filter(f => f.status==='maintenance').length;
    const utilArr = getAllUtilization();
    const avgUtil = Math.round(utilArr.reduce((a,b)=>a+b.rate,0)/utilArr.length);
    const underutilized = utilArr.filter(u => u.rate < 20);
    const overdemanded  = utilArr.filter(u => u.rate > 70);

    return {
      totalFacilities: FACILITIES.length,
      activeFacilities: active,
      maintenanceFacilities: maintenance,
      todayBookings: today.length,
      activeConflicts: conflicts.length,
      avgUtilization: avgUtil,
      underutilizedCount: underutilized.length,
      overdemandedCount: overdemanded.length,
      pendingApprovals: BOOKINGS.filter(b=>b.status==='pending').length,
    };
  }

  // ── Resolve a conflict ────────────────────────────────────────
  function resolveConflict(keepId, removeId) {
    const b = BOOKINGS.find(x=>x.id===removeId);
    if (b) b.status = 'cancelled';
    const k = BOOKINGS.find(x=>x.id===keepId);
    if (k) k.status = 'approved';
    // Re-scan all conflict statuses
    refreshConflictStatuses();
  }

  function refreshConflictStatuses() {
    const conflicts = detectAllConflicts();
    const conflictIds = new Set();
    conflicts.forEach(c => { conflictIds.add(c.booking1.id); conflictIds.add(c.booking2.id); });
    BOOKINGS.forEach(b => {
      if (b.status === 'conflict' && !conflictIds.has(b.id)) {
        b.status = 'approved';
      }
    });
  }

  // ── Book a facility ───────────────────────────────────────────
  function book(req) {
    const free = isFacilityFree(req.facilityId, req.date, req.startTime, req.endTime);
    const status = free ? 'approved' : 'conflict';
    const newB = {
      id: generateBookingId(),
      facilityId: req.facilityId,
      userId: CURRENT_USER.id,
      title: req.title,
      date: req.date,
      startTime: req.startTime,
      endTime: req.endTime,
      attendees: req.attendees,
      status,
      purpose: req.purpose,
      createdAt: new Date().toISOString()
    };
    BOOKINGS.push(newB);
    if (!free) {
      // mark conflicting bookings
      getActiveBookings(req.facilityId, req.date)
        .filter(b => b.id !== newB.id && timesOverlap(req.startTime,req.endTime,b.startTime,b.endTime))
        .forEach(b => { if(b.status==='approved') b.status='conflict'; });
    }
    return { booking: newB, hasConflict: !free };
  }

  return { recommend, detectAllConflicts, getAllUtilization, getDemandByHour, getStats, resolveConflict, isFacilityFree, book, timesOverlap, refreshConflictStatuses };
})();
