// ============================================================
//  CAMPUS FACILITY SYSTEM — SIMULATED DATABASE
// ============================================================

const FACILITY_TYPES = {
  CLASSROOM:   'Classroom',
  LAB:         'Laboratory',
  SEMINAR:     'Seminar Hall',
  SPORTS:      'Sports Facility',
  CONFERENCE:  'Conference Room',
  AUDITORIUM:  'Auditorium'
};

const FACILITIES = [
  // Classrooms
  { id:'CR-101', name:'Classroom 101',       type:FACILITY_TYPES.CLASSROOM,  building:'Block A',       floor:1, capacity:60,  amenities:['Projector','AC','Whiteboard'],                          status:'active' },
  { id:'CR-102', name:'Classroom 102',       type:FACILITY_TYPES.CLASSROOM,  building:'Block A',       floor:1, capacity:45,  amenities:['Projector','AC','Whiteboard'],                          status:'active' },
  { id:'CR-201', name:'Classroom 201',       type:FACILITY_TYPES.CLASSROOM,  building:'Block A',       floor:2, capacity:80,  amenities:['Projector','AC','Smart Board'],                         status:'active' },
  { id:'CR-202', name:'Classroom 202',       type:FACILITY_TYPES.CLASSROOM,  building:'Block B',       floor:2, capacity:50,  amenities:['Projector','Whiteboard'],                               status:'active' },
  { id:'CR-301', name:'Classroom 301',       type:FACILITY_TYPES.CLASSROOM,  building:'Block B',       floor:3, capacity:70,  amenities:['Projector','AC','Whiteboard'],                          status:'maintenance' },
  { id:'CR-302', name:'Classroom 302',       type:FACILITY_TYPES.CLASSROOM,  building:'Block C',       floor:3, capacity:55,  amenities:['Projector','AC','Whiteboard'],                          status:'active' },

  // Laboratories
  { id:'LAB-A1', name:'Computer Lab A',      type:FACILITY_TYPES.LAB,        building:'Block A',       floor:1, capacity:30,  amenities:['30 PCs','AC','Projector','High-Speed Internet'],        status:'active' },
  { id:'LAB-A2', name:'Computer Lab B',      type:FACILITY_TYPES.LAB,        building:'Block A',       floor:1, capacity:30,  amenities:['30 PCs','AC','Projector'],                              status:'active' },
  { id:'LAB-B1', name:'Physics Lab',         type:FACILITY_TYPES.LAB,        building:'Science Wing',  floor:1, capacity:25,  amenities:['Equipment','AC','Safety Gear'],                         status:'active' },
  { id:'LAB-B2', name:'Chemistry Lab',       type:FACILITY_TYPES.LAB,        building:'Science Wing',  floor:1, capacity:20,  amenities:['Equipment','Fume Hood','Safety Gear'],                  status:'active' },
  { id:'LAB-C1', name:'Electronics Lab',     type:FACILITY_TYPES.LAB,        building:'Block C',       floor:2, capacity:25,  amenities:['Equipment','AC','Workbenches'],                         status:'active' },

  // Seminar Halls
  { id:'SH-01',  name:'Seminar Hall 1',      type:FACILITY_TYPES.SEMINAR,    building:'Block B',       floor:1, capacity:150, amenities:['Stage','Projector','AC','Sound System','Mic'],          status:'active' },
  { id:'SH-02',  name:'Seminar Hall 2',      type:FACILITY_TYPES.SEMINAR,    building:'Block C',       floor:1, capacity:100, amenities:['Projector','AC','Sound System'],                        status:'active' },
  { id:'SH-03',  name:'Mini Seminar Hall',   type:FACILITY_TYPES.SEMINAR,    building:'Block A',       floor:3, capacity:60,  amenities:['Projector','AC','Mic'],                                status:'active' },

  // Conference Rooms
  { id:'CONF-01',name:'Board Room',          type:FACILITY_TYPES.CONFERENCE, building:'Block A',       floor:4, capacity:20,  amenities:['Video Conf','AC','Smart Board','Coffee Machine'],       status:'active' },
  { id:'CONF-02',name:'Meeting Room A',      type:FACILITY_TYPES.CONFERENCE, building:'Block B',       floor:2, capacity:15,  amenities:['TV Screen','AC','Whiteboard'],                          status:'active' },
  { id:'CONF-03',name:'Meeting Room B',      type:FACILITY_TYPES.CONFERENCE, building:'Block C',       floor:3, capacity:12,  amenities:['TV Screen','AC'],                                      status:'active' },

  // Sports
  { id:'GYM-01', name:'Main Gymnasium',      type:FACILITY_TYPES.SPORTS,     building:'Sports Complex',floor:0, capacity:200, amenities:['Equipment','Changing Rooms','Showers'],                 status:'active' },
  { id:'COURT-01',name:'Basketball Court',   type:FACILITY_TYPES.SPORTS,     building:'Sports Complex',floor:0, capacity:100, amenities:['Lighting','Scoreboard'],                               status:'active' },
  { id:'COURT-02',name:'Badminton Courts',   type:FACILITY_TYPES.SPORTS,     building:'Sports Complex',floor:0, capacity:40,  amenities:['Lighting','4 Courts'],                                 status:'active' },

  // Auditorium
  { id:'AUD-01', name:'Main Auditorium',     type:FACILITY_TYPES.AUDITORIUM, building:'Block B',       floor:0, capacity:500, amenities:['Stage','Full AV','AC','Green Room','Lighting Rig'],    status:'active' },
];

