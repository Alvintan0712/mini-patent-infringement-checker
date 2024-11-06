import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getPatents } from '../../queries/patent';
import Autocomplete from './Autocomplete';
import { getCompanies } from '../../queries/company';

const CheckInfringementForm = ({ handleModifyResult, onPatentChange, onCompanyChange }) => {
  const [companyName, setCompanyName] = useState("");

  const { data: patents } = useQuery({ queryKey: ["patent"], queryFn: getPatents });
  const { data: companies } = useQuery({ queryKey: ["company"], queryFn: getCompanies });

  const patentOptions = patents?.map(patent => ({
    label: patent.publication_number,
    value: JSON.stringify(patent),
  }));
  const companyOptions = companies?.map(company => ({
    label: company.name,
    value: JSON.stringify(company),
  }));

  const handlePatentChange = jsonValue => {
    const value = JSON.parse(jsonValue);
    onPatentChange(value);
  }

  const handleCompanyChange = jsonValue => {
    const value = JSON.parse(jsonValue);
    onCompanyChange(value);
  }

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
        <Autocomplete 
          label="Publication Number"
          options={patentOptions ?? []}
          onChange={handlePatentChange}
        />
      </div>
      <div className="pb-4">
        <Autocomplete 
          label="Company Name"
          options={companyOptions ?? []}
          onChange={handleCompanyChange}
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

export default CheckInfringementForm;