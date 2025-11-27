import React from 'react';
import { COURSES } from '../constants';
import { Icon } from './Icon';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
          DevOps <span className="text-blue-500">Simulation</span> Lab
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Gain hands-on experience with Kubernetes, Docker, and Linux in a safe, AI-powered simulated environment. No installation required.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.map(course => (
          <div key={course.id} className="bg-[#1e293b] rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 overflow-hidden group shadow-lg">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Icon name={course.icon} className="text-blue-400 group-hover:text-blue-300" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{course.title}</h2>
              <p className="text-gray-400 text-sm mb-6 h-10">{course.description}</p>
              
              <div className="space-y-3">
                {course.labs.map(lab => (
                  <Link 
                    key={lab.id} 
                    to={`/lab/${course.id}/${lab.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#0f172a] hover:bg-[#283549] transition-colors border border-gray-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${lab.difficulty === 'Beginner' ? 'bg-green-500' : lab.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <span className="text-gray-300 text-sm font-medium">{lab.title}</span>
                    </div>
                    <Icon name="chevron-right" className="text-gray-600" size={16} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-[#0f172a]/50 p-3 text-center border-t border-gray-800">
               <span className="text-xs text-gray-500 uppercase tracking-wider">{course.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};