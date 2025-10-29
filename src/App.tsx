import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CriteriaManager from './components/CriteriaManager';
import EmployeeManager from './components/EmployeeManager';
import CriteriaComparison from './components/CriteriaComparison';
import EmployeeScoring from './components/EmployeeScoring';
import Results from './components/Results';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'criteria':
        return <CriteriaManager />;
      case 'employees':
        return <EmployeeManager />;
      case 'comparison':
        return <CriteriaComparison />;
      case 'scoring':
        return <EmployeeScoring />;
      case 'results':
        return <Results />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </AppProvider>
  );
}

export default App;
