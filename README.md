# P10 – Which Block Is 34?
### Wayfinding for Visitors and Newcomers at Lovely Professional University (LPU)

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Academic Status](https://img.shields.io/badge/Project-Capstone%20Minor%2FMajor-orange.svg)](#)

---

## 📌 Project Overview

**“Which Block Is 34?”** is a web-based campus wayfinding and navigation system built for **Lovely Professional University (LPU)**. 

Expansive university campuses with hundreds of numbered academic blocks and multiple perimeter gates create severe disorientation for first-time visitors, parents during admissions, external examination candidates, and delivery riders. Generic commercial satellite maps treat university campuses as monolithic road blocks without pedestrian walkways, covered corridor alternatives, or indoor floor and room navigation.

This application provides:
1. **Interactive Schematic Campus Map:** Vector SVG map of LPU’s central academic spine, perimeter gates, and facilities with selectable interactive markers and animated route flow.
2. **Graph Shortest-Path Engine:** Dijkstra’s shortest-path algorithm calculating minimal walking distance, estimated time, and turn-by-turn guidance with covered walkway toggles.
3. **Last-50-Metre Indoor Guidance:** Landmark cues (pillars, porticos, glass doors), vertical transit (stairs/elevators), and door plaque identification (e.g., Room 34-205 Seminar Hall) with arrival confirmation.
4. **Visitor Assistance & Campus Help:** Interactive modal featuring campus emergency contacts, visitor FAQ, gate guide (Gate 1 vs 2 vs 3 vs 4), and first-time orientation checklist.
5. **QR Wayfinding Signboards:** QR waypoint scanning and printable high-res waypoint signs to anchor users to ground truth.
6. **Special Event & Exam Mode:** Dynamic advisories and simplified routes for exam halls, placement drives, and convocations.
7. **Usability Testing Lab:** Built-in test bench to conduct timed participant evaluation, log confusion points, and track System Usability Scale (SUS) scores.
8. **Complete Academic Documentation:** Formal IEEE-standard college project report and a 13-slide presentation pitch deck.

---

## ⚠️ Academic Accuracy & Integrity Notice

> **Important Disclosure on Campus Data:**  
> In accordance with academic honesty guidelines, **all coordinates, node layouts, pathway distances, and walking times in this initial prototype are illustrative sample/demo models**. They are designed for software evaluation and interface demonstration, not GPS-surveyed records.
> 
> The application includes a **Campus Data Admin tool** and a modular central file (`src/data/campusData.js`) that allows university administrators to import surveyed GIS data via a single JSON file without changing any application code.

---

## 🚀 Quick Start Guide (Run in VS Code)

### Prerequisites
- **Node.js** (v18.0 or newer recommended; tested on v24)
- **npm** (v9.0 or newer)

### 1. Open in VS Code
Open the project folder in VS Code or your preferred terminal:
```bash
cd "c:\Users\Asus\OneDrive\Documents\where is block 34"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
The terminal will display the local development URL, usually:
```
  VITE v8.3.4  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
Hold `Ctrl` and click the link (or open `http://localhost:5173/` in any modern web browser).

### 4. Build for Production / Evaluation Bundle
To verify zero syntax errors and create an optimized production build:
```bash
npm run build
npm run preview
```

---

## 🗂️ Project Directory Structure

```
where-is-block-34/
├── index.html                      # Root HTML with Google Inter typography & meta tags
├── package.json                    # Project dependencies and npm scripts
├── postcss.config.js               # PostCSS configuration for Tailwind
├── tailwind.config.js              # Theme colors (Navy #0f2744, Orange #f97316)
├── vite.config.js                  # Vite bundler configuration
├── src/
│   ├── main.jsx                    # React application entry point
│   ├── index.css                   # Tailwind directives, print styles & accessibility CSS
│   ├── App.jsx                     # Core application orchestrator, views & state management
│   ├── data/
│   │   └── campusData.js           # Central campus dataset (Nodes, Edges, Rooms, Events)
│   ├── utils/
│   │   └── dijkstra.js             # Graph builder, Dijkstra algorithm & turn-by-turn logic
│   └── components/
│       ├── Navbar.jsx              # Universal navigation bar, accessibility toggles & badges
│       ├── CampusMap.jsx           # SVG vector schematic campus map with animated routes
│       ├── SearchBar.jsx           # Instant search for blocks, rooms, gates & landmarks
│       ├── PopularDestinations.jsx # Quick waypoint chips (Block 34, Gate 1, UniMall, etc.)
│       ├── RoutePlanner.jsx        # Origin/destination selector & turn-by-turn guide
│       ├── Last50mGuidance.jsx     # Final approach screen with indoor cues & confetti
│       ├── QRWayfinding.jsx        # Camera scanner simulator & printable sign generator
│       ├── EventMode.jsx           # High-traffic exam and event navigation mode
│       ├── UsabilityTestLab.jsx    # Live participant testing bench, timer & SUS logger
│       ├── ResearchEmpathy.jsx     # Design thinking research, personas, HMW & interview guide
│       ├── ProjectReport.jsx       # Academic college report (print-ready / save as PDF)
│       ├── ProjectPresentation.jsx # Interactive 13-slide pitch deck with speaker notes
│       ├── FavoritesModal.jsx      # Saved locations modal drawer
│       ├── VisitorHelpModal.jsx    # Campus emergency contacts, FAQ, gate guide & checklist
│       ├── QuickActions.jsx        # Quick action cards (Find Block, Room, Gate, Help)
│       └── HowItWorks.jsx          # 4-step accordion explaining the wayfinding flow
└── README.md                       # Complete documentation & evaluator demonstration manual
```

---

## 🧭 How to Demonstrate the Project to an Evaluator

Follow this structured 5-minute evaluation walkthrough when demonstrating the project to professors, project guides, or university examiners:

### Step 1: Homepage & Campus Search (1 Minute)
1. Show the hero title: **“Which Block Is 34? – Wayfinding for Visitors and Newcomers”**.
2. Click into the search bar and type **`34`** or **`34-205`**.
3. Point out how the search returns both **Block 34** and specific rooms like **Room 34-205 (Seminar Hall Floor 2)** with category tags.
4. Click the star icon to save it to **Favorites**, and demonstrate the top-right Favorites counter updating in real time.

### Step 2: Shortest-Path Navigation & Schematic Map (1.5 Minutes)
1. Set **Starting Point** to **Gate 1 (Main GT Road)**.
2. Set **Destination** to **Block 34 (School of Computer Science & Engineering)**.
3. Click **“Calculate Shortest Route”**.
4. Observe the interactive SVG map:
   - Notice the **pulsing green pin** at Gate 1 and the **pulsing orange pin** at Block 34.
   - Point out the **animated glowing dashed path** along the central boulevard.
   - Demonstrate the **Zoom In (+)**, **Zoom Out (-)**, and **Pan** controls.
5. Toggle **“Prioritize Covered Walkways”** to show how weather-conscious visitors can select shaded corridor paths.
6. Click **“Start Turn-by-Turn Guide”** and step through each waypoint instruction with distance estimates.

### Step 3: Last-50-Metre Indoor Guidance (1 Minute)
1. At the final navigation step, click **“Open Last-50m Guidance”**.
2. Explain the core innovation: *traditional maps abandon users at the building perimeter; P10 guides them indoors*.
3. Review the 4 visual cues:
   - Outer building portico and facade.
   - Ground floor foyer and security desk.
   - Vertical transit: taking elevators vs central stairs.
   - Room plaque recognition (e.g. Room 34-205 Seminar Hall).
4. Click **“I Have Arrived at Destination!”** to trigger the arrival celebration confetti animation.

### Step 4: QR Wayfinding & Event Mode (1 Minute)
1. Switch to the **QR Waypoints** tab.
2. Demonstrate the **Camera Scanner Simulator**: click any sample waypoint (e.g. Gate 4 or UniMall) to detect the location instantly and click *“Navigate to Block 34”*.
3. Switch to the **QR Sign Station**: show the printable campus sign ready for physical mounting.
4. Switch to **Events & Exams**: demonstrate how exam candidates can navigate directly to exam centers with one tap during mid-terms.

### Step 5: Research, Usability Lab & Academic Report (30 Seconds)
1. Navigate to **Research & Empathy**: highlight the core How Might We (HMW) statement:
   > *“How might we get a first-time visitor from any gate to the right room with confidence?”*
2. Show the **3 User Personas** (Parent Ramesh Kumar, Candidate Priya Sharma, Courier Vikram Singh).
3. Open the **Usability Testing Lab**: start the live timer, record a participant trial, and export the log as a `.csv` file.
4. Open the **Academic Report** and click **“Print / Save as PDF”** to show the university-formatted documentation.
5. Open the **Presentation Deck** and use keyboard arrows to present the project slides with speaker notes.

---

## ⚙️ Replacing Demo Data with Verified Campus Information

To update the system with authentic surveyed university estate records:

### Method A: Using the In-App Admin Panel (Zero Code)
1. Navigate to the **Admin Data** tab in the top navigation bar.
2. To add or modify physical coordinates, use the **Add Campus Node** or **Pathway Connections** forms.
3. To load an entire surveyed campus dataset, switch to **Backup / Import JSON**, paste your validated JSON, and click **“Load & Apply Dataset”**.

### Method B: Modifying the Central Data File
Open `src/data/campusData.js` and edit the structured objects:
```javascript
// Adding a verified block node:
{
  id: "block-34",
  name: "Block 34 (School of Computer Science & Engineering)",
  code: "34",
  category: "block",
  x: 480,       // Schematic X coordinate
  y: 300,       // Schematic Y coordinate
  zone: "Central Academic Spine",
  floors: 5,
  accessible: true,
  facilities: ["Elevator", "Ramp Access", "Restrooms"],
}
```

```javascript
// Connecting two nodes with surveyed physical distance:
{
  source: "gate-1",
  target: "landmark-fountain",
  distance: 180, // Physical distance in meters
  type: "boulevard", // 'boulevard' | 'covered' | 'paved'
  description: "Main Grand Trunk Boulevard with wide shaded sidewalks."
}
```

---

## ♿ Accessibility & Usability Features

- **Large Text Mode:** Click the `A+` toggle in the top header to increase base typography by 15-20% with proportional scaling for visually impaired users.
- **High Contrast Mode:** Click the `Contrast` toggle to enable WCAG AAA compliant deep black backgrounds, pure yellow borders, and high-visibility text.
- **Keyboard Navigation:** Full support for `ArrowDown`, `ArrowUp`, `Enter`, and `Escape` in search suggestions and presentation slide navigation.
- **Responsive Mobile First:** Clean responsive drawer menus and touch-friendly targets tested on mobile, tablet, and desktop viewports.

---

## 🧪 Testing Checklist

| Test Case | Feature | Expected Behavior | Status |
|---|---|---|---|
| TC-01 | Home Search | Typing "34" shows Block 34 and Room 34-205 with category badges | ✅ Pass |
| TC-02 | Route Calculation | Selecting Gate 1 ➔ Block 34 renders animated path on map with ~390m estimate | ✅ Pass |
| TC-03 | Alternative Route | Toggling alternative route shows secondary walkway option with distance | ✅ Pass |
| TC-04 | Last-50m Guidance | Clicking Last-50m opens indoor steps; arrival button triggers confetti | ✅ Pass |
| TC-05 | QR Scanner | Scanning simulated waypoint sets starting position instantly | ✅ Pass |
| TC-06 | Event Mode | Clicking "Navigate for This Event" sets exam gates and destination | ✅ Pass |
| TC-07 | Favorites | Star toggle adds/removes items from localStorage and updates badge | ✅ Pass |
| TC-08 | Usability Lab | Running test timer logs session, updates average SUS and exports CSV | ✅ Pass |
| TC-09 | Print Report | Clicking Print renders clean academic document without navbar | ✅ Pass |
| TC-10 | Presentation Deck | Arrow keys navigate slides; fullscreen and speaker notes toggle cleanly | ✅ Pass |

---

## 👥 Contributors & Academic Credits

- **Project Title:** P10 – Which Block Is 34? (Campus Wayfinding)
- **Institution:** Lovely Professional University (LPU), Phagwara, Punjab
- **Academic Track:** Minor/Major Capstone Engineering Project
- **Department:** School of Computer Science & Engineering (SCSE)
- **Evaluation Term:** Academic Year 2026
