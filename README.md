# StudyFlow — Student Task Manager

A responsive student task manager built for the Student Task Manager assignment.

## Quick start (works by opening HTML)

The root `index.html` is a self-contained version with its CSS and JavaScript embedded. Extract the ZIP, then double-click `index.html` to open it in Chrome, Edge, Firefox, or a mobile HTML preview app. It does not need npm or an internet connection.

Features:
- View tasks and completion status
- Add tasks with empty-input validation
- Mark tasks completed / pending
- Delete tasks with confirmation
- Empty-state message
- Total, completed, remaining and progress statistics
- All / Pending / Completed filters
- Clear completed tasks with confirmation
- Saves tasks in browser localStorage where available
- Responsive desktop and mobile layout

## React source version

The `src/` folder also contains the React component source (`App.jsx`, `TaskItem.jsx`, `Card.jsx`, styles and entry point). To run this version as a Vite project, install Node.js, open a terminal in this folder and run:

```bash
npm install
npm run dev
```

Then open the localhost URL printed by Vite. Do not open the React/Vite version by double-clicking its `index.html`; use the self-contained root `index.html` for that workflow.
