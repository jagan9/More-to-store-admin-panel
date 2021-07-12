import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';


import { Box, Typography } from '@material-ui/core';

const SttipedAdView = (props) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <div style={{ background: "white", textAlign: "right" }}>
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
            onClick={() => {
              props.edit();
              handleClose();
            }}>EDIT</MenuItem>
          <MenuItem onClick={() => {
            props.delete();
            handleClose();
          }}>DELETE</MenuItem>

        </Menu>
      </div>
      <img src={props.image} style={{ background: props.background, width: "100%", height: "150px", objectFit: "scale-down" }} />
    </Box>
  )
}

export default SttipedAdView