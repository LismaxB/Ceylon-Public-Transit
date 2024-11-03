import { create } from "zustand";
import {StoreProps} from '@/types/type'

export const useStore = create<StoreProps>((set)=>({
    bus_id:'',
    setBusId:(bus_id:string)=>set({bus_id})
}));