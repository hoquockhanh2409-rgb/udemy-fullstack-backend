'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { User } from '@/types';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            🧸 Quản lý & Chia sẻ Đồ Chơi Trẻ Em
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Nền tảng giúp bạn quản lý và chia sẻ đồ chơi với cộng đồng
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="bg-purple-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-900 transition-all shadow-lg hover:shadow-xl"
              >
                Đăng ký ngay
              </Link>
            </div>
          )}
          {user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user.role === 'customer' && (
                <>
                  <Link
                    href="/my-toys"
                    className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                  >
                    Đồ chơi của tôi
                  </Link>
                  <Link
                    href="/browse"
                    className="bg-purple-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-900 transition-all shadow-lg hover:shadow-xl"
                  >
                    Tìm đồ chơi
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                >
                  👑 Vào Admin Dashboard
                </Link>
              )}
              {user.role === 'employee' && (
                <Link
                  href="/employee/dashboard"
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                >
                  👔 Vào Employee Dashboard
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Tính năng nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Quản lý dễ dàng</h3>
              <p className="text-gray-600">
                Thêm, sửa, xóa đồ chơi của bạn một cách đơn giản. Theo dõi tình trạng và thông tin chi tiết.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Chia sẻ cộng đồng</h3>
              <p className="text-gray-600">
                Cho người khác mượn đồ chơi không còn sử dụng. Tạo giá trị và kết nối cộng đồng.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Theo dõi mượn trả</h3>
              <p className="text-gray-600">
                Quản lý yêu cầu mượn, theo dõi ngày trả và trạng thái của từng giao dịch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Cách sử dụng
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start gap-6">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Thêm đồ chơi của bạn</h3>
                <p className="text-gray-600">
                  Vào mục &quot;Đồ chơi của tôi&quot; và thêm thông tin về những đồ chơi bạn muốn chia sẻ.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Tìm kiếm đồ chơi</h3>
                <p className="text-gray-600">
                  Duyệt qua danh sách đồ chơi có sẵn từ người dùng khác và chọn những món bạn thích.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Mượn và quản lý</h3>
                <p className="text-gray-600">
                  Gửi yêu cầu mượn, theo dõi trạng thái và trả đồ chơi đúng hạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Bắt đầu ngay hôm nay!</h2>
            <p className="text-xl mb-8 opacity-90">
              Tham gia cộng đồng chia sẻ đồ chơi và tạo giá trị cho những món đồ của bạn
            </p>
            <Link
              href="/login"
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
