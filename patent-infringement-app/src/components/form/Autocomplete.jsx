import { useState } from "react"

const Autocomplete = ({ label, options, onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = e => {
    setInputValue(e.target.value);

    const filtered = options.filter(option => 
      option.label.toLowerCase().includes(e.target.value.toLowerCase()));
    setFilteredOptions(filtered);

    setIsOpen(filtered.length > 0);
  }

  const handleOptionClick = option => {
    setInputValue(option.label);
    setIsOpen(false);
    if (onChange) onChange(option.value);
  }

  return (
    <div className="min-w-full">
      {label && (
        <label className="block mb-1 text-lg font-semibold">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          className="block w-full text-black px-3 py-2 border border-gray-300 bg-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full border bg-gray-800 border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-gray-500">No options found</li>
            ) : (
              filteredOptions.map(option => (
                <li
                  key={option.value}
                  className="px-3 py-2 cursor-pointer hover:bg-indigo-500 hover:text-white"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Autocomplete;