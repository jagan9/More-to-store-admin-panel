import React from 'react';
import {Box,Typography} from '@material-ui/core';
import ProductView from './ProductView.js';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';


const HorizontalScroller = (props) => {
 // props.products.map(item=>console.log(item))
	const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



	return (<>
		<div style={{float:"right"}}>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        
        
      >
       
           <MenuItem
          onClick={()=>{
            props.edit();
            handleClose();
          }}>EDIT</MenuItem>
         <MenuItem onClick={()=>{
            props.delete();
            handleClose();
          }}>DELETE</MenuItem>
     
      </Menu>
    </div>
		<Box p="16px" style={{background:props.background}}>

			<Typography variant="h5">{props.title}</Typography>
			
			<Box display="flex" overflow="auto">

			{props.products.map((item,index)=><ProductView key={index} item={item}/>)}
			
			
			</Box>
		</Box>
	</>
	)
}

export default HorizontalScroller