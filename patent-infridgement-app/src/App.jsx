import { useState } from 'react';
import './App.css';

const CheckInfringementForm = ({ handleModifyResult }) => {
  const [patentId, setPatentId] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log("Checking infringement...");
    } catch (error) {
      console.log("Error checking infringement:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ paddingBottom: "1rem" }}>
        <label>
          Patent ID: &nbsp;
          <input type="text" value={patentId} onChange={e => setPatentId(e.target.value)} />
        </label>
      </div>
      <div style={{ paddingBottom: "1rem" }}> 
        <label>
          Company Name: &nbsp;
          <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} />  
        </label>
      </div>
      <button type="submit">Check Infringement</button>
    </form>
  );
}

const ResultsBlock = ({ results }) => {
  const ResultBlock = ({ key, result }) => {
    return (
      <div key={key}>
        <h3>{result.product_name}</h3>
        <p>Infringement Likelihood: {result.infringement_likelihood}</p>
        <p>{result.explaination}</p>
      </div>
    );
  }

  const NoResultBlock = () => {
    return <p>No infringement detected or error occurred.</p>
  }
  
  console.log(results);

  return (
    <div>
      <h2>Results:</h2>
      {results.length > 0 ? results.map((result, index) => (
        <ResultBlock key={index} result={result} />
        )) : <NoResultBlock />}
    </div>
  );
}

const App = () => {
  const [results, setResults] = useState([
    { 
      product_name: "Walmart Shopping App",
      infringement_likelihood: "High",
      explaination: "The Walmart Shopping App implements several key elements of the patent claims including the direct advertisement-to-list functionality, mobile application integration, and shopping list synchronization. The app's implementation of digital advertisement display and product data handling closely matches the patent's specifications.",
    },
  ]);

  const handleModifyResult = (newResults) => {
    setResults(newResults);
  }

  return (
    <>
      <h1>Patent Infridgement Checker</h1>
      <CheckInfringementForm handleModifyResult={handleModifyResult} />
      <ResultsBlock results={results} />
    </>
  );
}

export default App;
