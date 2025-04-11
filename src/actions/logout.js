// rrd imports
import { redirect } from "react-router-dom";

// helers 
import { deleteItem } from "../Wrapper.js";

// Library
import { toast } from "react-toastify";

export async function logoutAction(){
    // delete tha user
    deleteItem({ key: "correo"});
    deleteItem({ key: "pwd"});
    toast.success("Nos vemos pronto!");
    // return redirect
    return redirect("/");
}