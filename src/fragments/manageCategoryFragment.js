import React from 'react';
import { Container } from '@material-ui/core';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Button from '@material-ui/core/Button';
import { deleteCategories, loadCategories, addCategories, updateCategories } from "../Components/Actions/CategoryAction";
import { storageRef } from '../firebase';
import { Home } from '@material-ui/icons';



export const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};



class ManageCategoryFragment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [
        { title: 'index', field: 'index', type: "numeric" },
        { title: 'category', field: 'categoryName', editable: "onAdd" },
        {
          title: 'icon',
          field: 'icon',
          editComponent: props => (
            <>
              <input
                accept="image/*"
                hidden
                id="contained-button-file"
                onChange={(e) => {

                  // {console.log(this.state.images.length)}
                  if (e.target.files && e.target.files[0]) {
                    this.setState({
                      image: e.target.files[0],
                    })
                    props.onChange(e.target.value);
                    e.target.value = null;
                  }
                }}
                name="image"
                type="file"
              />
              <label htmlFor="contained-button-file">
                {this.state.image || props.value ? (
                  <img src={this.state.image ? this.uploadImageURL(this.state.image) : props.value}
                    style={{ width: 40, height: 40, objectFit: "scale-down" }} />)

                  :

                  <Button variant="contained" color="primary" component="span" >
                    Add Image
                  </Button>

                }
              </label>
            </>),
          render: rowData => (rowData.icon === "null" ? <Home /> : <img src={rowData.icon}
            style={{ width: 40, height: 40, objectFit: "scale-down" }} />)

        },
      ],
    }
  }


  uploadImageURL = (item) => {
    try {
      return URL.createObjectURL(item)
    } catch (error) {
      return item
    }
  }



  uploadingImage = (onCompleted) => {



    let file = this.state.image;

    try {
      if (file.startsWith("https")) {

        onCompleted(file);

      }

    } catch (error) {


      var ts = String(new Date().getTime()),
        i = 0,
        out = '';

      for (i = 0; i < ts.length; i += 2) {
        out += Number(ts.substr(i, 2)).toString(36);
      }

      let filename = 'category' + out;




      var uploadTask = storageRef.child('categories/' + filename + '.jpg').put(file);
      uploadTask.on('state_changed', function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

      }, function (error) {
        // Handle unsuccessful uploads
      }, function () {

        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {

          onCompleted(downloadURL);

        });
      });
    }
  }






  deleteImage = (image, onComplete) => {
    console.log(image)
    let splited_link = image.split("/");
    let name = splited_link[splited_link.length - 1]
      .split("?")[0]
      .replace("categories%2F", "");

    console.log(name)
    storageRef.child('categories/' + name).delete().then(() => {
      onComplete(true);
    }).catch((err) => {
      console.log(err);
      onComplete(false)
    })

  }


  render() {
    return (
      <div>

        <Container maxWidth="md" fixed>


          <MaterialTable
            icons={tableIcons}
            title="Categories"
            options={{ search: false, paging: false }}
            columns={this.state.columns}
            data={this.props.categories}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {

                  if (newData.index && newData.categoryName && newData.icon) {

                    this.uploadingImage(url => {
                      newData["icon"] = url;


                      this.props.addCategory(newData,
                        () => resolve(),
                        (error) => resolve())
                    })


                  } else {
                    console.log("4")
                    resolve();
                    this.setState({
                      image: null,
                    })
                  }
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  if (newData.index === oldData.index && newData.icon === oldData.icon) {
                    resolve();
                    this.setState({
                      image: null,
                    })
                  } else if (newData.icon === oldData.icon) {


                    this.props.updateCategory(newData,
                      () => resolve(),
                      (error) => resolve());

                  } else {

                    this.deleteImage(oldData.icon, (success) => {

                      if (success) {
                        this.uploadingImage(url => {
                          newData["icon"] = url;


                          this.props.updateCategory(newData,
                            () => resolve(),
                            (error) => resolve());

                        })
                      } else {
                        resolve()
                      }



                    })

                  }
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {

                  this.props.deleteCategory(oldData.categoryName,
                    () => resolve(),
                    (error) => resolve())

                }),
            }}
          />







        </Container>

      </div>
    )
  }
}




const mapStateToProps = (state) => {
  return {
    categories: state.categories,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCategory: (data, onSuccess, onError) =>
      dispatch(addCategories(data, onSuccess, onError)),

    updateCategory: (data, onSuccess, onError) =>
      dispatch(updateCategories(data, onSuccess, onError)),

    deleteCategory: (data, onSuccess, onError) =>
      dispatch(deleteCategories(data, onSuccess, onError)),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(ManageCategoryFragment)



