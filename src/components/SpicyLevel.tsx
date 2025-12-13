interface Props {
    openSpicyLevel : boolean;
    setOpenSpicyLevel : ( value : boolean ) => void;
}

const SpicyLevel = ( { openSpicyLevel , setOpenSpicyLevel } : Props ) => { // design here
    return (
        <div className="fixed inset-0 flex justify-center items-center" >
            <div className="w-80 h-60 bg-primary rounded-sm flex flex-col gap-1 p-1" >
                <p className="text-center">Your Orders</p>
                <label>Spicy Levels</label>
                <div className="flex justify-between items-center px-2">
                    <input type="radio" name="spicyLevels" />
                    <label>Level 1</label>
                    <input type="radio" name="spicyLevels" />
                    <label>Level 2</label>
                    <input type="radio" name="spicyLevels" />
                    <label>Level 3</label>
                </div>

            </div>
        </div>
    )
}

export default SpicyLevel;