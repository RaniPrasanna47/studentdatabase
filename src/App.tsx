import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Search, 
  LayoutDashboard,
  UserPlus,
  BookPlus,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Student {
  id: number;
  name: string;
  email: string;
  enrollment_date: string;
}

interface Instructor {
  id: number;
  name: string;
  email: string;
  department: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  credits: number;
}

interface Section {
  id: number;
  course_id: number;
  instructor_id: number;
  course_title: string;
  instructor_name: string;
  semester: string;
  year: number;
  room: string;
}

interface Enrollment {
  id: number;
  student_name: string;
  course_title: string;
  semester: string;
  year: number;
  enrollment_date: string;
  mark: number | null;
  grade: string | null;
}

interface Stats {
  studentCount: number;
  courseCount: number;
  instructorCount: number;
  enrollmentCount: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'courses' | 'instructors' | 'sections' | 'enrollments' | 'marks'>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<Stats>({ studentCount: 0, courseCount: 0, instructorCount: 0, enrollmentCount: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
  const [newInstructor, setNewInstructor] = useState({ name: '', email: '', department: '' });
  const [newCourse, setNewCourse] = useState({ title: '', description: '', credits: 3 });
  const [newSection, setNewSection] = useState({ course_id: '', instructor_id: '', semester: 'Fall', year: 2024, room: '' });
  const [newEnrollment, setNewEnrollment] = useState({ student_id: '', section_id: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, iRes, cRes, secRes, eRes, stRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/instructors'),
        fetch('/api/courses'),
        fetch('/api/sections'),
        fetch('/api/enrollments'),
        fetch('/api/stats')
      ]);
      
      if (!sRes.ok || !iRes.ok || !cRes.ok || !secRes.ok || !eRes.ok || !stRes.ok) {
        throw new Error("One or more API requests failed");
      }
      
      const [studentsData, instructorsData, coursesData, sectionsData, enrollmentsData, statsData] = await Promise.all([
        sRes.json(),
        iRes.json(),
        cRes.json(),
        secRes.json(),
        eRes.json(),
        stRes.json()
      ]);

      setStudents(studentsData);
      setInstructors(instructorsData);
      setCourses(coursesData);
      setSections(sectionsData);
      setEnrollments(enrollmentsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      if (res.ok) {
        showMessage('success', 'Student added successfully!');
        setNewStudent({ name: '', email: '' });
        fetchData();
      } else {
        const data = await res.json();
        showMessage('error', data.error || 'Failed to add student');
      }
    } catch (err) {
      showMessage('error', 'Network error');
    }
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInstructor)
      });
      if (res.ok) {
        showMessage('success', 'Instructor added successfully!');
        setNewInstructor({ name: '', email: '', department: '' });
        fetchData();
      } else {
        const data = await res.json();
        showMessage('error', data.error || 'Failed to add instructor');
      }
    } catch (err) {
      showMessage('error', 'Network error');
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        showMessage('success', 'Course created successfully!');
        setNewCourse({ title: '', description: '', credits: 3 });
        fetchData();
      } else {
        showMessage('error', 'Failed to create course');
      }
    } catch (err) {
      showMessage('error', 'Network error');
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection)
      });
      if (res.ok) {
        showMessage('success', 'Section created successfully!');
        setNewSection({ course_id: '', instructor_id: '', semester: 'Fall', year: 2024, room: '' });
        fetchData();
      } else {
        showMessage('error', 'Failed to create section');
      }
    } catch (err) {
      showMessage('error', 'Network error');
    }
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEnrollment)
      });
      if (res.ok) {
        showMessage('success', 'Enrollment successful!');
        setNewEnrollment({ student_id: '', section_id: '' });
        fetchData();
      } else {
        const data = await res.json();
        showMessage('error', data.error || 'Enrollment failed');
      }
    } catch (err) {
      showMessage('error', 'Network error');
    }
  };

  const handleUpdateMark = async (enrollmentId: number, mark: number) => {
    let grade = 'F';
    if (mark >= 90) grade = 'A';
    else if (mark >= 80) grade = 'B';
    else if (mark >= 70) grade = 'C';
    else if (mark >= 60) grade = 'D';

    try {
      const res = await fetch(`/api/enrollments/${enrollmentId}/mark`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mark, grade })
      });
      if (res.ok) {
        showMessage('success', 'Mark updated!');
        fetchData();
      }
    } catch (err) {
      showMessage('error', 'Failed to update mark');
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen z-20"
      >
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight">EduManage</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="students" icon={Users} label="Students" />
          <NavItem id="instructors" icon={Users} label="Instructors" />
          <NavItem id="courses" icon={BookOpen} label="Courses" />
          <NavItem id="sections" icon={LayoutDashboard} label="Sections" />
          <NavItem id="enrollments" icon={CheckCircle2} label="Enrollments" />
          <NavItem id="marks" icon={CheckCircle2} label="Marks" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`bg-slate-50 rounded-xl p-4 ${!isSidebarOpen && 'hidden'}`}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</p>
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              System Online
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 rounded-lg text-sm transition-all outline-none w-64"
              />
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
              AD
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span className="font-medium">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Students', value: stats.studentCount, icon: Users, color: 'bg-blue-500' },
                  { label: 'Instructors', value: stats.instructorCount, icon: Users, color: 'bg-purple-500' },
                  { label: 'Active Courses', value: stats.courseCount, icon: BookOpen, color: 'bg-indigo-500' },
                  { label: 'Total Enrollments', value: stats.enrollmentCount, icon: CheckCircle2, color: 'bg-emerald-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-6">
                    <div className={`${stat.color} p-4 rounded-2xl text-white`}>
                      <stat.icon size={28} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                      <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Plus size={20} className="text-indigo-600" />
                    Quick Enrollment
                  </h3>
                  <form onSubmit={handleEnroll} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
                      <select 
                        required
                        value={newEnrollment.student_id}
                        onChange={e => setNewEnrollment({...newEnrollment, student_id: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      >
                        <option value="">Choose a student...</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Select Section</label>
                      <select 
                        required
                        value={newEnrollment.section_id}
                        onChange={e => setNewEnrollment({...newEnrollment, section_id: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      >
                        <option value="">Choose a section...</option>
                        {sections.map(s => <option key={s.id} value={s.id}>{s.course_title} - {s.instructor_name} ({s.semester} {s.year})</option>)}
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                      Enroll Student
                    </button>
                  </form>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-6">Recent Enrollments</h3>
                  <div className="space-y-4">
                    {enrollments.slice(0, 5).map((e, i) => (
                      <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                            <UserPlus size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{e.student_name}</p>
                            <p className="text-xs text-slate-500">Enrolled in {e.course_title}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                      </div>
                    ))}
                    {enrollments.length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        <p>No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-all">
                          <td className="px-6 py-4 font-bold">{s.name}</td>
                          <td className="px-6 py-4 text-slate-600">{s.email}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">
                            {new Date(s.enrollment_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <UserPlus size={20} className="text-indigo-600" />
                    Add New Student
                  </h3>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={newStudent.name}
                        onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                        placeholder="e.g. John Doe"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={newStudent.email}
                        onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                      Register Student
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'instructors' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {instructors.map(i => (
                        <tr key={i.id} className="hover:bg-slate-50 transition-all">
                          <td className="px-6 py-4 font-bold">{i.name}</td>
                          <td className="px-6 py-4 text-slate-600">{i.email}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{i.department}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <UserPlus size={20} className="text-indigo-600" />
                    Add New Instructor
                  </h3>
                  <form onSubmit={handleAddInstructor} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={newInstructor.name}
                        onChange={e => setNewInstructor({...newInstructor, name: e.target.value})}
                        placeholder="e.g. Dr. Sarah Connor"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={newInstructor.email}
                        onChange={e => setNewInstructor({...newInstructor, email: e.target.value})}
                        placeholder="sarah@edu.com"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                      <input 
                        required
                        type="text" 
                        value={newInstructor.department}
                        onChange={e => setNewInstructor({...newInstructor, department: e.target.value})}
                        placeholder="e.g. Computer Science"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                      Register Instructor
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sections' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Instructor</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sections.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-all">
                          <td className="px-6 py-4 font-bold">{s.course_title}</td>
                          <td className="px-6 py-4 text-slate-600">{s.instructor_name}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{s.semester} {s.year}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{s.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Plus size={20} className="text-indigo-600" />
                    Create New Section
                  </h3>
                  <form onSubmit={handleAddSection} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Select Course</label>
                      <select 
                        required
                        value={newSection.course_id}
                        onChange={e => setNewSection({...newSection, course_id: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      >
                        <option value="">Choose a course...</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Select Instructor</label>
                      <select 
                        required
                        value={newSection.instructor_id}
                        onChange={e => setNewSection({...newSection, instructor_id: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      >
                        <option value="">Choose an instructor...</option>
                        {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                        <select 
                          value={newSection.semester}
                          onChange={e => setNewSection({...newSection, semester: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        >
                          <option value="Fall">Fall</option>
                          <option value="Spring">Spring</option>
                          <option value="Summer">Summer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                        <input 
                          type="number" 
                          value={newSection.year}
                          onChange={e => setNewSection({...newSection, year: parseInt(e.target.value)})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
                      <input 
                        type="text" 
                        value={newSection.room}
                        onChange={e => setNewSection({...newSection, room: e.target.value})}
                        placeholder="e.g. Room 101"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                      Create Section
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'marks' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mark</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrollments.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-all">
                      <td className="px-6 py-4 font-bold">{e.student_name}</td>
                      <td className="px-6 py-4 text-slate-600">{e.course_title}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{e.semester} {e.year}</td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          defaultValue={e.mark || 0}
                          onBlur={(el) => handleUpdateMark(e.id, parseInt(el.target.value))}
                          className="w-16 p-1 border border-slate-200 rounded text-center"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          e.grade === 'A' ? 'bg-emerald-100 text-emerald-700' : 
                          e.grade === 'F' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {e.grade || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-indigo-600 text-xs font-bold">Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <BookOpen size={24} />
                      </div>
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                        {c.credits} Credits
                      </span>
                    </div>
                    <h4 className="text-lg font-bold mb-2">{c.title}</h4>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{c.description}</p>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-200 rounded-full" />
                        <span className="text-xs font-medium text-slate-600">Active Course</span>
                      </div>
                      <button className="text-indigo-600 text-xs font-bold hover:underline">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <BookPlus size={20} className="text-indigo-600" />
                    Create New Course
                  </h3>
                  <form onSubmit={handleAddCourse} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                      <input 
                        required
                        type="text" 
                        value={newCourse.title}
                        onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                        placeholder="e.g. Advanced Mathematics"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea 
                        required
                        value={newCourse.description}
                        onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                        placeholder="Brief overview of the course..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-24 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Credits</label>
                      <input 
                        required
                        type="number" 
                        min="1"
                        max="10"
                        value={newCourse.credits}
                        onChange={e => setNewCourse({...newCourse, credits: parseInt(e.target.value)})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                      Create Course
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'enrollments' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Enrollment Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrollments.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-all">
                      <td className="px-6 py-4 font-bold">{e.student_name}</td>
                      <td className="px-6 py-4 text-slate-600">{e.course_title}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{e.semester} {e.year}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {new Date(e.enrollment_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                  {enrollments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                        No enrollments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
