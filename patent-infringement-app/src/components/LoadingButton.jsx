import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingButton = ({ loading = false, onClick, label = "Submit" }) => {
  const handleClick = async () => {
    await onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`bg-gray-700 hover:border-gray-200 focus:outline-none ${
        loading ? "cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <span className="flex items-center">
          <FaSpinner className="animate-spin mr-2" /> Loading...
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default LoadingButton;
