# 🎮 NIRD Village Tech - Testing Guide

Welcome to the NIRD Village Tech testing guide! This document outlines how to test every feature of the game, including the main story mode, challenges, and hidden secrets.

## 🕹️ Game Modes

### 1. Story Mode (Main Campaign)
**Goal:** Liberate the school computer lab from proprietary software.
- **Step 1: Map Selection**
  - Click on the unlocked room (e.g., "Classroom 101").
  - *Note:* Other rooms unlock as you progress.
- **Step 2: PC Inspection**
  - Click on a machine (Laptop, Desktop, etc.) to view its specs.
  - Click "Start Repairs" to proceed.
- **Step 3: Workbench (Repair Phase)**
  - **Objective:** Install 3 components without running out of budget.
  - **Action:** Drag components from the inventory to their matching slots on the motherboard.
    - CPU ➡️ CPU Socket (Center)
    - RAM ➡️ RAM Slot (Top Left)
    - Storage ➡️ SATA Port (Bottom Right)
  - *Fail Condition:* Placing in wrong slot adds a "Mistake".
- **Step 4: OS Selection**
  - Choose a Linux distribution (e.g., Linux Mint for students).
- **Step 5: Bloatware Shooter**
  - **Objective:** Destroy falling bloatware before it hits the hard drive.
  - **Action:** Click on the falling icons (💩, 👁️, 📢).
  - *Win Condition:* Reach 100% installation progress.
- **Step 6: Customization**
  - Select a Theme, App Package, and Restriction.
  - Click "Complete Setup" to finish the room.

### 2. Arcade Mode
**Goal:** High score challenge.
- Select "Arcade" from the main menu.
- Play through an endless loop of repairs and shooter mini-games.

### 3. Challenges Mode
**Goal:** Specific technical challenges.
- Select "Challenges" from the main menu.
- **MiniMind (AI Sorter):** See detailed testing below.

---

## 🧠 MiniMind Challenge (AI Sorter)

**Access:** Via "Challenges" Mode or the "Try AI Sorter" button on the Landing Page.

### Features to Test:
1.  **Recycling Sorter (Default Mode):**
    - Hold an object (e.g., a bottle) to the camera.
    - Click **"TRAIN: PLASTIC"** (Red Button).
    - Hold a piece of paper.
    - Click **"TRAIN: RECYCLABLE"** (Blue Button).
    - Move the objects in/out of frame and watch the AI guess the label!
2.  **Hand Tracking:**
    - Click the **"HAND"** tab.
    - Show your hand to the camera.
    - Verify that a skeleton is drawn over your hand and the finger counter works.
3.  **Face Detection:**
    - Click the **"FACE"** tab.
    - Look at the camera.
    - Verify a green box tracks your face.
4.  **Educational Modal:**
    - Click the **"?"** or **"HOW IT WORKS"** button to read about Transfer Learning.

---

## 🐍 Hidden Secrets (Easter Eggs)

There is a hidden Snake game embedded in the application!

### How to Activate:
You can trigger the secret game from **ANYWHERE** in the app (Landing page, Map, etc.) using one of these methods:

**Method 1: The Konami Code**
Press the following keys on your keyboard:
`↑` `↑` `↓` `↓` `←` `→` `←` `→` `b` `a`

**Method 2: The Keyword**
Simply type the word:
`s` `n` `a` `k` `e`

### How to Play:
- Use **Arrow Keys** to move the snake.
- Eat the red food to grow.
- Avoid hitting the walls or yourself.
- Press **Esc** to close the game.

---

## 🛠️ Troubleshooting

- **Camera Issues:** Ensure you have allowed camera access in your browser.
- **Performance:** If the AI runs slow, try closing other tabs.
- **Reset:** Click the "Home" icon in the game navigation to return to the main menu.
