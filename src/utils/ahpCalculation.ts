import { Criteria, CriteriaComparison, EmployeeScore, Employee, AHPResult } from '../types';

export const AHP_SCALE = {
  1: 'Sama penting',
  2: 'Sama hingga sedikit lebih penting',
  3: 'Sedikit lebih penting',
  4: 'Sedikit hingga jelas lebih penting',
  5: 'Jelas lebih penting',
  6: 'Jelas hingga sangat lebih penting',
  7: 'Sangat lebih penting',
  8: 'Sangat hingga mutlak lebih penting',
  9: 'Mutlak lebih penting',
};

export function createPairwiseMatrix(
  criteria: Criteria[],
  comparisons: CriteriaComparison[]
): number[][] {
  const n = criteria.length;
  const matrix: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(1));

  criteria.forEach((c1, i) => {
    criteria.forEach((c2, j) => {
      if (i === j) {
        matrix[i][j] = 1;
      } else {
        const comparison = comparisons.find(
          (comp) =>
            (comp.criteriaId1 === c1.id && comp.criteriaId2 === c2.id) ||
            (comp.criteriaId1 === c2.id && comp.criteriaId2 === c1.id)
        );

        if (comparison) {
          if (comparison.criteriaId1 === c1.id) {
            matrix[i][j] = comparison.value;
          } else {
            matrix[i][j] = 1 / comparison.value;
          }
        }
      }
    });
  });

  return matrix;
}

export function normalizeMatrix(matrix: number[][]): number[][] {
  const n = matrix.length;
  const normalized: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += matrix[i][j];
    }

    for (let i = 0; i < n; i++) {
      normalized[i][j] = matrix[i][j] / sum;
    }
  }

  return normalized;
}

export function calculateWeights(normalizedMatrix: number[][]): number[] {
  const n = normalizedMatrix.length;
  const weights: number[] = [];

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += normalizedMatrix[i][j];
    }
    weights.push(sum / n);
  }

  return weights;
}

export function calculateConsistencyRatio(
  matrix: number[][],
  weights: number[]
): number {
  const n = matrix.length;
  const RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

  const weightedSum: number[] = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      weightedSum[i] += matrix[i][j] * weights[j];
    }
  }

  let lambdaMax = 0;
  for (let i = 0; i < n; i++) {
    lambdaMax += weightedSum[i] / weights[i];
  }
  lambdaMax /= n;

  const CI = (lambdaMax - n) / (n - 1);
  const CR = CI / (RI[n - 1] || 1);

  return CR;
}

export function calculateAHPResults(
  criteria: Criteria[],
  employees: Employee[],
  comparisons: CriteriaComparison[],
  employeeScores: EmployeeScore[]
): AHPResult[] {
  const pairwiseMatrix = createPairwiseMatrix(criteria, comparisons);
  const normalizedMatrix = normalizeMatrix(pairwiseMatrix);
  const criteriaWeights = calculateWeights(normalizedMatrix);

  const results: AHPResult[] = employees.map((employee) => {
    let finalScore = 0;
    const criteriaScores = criteria.map((criterion, index) => {
      const score =
        employeeScores.find(
          (es) => es.employeeId === employee.id && es.criteriaId === criterion.id
        )?.score || 0;

      const normalizedScore = score / 100;
      const weight = criteriaWeights[index];
      const weightedScore = normalizedScore * weight;

      finalScore += weightedScore;

      return {
        criteriaId: criterion.id,
        criteriaName: criterion.name,
        weight: weight,
        score: normalizedScore,
        weightedScore: weightedScore,
      };
    });

    return {
      employeeId: employee.id,
      employeeName: employee.name,
      finalScore: finalScore,
      rank: 0,
      criteriaScores: criteriaScores,
    };
  });

  results.sort((a, b) => b.finalScore - a.finalScore);
  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  return results;
}
