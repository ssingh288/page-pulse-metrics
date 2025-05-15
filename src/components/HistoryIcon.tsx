
import { History as HistoryIcon } from "lucide-react";

// This is just a wrapper component to avoid conflicts with the browser's History object
const HistoryIconComponent = (props: React.ComponentProps<typeof HistoryIcon>) => {
  return <HistoryIcon {...props} />;
};

export default HistoryIconComponent;
