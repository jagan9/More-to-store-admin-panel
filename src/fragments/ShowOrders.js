import React, { useEffect, useState } from 'react'
import SingleOrder from './SingleOrder'
import { firestore } from '../firebase'

export default function ShowOrders() {
    const [orders, setorders] = useState([])

    useEffect(() => {

        firestore.collection("ORDERS").get()
            .then((snap) => {
                const docs = snap.docs.map((doc) => doc.id);
                docs.forEach((id) => {
                    firestore.collection("ORDERS").doc(id).
                        collection("OrderItems").
                        get().then((snapshot) => {

                            const eachid = snapshot.docs.map((eachdoc) => eachdoc.id);
                            eachid.forEach((pid) => {
                                firestore.collection("ORDERS").doc(id).collection("OrderItems")
                                    .doc(pid).get().then((res) => {
                                        setorders((prev) => {
                                            return [...prev, res.data()]
                                        })
                                        // setorders([...orders, res.data()]);
                                    })
                            })


                        })
                })
            })


    }, []);
    return (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
            {

                orders?.map((order, i) => (<SingleOrder key={i} order={order} />))
            }
            {
                console.log(orders)
            }

        </div>
    )
}
