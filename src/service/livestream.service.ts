import axios from "axios";


export interface RoomItem {
   id: number;
   roomName: string;
   status: string;
   maxParticipants: number;
   thumbnail: string;
   createdAt: string;
   updatedAt: string;
   streamerId: number;
   categoryId: number;
}


export const fetchLivestreamRooms = async (): Promise<RoomItem[]> => {
   try {
       const res = await axios.get(`${process.env.NEXT_PUBLIC_LIVESTREAM_API_URL}`);
       return res.data || [];
   } catch (error) {
       console.error("❌ Error fetching livestream rooms:", error);
       return [];
   }
};

