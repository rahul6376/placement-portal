import { ArrowRight, CheckCircle2, Building2, GraduationCap, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect them
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="bg-[#fbfbfd] min-h-screen text-[#1d1d1f] overflow-hidden selection:bg-blue-500/20">
      
      {/* Hero Section */}
      <div className="relative isolate pt-24 pb-32 sm:pt-40 sm:pb-48 lg:pt-48 lg:pb-56 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism text-sm font-medium text-gray-600 mb-8 transition-all hover:bg-gray-50">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Welcome to the official placement portal of BKBIET</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
            <span className="block text-gray-900 text-3xl sm:text-4xl lg:text-5xl mb-4 font-semibold tracking-tight">BK Birla Institute of Engineering & Technology</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500">
              Redefining Placements.
            </span>
          </h1>
          
          <p className="mt-8 text-xl leading-relaxed text-gray-500 max-w-3xl mx-auto font-light">
            The ultimate gateway connecting top-tier campus talent with industry-leading companies. Discover tailored opportunities, seamlessly manage applications, and accelerate your career.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link 
              to="/register?role=student" 
              className="w-full sm:w-auto rounded-full bg-blue-600 text-white px-8 py-4 text-base font-medium shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:scale-105 hover:bg-blue-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transition-all flex items-center justify-center gap-2"
            >
              I am a Student <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/register?role=company" 
              className="w-full sm:w-auto rounded-full glass-morphism text-gray-700 px-8 py-4 text-base font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              I am a Company <Building2 className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="mt-8">
             <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
               Already have an account? Sign in <span aria-hidden="true">&rarr;</span>
             </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbfbfd] via-white to-[#fbfbfd] -z-10" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-24">
            <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Faster Placements</h2>
            <p className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Everything you need to succeed.
            </p>
            <p className="text-xl text-gray-500 font-light">
              Built with precision to provide the most seamless and profound experience for both students and recruiters.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[
              { name: 'Intelligent Matching', description: 'Smart algorithms that align your unique skills with the perfect company requirements.', icon: ShieldCheck },
              { name: 'Streamlined Tracker', description: 'Monitor your application pipeline from applied to hired, all in one visual timeline.', icon: CheckCircle2 },
              { name: 'Student Profiles', description: 'Showcase your academic records, technical arsenal, and portfolio in a premium format.', icon: GraduationCap },
              { name: 'Company Portal', description: 'Recruiters can post drives, filter candidates aggressively, and hire the top campus talent.', icon: Building2 },
            ].map((feature, idx) => (
              <div 
                key={feature.name} 
                className="glass-morphism p-8 sm:p-10 rounded-3xl hover:shadow-lg transition-all group cursor-default"
              >
                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                  <feature.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">{feature.name}</h3>
                <p className="text-gray-500 leading-relaxed font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
