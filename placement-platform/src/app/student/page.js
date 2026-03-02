import { GraduationCap, FileCheck, Target, Lightbulb } from 'lucide-react';
import StudentDashboard from '@/components/student/StudentDashboard';
import { db } from '@/lib/db';

export default async function StudentPortal() {
    // 1. Fetch real stats from the database for the whole platform
    const skillsAnalyzed = await db.studentSkill.count();
    const successStories = await db.placementOffer.count({ where: { status: 'accepted' } });
    const studentsActive = await db.student.count();

    const stats = [
        { label: 'Active Students', value: studentsActive.toLocaleString(), icon: Target, color: 'from-purple-500 to-pink-500' },
        { label: 'Skills Analyzed', value: skillsAnalyzed.toLocaleString(), icon: Lightbulb, color: 'from-pink-500 to-rose-500' },
        { label: 'Success Stories', value: successStories.toLocaleString(), icon: FileCheck, color: 'from-emerald-500 to-teal-500' },
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F5] min-w-[1280px] flex flex-col font-sans text-gray-900">
            {/* HEADER */}
            <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-10 shrink-0 z-20">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-[#2563EB] text-2xl">grid_view</span>
                        </div>
                        <span className="text-[20px] font-bold tracking-tight text-gray-900">Placify</span>
                    </div>
                    <nav className="flex items-center gap-2 h-[64px]">
                        <a href="/student" className="text-[14px] font-medium text-[#2563EB] px-4 h-full flex items-center border-b-2 border-[#2563EB]">Explore</a>
                        <a href="/company" className="text-[14px] font-medium text-[#6B7280] px-4 h-full flex items-center hover:text-[#2563EB] border-b-2 border-transparent">Company</a>
                        <a href="/college" className="text-[14px] font-medium text-[#6B7280] px-4 h-full flex items-center hover:text-[#2563EB] border-b-2 border-transparent">College</a>
                    </nav>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400">search</span>
                        </div>
                        <input
                            className="block w-[400px] pl-[44px] pr-5 py-2.5 bg-[#F3F4F6] border-none rounded-[50px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            placeholder="Explore career paths..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                    <div className="relative">
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">ST</div>
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="flex flex-1 overflow-hidden">
                {/* Main Content with Dashboard Logic */}
                <main className="flex-grow p-[32px] overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-[28px] font-bold text-gray-900">Student AI Portal</h1>
                            <p className="text-[15px] text-gray-500 mt-1">Discover your career roadmap and bridge the skills gap</p>
                        </div>

                        {/* Stats - Live Platform Data */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {stats.map((stat) => (
                                <div key={stat.label} className="bg-white rounded-[16px] p-5 flex items-center gap-4 shadow-sm border border-gray-100">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 text-white`}>
                                        <stat.icon className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-[24px] font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-[13px] text-gray-500">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Interactive Client Dashboard */}
                        <StudentDashboard />
                    </div>
                </main>

                {/* RIGHT SIDEBAR (Quick Actions/Suggestions) */}
                <aside className="w-[300px] shrink-0 mt-[32px] mr-[24px] mb-[32px]">
                    <div className="bg-white rounded-[16px] p-[28px] h-full overflow-y-auto shadow-sm border border-gray-100">
                        <h3 className="text-[15px] font-bold text-gray-900 mb-6">Suggested Next Steps</h3>
                        <div className="space-y-4">
                            <div className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-100 cursor-pointer block transition-colors">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg shrink-0">
                                        <span className="material-symbols-outlined text-xl">book</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[15px] text-gray-900 leading-tight mb-1">Update Resume</h4>
                                        <p className="text-[13px] text-gray-500">Get better matched with companies</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-100 cursor-pointer block transition-colors">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="bg-purple-100 text-purple-600 p-2 rounded-lg shrink-0">
                                        <span className="material-symbols-outlined text-xl">code_blocks</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[15px] text-gray-900 leading-tight mb-1">Skill Assessment</h4>
                                        <p className="text-[13px] text-gray-500">Validate your expertise</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
