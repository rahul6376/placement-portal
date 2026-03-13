import { useState, useEffect } from 'react';
import { MapPin, DollarSign, Clock, Search, Briefcase, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { jobService, profileService, applicationService } from '../services/api';

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [studentProfile, setStudentProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
       setUserId(id);
       profileService.getProfile(id).then(data => {
         setStudentProfile(data);
       }).catch(err => console.log('Could not fetch student profile.'));
    }

    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const data = await jobService.getAllJobs(searchQuery);
        setJobs(data);
      } catch (error) {
        console.error("Failed to load jobs", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Add a small debounce for typing
    const timerId = setTimeout(() => {
        fetchJobs();
    }, 300);
    
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const evaluateEligibility = (job) => {
    const reasons = [];
    if (!studentProfile) return { isEligible: false, reasons: ['Please complete your student profile first.'] };

    if (job.minCgpa && (studentProfile.cgpa || 0) < job.minCgpa) {
      reasons.push(`Requires ${job.minCgpa} CGPA (You have ${studentProfile.cgpa || 0})`);
    }
    if (job.maxBacklogs !== undefined && job.maxBacklogs !== null && (studentProfile.activeBacklogs || 0) > job.maxBacklogs) {
      reasons.push(`Max ${job.maxBacklogs} backlogs allowed (You have ${studentProfile.activeBacklogs || 0})`);
    }
    // Simplistic branch check if allowedBranches exists and is an array
    if (job.allowedBranches && job.allowedBranches.length > 0 && studentProfile.branch) {
      const branchesStr = job.allowedBranches.join(',').toLowerCase();
      if (!branchesStr.includes(studentProfile.branch.toLowerCase())) {
        reasons.push(`Branch not eligible`);
      }
    }
    
    return {
      isEligible: reasons.length === 0,
      reasons
    };
  };

  const handleApply = async (jobId) => {
    if (!userId || !studentProfile) {
      alert("Please ensure you are logged in and have completed your profile.");
      return;
    }
    
    setApplyingJobId(jobId);
    try {
      await applicationService.applyForJob({
        job: { id: jobId },
        student: { id: parseInt(userId) }, // Assumes User entity ties to Student
        status: 'APPLIED',
        applicationDate: new Date().toISOString().split('T')[0]
      });
      alert('Successfully applied!');
      // TODO: Filter out the job from the list, or mark it as applied
    } catch (err) {
      alert(err.message || 'Failed to submit application.');
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Live Drives</h1>
          <p className="mt-2 text-sm text-gray-500">Discover and apply to open placement opportunities.</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full sm:w-80 rounded-full border-0 py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
            placeholder="Search roles, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of jobs */}
      {isLoading ? (
        <div className="flex justify-center py-12">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
           <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
           <h3 className="mt-2 text-sm font-semibold text-gray-900">No drives found</h3>
           <p className="mt-1 text-sm text-gray-500">We couldn't find any opportunities matching your criteria at this moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => {
            const eligibility = evaluateEligibility(job);

            return (
              <div
                key={job.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-emerald-500"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{job.title}</h3>
                      <p className="text-sm font-medium text-emerald-600">{job.company?.name || 'Unknown Company'}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="truncate">{job.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 shrink-0 text-gray-400" />
                      <span>{job.salary || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                      <span>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling Base'}</span>
                    </div>
                    
                    {/* Eligibility Display */}
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                       <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Criteria</h4>
                       <div className="grid grid-cols-2 gap-2 text-xs">
                         <div className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3 text-gray-400" />
                            <span>Min CGPA: {job.minCgpa || 'N/A'}</span>
                         </div>
                         <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 text-gray-400" />
                            <span>Backlogs: {job.maxBacklogs !== null && job.maxBacklogs !== undefined ? job.maxBacklogs : 'Any'}</span>
                         </div>
                       </div>
                       {job.bondDetails && (
                         <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block">
                           Bond: {job.bondDetails}
                         </div>
                       )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {eligibility.isEligible ? (
                    <button 
                      onClick={() => handleApply(job.id)}
                      disabled={applyingJobId === job.id}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                        applyingJobId === job.id ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}>
                      {applyingJobId === job.id ? (
                        <>Processing...</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /> Apply Now</>
                      )}
                    </button>
                  ) : (
                    <div className="relative group/tooltip">
                      <button 
                        disabled 
                        className="w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed"
                      >
                        Not Eligible
                      </button>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg z-10 transition-opacity">
                        <p className="font-semibold mb-1">Ineligible due to:</p>
                        <ul className="list-disc pl-3">
                          {eligibility.reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
