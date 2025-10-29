import React, { useState } from 'react';
import { AlertCircle, Save, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function EmployeeScoring() {
  const { criteria, employees, employeeScores, updateEmployeeScore } = useApp();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [saved, setSaved] = useState(false);

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setSaved(false);

    const currentScores: { [key: string]: number } = {};
    criteria.forEach((c) => {
      const existing = employeeScores.find(
        (es) => es.employeeId === employeeId && es.criteriaId === c.id
      );
      currentScores[c.id] = existing?.score || 0;
    });
    setScores(currentScores);
  };

  const handleScoreChange = (criteriaId: string, score: number) => {
    setScores((prev) => ({ ...prev, [criteriaId]: score }));
    setSaved(false);
  };

  const handleSave = () => {
    if (!selectedEmployee) return;

    criteria.forEach((c) => {
      updateEmployeeScore({
        employeeId: selectedEmployee,
        criteriaId: c.id,
        score: scores[c.id] || 0,
      });
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (criteria.length === 0 || employees.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Penilaian Karyawan
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

  const selectedEmp = employees.find((e) => e.id === selectedEmployee);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Penilaian Karyawan
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Karyawan
        </label>
        <select
          value={selectedEmployee}
          onChange={(e) => handleEmployeeChange(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">-- Pilih Karyawan --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} - {emp.position}
            </option>
          ))}
        </select>
      </div>

      {selectedEmployee && selectedEmp && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {selectedEmp.name}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Jabatan: {selectedEmp.position}</p>
              <p>Divisi: {selectedEmp.department}</p>
            </div>
          </div>

          <div className="space-y-6">
            {criteria.map((criterion) => (
              <div key={criterion.id}>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {criterion.name}
                  </label>
                  <p className="text-xs text-gray-600">{criterion.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores[criterion.id] || 0}
                    onChange={(e) =>
                      handleScoreChange(criterion.id, parseInt(e.target.value))
                    }
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="w-20 text-right">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scores[criterion.id] || 0}
                      onChange={(e) =>
                        handleScoreChange(
                          criterion.id,
                          Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {saved ? (
                <>
                  <Check size={20} />
                  Tersimpan!
                </>
              ) : (
                <>
                  <Save size={20} />
                  Simpan Penilaian
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
