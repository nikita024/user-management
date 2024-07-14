const CountBox = ({ label, count }) => {
  return (
    <div className="count-box">
      <h3>{label}</h3>
      <p>{count}</p>
    </div>
  );
};

export default CountBox;