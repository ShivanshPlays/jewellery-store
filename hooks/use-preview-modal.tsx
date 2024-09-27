import { Product } from "@/types";
import {create} from "zustand";

interface PreviewModalStore{
    isOpen:boolean,
    data?:Product
    onOpen:(data:Product)=>void,
    onClose:()=>void
}

export const usePreviewModal=create<PreviewModalStore>((set)=>({
    isOpen:false,
    data:undefined,
    //IMO isOpen is the state and Set is the state updater and onOpen and onClose are 2 functions that change the state
    onOpen:(data:Product)=> set({data,isOpen:true}),
    onClose:()=> set({isOpen:false})
}))
 
export default usePreviewModal