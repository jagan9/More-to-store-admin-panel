import React ,{Component} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  Snackbar,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Container,
  Avatar,
  Backdrop,
  CircularProgress,
  Fab
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import BannerSlider from '../fragments/Bannerslider';
import ProductView from '../fragments/ProductView';
import HorizontalScroller from '../fragments/HorizontalScroller'
import SttipedAdView from '../fragments/SttipedAdView';
import GirdView from '../fragments/GirdView';
import {firestore} from '../firebase';
import {
  Home,
  Add,
  FormatColorFill
} from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import {loadCategories} from "../Components/Actions/CategoryAction";
import {connect} from "react-redux";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {loadCategoryPage} from '../Components/Actions/CategoryPageAction'
import {storageRef} from '../firebase';
import DeleteIcon from '@material-ui/icons/Delete';




class HomeFragment extends React.Component{

  constructor(props) {
    super(props)
  
    this.state = {
       value:0,
       loading:true,
       addDialog:false,
       page:"HOME",
       images:[],
       colors:[],
       view_type:0,
       searchProgress:false,
       searchProductChecked:[],
       position_error:"",
       layout_title_error:"",
       snackbar:false,
       layout_bg:"#ffffff",
    }
  }



  componentDidMount(){
    if(this.props.categories===null){
      this.props.loadCategories(()=>{

        this.props.loadPage("HOME",()=>{

          this.setState({
            loading:false,
          })

        },()=>{

          this.setState({
            loading:false,
          })
//error

        })

      },
      ()=>{
        this.setState({
            loading:false,
          })
      }
      );
    }
    else{
      this.setState({
        loading:false,
      })
    }
  }

  

   
  handleChange = (event, newValue) => {
    this.setState({
      value:newValue,
    })
  };

  onFieldChange=e=>{
    this.setState({
      [e.target.name]:e.target.value,
    })
  }

  removeImage=index=>{
    let images=this.state.images;
    let colors=this.state.colors;

    

    let image=images[index];
    images.splice(index,1)
    colors.splice(index,1)
      try{

        if (image.startsWith("https")) {
           //console.log("qEDa");
          this.setState(
            {loading:true},
            this.deleteImage([image],0,()=>{
              this.setState({

                loading:false,
                images,
                colors,
              });
            })
            );
        }

      }catch(error){

this.setState({

                
                images,
                colors,
              });
      }
    

    

    this.setState({
      images,
      colors
    })
  }

  loadProducts=()=>{

    firestore.collection("PRODUCTS")
    .get()
    .then((querySnapshot)=>{
      let productslist=[];
      if (!querySnapshot.empty) {

        querySnapshot.forEach((doc)=>{
          //console.log(doc.data());
          
          let data={
            id:doc.id,
            image:doc.data().product_image_1,
            title:doc.data().product_title,
            subtitle:"",
            price:doc.data().product_price,
          }

          productslist.push(data);
          
        });
      }
      this.setState({
            productslist,
          });
    }).catch((err)=>{
      console.log(err);
    })

  }

  onProductSearch=()=>{
    this.setState({
      searchProgress:true,
    })
    let keywords=this.state.search.split(" ");

    firestore.collection("PRODUCTS")
    .where('tags', 'array-contains-any',keywords)
    .get()
    .then((querySnapshot)=>{
      let productslist=[];
      if (!querySnapshot.empty) {
        //console.log("avgas");
        querySnapshot.forEach((doc)=>{
          //console.log(doc.data());
          let data={
            id:doc.id,
            image:doc.data().product_image_1,
            title:doc.data().product_title_1,
            subtitle:doc.data().product_subtitle_1,
            price:doc.data().product_price_1
          }

          productslist.push(data);


          
        });
      }
      this.setState({
            productslist,
            searchProgress:false,
          });
    }).catch((err)=>{
      console.log(err);
    })

  }

