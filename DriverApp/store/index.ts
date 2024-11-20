import { create } from "zustand";
import {StoreProps, BusDataProps} from '@/types/type'

export const useStore = create<StoreProps>((set)=>({
    bus_id:'',
    setBusId:(bus_id:string)=>set({bus_id}),
    busDetails:{
        bus_number:'',
        bus_type:'',
        capacity:0,
        private:false,
        active:false,
        created_at:'',
    },
    setBusDetails:(busDetails:BusDataProps)=>set({busDetails}),
}));