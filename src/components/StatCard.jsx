const StatCard = ({ label, value }) => {
  return (
    <div className="p-5 ">
      <p className="text-primary/50 text-base font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-primary text-4xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default StatCard;