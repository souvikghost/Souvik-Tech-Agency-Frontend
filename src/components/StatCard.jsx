import { svgPacket } from "../utils/svgPacket";

const icon = {
  TotalEmployees: svgPacket["employeeIcon"],
  TotalClients: svgPacket["clientIcon"],
  TotalProjects: svgPacket["projectsIcon"],
  TotalServices: svgPacket["servicesIcon"],
  PendingRequests: svgPacket["pendingRequestsIcon"],
  OngoingProjects: svgPacket["ongoingRequestsIcon"],
};

const StatCard = ({ label, value }) => {
  return (
    <div className="min-h-36 min-w-36  h-full bg-secondary flex flex-col justify-between items-center  rounded-lg ">
      <div className="h-[25%] w-full flex justify-center items-center text-center ">
        <p className="text-primary text-xs sm:text-sm  font-bold uppercase tracking-wide">{label}</p>
      </div>
      <div className="bg-primary/10 w-full flex flex-col justify-center items-center h-[75%] rounded-lg">
        <div className="h-10 w-10 min-w-10 max-w-10 min-h-10 max-h-10 rounded-full flex justify-center items-center bg-gray-100 ">{icon[label?.split(" ")?.join("")]}</div>
        <p className="text-primary text-4xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
