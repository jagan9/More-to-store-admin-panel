import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Home, Category, Settings, Phonelink, ShoppingCart, PowerSettingsNew } from '@material-ui/icons'
import Logo from '../media/Logo.jpg'
import Homefragment from '../fragments/HomeFragment'
import ShowOrders from '../fragments/ShowOrders'
import AddProduct from '../fragments/AddProduct'
import ManageCategoryFragment from '../fragments/manageCategoryFragment'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function ClippedDrawer() {
  const classes = useStyles();

  const [fragment, setfragment] = React.useState("HOME");


  const loadFragment = () => {


    switch (fragment) {
      case "HOME":
        return <Homefragment />

      case "LOAD_CATEGORY":
        return <ManageCategoryFragment />

      case "ADD_PRODUCT":
        return <AddProduct />

      case "SHOW_ORDERS":
        return <ShowOrders />





    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>

          <img src={Logo} height="60px" style={{ marginRight: "18px" }} />
          <Typography variant="h4" display="inline">My Mall Admin</Typography>

        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button onClick={e => setfragment("HOME")}>
              <ListItemIcon><Home /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </List>
          <List>
            <ListItem button onClick={e => setfragment("LOAD_CATEGORY")}>
              <ListItemIcon><Category /></ListItemIcon>
              <ListItemText primary="Categories" />
            </ListItem>
          </List>
          <List>
            <ListItem button onClick={e => setfragment("ADD_PRODUCT")}>
              <ListItemIcon><Phonelink /></ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>
          </List>
          <List>
            <ListItem button onClick={e => setfragment("SHOW_ORDERS")}>
              <ListItemIcon><ShoppingCart /></ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItem>
          </List>

          <Divider />
          <List>
            <ListItem button >
              <ListItemIcon><PowerSettingsNew /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
          <Divider />
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {loadFragment()}

      </main>
    </div>
  );
}