  uploadProductSection=()=>{
    this.setState({
      loading:true,
    })
    let data;
    if(this.state.edit_mode){
      let product=[];
      this.state.searchProductChecked.forEach(element=>{
        product.push(element)
        console.log(element);
      });
   data={

        index:parseInt(this.state.position),
        view_type:this.state.view_type,
        layout_title:this.state.layout_title,
        layout_background:this.state.layout_bg,
        product:product,
      } 
    }else{
   data={

        index:parseInt(this.state.position),
        view_type:this.state.view_type,
        layout_title:this.state.layout_title,
        layout_background:this.state.layout_bg,
        product:this.state.searchProductChecked,
      } 
    }
const onComplete=()=>{
       let sections = this.props.categoryPages[this.state.page]
        if(this.state.edit_mode){
  data["id"]=this.state.doc_id;


          let section=sections.filter(item=>item.id===this.state.doc_id)[0];
          sections[sections.indexOf(section)]=data
        }else{
           sections.push(data);
        sections.sort((a,b)=>a.index-b.index);
        }

        this.props.addSection(this.state.page,sections);
       this.setState({
          loading:false,
          edit_mode:false,
          position:"",
          images:[],
          colors:[],
          view_type:0,
          addDialog:false,
           searchProductChecked:[],
          layout_title:null,
          layout_bg:null,
        })
}
      if(this.state.edit_mode){

 //alert(this.state.doc_id)
 //console.log(data)
         firestore
      .collection("CATEGORIES")
      .doc(this.state.page)
      .collection("TOP_DEALS")
      .doc(this.state.doc_id)
      .set(data)
      .then(()=> {
        //alert(this.state.doc_id)
onComplete();
        
          console.log("Document successfully written!");
      })
      .catch((error)=> {

        this.setState({
          loading:false,
        });
          console.error("Error writing document: ", error);
      });


      }else{
      firestore
      .collection("CATEGORIES")
      .doc(this.state.page)
      .collection("TOP_DEALS")
      .add(data)
      .then((doc)=> {

data["id"]=doc.id;
onComplete();
   
          console.log("Document successfully written!");
      })
      .catch((error)=> {
        this.setState({
          loading:false,
        });
          console.error("Error writing document: ", error);
      });
}

      }




