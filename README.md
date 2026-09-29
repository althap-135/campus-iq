# 🏛️ CampusFlow — Intelligent Resource Allocation System for Campus Facilities

> **8-Hour AI Hackathon Submission**  
> **Problem Statement:** PS-03 | Smart Campus / AI & Optimization  
> **Assigned Team:** Team Hetro (TEAM-06)  
> **Live Web App:** [http://localhost:8080](http://localhost:8080)

---

## 📌 Executive Summary

**CampusFlow** is an intelligent, automated campus facility management and resource allocation platform. Designed to eliminate scheduling conflicts and minimize facility underutilization, the system optimizes classrooms, laboratories, seminar halls, conference suites, and athletic grounds across multi-building campuses.

The platform integrates a **multi-constraint satisfaction allocation algorithm**, **real-time conflict detection and 1-click resolution engine**, and an **interactive Google Gemini 2.5 Flash conversational assistant** with live campus context awareness.

---

## ✨ Key Features & Capabilities

### 1. 🤖 AI-Powered Constraint Allocation Engine
- Evaluates resource assignments based on a multi-factor scoring formula:
  $$\text{Score} = w_1 \cdot \text{CapacityFit} + w_2 \cdot \text{TypeMatch} + w_3 \cdot \text{Availability} + w_4 \cdot (1 - \text{Utilization}) + w_5 \cdot \text{Amenities}$$
- Recommends the top matching facilities ranked by suitability percentage.
- Prevents booking oversized rooms for small groups and prevents room overcrowding.

### 2. ⚠️ Conflict Detection & 1-Click Auto-Resolution
- Automatically scans all campus bookings for temporal and spatial overlaps.
- Visual alerts highlight active double bookings with conflict duration timers.
- **1-Click Resolution**: Admins can keep preferred reservations and auto-relocate displaced events to recommended alternative facilities with zero scheduling downtime.

### 3. 💬 Real-Time Google Gemini 2.5 Flash AI Assistant
- Floating desktop AI chat widget connected directly to Google Gemini 2.5 Flash.
- Ingests real-time campus database state (21 facilities, 11 today's bookings, active conflicts).
- Natural language queries:
  - *"I have 45 students, which computer labs are available today?"*
  - *"Are there any scheduling conflicts right now and how can I resolve them?"*
  - *"Which rooms are currently underutilized?"*
- Powered by a secure local Python backend proxy (`/api/gemini`) for instantaneous zero-CORS response streaming.

### 4. 📊 Utilization Analytics & Demand Heatmaps
- Interactive Chart.js visualizations:
  - **7-Day Facility Utilization Rate** bar chart
  - **Hourly Booking Demand Heatmap** (07:00 to 20:00)
  - **Facility Type Distribution** donut chart
  - **Weekly Trend** line chart
- Automated identification of **Over-demanded (>70%)** and **Underutilized (<20%)** campus zones.

### 5. 🗓️ Master Schedule & Real-Time Timeline
- Daily hour-by-hour timeline track for every facility.
- Filterable booking master list (by date and facility type).
- Instant approval/cancellation workflows.

### 6. 👤 Role-Based Persona Simulation
- Dynamic user switching between **Administrator**, **Faculty**, and **Student** accounts.
- Priority-based allocation tiers (Faculty priority overrides student requests).

---

## 🎨 Design System: "Dark Emerald & Obsidian"

Crafted specifically for executive command centers and hackathon evaluation:
- **Palette:** Deep Obsidian (`#050c08`), Forest Slate (`#0c1913`), and Glowing Emerald (`#10b981`, `#34d399`).
- **Typography:** Inter font family with tabular numeric figures for real-time synchronization.
- **Visuals:** SVG room architectural graphics, glowing sparkline performance indicators, and smooth glassmorphism modals.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.8+ (any standard Python installation)
- Modern web browser (Chrome, Edge, Firefox, Brave, Safari)

### 1. Start the Application Server
Open a terminal in the project directory and run:
```bash
python server.py
```
*The server will start on port `8080` with the built-in Gemini API proxy enabled.*

### 2. Access the Application
Open your browser and navigate to:
```
http://localhost:8080
```
*(On mobile or local network devices: `http://<YOUR_LOCAL_IP>:8080`)*

---

## 📁 Project Architecture & File Structure

```
team hetro/
├── index.html          # Main SPA document (Dashboard, Booking, Schedule, Conflicts, Analytics, Admin)
├── style.css           # Custom Dark Emerald Obsidian design system and responsive styles
├── data.js             # Simulated campus database (21 facilities, 10 users, 23 active/past bookings)
├── engine.js           # Multi-constraint scoring algorithm & conflict detection engine
├── charts.js           # Chart.js visualization configurations and data mapping
├── app.js              # Application controller, navigation, modal management, and UI logic
├── ai-assistant.js     # Google Gemini conversational widget with system prompt injection
├── server.py           # Python HTTP server with /api/gemini proxy and CORS support
├── key.env             # Google Gemini API key configuration
└── README.md           # Project documentation and submission brief
```

---

## 📋 Hackathon Requirements Matrix (PS-03)

| # | Hackathon Requirement | CampusFlow Implementation | Status |
|---|---|---|:---:|
| 1 | Real-time or simulated availability | Dynamic live status tracker (`Available`, `In Use`, `Partial`, `Maintenance`) | ✅ Complete |
| 2 | Multi-constraint evaluation | Capacity fit, schedule, facility category, and amenity requirements | ✅ Complete |
| 3 | Automated allocation | Constraint satisfaction engine ranking facilities with score percentages | ✅ Complete |
| 4 | Conflict prevention & detection | Real-time overlap detector preventing double-bookings with duration metrics | ✅ Complete |
| 5 | Underutilized & over-demanded rooms | Dedicated analytical alerts classifying usage rates (>70% vs <20%) | ✅ Complete |
| 6 | Alternative recommendations | Auto-suggests closest matching available facilities when preferred are booked | ✅ Complete |
| 7 | Interactive dashboard | Live hour-by-hour timeline, stat cards with wave sparklines, and status grid | ✅ Complete |
| 8 | Administrative utilization reports | Exportable reporting dashboard with trend charts, CSV & PDF export simulation | ✅ Complete |

---

## 👥 Team Hetro (TEAM-06)
- **Challenge:** 8-Hour AI Hackathon — PS-03 (Smart Campus / AI & Optimization)
- **Built with:** ❤️, Vanilla Web Technologies, Python, and Google Gemini AI.
