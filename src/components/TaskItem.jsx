import { Check, Trash2, Clock3 } from 'lucide-react';
import Card from './Card.jsx';

export default function TaskItem({ task, onToggle, onDelete }) {
  return <Card className={`task-card ${task.completed ? 'is-complete' : ''}`}>
    <button className={`task-check ${task.completed ? 'checked' : ''}`} onClick={() => onToggle(task.id)} aria-label={task.completed ? `Mark ${task.title} as pending` : `Complete ${task.title}`} title={task.completed ? 'Mark as pending' : 'Mark as completed'}>
      {task.completed && <Check size={16} strokeWidth={3} />}
    </button>
    <div className="task-copy"><p className="task-title">{task.title}</p><div className="task-meta"><Clock3 size={13} /><span>{task.completed ? 'Completed' : 'In progress'}</span><span className={`status-pill ${task.completed ? 'done' : 'pending'}`}>{task.completed ? 'Done' : 'Pending'}</span></div></div>
    <button className="icon-btn delete-btn" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`} title="Delete task"><Trash2 size={17} /></button>
  </Card>;
}
