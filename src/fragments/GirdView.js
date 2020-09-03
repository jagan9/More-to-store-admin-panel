import React from 'react';
import {Box,Typography} from '@material-ui/core';
import ProductView from './ProductView'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';



const GirdView = (props) => {
  //console.log(props.products)
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
		<Box  width="400px" style={{background:props.background}} p="16px" mx="auto">
		<Typography  variant="h5">{props.title}</Typography>
		<Box justify-content="center" p="16px" display="flex">
		<ProductView item={props.products[0]}/>
		<ProductView item={props.products[1]}/>
		</Box>
		<Box p="16px" justify-content="center" display="flex">
		<ProductView item={props.products[2]}/>
		<ProductView item={props.products[3]}/>
		</Box>
		</Box>
		</>
	)
}

export default GirdView