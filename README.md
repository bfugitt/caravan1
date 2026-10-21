# Caravan and Sea Routes

A trading game for the Grade 7 medieval unit. Students are merchants moving goods between
West Africa, the Islamic world, India, China, and Europe. Geography, seasons, and supply and
demand decide what they can earn, and every new city teaches something.

Runs in any browser (including Chromebooks). No accounts, no tracking. A game in progress is
saved only in the student's own browser.

## Put it online with GitHub Pages
1. Create a new GitHub repository and upload everything in this folder (keep the files together).
2. Open Settings, then Pages. Under "Build and deployment," choose "Deploy from a branch," pick `main` and `/ (root)`, and save.
3. After a minute, the game is at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

To try it first, double-click `index.html`.

## Files
- `index.html`: the page and styling
- `data.js`: **all the content** (city cards, quiz questions, events, goods, routes, prices). Edit this to change wording or facts.
- `core.js`: the game rules
- `game.js`: the screens
- `mapdata.js`: the map outlines (Natural Earth, public domain)
- `TEACHER_REVIEW.md`: a review checklist for the history teacher

## How long does a game take?
About 520 game days, usually 10 to 14 trips. I estimate 20 to 30 minutes, but it has not been timed with students yet.

## Helps for students
- "Merchants there want" appears on each destination, so students can plan what to carry.
- The 📜 Merchants' price guide shows which goods are cheap or wanted in the cities they know about (cities they have visited and the neighbors of those cities).
- The game keeps enough coins in the purse for the cheapest trip from the current city, so a student can always travel.

## Tuning
In `data.js`, `start` (coins and days), `stars` (star cut-offs), route `cost` and `days`, and each city's price `mult` control difficulty.
Each unit bought or sold moves the price 2% (`priceStep`). The star cut-offs were set from computer-simulated players, so adjust them after students try it.
