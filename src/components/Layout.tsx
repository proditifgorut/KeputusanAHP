import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ListChecks,
  GitCompare,
  ClipboardList,
  Trophy,
  Menu,
  X,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'criteria', label: 'Kriteria', icon: ListChecks },
    { id: 'employees', label: 'Karyawan', icon: Users },
    { id: 'comparison', label: 'Perbandingan', icon: GitCompare },
    { id: 'scoring', label: 'Penilaian', icon: ClipboardList },
    { id: 'results', label: 'Hasil & Ranking', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-green-600 rounded-lg transition-colors"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  Sistem Pendukung Keputusan AHP
                </h1>
                <p className="text-sm md:text-base text-green-100">
                  Pengadilan Agama Gorontalo Utara
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside
            className={`${
              isSidebarOpen ? 'block' : 'hidden'
            } lg:block lg:w-64 bg-white rounded-lg shadow-md p-4`}
          >
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      currentPage === item.id
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 bg-white rounded-lg shadow-md p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
