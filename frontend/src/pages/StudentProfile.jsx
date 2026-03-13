import { useState, useEffect } from 'react';
import { Save, User, BookOpen, Code, Link as LinkIcon, Plane, FileText, CheckCircle2 } from 'lucide-react';
import { profileService } from '../services/api';

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    cgpa10th: '',
    cgpa12th: '',
    cgpa: '',
    activeBacklogs: '0',
    skills: '',
    bptrcShowcase: '',
    linkedinUrl: '',
    githubUrl: '',
    leetcodeUrl: '',
    passportNumber: '',
    passportExpiry: '',
    visaStatus: 'None'
  });
  const [profileName, setProfileName] = useState('Student');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('name') || 'Student'; // Might need to save name in Auth
    if (id) {
      setUserId(id);
      profileService.getProfile(id).then(data => {
        if (data) {
          setFormData({
            ...data,
            skills: data.skills ? data.skills.join(', ') : '',
            cgpa10th: data.cgpa10th || '',
            cgpa12th: data.cgpa12th || '',
            cgpa: data.cgpa || '',
            activeBacklogs: data.activeBacklogs || '0',
            bptrcShowcase: data.bptrcShowcase || '',
            linkedinUrl: data.linkedinUrl || '',
            githubUrl: data.githubUrl || '',
            leetcodeUrl: data.leetcodeUrl || '',
            passportNumber: data.passportNumber || '',
            passportExpiry: data.passportExpiry || '',
            visaStatus: data.visaStatus || 'None'
          });
        }
      }).catch(err => console.log('No profile exists yet or failed to load.'));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }
      
      const payload = {
        ...formData,
        user: { id: parseInt(userId) },
      };
      
      if (typeof formData.skills === 'string') {
          payload.skills = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      }
      
      // Parse numbers if applicable
      if (payload.cgpa) payload.cgpa = parseFloat(payload.cgpa);
      if (payload.cgpa10th) payload.cgpa10th = parseFloat(payload.cgpa10th);
      if (payload.cgpa12th) payload.cgpa12th = parseFloat(payload.cgpa12th);
      if (payload.activeBacklogs) payload.activeBacklogs = parseInt(payload.activeBacklogs);

      const saved = await profileService.saveProfile(payload);
      setFormData({
         ...saved,
         skills: saved.skills ? saved.skills.join(', ') : ''
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    }
  };

  const renderInput = (label, name, type = 'text', placeholder = '') => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder={placeholder}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto pb-12">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            My Profile
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
              >
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow-sm sm:rounded-2xl border border-gray-100">
        <div className="px-4 py-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-sm">
                RJ
              </div>
              <span className="absolute bottom-0 right-0 block rounded-full bg-white flex items-center justify-center">
                 <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-white" />
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{profileName}</h3>
              <p className="text-sm font-medium text-emerald-600 mt-1">
                Student
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Section: Academic Record */}
          <section>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
              <BookOpen className="w-5 h-5 text-emerald-600" /> Academic Record
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderInput('10th Percentage / CGPA', 'cgpa10th')}
              {renderInput('12th / Diploma Percentage', 'cgpa12th')}
              {renderInput('Current Semester CGPA', 'cgpa')}
              {renderInput('Active Backlogs', 'activeBacklogs', 'number')}
            </div>
          </section>

          {/* Section: Technical Arsenal */}
          <section>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
              <Code className="w-5 h-5 text-emerald-600" /> Technical Arsenal
            </h4>
            <div className="space-y-4">
              {renderInput('Skills (Comma separated)', 'skills', 'text', 'Java, React, Python...')}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BPTRC Showcase (Projects / Research)</label>
                <textarea
                  name="bptrcShowcase"
                  rows={3}
                  value={formData.bptrcShowcase}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </section>

          {/* Section: Verifiable Links */}
          <section>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
              <LinkIcon className="w-5 h-5 text-emerald-600" /> Verifiable Links
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderInput('LinkedIn Profile', 'linkedinUrl', 'url', 'https://linkedin.com/in/...')}
              {renderInput('GitHub Profile', 'githubUrl', 'url', 'https://github.com/...')}
              {renderInput('LeetCode Profile', 'leetcodeUrl', 'url', 'https://leetcode.com/...')}
              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  disabled={!isEditing}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" /> Upload Resume PDF
                </button>
              </div>
            </div>
          </section>

          {/* Section: BIRD Exchange */}
          <section>
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
              <Plane className="w-5 h-5 text-emerald-600" /> BIRD Exchange Portal Details
            </h4>
            <p className="text-sm text-gray-500 mb-4">Optional: Essential for students aspiring for international internships (France, Thailand, etc).</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {renderInput('Passport Number', 'passportNumber')}
              {renderInput('Expiry Date', 'passportExpiry', 'date')}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visa Status</label>
                <select
                  name="visaStatus"
                  value={formData.visaStatus}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="None">None</option>
                  <option value="Applied">Applied</option>
                  <option value="Valid">Valid Schengen/Thai Visa</option>
                </select>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