  save = () =>{
  
    this.setState({
        position_error:"",
        layout_title_error:"",
      })

    if (!this.state.position) {
      this.setState({
        position_error:"required!"
      })
    }

    switch(this.state.view_type){
      case 0:

      if(this.state.images.length<3){
        this.setState({
          snackbar:true,
        })
        this.state.snackbar_error="minimun 3 images requeird!"
        return;
      }

      let urls=[];
      let index=0;
      this.setState({
        loading:true,
      })
      this.uploadingImage(this.state.images,index,urls,()=>{
      

            let data={
        index:parseInt(this.state.position),
        view_type:0,
        no_of_banners:urls.length,
      } 

      for(var i=0;i<urls.length;i++){
        data["banner_"+(i+1)]=urls[i];
        data["banner_"+(i+1)+"_background"]=this.state.colors[i];
      }  

      const onComplete=()=>{


        let sections = this.props.categoryPages[this.state.page]
        if(this.state.edit_mode){
  data["id"]=this.state.doc_id;


          let section=sections.filter(item=>item.id===this.state.doc_id)[0];
          sections[sections.indexOf(section)]=data
        }else{
           sections.push(data);
        sections.sort((a,b)=>a.index-b.index);
        }

        this.props.addSection(this.state.page,sections);
       this.setState({
          loading:false,
          position:"",
          addDialog:false,
          edit_mode:false,
          images:[],

          colors:[],
          view_type:0,
          addDialog:false,
        })
}

      //console.log(this.state.page)
      if(this.state.edit_mode){

 //alert(this.state.doc_id)
 console.log(data)
         firestore
      .collection("CATEGORIES")
      .doc(this.state.page)
      .collection("TOP_DEALS")
      .doc(this.state.doc_id)
      .set(data)
      .then(()=> {
        //alert(this.state.doc_id)
onComplete();
        
          console.log("Document successfully written!");
      })
      .catch((error)=> {

        this.setState({
          loading:false,
        });
          console.error("Error writing document: ", error);
      });


      }else{

      firestore
      .collection("CATEGORIES")
      .doc(this.state.page)
      .collection("TOP_DEALS")
      .add(data)
      .then((doc)=> {


        data["id"]=doc.id;
        let sections = this.props.categoryPages[this.state.page]
        sections.push(data);
        sections.sort((a,b)=>a.index-b.index);

        this.props.addSection(this.state.page,sections);
       this.setState({
          loading:false,
          position:"",
          edit_mode:false,
          images:[],
          colors:[],
          view_type:0,
          addDialog:false,
        })
          //console.log("Document successfully written!");
      })
      .catch((error)=> {
        this.setState({
          loading:false,
        });
          console.error("Error writing document: ", error);
      });


    }


      });


      break;


      case 1:

      if(this.state.images.length<1){
        this.setState({
          snackbar:true,
        })
        this.state.snackbar_error="image is requeird!"
        return;
      }

      
      let urls1=[];
      let index1=0;
      this.setState({
        loading:true,
      })
      this.uploadingImage(this.state.images,index1,urls1,()=>{
      

          let data={
        index:parseInt(this.state.position),
        view_type:1,
      } 

      data["strip_ad_banner"]=urls1[0];
      data["background"]=this.state.colors[0]; 
const onComplete=()=>{


        let sections = this.props.categoryPages[this.state.page]
        if(this.state.edit_mode){
  data["id"]=this.state.doc_id;


          let section=sections.filter(item=>item.id===this.state.doc_id)[0];
          sections[sections.indexOf(section)]=data
        }else{
           sections.push(data);
        sections.sort((a,b)=>a.index-b.index);
        }

        this.props.addSection(this.state.page,sections);
       this.setState({
          loading:false,
          position:"",
          addDialog:false,
          edit_mode:false,
          images:[],
          colors:[],
          view_type:0,
          addDialog:false,
        })
}

    //  console.log(this.state.page)
   if(this.state.edit_mode){

 //alert(this.state.doc_id)
 console.log(data)
         firestore
      .collection("CATEGORIES")
      .doc(this.state.page)
      .collection("TOP_DEALS")
      .doc(this.state.doc_id)
      .set(data)
      .then(()=> {
        //alert(this.state.doc_id)
onComplete();
        
          console.log("Document successfully written!");
      })
      .catch((error)=> {

        this.setState({
          loading:false,
        });
          console.error("Error writing document: ", error);
      });


      }
else{
      firestore
      .collection("CATEGORIES")
      .doc(this.state.page)
      .collection("TOP_DEALS")
      .add(data)
      .then((doc)=> {
      

        data["id"]=doc.id;
        let sections = this.props.categoryPages[this.state.page]
        sections.push(data);
        sections.sort((a,b)=>a.index-b.index);

        this.props.addSection(this.state.page,sections);
       this.setState({
          loading:false,
          position:"",
          edit_mode:false,
          images:[],
          colors:[],
          view_type:0,
          addDialog:false,
        })
          console.log("Document successfully written!");
      })
      .catch((error)=> {
        this.setState({
          loading:false,
        });
          console.error("Error writing document: ", error);
      });

}
      });

      

      break;


      case 2:

      if (!this.state.layout_title) {
      this.setState({
        layout_title_error:"required!"
      })
      return;
      }

      if (this.state.searchProductChecked.length<1) {
        this.setState({
          snackbar:true,
          snackbar_error:"Please select at least 1 product!"
        })
        return;
      }

      this.uploadProductSection()
      break;


      case 3:

       if (!this.state.layout_title) {
      this.setState({
        layout_title_error:"required!"
      })
      return;
      }

      if (this.state.searchProductChecked.length<4) {
        this.setState({
          snackbar:true,
          snackbar_error:"Please select at least 4 product!"
        })
        return;
      }

      this.uploadProductSection()

      break;


      default:
      break;
    }

  }



