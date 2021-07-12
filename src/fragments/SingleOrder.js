import React from 'react'
import Paper from '@material-ui/core/Paper';


export default function SingleOrder(props) {



    return (
        <Paper elevation={3} style={{
            margin: "10px", padding: "5px", maxWidth: "275px",
            display: "flex", flexDirection: "column", alignItems: "center"
        }}>

            <img style={{ padding: "10px", maxWidth: "275px", Height: "250px", objectFit: "contain" }} src={props.order["Product Image"]} />

            <div style={{ marginLeft: "20px" }}>
                <p>Product title: <b>{props.order["Product Title"]}</b></p>
                <p>Product Price: <b>{props.order["Product Price"]}</b></p>
                <p>Person name: <b>{props.order["Full Name"]}</b></p>
                <p>Payment Method: <b>{props.order["Payment Method"]}</b></p>
                <p>ordered date: <b>{new Date(props.order["Ordered Date"].toDate()).toUTCString()}</b></p>
                <p>order Status: <b>{props.order["Order Status"]}</b></p>
            </div>



        </Paper>
    )
}
