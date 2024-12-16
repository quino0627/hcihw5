export interface Reservation {
  id: string;
  vehicle_id: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: "pending" | "active" | "completed" | "cancelled";
  vehicle: {
    model: string;
    manufacturer: string;
    location: string;
  };
}
