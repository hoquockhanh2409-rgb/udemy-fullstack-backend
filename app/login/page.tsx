'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showDemo, setShowDemo] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const user = login(formData.email, formData.password);

        if (user) {
            // Redirect based on role
            switch (user.role) {
                case 'admin':
                    router.push('/admin/dashboard');
                    break;
                case 'employee':
                    router.push('/employee/dashboard');
                    break;
                case 'customer':
                    router.push('/');
                    break;
            }
        } else {
            setError('Email hoặc mật khẩu không đúng!');
        }
    };

    const handleDemoLogin = (email: string, password: string) => {
        setFormData({ email, password });
        const user = login(email, password);
        if (user) {
            switch (user.role) {
                case 'admin':
                    router.push('/admin/dashboard');
                    break;
                case 'employee':
                    router.push('/employee/dashboard');
                    break;
                case 'customer':
                    router.push('/');
                    break;
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🧸</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
                    <p className="text-gray-600">Quản lý Đồ Chơi Trẻ Em</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Chưa có tài khoản?{' '}
                        <Link href="/register" className="text-purple-600 font-semibold hover:underline">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>

                {/* Demo Accounts */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={() => setShowDemo(!showDemo)}
                        className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium"
                    >
                        {showDemo ? '▼' : '▶'} Tài khoản demo để test
                    </button>

                    {showDemo && (
                        <div className="mt-4 space-y-3">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-red-800">👑 Admin</p>
                                        <p className="text-sm text-red-600">admin@toymanagement.com</p>
                                        <p className="text-xs text-red-500">Pass: admin123</p>
                                    </div>
                                    <button
                                        onClick={() => handleDemoLogin('admin@toymanagement.com', 'admin123')}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                                    >
                                        Đăng nhập
                                    </button>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-blue-800">👔 Employee</p>
                                        <p className="text-sm text-blue-600">employee@toymanagement.com</p>
                                        <p className="text-xs text-blue-500">Pass: employee123</p>
                                    </div>
                                    <button
                                        onClick={() => handleDemoLogin('employee@toymanagement.com', 'employee123')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                                    >
                                        Đăng nhập
                                    </button>
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-green-800">👤 Customer</p>
                                        <p className="text-sm text-green-600">user1@example.com</p>
                                        <p className="text-xs text-green-500">Pass: user123</p>
                                    </div>
                                    <button
                                        onClick={() => handleDemoLogin('user1@example.com', 'user123')}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
                                    >
                                        Đăng nhập
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
