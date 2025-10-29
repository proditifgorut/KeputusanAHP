import React, { useState, useEffect } from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AHP_SCALE, calculateConsistencyRatio, createPairwiseMatrix, normalizeMatrix, calculateWeights } from '../utils/ahpCalculation';

export default function CriteriaComparison() {
  const { criteria, comparisons, updateComparison } = useApp();
  const [consistencyRatio, setConsistencyRatio] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (criteria.length >= 2) {
      const matrix = createPairwiseMatrix(criteria, comparisons);
      const normalized = normalizeMatrix(matrix);
      const weights = calculateWeights(normalized);
      const cr = calculateConsistencyRatio(matrix, weights);
      setConsistencyRatio(cr);
    }
  }, [criteria, comparisons]);

  const handleComparisonChange = (
    criteriaId1: string,
    criteriaId2: string,
    value: number
  ) => {
    updateComparison({
      criteriaId1,
      criteriaId2,
      value,
    });
  };

  const getComparisonValue = (criteriaId1: string, criteriaId2: string): number => {
    const comparison = comparisons.find(
      (c) =>
        (c.criteriaId1 === criteriaId1 && c.criteriaId2 === criteriaId2) ||
        (c.criteriaId1 === criteriaId2 && c.criteriaId2 === criteriaId1)
    );

    if (!comparison) return 1;

    if (comparison.criteriaId1 === criteriaId1) {
      return comparison.value;
    } else {
      return 1 / comparison.value;
    }
  };

  if (criteria.length < 2) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Perbandingan Kriteria
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto text-yellow-600 mb-3" size={48} />
          <p className="text-gray-700">
            Minimal 2 kriteria diperlukan untuk melakukan perbandingan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Perbandingan Berpasangan Kriteria
        </h2>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700"
        >
          <Info size={20} />
          Panduan Skala AHP
        </button>
      </div>

      {showInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Skala Perbandingan AHP</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {Object.entries(AHP_SCALE).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="font-semibold text-blue-600 w-6">{key}:</span>
                <span className="text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {consistencyRatio !== null && (
        <div
          className={`border rounded-lg p-4 mb-6 ${
            consistencyRatio <= 0.1
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">
              Consistency Ratio (CR):
            </span>
            <span
              className={`font-bold ${
                consistencyRatio <= 0.1 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {consistencyRatio.toFixed(4)}
            </span>
            <span className="text-gray-600 text-sm">
              {consistencyRatio <= 0.1
                ? '(Konsisten ✓)'
                : '(Tidak Konsisten - Periksa kembali perbandingan)'}
            </span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-3 text-left font-semibold text-gray-800">
                Kriteria
              </th>
              {criteria.map((c) => (
                <th
                  key={c.id}
                  className="border border-gray-300 bg-gray-100 p-3 text-center font-semibold text-gray-800"
                >
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c1, i) => (
              <tr key={c1.id}>
                <td className="border border-gray-300 bg-gray-50 p-3 font-medium text-gray-800">
                  {c1.name}
                </td>
                {criteria.map((c2, j) => (
                  <td key={c2.id} className="border border-gray-300 p-2">
                    {i === j ? (
                      <div className="text-center font-semibold text-gray-800">1</div>
                    ) : i < j ? (
                      <select
                        value={getComparisonValue(c1.id, c2.id)}
                        onChange={(e) =>
                          handleComparisonChange(
                            c1.id,
                            c2.id,
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-center text-gray-600 text-sm">
                        {(1 / getComparisonValue(c2.id, c1.id)).toFixed(2)}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Petunjuk:</span> Pilih nilai pada kolom
          untuk menentukan seberapa penting kriteria baris dibanding kriteria kolom.
          Nilai di bawah diagonal akan terisi otomatis sebagai kebalikannya.
        </p>
      </div>
    </div>
  );
}
