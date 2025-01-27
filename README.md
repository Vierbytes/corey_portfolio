# Portfolio Brainstorm & Inspiration

## Inspiration Sites

Here are the developer portfolio and design sites I found inspiring, along with what caught my eye about each one.

---

### 1. Tajmirul Islam - [tajmirul.site](https://www.tajmirul.site/)

This one grabbed me right away. The hero section hits you with a massive **"FRONTEND DEVELOPER"** headline using the Anton font, super bold and confident. What I really liked is the **smooth scroll physics** powered by React Lenis (with a lerp of 0.1 and duration of 1.4 seconds), which makes the whole page feel buttery and fluid instead of the default jumpy browser scroll. The dark theme with muted foreground text that brightens on hover gives it this sleek, premium feel. He also has his email displayed **vertically along the left side** of the page using `writing-mode: vertical-rl`, which is a subtle but creative touch I haven't seen on many portfolios. The stats section (3+ Years, 7+ Projects, 10K+ Hours) right in the hero is a nice way to build credibility instantly.

**Key Animations & Features:**
- Framer Motion + GSAP for scroll-triggered animations
- Smooth scrolling with React Lenis (buttery page feel)
- Hover underline effects and color transitions on interactive elements
- Gradient reveal effect on the email link (background-position animation)
- Skills organized by category with visual tech logos

---

### 2. Huts - [huts.com](https://huts.com/)