  deleteImage=(images,index,onComplete)=>{
    //console.log("images")
     const deleteAgain=(images,index,onComplete)=>
     this.deleteImage(images,index,onComplete)

     let splited_link=images[index].split("/");
     let name=splited_link[splited_link.length-1].split("?")[0].replace("banner%2F","");
   // console.log(typeof(name));
    storageRef.child('banner/'+name).delete().then(()=>{

    index++;
    if(index<0){
      //console.log("images");
      deleteAgain(images,index,onComplete);
    }else{
      //console.log("pgfkg");
      onComplete();
    }
    }).catch((err)=>{
      console.log(err);
      this.setState({
        loading:false,
      })
    })
    
  }


  uploadingImage=(images,index,urls,onCompleted)=>{

    const uploadAgain=(images,index,urls,onCompleted)=>this.uploadingImage(images,index,urls,onCompleted)

    let file=images[index];

          try{
      if (file.startsWith("https")) {
        urls.push(file);
          index++;
          if(index<images.length){
            uploadAgain(images,index,urls,onCompleted)
          }else{
            onCompleted();
          }
      }

          }catch(error){

          
          var ts = String(new Date().getTime()),
              i = 0,
              out = '';

          for (i = 0; i < ts.length; i += 2) {
              out += Number(ts.substr(i, 2)).toString(36);
          }

        let filename='banner' + out;




          var uploadTask = storageRef.child('banner/'+filename+'.jpg').put(file);
      uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
          urls.push(downloadURL);
          index++;
          if(index<images.length){
            uploadAgain(images,index,urls,onCompleted)
          }else{
            onCompleted();
          }
        });
      });
      }
        }





loading=()=>{
  this.setState({
    loading:true,
  })
}

  

  uploadImageURL=(item)=>{
    try{
return URL.createObjectURL(item)
    }catch(error){
return item
    }
  }


