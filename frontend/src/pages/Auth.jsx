import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Building2, GraduationCap } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { userService } from '../services/api';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'student';
  const isLogin = location.pathname === '/login';

  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        localStorage.setItem('token', session.access_token);
        fetchAndStoreCurrentUser().finally(() => {
          navigate('/dashboard', { replace: true });
        });
      } else {
        setCheckingSession(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.setItem('token', session.access_token);
        fetchAndStoreCurrentUser().finally(() => {
          navigate('/dashboard', { replace: true });
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchAndStoreCurrentUser = async () => {
    try {
      const me = await userService.getCurrentUser();
      localStorage.setItem('userId', me.id);
      localStorage.setItem('userName', me.name);
      localStorage.setItem('userRole', me.role);
    } catch (e) {
      // swallow for now; UI will still have token
      console.error('Failed to fetch current user', e);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Checking your session…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-600/20">
            {role === 'company' ? (
              <Building2 className="h-10 w-10 text-white" />
            ) : (
              <GraduationCap className="h-10 w-10 text-white" />
            )}
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          As a{' '}
          <span className="font-semibold text-emerald-600">
            {role === 'company' ? 'Company Partner' : 'Student'}
          </span>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-8 shadow sm:rounded-2xl sm:px-8 border border-gray-100">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            view={isLogin ? 'sign_in' : 'sign_up'}
          />
        </div>
      </div>
    </div>
  );
}
