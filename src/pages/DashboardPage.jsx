import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { planService } from '../services/planService';
import { PlanCard } from '../components/plans/PlanCard';
import { Button } from '../components/common/Button';

export const DashboardPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPlans();
  }, [user]);

  const loadPlans = async () => {
    if (!user) return;
    try {
      const userPlans = await planService.getUserPlans(user.uid);
      setPlans(userPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">LearnFlow AI</h1>
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Learning Plans</h2>
            <p className="text-gray-600">Create and manage your personalized learning journeys</p>
          </div>
          <Button onClick={() => navigate('/create-plan')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Plan
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-gray-600 mb-4">You haven't created any learning plans yet.</p>
            <Button onClick={() => navigate('/create-plan')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Plan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onClick={() => navigate(`/plan/${plan.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
