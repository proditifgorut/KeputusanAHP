import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Criteria,
  Employee,
  CriteriaComparison,
  EmployeeScore,
  AHPResult,
} from '../types';

interface AppContextType {
  criteria: Criteria[];
  employees: Employee[];
  comparisons: CriteriaComparison[];
  employeeScores: EmployeeScore[];
  ahpResults: AHPResult[];
  addCriteria: (criteria: Omit<Criteria, 'id'>) => void;
  updateCriteria: (id: string, criteria: Partial<Criteria>) => void;
  deleteCriteria: (id: string) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  updateComparison: (comparison: CriteriaComparison) => void;
  updateEmployeeScore: (score: EmployeeScore) => void;
  calculateResults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [comparisons, setComparisons] = useState<CriteriaComparison[]>([]);
  const [employeeScores, setEmployeeScores] = useState<EmployeeScore[]>([]);
  const [ahpResults, setAhpResults] = useState<AHPResult[]>([]);

  useEffect(() => {
    const savedCriteria = localStorage.getItem('criteria');
    const savedEmployees = localStorage.getItem('employees');
    const savedComparisons = localStorage.getItem('comparisons');
    const savedScores = localStorage.getItem('employeeScores');

    if (savedCriteria) setCriteria(JSON.parse(savedCriteria));
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedComparisons) setComparisons(JSON.parse(savedComparisons));
    if (savedScores) setEmployeeScores(JSON.parse(savedScores));
  }, []);

  useEffect(() => {
    localStorage.setItem('criteria', JSON.stringify(criteria));
  }, [criteria]);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('comparisons', JSON.stringify(comparisons));
  }, [comparisons]);

  useEffect(() => {
    localStorage.setItem('employeeScores', JSON.stringify(employeeScores));
  }, [employeeScores]);

  const addCriteria = (newCriteria: Omit<Criteria, 'id'>) => {
    const criteria: Criteria = {
      ...newCriteria,
      id: Date.now().toString(),
    };
    setCriteria((prev) => [...prev, criteria]);
  };

  const updateCriteria = (id: string, updates: Partial<Criteria>) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCriteria = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
    setComparisons((prev) =>
      prev.filter((comp) => comp.criteriaId1 !== id && comp.criteriaId2 !== id)
    );
    setEmployeeScores((prev) => prev.filter((score) => score.criteriaId !== id));
  };

  const addEmployee = (newEmployee: Omit<Employee, 'id'>) => {
    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
    };
    setEmployees((prev) => [...prev, employee]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setEmployeeScores((prev) => prev.filter((score) => score.employeeId !== id));
  };

  const updateComparison = (comparison: CriteriaComparison) => {
    setComparisons((prev) => {
      const existing = prev.findIndex(
        (comp) =>
          (comp.criteriaId1 === comparison.criteriaId1 &&
            comp.criteriaId2 === comparison.criteriaId2) ||
          (comp.criteriaId1 === comparison.criteriaId2 &&
            comp.criteriaId2 === comparison.criteriaId1)
      );

      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = comparison;
        return updated;
      }

      return [...prev, comparison];
    });
  };

  const updateEmployeeScore = (score: EmployeeScore) => {
    setEmployeeScores((prev) => {
      const existing = prev.findIndex(
        (s) => s.employeeId === score.employeeId && s.criteriaId === score.criteriaId
      );

      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = score;
        return updated;
      }

      return [...prev, score];
    });
  };

  const calculateResults = () => {
    if (criteria.length === 0 || employees.length === 0) {
      setAhpResults([]);
      return;
    }

    const { calculateAHPResults } = require('../utils/ahpCalculation');
    const results = calculateAHPResults(
      criteria,
      employees,
      comparisons,
      employeeScores
    );
    setAhpResults(results);
  };

  return (
    <AppContext.Provider
      value={{
        criteria,
        employees,
        comparisons,
        employeeScores,
        ahpResults,
        addCriteria,
        updateCriteria,
        deleteCriteria,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        updateComparison,
        updateEmployeeScore,
        calculateResults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
