import React, { useEffect } from 'react';
import { Trophy, Medal, Award, AlertCircle, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function Results() {
  const { criteria, employees, comparisons, employeeScores, ahpResults, calculateResults } = useApp();

  useEffect(() => {
    if (criteria.length > 0 && employees.length > 0) {
      calculateResults();
    }
  }, [criteria, employees, comparisons, employeeScores, calculateResults]);

  if (criteria.length === 0 || employees.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Hasil & Ranking
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto text-yellow-600 mb-3" size={48} />
          <p className="text-gray-700">
            {criteria.length === 0
              ? 'Silakan tambahkan kriteria terlebih dahulu.'
              : 'Silakan tambahkan karyawan terlebih dahulu.'}
          </p>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={32} />;
      case 2:
        return <Medal className="text-gray-400" size={28} />;
      case 3:
        return <Award className="text-orange-600" size={28} />;
      default:
        return <TrendingUp className="text-gray-400" size={24} />;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Hasil Perhitungan & Ranking
        </h2>
        <button
          onClick={calculateResults}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Hitung Ulang
        </button>
      </div>

      <div className="space-y-4">
        {ahpResults.map((result) => (
          <div
            key={result.employeeId}
            className={`border rounded-lg p-6 ${getRankBg(result.rank)}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">{getRankIcon(result.rank)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {result.rank}. {result.employeeName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {employees.find((e) => e.id === result.employeeId)?.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Skor Akhir</p>
                    <p className="text-3xl font-bold text-green-600">
                      {(result.finalScore * 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.criteriaScores.map((cs) => (
                    <div
                      key={cs.criteriaId}
                      className="bg-white bg-opacity-60 rounded-lg p-3"
                    >
                      <p className="text-xs text-gray-600 mb-1">{cs.criteriaName}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-lg font-semibold text-gray-800">
                          {(cs.score * 100).toFixed(0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          × {(cs.weight * 100).toFixed(1)}% = {(cs.weightedScore * 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-green-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${cs.score * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ahpResults.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">
            Belum ada hasil. Pastikan semua karyawan sudah dinilai.
          </p>
        </div>
      )}
    </div>
  );
}
