const Placeholder = ({ title }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <h2 className="text-primary font-display text-3xl font-bold opacity-20">{title}</h2>
    </div>
  );
};

export default Placeholder;