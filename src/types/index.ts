export interface Criteria {
  id: string;
  name: string;
  description: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  joinDate: string;
}

export interface CriteriaComparison {
  criteriaId1: string;
  criteriaId2: string;
  value: number;
}

export interface EmployeeScore {
  employeeId: string;
  criteriaId: string;
  score: number;
}

export interface AHPResult {
  employeeId: string;
  employeeName: string;
  finalScore: number;
  rank: number;
  criteriaScores: {
    criteriaId: string;
    criteriaName: string;
    weight: number;
    score: number;
    weightedScore: number;
  }[];
}