This site is on another level design-wise. The color palette alone is worth studying. They use a **deep forest green (#0c310a)** for headlines paired with a **warm brown (#664a42)** for body text, all on a cream/beige background (#fffdf6). It feels organic and earthy, completely different from the typical tech-dark-mode look. The typography pairing of **HW Cigars** (serif) for headlines and **ABC Walter Neue** (sans-serif) for body text creates a high-end editorial feel.

**Key Animations & Features:**
- **3D card flip on hover** that rotates cards 180 degrees on the Y-axis with full perspective transforms
- Horizontal scroll containers with maintained perspective
- Custom CSS grid using viewport calculations: `calc((100vw - (padding*2 + gap*n)) / columns)`, super responsive
- Bouncy micro-interactions using `cubic-bezier(.175,.885,.32,1.125)` easing
- Button animations with animated SVG paths that extend on interaction and rotating icon circles
- Modal overlays with backdrop blur (10px)
- Navigation that hides on scroll down but reappears when you activate the menu

---

### 3. Mural Pay - [muralpay.com](https://www.muralpay.com/)

Even though this is more of a product/fintech site than a personal portfolio, the design system is really clean and worth learning from. The typography strategy uses **multiple font families** (Inter, Albert Sans, Plus Jakarta Sans, PP Neue Montreal) across different weights (100-900), which gives them incredible flexibility in creating visual hierarchy without relying on just size changes. The color token system is well thought out: deep blue primaries (#3e42fa), gold/amber accents (#ffb407) for highlights, and a range of light blues for depth.

**Key Animations & Features:**
- Built with Framer, so their built-in animation capabilities are baked into every element
- Comprehensive CSS variable / design token system for dynamic theming
- Multi-font strategy for nuanced typographic hierarchy
- Clean responsive breakpoints (768px, 1200px)
- Performance-first approach with `font-display: swap` optimization

---

### 4. Dustin Brett - [dustinbrett.com](https://dustinbrett.com/)

This is probably the most *unique* portfolio I've ever seen. Instead of a traditional website, **his entire portfolio IS a functioning desktop operating system** (called daedalOS) running in the browser. You land on what looks like a Windows desktop, complete with a taskbar, file explorer, and working applications. It's a full-blown OS simulation. The dark theme uses pure black (#000) with semi-transparent overlays and Windows-style blue highlights (rgb(0, 120, 215)).

**Key Animations & Features:**
- **Full desktop OS simulation** with a taskbar, start menu, draggable/resizable windows, and file system
- CSS Grid with `grid-template-columns: repeat(auto-fill, 74px)` for desktop icon layout
- Backdrop blur effects on the taskbar
- Progressive hover feedback where backgrounds darken through multiple states (hover, active, focus)
- Dynamic theme switching with CSS custom property transitions
- System UI fonts (Segoe UI, system-ui, Roboto) for authentic OS feel
- Tabular-nums font variant for consistent number spacing in the taskbar clock

---

### 5. Adham Dannaway - [adhamdannaway.com](https://www.adhamdannaway.com/)

This portfolio nails the **designer-meets-coder** identity. The hero section uses a **split-screen design** with "designer" on one side and "&lt;coder&gt;" on the other, with a large portrait anchoring the layout. It immediately tells you who this person is and what they do. The header fades in over 1 second on page load, which feels polished without being slow.

**Key Animations & Features:**
- **Split-screen hero** that visually represents the designer/developer duality
- Page transition system where elements with `.transition` class trigger leaving animations
- Sprite-based fade-in effects for visual elements
- Thumbnail hover interactions on portfolio pieces
- Smooth scroll-to-top with `easeInOutQuad` easing
- Clipboard copy feature for email (with success/failure toast feedback)
- Clean WordPress build with custom theme, proving you don't need React for a great portfolio

---

### 6. Redoyanul Haque - [redoyanulhaque.me](https://www.redoyanulhaque.me/)

Positions as an "AI Developer | Python Engineer." The site focuses on establishing a clear professional identity right from the title. Worth revisiting for the full visual experience since it may rely heavily on client-side rendering.

---

### 7. Sector 32 - [sector32.net](https://www.sector32.net/)

This one goes for maximum atmosphere. Ultra-dark background (#0c0c0c, nearly pure black) with a **full-screen preloader animation** that takes over the entire viewport before content loads. The preloader uses centered flexbox layout spanning 100vw/100vh, which suggests a dramatic intro sequence (possibly with SVG or canvas animations). The skull emoji in the title and subtle SVG graphics in dark gray (#222222) against the near-black background create this edgy, mysterious vibe. It's the kind of site that makes you lean in and wonder what's about to happen.

**Key Animations & Features:**
- Full-viewport preloader / intro animation sequence
- Ultra-minimal dark aesthetic, near-black on black with subtle contrast
- SVG-based visual elements
- Dramatic reveal where content loads behind the preloader

---

### 8. Toukoum - [toukoum.fr](https://www.toukoum.fr/)

This portfolio takes a completely different approach. It's built around an **AI-powered Memoji character** that visitors can interact with. Instead of scrolling through static sections, you can literally ask the Memoji questions about the developer's experience, skills, and background. The navigation is organized into clean sections: "Me," "Projects," "Skills," and "Fun." It supports both light and dark mode themes and is built with Next.js. One of the most eye-catching details is the **colorful cursor trail effect**. As you move your mouse around the page, it leaves behind a trail of colorful, fading dots or particles that follow the cursor. It's a small thing but it makes the whole site feel playful and alive, like the page is reacting to you just being there.

**Key Animations & Features:**
- **Colorful cursor trail effect** that leaves a rainbow/gradient particle trail as you move the mouse across the page, giving the site a magical, interactive feel
- **AI-powered conversational Memoji** where visitors interact with a character to learn about the dev
- Light/dark theme toggle
- Modular section-based navigation (Me, Projects, Skills, Fun)
- Personality-driven design, the portfolio feels like meeting a person, not reading a resume
- Built with Next.js for performance and smooth client-side transitions

---

## 6 Unique Features That Stood Out the Most

These are the features across all the sites that I think are the most impressive, creative, or worth drawing inspiration from for my own portfolio:

### 1. Full Desktop OS Simulation (Dustin Brett)
Instead of a website, his portfolio IS an operating system. You interact with it like a real desktop: opening apps, dragging windows, using a file explorer. This completely redefines what a "portfolio" can be. It makes every other portfolio feel conventional by comparison. The sheer ambition and technical skill required to pull this off is wild.

**Why it stands out:** It proves that a portfolio doesn't have to follow any template. The medium IS the message. The OS itself demonstrates his engineering ability better than any project card ever could.

---

### 2. AI-Powered Interactive Memoji (Toukoum)
Having an AI character that visitors can talk to and ask questions about the developer is genius. It turns a passive browsing experience into an active conversation. Instead of reading about someone, you're talking to a representation of them. This is the kind of thing that makes people share your site with others.

**Why it stands out:** It's personal, memorable, and uses modern AI in a way that actually enhances the user experience rather than feeling gimmicky. It also means the portfolio can answer questions the developer didn't anticipate. It scales with curiosity.

---

### 3. 3D Card Flips & Bouncy Micro-Interactions (Huts)
The 3D card flip animations (rotateY 180 degrees with perspective) combined with bouncy cubic-bezier easing (.175, .885, .32, 1.125) make every interaction feel alive and tactile. The animated SVG button paths that extend on hover add another layer of sophistication. These aren't just animations. They make the site feel like it has *weight* and *physics*.

**Why it stands out:** Most sites have hover effects. This site has hover *experiences*. The bouncy easing makes interactions feel playful and intentional, like every element was crafted with care. It's the difference between "functional" and "delightful."

---

### 4. Split-Screen Designer/Coder Hero (Adham Dannaway)
The hero section that literally splits the screen between "designer" and "&lt;coder&gt;" is one of the most effective portfolio hero sections I've seen. It communicates a dual identity instantly, no reading required. The visual metaphor does all the heavy lifting. Combined with the portrait and the fade-in animation, it's simple but incredibly effective.

**Why it stands out:** It solves the biggest portfolio problem (telling someone what you do) in a single visual. No paragraphs, no buzzwords. One look and you get it. The best design is the one that communicates instantly.

---

### 5. Smooth Scroll Physics & Full-Screen Preloader Atmosphere (Tajmirul + Sector 32)
Two features I'm combining here because they work toward the same goal: making the site *feel* different before you even read anything. Tajmirul's smooth scroll with React Lenis (lerp: 0.1, duration: 1.4s) makes his site feel premium the moment you start scrolling. Sector 32's full-screen preloader creates anticipation and drama before a single word appears. Both are about controlling the *vibe* from the first millisecond.

**Why it stands out:** Most people focus on what their site looks like. These focus on what it *feels* like. The physics of scrolling, the drama of a loading sequence... these create emotional responses that static design alone can't achieve. It's like the difference between a photo and a movie.

---

### 6. Colorful Cursor Trail Effect (Toukoum)

As you move your mouse around the Toukoum site, it leaves behind a trail of colorful, fading particles that follow your cursor. It's not the main feature of the site, but it's one of those details that immediately makes you go "oh, that's cool" and start waving your mouse around just to watch it. The colors shift through a gradient as the trail fades out, giving it an almost magical quality.

**Why it stands out:** It's a low-effort, high-impact detail. It doesn't require the visitor to click anything or read anything. Just existing on the page and moving the mouse creates a moment of delight. It signals that the developer cares about craft and small details, which says a lot about how they'd approach real projects. It's also very sharable; people love showing others "look what happens when you move the mouse."

---

## Wireframe Ideas for My Portfolio

Based on everything I've studied, here are the directions I'm thinking about for my own site:

### Concept: "Interactive Terminal / Command-Line Portfolio"
Inspired by Dustin Brett's OS approach but adapted to my style. What if my portfolio looked and felt like a terminal/command-line interface? Visitors could type commands to navigate sections, but there'd also be a GUI fallback for people who don't want to type. It would showcase technical skill while being genuinely fun to use.

### Alternative Concept: "Scroll-Driven Narrative"
A single-page experience with buttery smooth scrolling (like Tajmirul's), dramatic section reveals (like Sector 32's preloader approach), and bouncy micro-interactions (like Huts). Each scroll section tells a chapter of my story: who I am, what I've built, what I'm learning, and how to reach me.

### Alternative Concept: "Computer Desktop Portfolio"
Directly inspired by Dustin Brett's daedalOS. The portfolio loads as an interactive computer desktop environment. Visitors see a wallpaper, desktop icons, and a taskbar. Clicking icons opens "windows" for each section (About Me, Projects, Contact, Resume). Windows can be dragged, resized, minimized, and closed, just like a real OS. The taskbar shows open windows and a clock. This concept turns the portfolio itself into the most impressive project on display. Could start simpler than Dustin's full OS and just nail the window management, icon grid, and taskbar basics.

### Must-Have Elements (Regardless of Concept):

- Dark theme with accent colors (not just black and white, maybe deep blues or forest greens)
- Smooth scroll physics (React Lenis or similar)
- Hover interactions that feel tactile and intentional
- A hero section that communicates who I am in under 3 seconds
- Project showcase with live previews or interactive demos
- Mobile-responsive, has to feel great on phones too
- Something personal and unexpected that makes visitors remember my site

### Wireframe

[View the Figma wireframe here](https://www.figma.com/design/00BYkZi4bMpodtTOfq23pN/Untitled?node-id=0-1&t=4Z2ZI8IGA4UxgKdd-1)

---

## Chosen Concept: Desktop OS Simulation

I've decided to go with the **Computer Desktop Portfolio** concept, directly inspired by Dustin Brett's daedalOS. The portfolio will load as an interactive desktop environment where each section of the portfolio lives inside draggable, resizable windows that mimic a real operating system.

### Why This Concept

- The portfolio itself becomes the most impressive project on display
- It's memorable and shareable, people will want to show others
- It demonstrates real technical skill (window management, state handling, drag/drop)
- It's genuinely fun to interact with
- It sets me apart from every other developer with a standard scrolling portfolio

---

## MVP Requirements (Due 2/18)

Based on the official portfolio requirements, here's what needs to be built, adapted to the desktop OS concept:

### 1. About Me Window
- My name and bio
- Professional photo (if available)
- Opens from a desktop icon labeled "About Me" or similar

### 2. Projects Window
- Carousel or grid display of completed projects
- Screenshots/images of each application
- Clicking a project card opens the live site
- GitHub repo icon/link for each project
- Could be styled like a "File Explorer" window browsing project folders

### 3. Skills Window
- Component displaying known languages and skills
- Use tech logos/icons for visual appeal
- Could be styled like a "System Info" or "Control Panel" window

### 4. Contact Window
- Form with subject and message fields
- Sends email directly to me (will need a backend service like Formspree or EmailJS)
- Could be styled like an "Email Client" window

### 5. Resume
- PDF download button
- Could live in the Contact window, or be its own desktop icon that triggers a download
- Alternatively, open a "PDF Viewer" window that displays the resume

### Desktop Shell Components

These are the OS simulation pieces that tie everything together:

**Taskbar**
- Fixed at the bottom of the screen
- Shows currently open windows
- Clock display
- Maybe a "Start" button (could open a menu listing all available windows)

**Desktop Icons**
- Grid of clickable icons on the "wallpaper"
- Each icon opens its corresponding window
- Icons: About Me, Projects, Skills, Contact, Resume

**Window System**
- Draggable windows (click and drag title bar)
- Resizable windows (drag corners/edges)
- Minimize button (hides window, shows in taskbar)
- Maximize button (fills screen)
- Close button (removes window)
- Windows stack on top of each other (z-index management)
- Clicking a window brings it to front

**Wallpaper**
- Background image or gradient
- Could be customizable as a stretch goal

---

## Build Plan (Slow and Steady)

**Deadline: MVP by 2/18, buffer until 2/19**

Taking it one piece at a time. Each day focuses on one small, completable task.

### Week 1: Foundation
- [ ] Day 1: Set up project structure (HTML, CSS, JS files)
- [ ] Day 2: Build the desktop background and basic layout
- [ ] Day 3: Create the taskbar component (static, no functionality yet)
- [ ] Day 4: Build a single draggable window component
- [ ] Day 5: Add window controls (close, minimize, maximize buttons)
- [ ] Day 6: Implement window stacking (z-index on click)
- [ ] Day 7: Create desktop icon grid layout

### Week 2: Content Windows
- [ ] Day 8: Build About Me window content
- [ ] Day 9: Build Projects window with project cards
- [ ] Day 10: Add project carousel or grid functionality
- [ ] Day 11: Build Skills window with tech icons
- [ ] Day 12: Build Contact window with form
- [ ] Day 13: Connect contact form to email service
- [ ] Day 14: Add Resume download functionality

### Week 3: Polish and Launch
- [ ] Day 15: Taskbar functionality (show open windows, click to focus)
- [ ] Day 16: Window minimize/restore from taskbar
- [ ] Day 17: Mobile responsiveness (simplified view for small screens)
- [ ] Day 18: Testing, bug fixes, final polish
- [ ] Day 19: Buffer day for debugging with classmates

---

## Technical Decisions to Make

- **Vanilla JS vs Framework**: Could build with vanilla JS/CSS for simplicity, or use React for cleaner state management of windows
- **CSS Strategy**: CSS Grid for desktop icons, Flexbox for window internals, CSS variables for theming
- **Drag Library**: Could use native HTML5 drag, or a library like interact.js for smoother drag/resize
- **Contact Form Backend**: Formspree, EmailJS, or Netlify Forms are all good free options
- **Hosting**: GitHub Pages, Netlify, or Vercel

---

## Stretch Goals (After MVP)

- Boot sequence animation (fake loading screen before desktop appears)
- Start menu that lists all windows
- Right-click context menus
- Window snap to edges (like Windows 10/11)
- Multiple wallpaper options / theme switcher
- Sound effects on window open/close
- A working "Terminal" app window
- Easter eggs hidden in the desktop
