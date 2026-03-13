import React, { useState, useEffect } from 'react';
import { Clock, Code, Users, CheckCircle, XCircle, ChevronRight, Briefcase } from 'lucide-react';
import { applicationService } from '../services/api';

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const data = await applicationService.getStudentApplications(userId);
          const formattedApps = data.map(app => formatApplication(app));
          setApplications(formattedApps);
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, []);

  const formatApplication = (apiApp) => {
    // Determine step statuses based on the backend enum: APPLIED, APTITUDE_TEST, TECHNICAL_INTERVIEW, HR_ROUND, ACCEPTED, REJECTED
    const s = apiApp.status;
    const isRejected = s === 'REJECTED';
    const isAccepted = s === 'ACCEPTED';

    const buildStep = (name, icon, stepStage, currentStage) => {
      // Logic: if rejected at this stage, mark error. if past this stage, mark completed. if at this stage, mark current. else upcoming.
      const stages = ['APPLIED', 'APTITUDE_TEST', 'TECHNICAL_INTERVIEW', 'HR_ROUND', 'RESULT'];
      const stepIndex = stages.indexOf(stepStage);
      
      let mappedCurrent = s;
      if (s === 'ACCEPTED' || s === 'REJECTED') {
          mappedCurrent = 'RESULT'; 
          // If we had a "rejected At" field we could make the specific round error, but we'll put error on Result for now
      }
      const currentIndex = stages.indexOf(mappedCurrent);

      let status = 'upcoming';
      if (stepIndex < currentIndex) status = 'completed';
      else if (stepIndex === currentIndex) {
         if (isRejected) status = 'error';
         else if (isAccepted) status = 'completed';
         else status = 'current';
      }

      return { 
        name, 
        icon, 
        status, 
        date: stepIndex === 0 ? new Date(apiApp.applicationDate).toLocaleDateString() : (status === 'completed' || status === 'error' ? 'Done' : 'TBD') 
      };
    };

    return {
      id: apiApp.id,
      company: apiApp.job?.company?.name || 'Company',
      role: apiApp.job?.title || 'Role',
      appliedOn: apiApp.applicationDate,
      status: apiApp.status,
      steps: [
        buildStep('Applied', Briefcase, 'APPLIED'),
        buildStep('Aptitude Test', Clock, 'APTITUDE_TEST'),
        buildStep('Technical Interview', Code, 'TECHNICAL_INTERVIEW'),
        buildStep('HR Round', Users, 'HR_ROUND'),
        buildStep('Result', CheckCircle, 'RESULT'),
      ]
    };
  };

  const getStepStyles = (status) => {
    switch (status) {
      case 'completed':
        return { bg: 'bg-emerald-600', text: 'text-white', line: 'bg-emerald-600' };
      case 'current':
        return { bg: 'bg-blue-600 ring-4 ring-blue-100', text: 'text-white', line: 'bg-gray-200' };
      case 'error':
        return { bg: 'bg-red-500', text: 'text-white', line: 'bg-gray-200' };
      case 'upcoming':
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-400', line: 'bg-gray-200' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Application Pipeline</h1>
        <p className="mt-2 text-sm text-gray-500">Track the status and timeline of your ongoing job applications.</p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
             <h3 className="mt-2 text-sm font-semibold text-gray-900">No applications yet</h3>
             <p className="mt-1 text-sm text-gray-500">Apply to jobs on the Live Drives board to see them tracked here.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl font-bold text-gray-700">
                  {app.company.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{app.role}</h3>
                  <p className="text-sm text-gray-500">{app.company} • Applied {new Date(app.appliedOn).toLocaleDateString()}</p>
                </div>
              </div>
              
              {app.status === 'REJECTED' && (
                 <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
                   <XCircle className="w-3.5 h-3.5" /> No longer under consideration
                 </span>
              )}
            </div>

            {/* Pipeline Visual */}
            <div className="relative">
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-100 -z-10 rounded-full" aria-hidden="true" />
              
              <div className="flex justify-between w-full">
                {app.steps.map((step, idx) => {
                  const styles = getStepStyles(step.status);
                  const Icon = step.icon;
                  const isLast = idx === app.steps.length - 1;
                  
                  return (
                    <div key={step.name} className="flex flex-col items-center relative z-10 w-24">
                      {/* Connecting Line (drawn to the left of the circle except for the first item) */}
                      {idx > 0 && (
                        <div className={`absolute top-5 right-1/2 w-full h-0.5 ${getStepStyles(app.steps[idx - 1].status).line === 'bg-emerald-600' && step.status !== 'upcoming' ? 'bg-emerald-600' : 'bg-gray-200'} -z-10`} />
                      )}

                      <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${styles.bg} ${styles.text}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="mt-3 text-center">
                        <p className={`text-xs font-semibold ${step.status === 'current' ? 'text-blue-600' : step.status === 'error' ? 'text-red-600' : 'text-gray-900'}`}>
                          {step.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}
