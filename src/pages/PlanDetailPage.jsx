import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { planService } from '../services/planService';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { WeekSection } from '../components/plans/WeekSection';
import { AIAssistant } from '../components/ai/AIAssistant';
import { Modal } from '../components/common/Modal';

export const PlanDetailPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [tasksByWeek, setTasksByWeek] = useState({});
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteModal, setNoteModal] = useState({ isOpen: false, task: null, content: '' });

  useEffect(() => {
    loadPlanData();
  }, [planId]);

  const loadPlanData = async () => {
    try {
      const [planData, weeksData, tasksData] = await Promise.all([
        planService.getPlan(planId),
        planService.getWeeks(planId),
        planService.getAllPlanTasks(planId)
      ]);

      setPlan(planData);
      setWeeks(weeksData);
      setAllTasks(tasksData);

      // Group tasks by week
      const grouped = {};
      tasksData.forEach(task => {
        if (!grouped[task.weekId]) {
          grouped[task.weekId] = [];
        }
        grouped[task.weekId].push(task);
      });
      setTasksByWeek(grouped);
    } catch (error) {
      console.error('Error loading plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await planService.updateTaskStatus(taskId, updates.status);
      await loadPlanData(); // Reload to update stats
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskNote = async (task) => {
    try {
      const existingNote = await planService.getNote(task.id);
      setNoteModal({
        isOpen: true,
        task,
        content: existingNote?.content || ''
      });
    } catch (error) {
      console.error('Error loading note:', error);
    }
  };

  const handleSaveNote = async () => {
    try {
      await planService.saveNote(noteModal.task.id, planId, noteModal.content);
      setNoteModal({ isOpen: false, task: null, content: '' });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Plan not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const progress = plan.stats?.totalTasksCount > 0
    ? (plan.stats.completedTasksCount / plan.stats.totalTasksCount) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{plan.title}</h1>
            <p className="text-sm text-gray-600">{plan.description}</p>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Overall Progress</h2>
              <p className="text-sm text-gray-600">
                {plan.stats?.completedTasksCount || 0} of {plan.stats?.totalTasksCount || 0} tasks completed
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{plan.totalWeeks} weeks</span>
            </div>
          </div>
          <ProgressBar progress={progress} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weeks List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Breakdown</h2>
            {weeks.map(week => (
              <WeekSection
                key={week.id}
                week={week}
                tasks={tasksByWeek[week.id] || []}
                onTaskUpdate={handleTaskUpdate}
                onTaskNote={handleTaskNote}
              />
            ))}
          </div>

          {/* AI Assistant */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <AIAssistant plan={plan} tasks={allTasks} />
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      <Modal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal({ isOpen: false, task: null, content: '' })}
        title={`Notes: ${noteModal.task?.title || ''}`}
        size="lg"
      >
        <textarea
          value={noteModal.content}
          onChange={(e) => setNoteModal({ ...noteModal, content: e.target.value })}
          placeholder="Add your notes, PoC, or learnings here..."
          rows={12}
          className="input-field resize-none mb-4"
        />
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setNoteModal({ isOpen: false, task: null, content: '' })}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button onClick={handleSaveNote} className="flex-1">
            Save Note
          </Button>
        </div>
      </Modal>
    </div>
  );
};
