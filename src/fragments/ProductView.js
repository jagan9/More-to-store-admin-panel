import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

const ProductView = (props) => {
	//console.log(props.item)
	return (
		<Box p="16px" bgcolor="white" boxShadow="8px" borderRadius="13px" mx="7px" width="150px">
			<img src={props.item.image} style={{ width: "120px", height: "120px", backgroundColor: "white", objectFit: "scale-down" }} />
			<Typography variant="subtitle1">{props.item.title}</Typography>
			<Typography variant="subtitle2"><span style={{ color: "#3bfb05" }}>{props.item.subtitle}</span></Typography>
			<Typography variant="h6">Rs:{props.item.price}</Typography>
		</Box>
	)
}

export default ProductView