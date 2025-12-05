import { useState, useEffect } from 'react';
import { FiPlus, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { useDashboardStore } from '../../store/dashboardStore';
import { netlifyDB } from '../../services/netlifyDB';
import type { TasksConfig, Task } from '../../types';

interface TasksWidgetProps {
  widgetId: string;
  config: TasksConfig;
}

const TasksWidget = ({ widgetId, config }: TasksWidgetProps) => {
  const { userId, updateWidgetConfig } = useDashboardStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const loadedTasks = await netlifyDB.getTasks(widgetId);
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetId]);

  const handleAddTask = async () => {
    const text = newTaskText.trim();
    if (!text) return;

    const newTask: Task = {
      id: `task_${uuidv4()}`,
      widgetInstanceId: widgetId,
      userId,
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      order: tasks.length,
    };

    // Optimistic UI update
    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setIsAdding(false);

    try {
      await netlifyDB.saveTask(newTask);
    } catch (error) {
      console.error('Failed to save task:', error);
      // Revert on error
      setTasks(tasks);
    }
  };

  const handleToggleTask = async (task: Task) => {
    const updatedTask: Task = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined,
    };

    // Optimistic UI update
    setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));

    try {
      await netlifyDB.saveTask(updatedTask);
    } catch (error) {
      console.error('Failed to update task:', error);
      // Revert on error
      setTasks(tasks);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // Optimistic UI update
    const filteredTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(filteredTasks);

    try {
      await netlifyDB.deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
      // Revert on error
      setTasks(tasks);
    }
  };

  const toggleShowCompleted = () => {
    updateWidgetConfig(widgetId, {
      showCompleted: !config.showCompleted,
    });
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-sm text-slate-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Tasks
          </h3>
          <p className="text-xs text-slate-500">
            {activeTasks.length} active
            {completedTasks.length > 0 && `, ${completedTasks.length} done`}
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="text-slate-400 hover:text-primary-500"
          title="Add task"
        >
          <FiPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Add Task Input */}
      {isAdding && (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask();
                if (e.key === 'Escape') {
                  setIsAdding(false);
                  setNewTaskText('');
                }
              }}
              className="input-field text-sm flex-1"
              placeholder="What needs to be done?"
              autoFocus
            />
            <button onClick={handleAddTask} className="btn-primary text-sm">
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewTaskText('');
              }}
              className="btn-ghost text-sm"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && !isAdding && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-500">
            <FiCheck className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm mb-3">No tasks yet</p>
            <button onClick={() => setIsAdding(true)} className="btn-primary text-sm">
              <FiPlus className="inline mr-2" />
              Add Your First Task
            </button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length > 0 && (
        <div className="flex-1 overflow-auto scrollbar-thin">
          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div className="space-y-2 mb-4">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="mt-0.5 w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 hover:border-primary-500 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 dark:text-white break-words">
                      {task.text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 flex-shrink-0"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <button
                onClick={toggleShowCompleted}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2"
              >
                {config.showCompleted ? '▼' : '▶'} Completed ({completedTasks.length})
              </button>

              {config.showCompleted && (
                <div className="space-y-2">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors opacity-60"
                    >
                      <button
                        onClick={() => handleToggleTask(task)}
                        className="mt-0.5 w-5 h-5 rounded border-2 border-primary-500 bg-primary-500 flex items-center justify-center flex-shrink-0"
                      >
                        <FiCheck className="w-3 h-3 text-white" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-through break-words">
                          {task.text}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 flex-shrink-0"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TasksWidget;
