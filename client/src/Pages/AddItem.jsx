import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const AddItem = () => {

    const url = import.meta.env.VITE_BACKEND_URL 
    const [data, setData] = useState([])
    const [showModel, setShowModel] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [index, setIndex] = useState(-1)
    const [itemData, setItemData] = useState({
        name: '',
        price: 1,
        quantity: 1,
        category: 'chocolate'
    })

    const handleChange = (e) => {
        const name = e.target.name 
        const value = e.target.value 
        setItemData((prev) => ({...prev, [name]: value}))
    }

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${url}/api/v1/sweet/add-item`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(itemData)
            })
            const result = await res.json()
            if(res.ok){
                toast.success(result.body)
            } else{
                toast.error(result.body)
            }
            setItemData({
                category: 'chocolate',
                name: '',
                price: 1,
                quantity: 1
            })
        } catch (error) {
            console.log(error);
        }
    }

    const fetchData = async () => {
        try {
            const res = await fetch(`${url}/api/v1/sweet/list-all-sweet`, {
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

    const handleUpdate = async () => {
        try {
            const res = await fetch(`${url}/api/v1/sweet/add-quantity`, {
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

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${url}/api/v1/sweet/delete-sweet`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({sweetId: id})
            })
            const result = await res.json()
            if(res.ok){
                toast.success(result.body)
                fetchData()
            } else {
                toast.error(result.body)
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

    useEffect(() => {
        fetchData()
    }, [])

  return (
    <div className='mt-[70px] max-w-4xl mx-auto flex flex-col relative'>
        <div className="flex flex-col gap-y-2">
            <h1 className='text-[24px] font-bold'>Add Item</h1>
            <div className="flex gap-2 items-center">
                <p>Name: </p>
                <input type="text" name="name" placeholder='Enter name' className='border px-2 py-0.5' value={itemData.name} onChange={(e) => handleChange(e)} />
            </div>
            <div className="flex gap-2 items-center">
                <p>Price: </p>
                <input type="number" min={1} name="price" placeholder='Enter price' className='border px-2 py-0.5' value={itemData.price} onChange={(e) => handleChange(e)} />
            </div>
            <div className="flex gap-2 items-center">
                <p>Quantity: </p>
                <input type="number" name="quantity" placeholder='Enter quantity' className='border px-2 py-0.5' value={itemData.quantity} onChange={(e) => handleChange(e)} />
            </div>
            <div className="flex gap-2 items-center">
                <p>Select category: </p>
                <select name="category" id="" value={itemData.category} className='border-1 outline-0 px-1 py-1' onChange={(e) => handleChange(e)}>
                    <option value="chocolate">Chocolate</option>
                    <option value="candy">candy</option>
                    <option value="pastry">Pastry</option>
                </select>
            </div>
            <button className="bg-blue-600 text-white mt-3 px-3 py-0.5 rounded hover:bg-blue-700 hover:cursor-pointer" onClick={handleSubmit}>Submit</button>
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
                    data.map((item, idx) => (
                        <tr className='text-[18px] border-b-1'>
                            <td className='px-2 py-1'>{idx+1}</td>
                            <td className='px-2 py-1'>{item.name}</td>
                            <td className='px-2 py-1'>{item.category}</td>
                            <td className='px-2 py-1'>{item.price}</td>
                            <td className='px-2 py-1'>{item.quantity}</td>
                            <td className='px-2 py-1'>
                                <button className="bg-blue-600 text-white px-3 py-0.5 rounded hover:bg-blue-700 hover:cursor-pointer" onClick={() => handleClick(idx)}>
                                    Edit
                                </button>
                                <button className="bg-red-600 ml-2 text-white px-3 py-0.5 rounded hover:bg-red-700 hover:cursor-pointer" onClick={() => handleDelete(item._id)}>
                                    Delete
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
                    <div className="bg-white text-black border border-gray-500 rounded-xl p-6 w-[370px] shadow-lg flex flex-col">
                        <div className="text-right cursor-pointer" onClick={handleClose}>X</div>
                        <div className="">
                            <div className="">Name: {data[index].name}</div>
                            <div className="">Category: {data[index].category}</div>
                            <div className="">Price: {data[index].price}</div>
                            <div className="">Available quantity: {data[index].quantity}</div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <p>Quantity to add: </p>
                            <input className='border px-2 w-fit' placeholder='0' value={quantity} type="number" onChange={e=>setQuantity(e.target.value)
                            } min={1} />
                        </div>
                       <button className="bg-blue-600 text-white mt-3 px-3 py-0.5 rounded hover:bg-blue-700 hover:cursor-pointer" onClick={handleUpdate}>
                            Update Quantity
                        </button>
                    </div>
                </div>
        }

    </div>
  )
}

export default AddItem