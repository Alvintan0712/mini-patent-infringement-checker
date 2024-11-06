const Company = ({ data }) => {
  return (
    <div>
      <h2>Company Name: {data?.name}</h2>
      <h3>Products</h3>
      <ul className="list-disc mb-4">
        {data?.products?.map((product, index) => {
          return (
            <li key={index} className="relative left-4 mb-2">
              <bold>{product.name}:</bold> {product.description}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Company;