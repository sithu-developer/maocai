import { useAppSelector } from "@/store/hooks";
import { abyssinica } from "@/util/font"



const Voucher = () => {
    const customerTable = useAppSelector(store => store.table.customerTable)

    if(!customerTable) return null;

    const getCurrentDate = () => {
        const date = new Date();
        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    }

    return (
        <div className="bg-[#F8E6E6] grow rounded-[7px] border border-voucherColor flex flex-col gap-1 px-4 py-3 overflow-y-auto ">
            <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-voucherColor"}>QiQi Mala</p>
            <div className="flex items-center justify-between">
                <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-voucherColor underline underline-offset-2"}>Table no.{customerTable.tableName}</p>
                <p className={abyssinica.className + " text-center text-[clamp(10px,1.2vw,16px)] text-voucherColor underline underline-offset-2"}>{getCurrentDate()}</p>
            </div>
            <div className="grow flex flex-col px-2 pt-4 gap-2">
                <div className="flex items-center justify-between">
                    <p className={abyssinica.className + "  text-[clamp(10px,1.2vw,16px)] text-voucherColor w-[32%]"}>Items</p>
                    <p className={abyssinica.className + "  text-[clamp(10px,1.2vw,16px)] text-voucherColor w-[8.5%] text-center"}>Qty</p>
                    <div className="flex items-center gap-4 w-[40%]">
                        <p className={abyssinica.className + "  text-[clamp(10px,1.2vw,16px)] text-voucherColor w-[45%] text-center "}>Price</p>
                        <p className={abyssinica.className + "  text-[clamp(10px,1.2vw,16px)] text-voucherColor w-[55%] text-end"}>Amount</p>
                    </div>
                </div>
                <div className=" flex flex-col gap-1 px-1">
                    {[ 1, 2, 3 , 4 ,5 ,6 , 7, 8,9,11,12,13,14,15,16,17,18,19].map(item => (
                        <div key={item} className="flex items-center justify-between">
                            <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[32%]"}>Chicken Fire rice</p>
                            <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[8.5%] text-center"}>3</p>
                            <div className="flex items-center gap-3 w-[40%]">
                                <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[45%] text-center"}>1400</p>
                                <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[55%] text-end"}>14000</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-1 py-1.5 border-t border-t-voucherColor ">
                    <div className="flex items-center justify-between mb-1 px-1 ">
                        <span className="w-[21%]" />
                        <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[21%] text-center"}>Total</p>
                        <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[21.5%] text-end"}>Calc</p>
                    </div>
                    <div className="flex items-center justify-between px-1 ">
                        <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[21%]"}>Tax</p>
                        <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[10%] text-center"}>3%</p>
                        <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[21.5%] text-end"}>Calc</p>
                    </div>
                    <div className="flex items-center justify-between px-1 ">
                        <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[21%] text-nowrap"}>Service Charge</p>
                        <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[10%] text-center"}>3%</p>
                        <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[21.5%] text-end"}>Calc</p>
                    </div>
                    <div className="flex items-center justify-end mt-2">
                        <div className="flex justify-between items-center w-[62%] pt-2 border-t border-voucherColor px-1">
                            <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[40%] text-nowrap text-center"}>Total price</p>
                            <p className={abyssinica.className + "  text-[clamp(8px,1vw,11px)] text-voucherColor w-[40%] text-end"}>Calc</p>
                        </div>
                    </div>
                    <p className={abyssinica.className + " text-[clamp(10px,1.3vw,18px)] text-center mt-3 text-voucherColor"}>Thank You!</p>
                </div>
            </div>
        </div>
    )
}

export default Voucher;