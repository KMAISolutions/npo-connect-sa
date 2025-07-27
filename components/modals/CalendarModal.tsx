import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Task } from '../../types';

interface CalendarModalProps {
  onClose: () => void;
  onBack: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ onClose, onBack }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', type: 'task' as 'task' | 'grant' });

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('npoTasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Could not load tasks from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('npoTasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Could not save tasks to localStorage", error);
    }
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.dueDate) return;
    setTasks([...tasks, { ...newTask, id: Date.now() }].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    setNewTask({ title: '', dueDate: '', type: 'task' });
  };
  
  const handleDeleteTask = (id: number) => {
      setTasks(tasks.filter(task => task.id !== id));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewTask(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal title="Task & Deadline Calendar" onClose={onClose} onBack={onBack}>
      <div className="max-w-5xl mx-auto">
          <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg shadow-sm">
              <p className="font-bold">Note:</p>
              <p>All data is stored locally in your browser and will be lost if you clear your browser's data.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                  <Card>
                      <h2 className="text-xl font-bold mb-4">Add New Item</h2>
                      <form onSubmit={handleAddTask} className="space-y-4">
                          <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                          <Input type="text" name="title" id="title" value={newTask.title} onChange={handleInputChange} placeholder="e.g., Submit XYZ Grant" required/>
                          </div>
                          <div>
                          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                          <Input type="date" name="dueDate" id="dueDate" value={newTask.dueDate} onChange={handleInputChange} required/>
                          </div>
                          <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                          <select name="type" id="type" value={newTask.type} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm transition">
                              <option value="task">General Task</option>
                              <option value="grant">Grant Deadline</option>
                          </select>
                          </div>
                          <Button type="submit" className="w-full">Add to Calendar</Button>
                      </form>
                  </Card>
              </div>
              
              <div className="md:col-span-2">
                  <Card>
                      <h2 className="text-xl font-bold mb-4">Upcoming Deadlines & Tasks</h2>
                      {tasks.length > 0 ? (
                          <ul className="space-y-3">
                              {tasks.map(task => (
                                  <li key={task.id} className="p-4 bg-white rounded-lg flex items-center justify-between border-l-4 transition hover:shadow-md"
                                      style={{ borderColor: task.type === 'grant' ? '#ef4444' : '#16a34a' }}>
                                      <div>
                                          <p className="font-semibold text-gray-800">{task.title}</p>
                                          <p className="text-sm text-gray-600">
                                              Due: {new Date(task.dueDate).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                          </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${task.type === 'grant' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                              {task.type === 'grant' ? 'Grant' : 'Task'}
                                          </span>
                                          <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-full" aria-label={`Delete task: ${task.title}`}>
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                              </svg>
                                          </button>
                                      </div>
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <p className="text-center text-gray-500 py-8">You have no upcoming tasks or deadlines. Add one to get started!</p>
                      )}
                  </Card>
              </div>
          </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;
