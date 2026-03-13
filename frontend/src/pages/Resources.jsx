import React from 'react';
import { FileText, Download, BookOpen, Video, ExternalLink, Megaphone } from 'lucide-react';

export default function Resources() {
  const announcements = [
    {
      id: 1,
      title: 'TCS Ninja Hiring - Webinar Link',
      date: 'March 15, 2026',
      content: 'Join the mandatory webinar for all students applying to TCS Ninja. Link will be active 10 minutes prior.',
      type: 'important'
    },
    {
      id: 2,
      title: 'Resume Review Camp',
      date: 'March 18, 2026',
      content: 'Bring your printed resumes to Seminar Hall B for a 1-on-1 review with industry experts.',
      type: 'general'
    }
  ];

  const materials = [
    {
      category: 'Interview Preparation',
      items: [
        { name: 'Top 100 Array Questions (LeetCode)', type: 'pdf', icon: FileText, size: '2.4 MB' },
        { name: 'System Design Interview Cheatsheet', type: 'pdf', icon: FileText, size: '1.8 MB' },
        { name: 'Mock Interview Recording - SDE Role', type: 'video', icon: Video, size: '145 MB' },
      ]
    },
    {
      category: 'Company Specific Patterns',
      items: [
        { name: 'Amazon Technical Questions 2025', type: 'pdf', icon: FileText, size: '3.1 MB' },
        { name: 'Google Aptitude Round Syllabus', type: 'doc', icon: BookOpen, size: '1.2 MB' },
        { name: 'Birla Soft Previous Year Papers', type: 'link', icon: ExternalLink, size: '-' },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Resource Hub</h1>
        <p className="mt-2 text-sm text-gray-500">Important announcements and preparation materials from the TPO.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Announcements */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-600" /> Announcements
          </h2>
          <div className="space-y-4">
            {announcements.map((item) => (
              <div key={item.id} className={`p-5 rounded-2xl border ${item.type === 'important' ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white shadow-sm'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold ${item.type === 'important' ? 'text-amber-900' : 'text-gray-900'}`}>{item.title}</h3>
                </div>
                <p className={`text-sm mb-3 ${item.type === 'important' ? 'text-amber-800' : 'text-gray-600'}`}>{item.content}</p>
                <div className="text-xs font-semibold text-gray-400">{item.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Materials */}
        <div className="lg:col-span-2 space-y-8">
          {materials.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">{section.category}</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <li key={itemIdx} className="px-6 py-4 flex items-center justify-between hover:bg-emerald-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${item.type === 'pdf' ? 'bg-red-50 text-red-600' : item.type === 'video' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.size !== '-' ? `Size: ${item.size}` : 'External Resource'}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-full hover:bg-white shadow-sm opacity-0 group-hover:opacity-100">
                        {item.type === 'link' ? <ExternalLink className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
