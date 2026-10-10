import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { aiService } from '../services/aiService';
import { planService } from '../services/planService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';

export const CreatePlanPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    syllabus: '',
    weeks: 16,
    hoursPerWeek: 10,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    intensity: 'medium',
    handsOnPreference: 60
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const result = await aiService.generatePlan(formData);
      setGeneratedPlan(result.plan);
      setStep(3);
    } catch (error) {
      alert('Error generating plan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    setLoading(true);
    try {
      // Calculate total tasks and minutes
      let totalTasks = 0;
      let totalMinutes = 0;
      generatedPlan.weeks.forEach(week => {
        totalTasks += week.tasks.length;
        week.tasks.forEach(task => {
          totalMinutes += task.estMinutes;
        });
      });

      // Create plan
      const planId = await planService.createPlan(user.uid, {
        title: formData.title,
        description: generatedPlan.description || '',
        totalWeeks: generatedPlan.totalWeeks,
        settings: {
          hoursPerWeek: formData.hoursPerWeek,
          availableDays: formData.availableDays,
          intensity: formData.intensity
        },
        stats: {
          completedTasksCount: 0,
          totalTasksCount: totalTasks,
          totalMinutesPlanned: totalMinutes,
          totalMinutesCompleted: 0,
          estimatedCompletionDate: null
        }
      });

      // Create weeks and tasks
      for (const week of generatedPlan.weeks) {
        const weekRefs = await planService.createWeeks(planId, [{
          weekNumber: week.weekNumber,
          theme: week.theme,
          targetHours: week.targetHours
        }]);
        
        const weekId = weekRefs[0].id;
        await planService.createTasks(planId, weekId, week.tasks);
      }

      navigate(`/plan/${planId}`);
    } catch (error) {
      alert('Error saving plan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Create Learning Plan</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-24 h-1 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Syllabus */}
        {step === 1 && (
          <Card className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Step 1: Paste Your Syllabus</h2>
            <Input
              label="Plan Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., 16-Week Bug Bounty Roadmap"
              required
              className="mb-4"
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Syllabus <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.syllabus}
              onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
              placeholder="Paste your course syllabus or learning topics here..."
              rows={12}
              className="input-field resize-none"
              required
            />
            <Button 
              onClick={() => setStep(2)} 
              disabled={!formData.title || !formData.syllabus}
              className="mt-4 w-full"
            >
              Next: Set Schedule
            </Button>
          </Card>
        )}

        {/* Step 2: Settings */}
        {step === 2 && (
          <Card className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Step 2: Configure Your Schedule</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Input
                label="Number of Weeks"
                type="number"
                value={formData.weeks}
                onChange={(e) => setFormData({ ...formData, weeks: parseInt(e.target.value) })}
                min="1"
                max="52"
              />
              <Input
                label="Hours per Week"
                type="number"
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) })}
                min="1"
                max="40"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      formData.availableDays.includes(day)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Intensity Level
              </label>
              <div className="flex gap-2">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFormData({ ...formData, intensity: level })}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                      formData.intensity === level
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hands-on vs Reading: {formData.handsOnPreference}% hands-on
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.handsOnPreference}
                onChange={(e) => setFormData({ ...formData, handsOnPreference: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleGeneratePlan} loading={loading} className="flex-1">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Plan with AI
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Review */}
        {step === 3 && generatedPlan && (
          <div className="space-y-4 animate-fade-in">
            <Card>
              <h2 className="text-2xl font-bold mb-2">{generatedPlan.title}</h2>
              <p className="text-gray-600 mb-4">{generatedPlan.description}</p>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{generatedPlan.totalWeeks} weeks</span>
                <span>•</span>
                <span>{generatedPlan.weeks.reduce((sum, w) => sum + w.tasks.length, 0)} tasks</span>
              </div>
            </Card>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {generatedPlan.weeks.map(week => (
                <Card key={week.weekNumber}>
                  <h3 className="font-bold text-lg mb-2">
                    Week {week.weekNumber}: {week.theme}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{week.targetHours}h target</p>
                  <ul className="space-y-1">
                    {week.tasks.map((task, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        • {task.title} ({task.estMinutes}m)
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSavePlan} loading={loading} className="flex-1">
                Save & Start Learning
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
