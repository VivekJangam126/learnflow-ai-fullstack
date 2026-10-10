import { Check, Clock, BookOpen, Code, FileText, StickyNote } from 'lucide-react';

export const TaskItem = ({ task, onUpdate, onNote }) => {
  const icons = {
    reading: BookOpen,
    lab: Code,
    video: FileText,
    notes: StickyNote,
    review: FileText
  };

  const Icon = icons[task.type] || FileText;

  const handleStatusToggle = () => {
    const newStatus = task.status === 'done' ? 'not_started' : 'done';
    onUpdate(task.id, { status: newStatus });
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
      task.status === 'done' 
        ? 'bg-success-50 border-success-200' 
        : 'bg-gray-50 border-gray-200 hover:border-primary-300'
    }`}>
      <button
        onClick={handleStatusToggle}
        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
          task.status === 'done'
            ? 'bg-success-500 border-success-500'
            : 'border-gray-300 hover:border-primary-500'
        }`}
      >
        {task.status === 'done' && <Check className="w-4 h-4 text-white" />}
      </button>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-500" />
            <h4 className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              {task.estMinutes}m
            </span>
            <button
              onClick={() => onNote(task)}
              className="p-1 hover:bg-white rounded transition-colors"
              title="Add note"
            >
              <StickyNote className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}

        {task.resources && task.resources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {task.resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:text-primary-700 underline"
              >
                {resource.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
