const ModificationPage = () => {
    return (
        <div className="bg-[#EAF4F4] h-screen w-screen flex">
            <div className="w-[73%] flex flex-col">
                <p className="text-3xl px-5 py-3.5">Category &gt; </p>
                <div className="bg-amber-300 flex flex-wrap gap-5 p-5 overflow-auto">
                    {[1,2,3,4,5,6,7,8,9].map(item => (
                        <div key={item} className="h-48 w-43 bg-cyan-500 rounded-[9px] border-2">a</div>
                    ))}
                </div>
            </div>
            <div className="bg-fuchsia-500 w-[28%]  p-5">hello</div>
        </div>
    )
}

export default ModificationPage;

//grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4