const USERS = [
  { id:'U001', name:'Dr. Priya Sharma',  role:'faculty', dept:'Computer Science', email:'priya.sharma@campus.edu',     priority:2, avatar:'PS' },
  { id:'U002', name:'Prof. Rajan Kumar', role:'faculty', dept:'Physics',           email:'rajan.kumar@campus.edu',      priority:2, avatar:'RK' },
  { id:'U003', name:'Dr. Meena Iyer',    role:'faculty', dept:'Chemistry',         email:'meena.iyer@campus.edu',       priority:2, avatar:'MI' },
  { id:'U004', name:'Arjun Mehta',       role:'student', dept:'Computer Science',  email:'arjun.m@student.campus.edu',  priority:1, avatar:'AM' },
  { id:'U005', name:'Sneha Patel',       role:'student', dept:'Electronics',       email:'sneha.p@student.campus.edu',  priority:1, avatar:'SP' },
  { id:'U006', name:'Rahul Singh',       role:'student', dept:'Mechanical',        email:'rahul.s@student.campus.edu',  priority:1, avatar:'RS' },
  { id:'U007', name:'Admin User',        role:'admin',   dept:'Administration',    email:'admin@campus.edu',            priority:3, avatar:'AU' },
  { id:'U008', name:'Dr. Kavita Nair',   role:'faculty', dept:'Electronics',       email:'kavita.n@campus.edu',         priority:2, avatar:'KN' },
  { id:'U009', name:'Pooja Reddy',       role:'student', dept:'Physics',           email:'pooja.r@student.campus.edu',  priority:1, avatar:'PR' },
  { id:'U010', name:'Vikram Gupta',      role:'student', dept:'Computer Science',  email:'vikram.g@student.campus.edu', priority:1, avatar:'VG' },
];

let CURRENT_USER = USERS[6]; // Default: Admin

// ── Date helpers ──────────────────────────────────────────────
const TODAY = new Date();
const fmt   = d => d.toISOString().split('T')[0];
const TODAY_STR = fmt(TODAY);
const pastDate  = n => { const d=new Date(TODAY); d.setDate(d.getDate()-n); return fmt(d); };
const futureDate= n => { const d=new Date(TODAY); d.setDate(d.getDate()+n); return fmt(d); };

