import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Employee } from '../types';

export default function EmployeeManager() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    joinDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateEmployee(editingId, formData);
      setEditingId(null);
    } else {
      addEmployee(formData);
      setIsAdding(false);
    }
    setFormData({ name: '', position: '', department: '', joinDate: '' });
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      joinDate: employee.joinDate,
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', position: '', department: '', joinDate: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Karyawan</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Tambah Karyawan
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nama karyawan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jabatan *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Jabatan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Divisi/Bagian *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Divisi/Bagian"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Bergabung *
              </label>
              <input
                type="date"
                required
                value={formData.joinDate}
                onChange={(e) =>
                  setFormData({ ...formData, joinDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={18} />
              Simpan
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X size={18} />
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-full">
                <User className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.position}</p>
              </div>
            </div>
            <div className="space-y-1 mb-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">Divisi:</span> {employee.department}
              </p>
              <p>
                <span className="font-medium">Bergabung:</span>{' '}
                {new Date(employee.joinDate).toLocaleDateString('id-ID')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(employee)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Edit2 size={16} />
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Yakin ingin menghapus karyawan ini?')) {
                    deleteEmployee(employee.id);
                  }
                }}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
              >
                <Trash2 size={16} />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {employees.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            Belum ada karyawan yang ditambahkan
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Tambah Karyawan Pertama
          </button>
        </div>
      )}
    </div>
  );
}
