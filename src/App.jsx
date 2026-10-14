import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCheck, CircleHelp, ClipboardList, ListTodo, Plus, Sparkles, Target, Trash2 } from 'lucide-react';
import Card from './components/Card.jsx';
import TaskItem from './components/TaskItem.jsx';

const STORAGE_KEY = 'studyflow-tasks-v1';
const starterTasks = [
  { id: 'demo-1', title: 'Review lecture notes', completed: true, createdAt: Date.now() - 300000 },
  { id: 'demo-2', title: 'Finish mathematics exercises', completed: false, createdAt: Date.now() - 200000 },
  { id: 'demo-3', title: 'Read chapter 4 of biology', completed: false, createdAt: Date.now() - 100000 },
];

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return { tasks: starterTasks, failed: false };
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(t => t && typeof t.id === 'string' && typeof t.title === 'string' && typeof t.completed === 'boolean')) throw new Error('Invalid saved task data');
    return { tasks: parsed, failed: false };
  } catch (error) {
    console.error('Could not load saved tasks:', error);
    return { tasks: [], failed: true };
  }
}

export default function App() {
  const [initial] = useState(loadTasks);
  const [tasks, setTasks] = useState(initial.tasks);
  const [storageWarning, setStorageWarning] = useState(initial.failed);
  const [taskInput, setTaskInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [filter, setFilter] = useState('All');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); setStorageWarning(false); }
    catch (error) { console.error('Could not save tasks:', error); setStorageWarning(true); }
  }, [tasks]);

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const visibleTasks = useMemo(() => tasks.filter(task => filter === 'All' || (filter === 'Completed' ? task.completed : !task.completed)), [tasks, filter]);

  function addTask(event) {
    event.preventDefault();
    const title = taskInput.trim();
    if (!title) { setInputError('Please enter a task before adding it.'); return; }
    setTasks(current => [{ id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, title, completed: false, createdAt: Date.now() }, ...current]);
    setTaskInput(''); setInputError(''); setNotice('Task added successfully.');
  }
  function toggleTask(id) { setTasks(current => current.map(task => task.id === id ? { ...task, completed: !task.completed } : task)); setNotice('Task status updated.'); }
  function deleteTask(id) {
    const task = tasks.find(item => item.id === id);
    if (!task) return;
    if (!window.confirm(`Delete “${task.title}”? This action cannot be undone.`)) return;
    setTasks(current => current.filter(item => item.id !== id)); setNotice('Task deleted.');
  }
  function clearCompleted() {
    const count = tasks.filter(task => task.completed).length;
    if (!count) return;
    if (window.confirm(`Delete all ${count} completed task${count === 1 ? '' : 's'}? This action cannot be undone.`)) { setTasks(current => current.filter(task => !task.completed)); setNotice('Completed tasks cleared.'); }
  }

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#top" aria-label="StudyFlow home"><span className="brand-mark"><BookOpen size={21} /></span><span>studyflow<span className="brand-dot">.</span></span></a><div className="topbar-right"><span className="topbar-label"><span className="online-dot" /> Your personal study space</span><div className="avatar">S</div></div></header>
    <main id="top" className="main-content">
      <section className="welcome-row"><div><div className="eyebrow"><Sparkles size={14} /> YOUR SPACE TO GET THINGS DONE</div><h1>Make room for <span>what matters.</span></h1><p className="welcome-subtitle">One task at a time. You’ve got this.</p></div><div className="date-chip"><span className="date-icon"><Target size={17} /></span><div><strong>Keep your focus</strong><small>Progress, not perfection</small></div></div></section>

      <section className="stats-grid" aria-label="Task statistics">
        <Card className="stat-card stat-total"><div className="stat-top"><span className="stat-icon"><ClipboardList size={19} /></span><span className="stat-caption">ALL TASKS</span></div><div className="stat-number">{tasks.length}</div><div className="stat-bottom"><span>Total on your list</span><span className="stat-symbol">↗</span></div></Card>
        <Card className="stat-card stat-completed"><div className="stat-top"><span className="stat-icon"><CheckCheck size={19} /></span><span className="stat-caption">COMPLETED</span></div><div className="stat-number">{completedCount}</div><div className="stat-bottom"><span>Look at you go!</span><span className="stat-symbol">✓</span></div></Card>
        <Card className="stat-card stat-pending"><div className="stat-top"><span className="stat-icon"><ListTodo size={19} /></span><span className="stat-caption">REMAINING</span></div><div className="stat-number">{pendingCount}</div><div className="stat-bottom"><span>Ready when you are</span><span className="stat-symbol">○</span></div></Card>
      </section>

      <section className="workspace-grid">
        <div className="task-column"><div className="section-heading"><div><h2>Your task list</h2><p>Small steps lead to big things.</p></div><span className="count-badge">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span></div>
          <Card className="composer-card"><div className="composer-heading"><span className="composer-icon"><Plus size={18} /></span><div><h3>Add a new task</h3><p>What would you like to get done?</p></div></div><form onSubmit={addTask} noValidate><label className="sr-only" htmlFor="task-title">Task title</label><div className={`input-wrap ${inputError ? 'input-invalid' : ''}`}><input id="task-title" value={taskInput} onChange={e => { setTaskInput(e.target.value); if (inputError) setInputError(''); }} placeholder="e.g. Prepare for tomorrow’s class..." maxLength={180} aria-describedby={inputError ? 'task-error' : 'task-hint'} /><button className="primary-btn" type="submit"><Plus size={17} /> Add task</button></div>{inputError ? <p id="task-error" className="field-error" role="alert">{inputError}</p> : <p id="task-hint" className="field-hint">A clear task makes a good starting point. <span>{taskInput.length}/180</span></p>}</form></Card>

          <div className="list-toolbar"><div className="filter-tabs" role="group" aria-label="Filter tasks">{['All', 'Pending', 'Completed'].map(option => <button key={option} className={`filter-tab ${filter === option ? 'active' : ''}`} onClick={() => setFilter(option)} aria-pressed={filter === option}>{option}<span>{option === 'All' ? tasks.length : option === 'Pending' ? pendingCount : completedCount}</span></button>)}</div>{completedCount > 0 && <button className="text-action" onClick={clearCompleted}><Trash2 size={14} /> Clear completed</button>}</div>

          {storageWarning && <div className="storage-warning" role="status"><CircleHelp size={17} /><span>Your browser couldn’t access saved tasks. Changes may not persist after refreshing.</span></div>}
          {notice && <p className="sr-only" role="status" aria-live="polite">{notice}</p>}
          <div className="task-list" aria-live="polite">{visibleTasks.length ? visibleTasks.map(task => <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />) : <Card className="empty-state"><div className="empty-illustration"><ClipboardList size={27} /></div><h3>{tasks.length === 0 ? 'No tasks available' : `No ${filter.toLowerCase()} tasks`}</h3><p>{tasks.length === 0 ? 'Add your first task above and make today count.' : 'Try another filter or add a new task to your list.'}</p>{filter !== 'All' && <button className="secondary-btn" onClick={() => setFilter('All')}>View all tasks</button>}</Card>}</div>
        </div>

        <aside className="side-column"><Card className="progress-card"><div className="progress-heading"><span className="progress-icon"><Target size={19} /></span><span className="progress-label">YOUR PROGRESS</span></div><div className="progress-value-row"><strong>{progress}<small>%</small></strong><span>{completedCount} of {tasks.length} done</span></div><div className="progress-track" role="progressbar" aria-label="Task completion progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><div className="progress-fill" style={{ width: `${progress}%` }} /></div><p className="progress-message">{tasks.length === 0 ? 'Your journey starts with one task.' : progress === 100 ? 'Amazing! Everything is checked off.' : progress >= 50 ? 'You’re over halfway there. Keep going!' : 'Every completed task is a little win.'}</p><div className="progress-divider" /><div className="mini-stat"><span><span className="mini-dot done-dot" /> Completed</span><strong>{completedCount}</strong></div><div className="mini-stat"><span><span className="mini-dot pending-dot" /> Still to do</span><strong>{pendingCount}</strong></div></Card>
          <Card className="tip-card"><div className="tip-icon"><Sparkles size={19} /></div><span className="tip-label">A LITTLE REMINDER</span><h3>Progress over perfection.</h3><p>You don’t have to do everything today. Just choose one thing and begin.</p><div className="tip-decoration"><span /><span /><span /><span /><span /></div></Card>
          <div className="side-note"><span className="note-icon"><BookOpen size={15} /></span><p><strong>Study tip</strong><br />Break a big assignment into smaller, manageable tasks.</p></div>
        </aside>
      </section>
      <footer className="footer"><span>Made for your next big thing <span className="footer-heart">♥</span></span><span>STUDYFLOW · STUDENT TASK MANAGER</span></footer>
    </main>
  </div>;
}
