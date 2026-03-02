'use client';

import { Building2, GraduationCap, School, Sparkles, LogOut, User as UserIcon, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const navItems = [
    { href: '/company', label: 'Company Portal', icon: Building2, color: 'from-indigo-500 to-purple-500' },
    { href: '/student', label: 'Student Portal', icon: GraduationCap, color: 'from-purple-500 to-pink-500' },
    { href: '/college', label: 'College Cell', icon: School, color: 'from-violet-500 to-indigo-500' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const isAuthPage = pathname.startsWith('/auth');

    if (isAuthPage) return null; // Hide navbar on login/signup pages for a cleaner look

    if (pathname.startsWith('/student')) {
        return null;
    }

    return (
        <nav className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            <span className="gradient-text">Placify</span>
                            <span className="text-slate-500 font-normal text-sm ml-1.5 font-bold uppercase tracking-wider">AI</span>
                        </span>
                    </Link>

                    {/* Nav Tabs */}
                    <div className="hidden md:flex items-center gap-1 rounded-2xl bg-slate-800/50 p-1 border border-slate-700/50">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (pathname === '/' && item.href === '/company');
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300
                                        ${isActive
                                            ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                                        }
                                    `}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Status & Actions */}
                    <div className="flex items-center gap-4">
                        {status === 'loading' ? (
                            <div className="h-8 w-24 bg-slate-800 rounded-lg animate-pulse" />
                        ) : session ? (
                            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                                <div className="hidden sm:block text-right">
                                    <p className="text-xs font-bold text-slate-100 truncate max-w-[100px]">{session.user.name}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter bg-slate-800 px-1.5 py-0.5 rounded-md inline-block">
                                        {session.user.role}
                                    </p>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/login" className="text-sm font-medium text-slate-400 hover:text-slate-200 px-3 py-2">
                                    Login
                                </Link>
                                <Link href="/auth/signup" className="btn-primary text-xs flex items-center gap-2 px-4 py-2">
                                    <UserIcon className="h-3.5 w-3.5" />
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