render(){
  return (
    <div>
    <Container maxWidth="md" fixed>
      <AppBar position="static" color="default">
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
        
          {this.props.categories?this.props.categories.map((category,index)=>(
           
            <Tab icon={<CategoryTabs icon={category.icon} title={category.categoryName}/>}
            onClick={e=>{
              if(this.props.categoryPages[category.categoryName.toUpperCase()]){
                 this.setState({page:category.categoryName.toUpperCase()})
              }else{
                this.setState({loading:true})
                this.props.loadPage(category.categoryName.toUpperCase(),()=>{

                this.setState({
                  loading:false,
                  page:category.categoryName.toUpperCase()
                })

                },()=>{

                  this.setState({
                    loading:false,
                  })
        //error

        })
              }

              }}

             key={index}
            />
            )):null}
          

            
        </Tabs>
      </AppBar>

      {this.props.categoryPages?this.props.categoryPages[this.state.page].map((item,indexmain)=>{
        switch(item.view_type){

          case 0:
          let banners=[];
          let images=[];
          let colors=[];
          for(let index=1;index<item.no_of_banners+1;index++){
            const banner=item['banner_'+index];
            const color=item['banner_'+index+'_background']
            banners.push({banner,color})
            images.push(banner)
            colors.push(color)
          }
          //console.log(banners);
           return <BannerSlider 
           key={indexmain}

           edit={()=>{
            this.setState({
              view_type:item.view_type,
              edit_mode:true,
              addDialog:true,
              position:item.index,
              images:images,
              colors:colors,
              doc_id:item.id,
            },



            )
           }}
           delete={()=>{
            this.setState({
              loading:true,
            },
            this.deleteImage(images,0,()=>{

              //console.log("came")
              firestore
              .collection("CATEGORIES")
              .doc(this.state.page)
              .collection("TOP_DEALS")
              .doc(item.id)
              .delete()
              .then(()=>{
this.props.categoryPages[this.state.page].splice(indexmain,1)
                this.setState({
                  loading:false,
                })
               


              }).catch((err)=>{
                console.log(err)
                this.setState({
                  loading:false,
                })
              })

            })
           )}} images={banners}/>;

          case 1:
      
          return <SttipedAdView
          key ={indexmain}
          edit={()=>{
            this.setState({
              view_type:item.view_type,
              edit_mode:true,
              addDialog:true,
              position:item.index,
              images:[item.strip_ad_banner],
              colors:[item.background],
              doc_id:item.id,
            })}}


          delete={()=>{
            this.setState({
              loading:true,
            },
            this.deleteImage([item.strip_ad_banner],0,()=>{

              firestore
              .collection("CATEGORIES")
              .doc(this.state.page)
              .collection("TOP_DEALS")
              .doc(item.id)
              .delete()
              .then(()=>{

this.props.categoryPages[this.state.page].splice(indexmain,1)
                this.setState({
                  loading:false,
                })
               


              }).catch((err)=>{
                console.log(err)
                this.setState({
                  loading:false,
                })
              })

            })
           )}} 



           image={item.strip_ad_banner} background={item.background}/>;


          case 2:

          let productsdata=[];
          let ids=[];

          if(!item.loaded){
            //console.log(item.product)
          item.product.forEach((id,index)=>{
           // console.log(id)
            firestore.collection("PRODUCTS").doc(id).get()
            .then((document)=>{

              if(document.exists){
                 let id1 = id;
                let productdata={
                  id:id,
                  title:document.data()["product_title"],
                  subtitle:"",
                  price:document.data()["product_price"],
                  image:document.data()["product_image_1"],

                }

                productsdata.push(productdata);
                ids.push(id1);
                if(index === item.product.length-1){

                  item.product=productsdata;
                  item['ids']=ids;
                  item['loaded']=true;
                  this.setState({})
                 // console.log(item.product)
                }
              }
            }).catch((err)=>{
              console.log(err);
            })
          })
        }
        return <HorizontalScroller 
        key = {indexmain}

        edit={()=>{
            this.setState({
              view_type:item.view_type,
              edit_mode:true,
              addDialog:true,
              position:item.index,
              layout_bg:item.layout_background,
              layout_title:item.layout_title,
              searchProductChecked:item.ids,
              doc_id:item.id,
            })}}

       delete={()=>
        this.setState({loading:true},()=>{
         // console.log(item.id)
        firestore
              .collection("CATEGORIES")
              .doc(this.state.page)
              .collection("TOP_DEALS")
              .doc(item.id)
              .delete()
              .then(()=>{
this.props.categoryPages[this.state.page].splice(indexmain,1);
                this.setState({
                  loading:false,
                });
               


              }).catch((err)=>{
                console.log(err)

                this.setState({
                  loading:false,
                });
              });
})}


        products={item.product} 
        title={item.layout_title} 
        background={item.layout_background}/>;

        case 3:

        let gridproductsdata=[];
        let indexs=[];
          //console.log(item)

          if(!item.loaded){
           // console.log(item.product)
          item.product.forEach((id,index)=>{
            // console.log(id)
            if (index<4) {
            firestore.collection("PRODUCTS").doc(id).get()
            .then((document)=>{

              if(document.exists){
                  let index1 = id;
                let productdata={
                  id:id,
                  title:document.data()["product_title"],
                  subtitle:"",
                  price:document.data()["product_price"],
                  image:document.data()["product_image_1"],

                }

                gridproductsdata.push(productdata);
                indexs.push(index1);
                if(index === 3){

                  item.product=gridproductsdata;
                 // console.log(item.product)
                  item['loaded']=true;
                  item['indexs']=indexs;
                  this.setState({})
                }
              }
            }).catch((err)=>{
              console.log(err);
            })
            }
          })
        }
        return <GirdView 
        key = {indexmain}
        edit={()=>{
            this.setState({
              view_type:item.view_type,
              edit_mode:true,
              addDialog:true,
              position:item.index,
              layout_bg:item.layout_background,
              layout_title:item.layout_title,
              searchProductChecked:item.indexs,
              doc_id:item.id,
            })}}

        delete={()=>
        this.setState({
          loading:true,
        },()=>{
        firestore
              .collection("CATEGORIES")
              .doc(this.state.page)
              .collection("TOP_DEALS")
              .doc(item.id)
              .delete()
              .then(()=>{
this.props.categoryPages[this.state.page].splice(indexmain,1)
                this.setState({
                  loading:false,
                })
               


              }).catch((err)=>{
                console.log(err)
                this.setState({
                  loading:false,
                })
              })
}
)}

        products={item.product} 
        title={item.layout_title} 
        background={item.layout_background}/>;

          
          default:
          break;
        }
      }):null}

      

      
     
      <Backdrop style={{zIndex:1300}} open={this.state.loading}>
      <CircularProgress color="primary" />
      </Backdrop>

      <Fab onClick={e=>this.setState({addDialog:true,edit_mode:false})} color="primary" aria-label="add" style={{position:"fixed" ,bottom:"30px",right:"30px"}}>
  <Add />
</Fab>
      
    </Container>


    <Dialog fullScreen open={this.state.addDialog} onClose={e=>{this.setState({addDialog:false})}} TransitionComponent={Transition}>
        <AppBar >
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={e=>this.setState({
              addDialog:false
            })} aria-label="close">
              <Close />
            </IconButton>
            <Typography variant="h6" >
             {this.state.edit_mode?"Edit Section":"Add Section"}
            </Typography>
            <Button 
            style={{position:"absolute" , right:"0"}} 
            autoFocus color="inherit" 
            onClick={e=>this.save()}>
              save
            </Button>
          </Toolbar>
        </AppBar>
<Toolbar/>
<Box padding="16px">
<FormControl>
        <InputLabel id="demo-simple-select-label">View Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={e=>{
            this.onFieldChange(e);
            this.setState({
              images:[],
              colors:[],
            })

          }}
          name="view_type"
          defaultValue={this.state.view_type}
        >
          <MenuItem value={0}>BANNER SLIDER</MenuItem>
          <MenuItem value={1}>STRIP AD</MenuItem>
          <MenuItem value={2}>HORIZONTAL SCROLLER</MenuItem>
          <MenuItem value={3}>GIRD VIEW</MenuItem>
        </Select>

       

        <br/>
        <TextField
          label="Position"
          defaultValue={this.state.position}
          id="outlined-size-small"
          variant="outlined"
          size="small"
          error={this.state.position_error!==""}
          helperText={this.state.position_error}
          margin="dense"
          onChange={this.onFieldChange}
          name="position"
          type="number"
        />

        <br/>
        <Box display="flex" flexWrap="true">
        {this.state.images.map((item,index)=>(
          <Box margin="12px">
          <img 
          src={this.uploadImageURL(item)} 
          style={{backgroundColor:this.state.colors[index],
          height:"90px" ,width:this.state.view_type===0?"160px":this.state.view_type===1?"210px":"0"}}/>
          <br/><input onChange={e=>{
            let colors=this.state.colors;

            colors[index]=e.target.value;

            this.setState({
              colors,
            })
          }} hidden id={"contained-button-"+index} type="color" defaultValue="#000000" />
          
           <IconButton aria-label="delete" onClick={e=>this.removeImage(index)}>
           <DeleteIcon />
          
          </IconButton>
          <label htmlFor={"contained-button-"+index}>
          <IconButton color="primary" aria-label="upload picture" component="span">
          <FormatColorFill />
        </IconButton>
          </label>
          
          </Box>
        ))}
        </Box>

         <input
        accept="image/*"
        hidden
        id="contained-button-file"
        onChange={(e)=>{
        
         // {console.log(this.state.images.length)}
          if(e.target.files && e.target.files[0]){
          let images=this.state.images;


          images.push(e.target.files[0]);
          this.state.colors.push("#ffffff");
          this.setState({
            images:images,
          })
          e.target.value=null;
        }
        }}
        type="file"
      />

      {this.state.view_type===0 &&this.state.images.length<8?
        <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span" 
          
          >
          Add Image
        </Button>
      </label>:null
      }

      {this.state.view_type===1 &&this.state.images.length<1?
        <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span" 
          
          >
          Add Image
        </Button>
      </label>:null
      }
     
</FormControl>
 </Box>
{(this.state.view_type===2||this.state.view_type===3)&&
<div style={{padding:"16px",width:"100%"}}>
    <TextField 
    label="Title" 
    onChange={this.onFieldChange}
    name="layout_title"
    defaultValue={this.state.layout_title}
    style={{width:"100%",background:this.state.layout_bg}}
    error={this.state.layout_title_error!==""}
    helperText={this.state.layout_title_error}
    />
     <br/>
     <input
        name="layout_bg"
        hidden
        id="standard-basic"
        onChange={
          this.onFieldChange
        }
        type="color"
      />
     <label htmlFor="standard-basic">
        <Button 
        color="primary"
        component="span"
        >
        layout Background
        </Button>
      </label>
      <h4>SelectProduct : {this.state.searchProductChecked.length}</h4>
<br/>
      <Box display="flex">
        <TextField 
        name="search" 
        label="Outlined" 
        variant="outlined" 
        size="small"
        onChange={this.onFieldChange}
        style={{flexGrow:"1"}}
        />
        <Button 
        variant="contained" 
        color="primary"
        onClick={e=>this.onProductSearch()}
        >
        Search
        </Button>
        </Box>
        <br/>
        {this.state.searchProgress?<Box style={{width:"100%",background:"#00000010",textAlign:"center"}}><CircularProgress color="primary"  /></Box>:
        <Box display="flex" flexWrap="true" style={{padding:"24px",background:"#00000010",width:"100%",flexWrap:"wrap"}}>

        {
          this.state.productslist===undefined?
          this.loadProducts()
        :
        this.state.productslist.map((item,index)=>
          <FormControlLabel
          key = {index}
          control={<Checkbox 
            defaultChecked={this.state.searchProductChecked.filter(x=>x===item.id).length>0}
            onChange={e=>{
              if(e.target.checked){
                let checked=this.state.searchProductChecked;
                
                checked.push(item.id);
                
                this.setState({
                  searchProductChecked:checked
                })
              }else{
                let posi=this.state.searchProductChecked.indexOf(item.id)
              
                this.state.searchProductChecked.splice(posi,1);
                this.setState({})
              }
            }}
            />
          }
          label={<ProductView item={item}/>}
          labelPlacement="bottom"
        />
        )
       }
      </Box>}



</div>}
 
      
        
       

<Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.snackbar}
        autoHideDuration={1000}
        onClose={e=>this.setState({
          snackbar:false
        })}
        message={this.state.snackbar_error}
        
      />


      
         

      </Dialog>



    <Backdrop style={{zIndex:"1600"}} open={this.state.loading} >
      <CircularProgress color="primary" />
      </Backdrop>
      </div>
  );
}
}


export const CategoryTabs=({icon,title})=>{
  return(
  <Box textAlign="center">
  {icon!=="null"?
  <img
  alt="R"
  variant="square"
  src={icon}
  style={{height:"34px",width:"34px"}}
  />:
  <Home/>}
  <Typography variant="body2">{title}</Typography>
  </Box>);
};



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const mapStateToProps=(state)=>{
  return{
  categories:state.categories,
  categoryPages:state.categoryPages,
  };
};

const mapDispatchToProps=(dispatch)=>{
  return{
  loadCategories:(onSuccess,onError)=>dispatch(loadCategories(onSuccess,onError)),
  loadPage:(category,onSuccess,onError)=>dispatch(loadCategoryPage(category,onSuccess,onError)),
  addSection:(page,list)=>
  dispatch({type:"LOAD_PAGE",payload:list, category:page}),
  };
};


export default connect(mapStateToProps,mapDispatchToProps)(HomeFragment)








