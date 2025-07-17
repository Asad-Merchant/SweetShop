import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Home = () => {

    const url = import.meta.env.VITE_BACKEND_URL
    const [data, setData] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [showModel, setShowModel] = useState(false)
    const [showApply, setShowApply] = useState(false)
    const [range, setRange] = useState(0)
    const [cat, setCat] = useState("all")
    const [index, setIndex] = useState(-1)
    const [search, setSearch] = useState("")

    const fetchData = async () => {
        try {
            const res = await fetch(`${url}/api/v1/sweet/list-sweet`, {
                method: "GET",
            })
            console.log(res);
            
            if(res.ok){
                const result = await res.json()
                setData(result.body)
            } else{
                toast.error("Somrthing went wrong")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClick = (idx) => {
        setIndex(idx)
        setShowModel(true)
    }

    const handleClose = () => {
        setIndex(-1)
        setShowModel(false)
    }

    const handleOrder = async () => {
        try {
            const res = await fetch(`${url}/api/v1/sweet/buy-sweet`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({sweetId: data[index]._id, quantity})
            })
            const result = await res.json()
            if(res.ok){
                toast.success(result.body)
            } else {
                toast.error(result.body)
            }
            fetchData()
            setIndex(-1)
            setShowModel(false)
            setQuantity(1)
        } catch (error) {
            console.log(error);
        }
    }

    const handleRangeChange = (value) => {
        setRange(value)
        setShowApply(true)
    }

    const handleChange = async (category, maxValue) => {
        // console.log(category, maxValue);
        try {
            const res = await fetch(`${url}/api/v1/sweet/search`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({category: category, maxValue: range})
            })
            const result = await res.json()
            if(res.ok){
                setData(result.body)
                
            } else{
                toast.error("Something went wrong.")
            }
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        fetchData()
    }, [])


  return (
    <div className='mt-[70px] max-w-4xl mx-auto flex flex-col relative'>
        <div className="text-center font-bold text-[38px]">
            Welcome to Sweet mart
        </div>
        <div className="flex gap-x-3 mt-5 items-center">
            <div className="">
                <input type="text" placeholder='Search by name...' className='border px-2 py-1' onChange={(e)=>setSearch(e.target.value)} />
            </div>
            <div className="">
                <select name="" id="" value={cat} className='border-1 outline-0 px-1 py-1' onChange={(e)=>{setCat(e.target.value); handleChange(e.target.value, range)}}>
                    <option value="all">All</option>
                    <option value="chocolate">Chocolate</option>
                    <option value="candy">candy</option>
                    <option value="pastry">Pastry</option>
                </select>
            </div>
            <div className="flex flex-col items-center">
                <input type="range" min={1} max={100} value={range} onChange={(e)=>handleRangeChange(e.target.value)} />
                <p>Value: {range}</p>
            </div>
            {
                showApply && <button className="bg-blue-600 text-white mt-3 px-3 py-0.5 rounded hover:bg-blue-700 hover:cursor-pointer" onClick={() => handleChange(cat, range)}>Apply</button>
            }
        </div>
        <table className='mt-3 text-center border-collapse'>
            <tr className='bg-gray-300 text-center border-1'>
                <th>Sr no.</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th></th>
            </tr>
            {
                data.length>0 ? 
                    data.filter((item)=>search? item.name.toLowerCase().includes(search.toLowerCase()) : item).map((item, idx) => (
                        <tr className='text-[18px] border-b-1'>
                            <td className='px-2 py-1'>{idx+1}</td>
                            <td className='px-2 py-1'>{item.name}</td>
                            <td className='px-2 py-1'>{item.category}</td>
                            <td className='px-2 py-1'>{item.price}</td>
                            <td className='px-2 py-1'>{item.quantity}</td>
                            <td className='px-2 py-1'>
                                <button className="bg-blue-600 text-white px-3 py-0.5 rounded hover:bg-blue-700 hover:cursor-pointer" onClick={() => handleClick(idx)}>
                                Buy
                                </button>
                            </td>
                        </tr>
                    ))
                :
                    <tr>
                        <td colSpan={6}>No items found</td>
                    </tr>
            }
        </table>

        {
            showModel && 
                <div className="fixed bg-[rgba(255,255,255,0.5)] bg-opacity-30 inset-0 flex justify-center items-center z-50">
                    <div className="bg-white text-black border border-gray-500 rounded-xl p-6 w-[350px] shadow-lg flex flex-col">
                        <div className="text-right cursor-pointer" onClick={handleClose}>X</div>
                        <div className="">
                            <div className="">Name: {data[index].name}</div>
                            <div className="">Category: {data[index].category}</div>
                            <div className="">Price: {data[index].price}</div>
                            <div className="">Available quantity: {data[index].quantity}</div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <p>Enter Quantity: </p>
                            <input placeholder='0' value={quantity} type="number" onChange={e=>setQuantity(e.target.value)
                            } min={1} max={data[index].quantity} />
                        </div>
                       <button className="bg-blue-600 text-white mt-3 px-3 py-0.5 rounded hover:bg-blue-700 hover:cursor-pointer" onClick={handleOrder}>
                            Place order
                        </button>
                    </div>
                </div>
        }

    </div>
  )
}

export default Home