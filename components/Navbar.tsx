'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout, isAuthenticated } from '@/lib/auth';
import { User } from '@/types';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        // Load user on mount
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }

        // Listen for storage changes (when user logs in/out in another tab or same page)
        const handleStorageChange = () => {
            const updatedUser = getCurrentUser();
            setUser(updatedUser);
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also check periodically for same-tab updates
        const interval = setInterval(() => {
            const updatedUser = getCurrentUser();
            if (updatedUser?.id !== user?.id) {
                setUser(updatedUser);
            }
        }, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [user?.id]);

    const handleLogout = () => {
        logout();
        setUser(null);
        router.push('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🧸</span>
                        <span className="font-bold text-xl">Quản lý Đồ Chơi</span>
                    </Link>

                    <div className="flex items-center space-x-1 md:space-x-4">
                        {!user ? (
                            <>
                                <Link
                                    href="/"
                                    className="px-3 md:px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm md:text-base"
                                >
                                    Trang chủ
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-3 md:px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm md:text-base"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-3 md:px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm md:text-base font-semibold"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        ) : (
                            <>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="px-3 md:px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm md:text-base"
                                    >
                                        👑 Admin
                                    </Link>
                                )}
                                {user.role === 'employee' && (
                                    <Link
                                        href="/employee/dashboard"
                                        className="px-3 md:px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm md:text-base"
                                    >
                                        👔 Employee
                                    </Link>
                                )}
                                {user.role === 'customer' && (
                                    <>
                                        <Link
                                            href="/"
                                            className="px-3 md:px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm md:text-base"
                                        >
                                            Trang chủ
                                        </Link>
                                        <Link
                                            href="/my-toys"
                                            className="px-3 md:px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm md:text-base"
                                        >
                                            Đồ chơi của tôi
                                        </Link>
                                        <Link
                                            href="/browse"
                                            className="px-3 md:px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm md:text-base"
                                        >
                                            Tìm đồ chơi
                                        </Link>
                                        <Link
                                            href="/borrows"
                                            className="px-3 md:px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm md:text-base"
                                        >
                                            Quản lý mượn
                                        </Link>
                                    </>
                                )}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm md:text-base"
                                    >
                                        <span>{user.name}</span>
                                        <span>▼</span>
                                    </button>
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                                            <div className="px-4 py-2 text-sm text-gray-600 border-b">
                                                {user.email}
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
