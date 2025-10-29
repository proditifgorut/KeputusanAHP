import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Criteria } from '../types';

export default function CriteriaManager() {
  const { criteria, addCriteria, updateCriteria, deleteCriteria } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCriteria(editingId, formData);
      setEditingId(null);
    } else {
      addCriteria(formData);
      setIsAdding(false);
    }
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (criterion: Criteria) => {
    setEditingId(criterion.id);
    setFormData({
      name: criterion.name,
      description: criterion.description,
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Kriteria</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Tambah Kriteria
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kriteria *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Contoh: Kedisiplinan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Deskripsi kriteria penilaian"
              />
            </div>
            <div className="flex gap-3">
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
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {criteria.map((criterion) => (
          <div
            key={criterion.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-800 mb-2">{criterion.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{criterion.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(criterion)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Edit2 size={16} />
                Edit
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm('Yakin ingin menghapus kriteria ini?')
                  ) {
                    deleteCriteria(criterion.id);
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

      {criteria.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Belum ada kriteria yang ditambahkan</p>
          <button
            onClick={() => setIsAdding(true)}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Tambah Kriteria Pertama
          </button>
        </div>
      )}
    </div>
  );
}
