import { IoCloseCircleOutline, IoSearch } from "react-icons/io5"
import Location from "./Location"
import { useEffect, useState } from "react"
import axios from "axios"
import { MdOutlineClose } from "react-icons/md"

const LocationTree = () => {
    const [data, setData] = useState('')
    const [allData, setAllData] = useState('')
    const [isVisible, setIsVisible] = useState(4)
    useEffect(() => {
        const fetchData = async () => {
            const res = await (await axios.get("https://66433cbc3c01a059ea221251.mockapi.io/api/locationtree/location"))
            setAllData(res.data)
            setData(res.data.slice(0, 2))
        }
        fetchData()
    }, [])
    const LoadMore = () => {
        setData(allData.slice(0, isVisible))
        setIsVisible(isVisible + 2)
    }

    return (
        <div className="min-w-[350px]  border rounded-md flex flex-col  shadow-2xl bg-white relative">
            <div className="w-full flex justify-center p-4 bg-[#f2f2f2] items-center relative">
                <IoSearch className="absolute left-5 size-5 text-[#c6c4c4] hover:text-[#b3b3b3] cursor-pointer" />
                <input type="text" className="w-full border pl-6 h-8" />
                <MdOutlineClose className="absolute right-5 font-semibold text-[16px] text-[#c6c4c4] hover:text-[#b3b3b3] cursor-pointer" />
            </div>
            <div className="h-[500px] p-4 overflow-y-scroll">
                {
                    data ? data.map((item, index) => (
                        <Location index={index} item={item} key={index} />
                    )) : <p>Loading ... </p>
                }

                {isVisible <= allData.length ? <p onClick={LoadMore} className="text-[#7c7c7c] italic cursor-pointer hover:text-blue-700">Loadmore ...</p> : ""}

            </div>
        </div>
    )
}

export default LocationTree