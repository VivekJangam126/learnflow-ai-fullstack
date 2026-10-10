import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { format } from 'date-fns';

export const PlanCard = ({ plan, onClick }) => {
  const progress = plan.stats?.totalTasksCount > 0 
    ? (plan.stats.completedTasksCount / plan.stats.totalTasksCount) * 100 
    : 0;

  return (
    <Card hover onClick={onClick} className="animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.title}</h3>
          <p className="text-sm text-gray-500">{plan.description || 'No description'}</p>
        </div>
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          {plan.totalWeeks} weeks
        </span>
      </div>

      <ProgressBar progress={progress} className="mb-4" />

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{plan.createdAt ? format(plan.createdAt.toDate(), 'MMM d, yyyy') : 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{plan.settings?.hoursPerWeek || 0}h/week</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          <span>{plan.stats?.completedTasksCount || 0}/{plan.stats?.totalTasksCount || 0} tasks</span>
        </div>
      </div>
    </Card>
  );
};
