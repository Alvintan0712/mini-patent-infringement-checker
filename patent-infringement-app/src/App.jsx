import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import './App.css';
import CheckInfringementForm from './components/form/CheckInfringementForm';
import Patent from './components/Patent';
import Company from './components/Company';

const queryClient = new QueryClient();

const ResultsBlock = ({ result }) => {
  const ResultBlock = () => {
    return (
      <div>
        <p>Report id: {result?.analysis_id}</p>
        <p>Publication No.: {result?.patent_id}</p>
        <p>Company Name: {result?.company_name}</p>

        <div className="mt-4">
          <h3>Top infringing products</h3>
          <ol className="list-decimal">
            {result?.top_infringing_products?.map((product, index) => {
              return (
                <li key={index} className="relative mb-4 left-8">
                  <h4>{product?.product_name}</h4>
                  
                  <p className="font-bold">Description</p>
                  <p>{product?.description}</p>

                  <p className="font-bold">Relevant Claims</p>
                  <p>{product?.relevant_claims?.join(", ")}</p>

                  <p className="font-bold">Infringement Likelihood</p>
                  <p>{product?.infringement_likelihood}</p>

                  <p className="font-bold">Infringing Features</p>
                  <ul className="list-disc mb-4">
                    {product?.infringing_features?.product_features?.map((feature, index) => {
                      return (
                        <li key={index} className="relative left-4">
                          {feature}
                        </li>
                      );
                    })}
                  </ul>

                  <p className="font-bold">Explaination</p>
                  <p>{product?.infringing_features?.explaination}</p>
                </li>
              );
            })}
          </ol>
        </div>

        {result?.overall_risk_assessment && (
          <div className="mt-4">
            <h3>Overall Risk Assessment</h3>
            <p>{result?.overall_risk_assessment}</p>
          </div>
        )}
      </div>
    );
  }

  const NoResultBlock = () => {
    return <p>No infringement detected or error occurred.</p>
  }
  
  return (
    <div className="mt-4">
      <h2>Result</h2>
      {result ? <ResultBlock/> : <NoResultBlock />}
    </div>
  );
}

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
        handleModifyResult={handleModifyResult}
        onPatentChange={handlePatentChange}
        onCompanyChange={handleCompanyChange}
      />
      {patent && <Patent data={patent}/>}
      {company && <Company data={company}/>}
      <ResultsBlock result={result} />
    </QueryClientProvider>
  );
}

export default App;