let BOOKINGS = [
  // ── Today ────────────────────────────────────────────────────
  { id:'BK-001', facilityId:'CR-101',  userId:'U001', title:'Data Structures Lecture',      date:TODAY_STR,    startTime:'09:00', endTime:'10:30', attendees:55,  status:'approved',  purpose:'Lecture',     createdAt:'2026-09-28T08:00:00' },
  { id:'BK-002', facilityId:'LAB-A1',  userId:'U001', title:'Programming Lab Session',      date:TODAY_STR,    startTime:'11:00', endTime:'13:00', attendees:28,  status:'approved',  purpose:'Lab Session', createdAt:'2026-09-28T08:10:00' },
  { id:'BK-003', facilityId:'SH-01',   userId:'U002', title:'Physics Department Seminar',   date:TODAY_STR,    startTime:'14:00', endTime:'16:00', attendees:120, status:'approved',  purpose:'Seminar',     createdAt:'2026-09-28T09:00:00' },
  { id:'BK-004', facilityId:'CONF-01', userId:'U007', title:'Faculty Coordination Meeting', date:TODAY_STR,    startTime:'10:00', endTime:'11:30', attendees:15,  status:'approved',  purpose:'Meeting',     createdAt:'2026-09-28T07:30:00' },
  { id:'BK-005', facilityId:'CR-202',  userId:'U003', title:'Chemistry Fundamentals',       date:TODAY_STR,    startTime:'09:00', endTime:'10:00', attendees:45,  status:'approved',  purpose:'Lecture',     createdAt:'2026-09-28T08:20:00' },
  { id:'BK-006', facilityId:'LAB-B2',  userId:'U003', title:'Organic Chemistry Lab',        date:TODAY_STR,    startTime:'14:00', endTime:'17:00', attendees:18,  status:'approved',  purpose:'Lab Session', createdAt:'2026-09-28T08:25:00' },
  { id:'BK-007', facilityId:'GYM-01',  userId:'U006', title:'Student Fitness Session',      date:TODAY_STR,    startTime:'07:00', endTime:'09:00', attendees:50,  status:'approved',  purpose:'Sports',      createdAt:'2026-09-27T10:00:00' },
  { id:'BK-008', facilityId:'CR-201',  userId:'U008', title:'Circuit Theory Lecture',       date:TODAY_STR,    startTime:'10:30', endTime:'12:00', attendees:75,  status:'approved',  purpose:'Lecture',     createdAt:'2026-09-28T08:30:00' },
  // ⚠ CONFLICT: LAB-A1 double-booked (11:00–13:00 vs 11:30–13:30)
  { id:'BK-009', facilityId:'LAB-A1',  userId:'U004', title:'AI Workshop',                  date:TODAY_STR,    startTime:'11:30', endTime:'13:30', attendees:25,  status:'conflict',  purpose:'Workshop',    createdAt:'2026-09-28T10:00:00' },
  // ⚠ CONFLICT: SH-02 double-booked
  { id:'BK-010', facilityId:'SH-02',   userId:'U005', title:'TechFest Planning',             date:TODAY_STR,    startTime:'15:00', endTime:'17:00', attendees:80,  status:'approved',  purpose:'Event',       createdAt:'2026-09-28T09:00:00' },
  { id:'BK-011', facilityId:'SH-02',   userId:'U009', title:'Alumni Meet Preparation',       date:TODAY_STR,    startTime:'14:30', endTime:'16:30', attendees:60,  status:'conflict',  purpose:'Meeting',     createdAt:'2026-09-28T11:00:00' },

  // ── Yesterday ────────────────────────────────────────────────
  { id:'BK-012', facilityId:'CR-101',  userId:'U001', title:'Algorithm Design',             date:pastDate(1),  startTime:'09:00', endTime:'10:30', attendees:55,  status:'completed', purpose:'Lecture',     createdAt:'2026-09-27T08:00:00' },
  { id:'BK-013', facilityId:'AUD-01',  userId:'U007', title:'Annual Prize Distribution',    date:pastDate(1),  startTime:'10:00', endTime:'14:00', attendees:450, status:'completed', purpose:'Event',       createdAt:'2026-09-25T08:00:00' },
  { id:'BK-014', facilityId:'LAB-B1',  userId:'U002', title:'Optics Experiment',            date:pastDate(1),  startTime:'14:00', endTime:'17:00', attendees:22,  status:'completed', purpose:'Lab Session', createdAt:'2026-09-27T08:00:00' },
  { id:'BK-015', facilityId:'CR-202',  userId:'U003', title:'Chemical Bonding Lecture',     date:pastDate(1),  startTime:'11:00', endTime:'12:00', attendees:48,  status:'completed', purpose:'Lecture',     createdAt:'2026-09-27T08:00:00' },
  { id:'BK-016', facilityId:'SH-03',   userId:'U008', title:'Electronics Club Meet',        date:pastDate(2),  startTime:'15:00', endTime:'17:00', attendees:55,  status:'completed', purpose:'Meeting',     createdAt:'2026-09-26T08:00:00' },

  // ── Future ────────────────────────────────────────────────────
  { id:'BK-017', facilityId:'AUD-01',  userId:'U007', title:'Cultural Fest 2026',           date:futureDate(2),startTime:'10:00', endTime:'20:00', attendees:480, status:'approved',  purpose:'Event',       createdAt:'2026-09-25T08:00:00' },
  { id:'BK-018', facilityId:'SH-01',   userId:'U001', title:'Guest Lecture: AI in Health', date:futureDate(1),startTime:'11:00', endTime:'13:00', attendees:130, status:'approved',  purpose:'Lecture',     createdAt:'2026-09-28T08:00:00' },
  { id:'BK-019', facilityId:'CONF-01', userId:'U002', title:'Research Review Meeting',      date:futureDate(1),startTime:'14:00', endTime:'16:00', attendees:18,  status:'pending',   purpose:'Meeting',     createdAt:'2026-09-29T09:00:00' },
  { id:'BK-020', facilityId:'CR-102',  userId:'U008', title:'Microprocessors Lecture',      date:futureDate(1),startTime:'09:00', endTime:'10:30', attendees:40,  status:'approved',  purpose:'Lecture',     createdAt:'2026-09-28T08:00:00' },
  { id:'BK-021', facilityId:'LAB-C1',  userId:'U008', title:'PCB Design Lab',              date:futureDate(2),startTime:'10:00', endTime:'13:00', attendees:23,  status:'approved',  purpose:'Lab Session', createdAt:'2026-09-28T08:00:00' },
  { id:'BK-022', facilityId:'COURT-01',userId:'U010', title:'Inter-dept Basketball',        date:futureDate(3),startTime:'16:00', endTime:'19:00', attendees:30,  status:'pending',   purpose:'Sports',      createdAt:'2026-09-29T10:00:00' },
  { id:'BK-023', facilityId:'LAB-A2',  userId:'U004', title:'Machine Learning Lab',         date:futureDate(1),startTime:'14:00', endTime:'17:00', attendees:28,  status:'approved',  purpose:'Lab Session', createdAt:'2026-09-29T08:00:00' },
];

let _nextId = 24;
function generateBookingId() { return `BK-${String(_nextId++).padStart(3,'0')}`; }

const TIME_SLOTS_START = ['07:00','08:00','09:00','10:00','10:30','11:00','11:30',
                          '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
const TIME_SLOTS_END   = ['08:00','09:00','10:00','10:30','11:00','11:30','12:00',
                          '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

const PURPOSES = ['Lecture','Lab Session','Seminar','Workshop','Meeting','Exam','Event','Sports','Research','Other'];

// ── Lookup helpers ─────────────────────────────────────────────
function getFacilityById(id)  { return FACILITIES.find(f => f.id === id); }
function getUserById(id)      { return USERS.find(u => u.id === id); }
function getBookingsByDate(d) { return BOOKINGS.filter(b => b.date === d); }
function getTodayBookings()   { return getBookingsByDate(TODAY_STR); }
function getActiveFacilities(){ return FACILITIES.filter(f => f.status === 'active'); }
