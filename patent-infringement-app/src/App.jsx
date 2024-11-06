import { useState } from 'react';
import './App.css';

const CheckInfringementForm = ({ handleModifyResult }) => {
  const [publicationNumber, setPublicationNumber] = useState("");
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const resp = await fetch("/sample-response.json");
      const res = await resp.json();

      handleModifyResult(res);
    } catch (error) {
      console.log("Error checking infringement:", error);
      handleModifyResult(null);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="pb-4">
        <label for="patent-id" className="block mb-1 text-lg font-semibold">Publication Number</label>
        <input
          className="min-w-full rounded-md bg-gray-300 text-gray-900 p-2"
          type="text"
          value={publicationNumber}
          onChange={e => setPublicationNumber(e.target.value)}
        />
      </div>
      <div className="pb-4">
        <label for="company-name" className="block mb-1 text-lg font-semibold">Company Name</label>
        <input 
          className="min-w-full rounded-md bg-gray-300 text-gray-900 p-2"
          type="text"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-gray-700 hover:border-gray-200">
          Check
        </button>
      </div>
    </form>
  );
}

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
  const [result, setResult] = useState(null);

  const handleModifyResult = async (newResult) => {
    setResult(newResult);
  }

  return (
    <>
      <h1>Patent Infridgement Checker</h1>
      <CheckInfringementForm handleModifyResult={handleModifyResult} />
      <ResultsBlock result={result} />
    </>
  );
}

export default App;
