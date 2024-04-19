import React, { useState, useEffect } from 'react';

const Orders = () => {
  const [orderId, setOrderId] = useState('');
  const [caseId, setCaseId] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8010/orders/all');
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders); // Assuming the response has a field named 'orders'
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      }
    };

    fetchOrders();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newOrder = { orderId, caseId };
      const response = await fetch('http://localhost:8010/orders/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });

      if (response.ok) {
        console.log('Order successfully submitted!');
        setOrderId('');
        setCaseId('');
        window.location.reload();

      } else {
        console.error('Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error.message);
    }
  };

  return (
    <div className="orders-wrap  w-full flex justify-center border-t shadow-inner font-roboto " >
      <div className="orders-content border flex flex-col  md:w-3/4 lg:w-3/4 xl:w-3/5 shadow">
        <h1 className="text-2xl text-center border-b">PROTOTYPE</h1>
        <div className="orders-upper-section flex flex-col w-full py-5 border-b border-t px-10">
          <h1 className="text-xl">Create Execution Order</h1>
          <form onSubmit={handleSubmit} className="flex flex-col ">
            <div className="">
              <label htmlFor="orderId" className="block">Order ID:</label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter order ID"
                className="border"
              />
            </div>
            <div className="">
              <label htmlFor="caseId" className="block">Case ID:</label>
              <input
                type="text"
                id="caseId"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="Enter case ID"
                className="border"
              />
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-1/5">
              Submit
            </button>
          </form>
        </div>
        <div className="orders-lower-section flex flex-col w-full py-5">
          <h1 className="text-xl">Execution Orders</h1>
          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr>
                <th className="border  px-4 py-2">#</th>
                <th className="border  px-4 py-2">Order ID</th>
                <th className="border  px-4 py-2">Case ID</th>
                <th className="border  px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td className="border text-center px-4 py-2">{index + 1}</td>
                  <td className="border text-center px-4 py-2">{order.orderId}</td>
                  <td className="border text-center px-4 py-2">{order.caseId}</td>
                  <td className="border text-center px-4 py-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Orders
