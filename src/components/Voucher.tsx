import { useAppSelector } from "@/store/hooks";
import { VoucherItem } from "@/type/order";
import { abyssinica } from "@/util/font"
import { order, ORDERSTATUS } from "@prisma/client";

interface Props {
    voucherItems : VoucherItem[]
    relatedOrders ?: order[]
}

const Voucher = ( { voucherItems , relatedOrders } : Props) => {
    const customerTable = useAppSelector(store => store.table.customerTable);
    const company = useAppSelector(store => store.company.item);

    if(!customerTable || !company ) return null;

    const getCurrentDate = () => {
        const date = relatedOrders ? new Date(relatedOrders[0].createdAt) : new Date();
        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + "|" + date.getHours() + ":" + date.getMinutes() ;
    }

    const getTotalPrice = () => {
        let totalPrice = 0;
        voucherItems.forEach(item => totalPrice += item.price * item.quantity)
        return totalPrice;
    }

    return (
        <div className={`bg-[#F8E6E6] relative ${relatedOrders ? "w-70 h-100 pt-5" : "grow"} rounded-[7px] border border-voucherColor flex flex-col gap-1 px-4 py-3 overflow-y-auto `}>
            <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-voucherColor"}>QiQi Mala</p>
            <div className="flex items-center justify-between">
                <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-voucherColor underline underline-offset-2"}>Table: {customerTable.tableName}</p>
                <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-voucherColor underline underline-offset-2"}>{getCurrentDate()}</p>
            </div>
            {voucherItems.length ? <div className="grow flex flex-col px-2 pt-4 gap-2">
                <div className="flex items-center justify-between">
                    <p className={abyssinica.className + "  text-[clamp(10px,1.2vw,16px)] text-voucherColor w-[32%]"}>Items</p>
                    <p className={abyssinica.className + "  text-[clamp(10px,1.2vw,16px)] text-voucherColor w-[8.5%] text-center"}>Qty</p>
                    <div className="flex items-center gap-4 w-[40%]">
                        <p className={abyssinica.className + "  text-[clamp(10px,1.2vw,16px)] text-voucherColor w-[45%] text-center "}>Price</p>
                        <p className={abyssinica.className + "  text-[clamp(10px,1.2vw,16px)] text-voucherColor w-[55%] text-end"}>Amount</p>
                    </div>
                </div>
                <div className=" flex flex-col gap-1 px-1">
                    {voucherItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                            <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[32%]"}>{item.name}</p>
                            <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[8.5%] text-center"}>{item.quantity}</p>
                            <div className="flex items-center gap-3 w-[40%]">
                                <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[45%] text-center"}>{item.price}</p>
                                <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[55%] text-end"}>{item.price * item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-1 py-1.5 border-t border-t-voucherColor ">
                    <div className="flex items-center justify-between mb-1 px-1 ">
                        <span className="w-[21%]" />
                        <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[21%] text-center"}>Sub total</p>
                        <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[21.5%] text-end"}>{getTotalPrice()}</p>
                    </div>
                    <div className="flex items-center justify-between px-1 ">
                        <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[21%]"}>Tax</p>
                        <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[10%] text-center"}>{company.taxPercentage}%</p>
                        <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[21.5%] text-end"}>{getTotalPrice() * 1/100 * company.taxPercentage}</p>
                    </div>
                    <div className="flex items-center justify-between px-1 ">
                        <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[21%] text-nowrap"}>Service Charge</p>
                        <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[10%] text-center"}>{company.serviceChargePercentage}%</p>
                        <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[21.5%] text-end"}>{getTotalPrice() * 1/100 * company.serviceChargePercentage}</p>
                    </div>
                    <div className="flex items-center justify-end mt-2">
                        <div className="flex justify-between items-center w-[62%] pt-2 border-t border-voucherColor px-1">
                            <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[40%] text-nowrap text-center"}>Total price</p>
                            <p className={abyssinica.className + "  text-[clamp(8px,1.1vw,11px)] text-voucherColor w-[40%] text-end"}>{getTotalPrice() + (getTotalPrice() * 1/100 * company.taxPercentage) + (getTotalPrice() * 1/100 * company.serviceChargePercentage) }</p>
                        </div>
                    </div>
                    <p className={abyssinica.className + " text-[clamp(10px,1.3vw,18px)] text-center mt-3 text-voucherColor"}>Thank You!</p>
                </div>
            </div>
            :<p className={abyssinica.className + " text-center text-[clamp(10px,.8vw,17px)] text-voucherColor mt-20"}>Please, select your foods.</p>}
            {relatedOrders && <p className={`${abyssinica.className} text-[clamp(11px,1.3vw,16px)] absolute top-0 right-0 py-1 px-2 rounded-bl-[7px] ${relatedOrders[0].status === ORDERSTATUS.ORDERED ? "bg-green-600 shadow-green-600" : "bg-primary shadow-primary"} text-secondary shadow-lg ` }>{relatedOrders[0].status}</p>}
            {(relatedOrders && relatedOrders[0].spicyLevel )&& <p className={abyssinica.className + " text-[clamp(12px,1.5vw,18px)] py-1 px-2 text-center bg-foodBorder text-secondary rounded-2xl  mb-2"}>Spicy Level {relatedOrders[0].spicyLevel}</p>}
        </div>
    )
}

export default Voucher;