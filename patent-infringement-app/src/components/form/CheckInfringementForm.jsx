import { useMutation, useQuery } from '@tanstack/react-query';
import { getPatents } from '../../queries/patent';
import Autocomplete from './Autocomplete';
import { getCompanies } from '../../queries/company';
import LoadingButton from '../LoadingButton';
import { checkInfringement } from '../../mutation/patent';

const CheckInfringementForm = ({ patentId, companyName, onModifyResult, onPatentChange, onCompanyChange }) => {
  const { data: patents } = useQuery({ queryKey: ["patent"], queryFn: getPatents });
  const { data: companies } = useQuery({ queryKey: ["company"], queryFn: getCompanies });
  const { mutate, isPending } = useMutation({ mutationFn: checkInfringement });

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

  const handleSubmit = async () => {
    try {
      mutate({ patent_id: patentId, company_name: companyName }, {
        onSuccess: (data, variables, context) => {
          onModifyResult(data);
        },
        onError: () => {
          console.log("Error checking infringement:", error);
          onModifyResult(null);
        }
      });
    } catch (error) {
      console.log("Error checking infringement:", error);
    }
  }

  return (
    <form>
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
        <LoadingButton loading={isPending} onClick={handleSubmit} label="Check" />
      </div>
    </form>
  );
}

export default CheckInfringementForm;