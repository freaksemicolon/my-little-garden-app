import { Plant } from "@/data/plants";
import PlantCard from "./PlantCard";

interface PlantListProps {
  plants: Plant[];
}

const PlantList = ({ plants }: PlantListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {plants.map((plant) => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </div>
  );
};

export default PlantList;
