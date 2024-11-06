import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import CheckInfringementForm from './components/form/CheckInfringementForm';
import Patent from './components/Patent';
import Company from './components/Company';
import InfringementResult from './components/InfringementResult';
import './App.css';

const queryClient = new QueryClient();

const App = () => {
  const [patent, setPatent] = useState(null);
  const [company, setCompany] = useState(null);
  const [result, setResult] = useState(null);

  const handleModifyResult = async (newResult) => {
    setResult(newResult);
  }

  const handlePatentChange = value => setPatent(value);
  const handleCompanyChange = value => setCompany(value);

  return (
    <QueryClientProvider client={queryClient}>
      <h1>Patent Infridgement Checker</h1>
      <CheckInfringementForm
        patentId={patent?.publication_number ?? ""}
        companyName={company?.name ?? ""}
        onModifyResult={handleModifyResult}
        onPatentChange={handlePatentChange}
        onCompanyChange={handleCompanyChange}
      />
      {patent && <Patent data={patent} />}
      {company && <Company data={company} />}
      <InfringementResult result={result} />
    </QueryClientProvider>
  );
}

export default App;
