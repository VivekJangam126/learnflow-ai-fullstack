import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
import { TaskItem } from './TaskItem';

export const WeekSection = ({ week, tasks, onTaskUpdate, onTaskNote }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="card mb-4 animate-fade-in">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              Week {week.weekNumber}: {week.theme}
            </h3>
            <span className="text-sm text-gray-500">
              {week.targetHours}h target
            </span>
          </div>
          <ProgressBar progress={progress} showLabel={false} />
        </div>
        <div className="ml-4">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-2 animate-slide-up">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks for this week</p>
          ) : (
            tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onTaskUpdate}
                onNote={onTaskNote}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
