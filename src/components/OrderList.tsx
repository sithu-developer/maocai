interface Props {
    openOrderList : boolean;
    setOpenOrderList : (value : boolean ) => void;
}

const OrderList = ( { openOrderList , setOpenOrderList } : Props ) => {
    
    if(openOrderList) // here
    return (
        <div className="bg-black/50 fixed inset-0 w-screen flex justify-center items-center" onClick={() => setOpenOrderList(false)} >
            <div>
                hello
            </div>
        </div>
    )
}

export default OrderList;