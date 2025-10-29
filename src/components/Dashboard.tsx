import React from 'react';
import { Users, ListChecks, TrendingUp, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function Dashboard() {
  const { criteria, employees, ahpResults } = useApp();

  const stats = [
    {
      label: 'Total Kriteria',
      value: criteria.length,
      icon: ListChecks,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Karyawan',
      value: employees.length,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Sudah Dinilai',
      value: ahpResults.length,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      label: 'Karyawan Terbaik',
      value: ahpResults.length > 0 ? '1' : '0',
      icon: Award,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Tentang Sistem
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Sistem Pendukung Keputusan dengan metode Analytical Hierarchy Process
            (AHP) untuk menentukan karyawan terbaik di Pengadilan Agama Gorontalo
            Utara.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Metode AHP untuk perhitungan objektif</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Perbandingan berpasangan antar kriteria</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Penilaian komprehensif untuk setiap karyawan</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Hasil ranking otomatis dan transparan</span>
            </li>
          </ul>
        </div>

        {ahpResults.length > 0 && (
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="text-yellow-600" size={24} />
              Karyawan Terbaik
            </h3>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-2xl font-bold text-gray-800 mb-1">
                {ahpResults[0].employeeName}
              </p>
              <p className="text-gray-600 mb-3">
                Skor: {(ahpResults[0].finalScore * 100).toFixed(2)}
              </p>
              <div className="space-y-2">
                {ahpResults[0].criteriaScores.slice(0, 3).map((cs) => (
                  <div key={cs.criteriaId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{cs.criteriaName}</span>
                    <span className="font-semibold text-gray-800">
                      {(cs.score * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {ahpResults.length === 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <Award className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-600">
                Belum ada hasil perhitungan.
                <br />
                Silakan isi data dan lakukan penilaian terlebih dahulu.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
