const Patent = ({ data }) => {
  return (
    <div>
      <h2>Patent ID: {data?.publication_number}</h2>
      <h3>Title</h3>
      <p>{data?.title}</p>
      <h3>Claims</h3>
      <ul className="mb-4">
        {data?.claims?.map((claim, index) => {
          return (
            <li key={index} className="mb-2">{claim.text}</li>
          );
        })}
      </ul>
    </div>
  );
}

export default Patent;