import React from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  RadioGroup,
  Radio,
  Snackbar,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { tableIcons } from "./manageCategoryFragment"
import MaterialTable from 'material-table';
import firebase, { storageRef, firestore } from '../firebase';

class AddProduct extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      COD: false,
      snakbar: false,
      loading: false,
      product_title: { error: "", value: "" },
      price: { error: "", value: "" },
      cutted_price: { error: "", value: "0" },
      valid_for_days: { error: "", value: "" },
      coupon_title: { error: "", value: "" },
      coupon_body: { error: "", value: "" },
      free_coupons: { error: "", value: "0" },
      tags: { error: "", value: "" },
      description: { error: "", value: "" },
      percentage: { error: "", value: "" },
      lower_limit: { error: "", value: "" },
      upper_limit: { error: "", value: "" },
      max_quantity: { error: "", value: "" },
      stock_quantity: { error: "", value: "" },
      offers_applied: { error: "", value: "0" },
      other_details: { error: "", value: "" },
      discount: { error: "", value: "" },
      images: [],
      columns: [
        { title: 'key', field: 'field' },
        { title: 'value', field: 'value' },

      ],
      data: [

      ],
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: { error: "", value: e.target.value }
    })
  }

  uploadImageURL = (item) => {
    try {
      return URL.createObjectURL(item)
    } catch (error) {
      return item
    }
  }

  removeImage = index => {
    let images = this.state.images;

    let image = images[index];
    images.splice(index, 1)

    try {

      if (image.startsWith("https")) {
        //console.log("qEDa");
        this.setState(
          { loading: true },
          this.deleteImage([image], 0, () => {
            this.setState({
              images,
            });
          })
        );
      }

    } catch (error) {
      this.setState({
        images,
      });
    }

    this.setState({
      images,
    })
  }


  uploadImages = (images, index, urls, onCompleted) => {

    const uploadAgain = (images, index, urls, onCompleted) =>
      this.uploadImages(images, index, urls, onCompleted)

    let file = images[index];

    try {
      if (file.startsWith("https")) {
        urls.push(file);
        index++;
        if (index < images.length) {
          uploadAgain(images, index, urls, onCompleted)
        } else {
          onCompleted();
        }
      }
    }
    catch (error) {

      var ts = String(new Date().getTime()),
        i = 0,
        out = '';

      for (i = 0; i < ts.length; i += 2) {
        out += Number(ts.substr(i, 2)).toString(36);
      }

      let filename = 'product' + out;




      var uploadTask = storageRef.child('products/' + filename + '.jpg').put(file);
      uploadTask.on('state_changed', function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

      }, function (error) {
        // Handle unsuccessful uploads
      }, function () {

        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          urls.push(downloadURL);
          index++;
          if (index < images.length) {
            uploadAgain(images, index, urls, onCompleted)
          } else {
            onCompleted();
          }
        });
      });
    }
  }



  uploadProduct = () => {

    if (this.state.images.length === 0) {
      this.setState({
        snakbar: true,
      });
      this.state.snackbar_error = "image is requried!";

      return;
    }

    if (this.state.use_tab_layout && this.state.data.length === 0) {
      this.setState({
        snakbar: true,
      });
      this.state.snackbar_error = "you are using tab layout!";

      return;
    }

    let mandateroyList = [
      "product_title",
      "price",
      "max_quantity",
      "description",
      "other_details",
      "stock_quantity",
      "tags",
    ];

    if (this.state.attach_copon) {
      let list = [
        "coupon_title",
        'valid_for_days',
        'coupon_body',
        'lower_limit',
        'upper_limit',
      ];
      if (this.state.coupon_type === "percentage") {
        list.push('percentage')
      }
      else {
        list.push('discount')
      }

      mandateroyList = mandateroyList.concat(list);
    }

    let show_errors = true;

    mandateroyList.forEach((item, index) => {
      let field = this.state[item];

      if (field.value === "") {
        field.error = "Required!";
        show_errors = false;
      }
    });


    if (!show_errors) {
      this.setState({});

      return;
    }




    let index = 0;
    let urls = [];
    this.setState({
      loading: true,
    })

    this.uploadImages(this.state.images, index, urls, () => {

      let data = {
        added_on: firebase.firestore.Timestamp.fromDate(new Date()),
        no_of_product_images: urls.length,
        product_title: this.state.product_title.value,
        product_price: this.state.price.value,
        COD: this.state.COD,
        cutted_price: this.state.cutted_price.value,
        max_quantity: parseInt(this.state.max_quantity.value),
        offers_applied: this.state.offers_applied.value,
        product_description: this.state.description.value,
        product_other_details: this.state.other_details.value,
        stock_quantity: parseInt(this.state.stock_quantity.value),
        tags: this.state.tags.value.split(","),
        '1_star': 0,
        '2_star': 0,
        '3_star': 0,
        '4_star': 0,
        '5_star': 0,
        in_stock: true,
        average_rating: "0",
        total_ratings: 0,
      }


      if (this.state.attach_copon) {
        data['free_coupen_body'] = this.state.coupon_body.value
        data['free_coupen_title'] = this.state.coupon_title.value
        data['free_coupens'] = parseInt(this.state.free_coupons.value)
        data['lower_limit'] = this.state.lower_limit.value
        data['upper_limit'] = this.state.upper_limit.value
        data['validity'] = this.state.valid_for_days.value


        if (this.state.coupon_type === "percentage") {
          data['percentage'] = this.state.percentage.value
        }
        else {
          data['amount'] = this.state.discount.value
        }
      }

      if (this.state.use_tab_layout) {
        data['use_tab_layout'] = true
        let sectionCount = 0;
        let index = 0;
        this.state.data.forEach((item) => {
          if (item.field === "title") {
            sectionCount++;
            data['spec_title_' + sectionCount + '_total_fields'] = index;
            index = 0;

            data['spec_title_' + sectionCount] = item.value;
          } else {
            index++;
            data['spec_title_' + sectionCount + '_field_' + index + '_name'] =
              item.field;
            data['spec_title_' + sectionCount + '_field_' + index + '_value'] =
              item.value;
          }
        });
        data['total_spec_titles'] = sectionCount;
      } else {
        data['use_tab_layout'] = false
      }

      urls.forEach((item, index) => {
        data['product_image_' + (index + 1)] = item;
      });

      const uploadQuantity = (doc_id) => {

        firestore
          .collection("PRODUCTS")
          .doc(doc_id)
          .collection("QUANTITY")
          .add({ time: firebase.firestore.Timestamp.fromDate(new Date()) })
          .then(function (doc) {

          })
          .catch((err) => {
            this.setState({
              loading: false,
            });
          })

      }


      firestore
        .collection('PRODUCTS')
        .add(data)
        .then((doc) => {
          let doc_id = doc.id;

          for (
            let index = 0;
            index < 0;
            index++
          ) {

            uploadQuantity(doc_id);
          }

          console.log("Document successfully written!");
          this.setState({
            loading: false,
          });
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
          console.error("Error writing document: ", error);
        });


    });

  }








  render() {

    return (
      <Box bgcolor="white" boxShadow={1} p={4}>

        <Typography variant="h5" gutterBottom>
          Add product
        </Typography>

        <Box display="flex" flexWrap="true">
          {this.state.images.map((item, index) => (
            <Box margin="12px">
              <img
                src={this.uploadImageURL(item)}
                style={{ height: "90px", width: "160px" }} />
              <br />
              <IconButton
                aria-label="delete"
                onClick={e => this.removeImage(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>


        <input
          accept="image/*"
          hidden
          id="contained-button-file"
          onChange={(e) => {

            // {console.log(this.state.images.length)}
            if (e.target.files && e.target.files[0]) {
              let images = this.state.images;

              images.push(e.target.files[0]);
              this.setState({
                images: images,
              })
              e.target.value = null;
            }
          }}
          type="file"
        />

        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Add Image
          </Button>
        </label>

        <br />

        <TextField
          margin="normal"
          fullWidth
          label="Product Title"
          variant="outlined"
          size="small"
          name="product_title"
          onChange={e => this.onChange(e)}
          error={this.state.product_title.error !== ""}
          helperText={this.state.product_title.error}
          defaultValue={this.state.product_title.value}
        />

        <br />
        <TextField
          margin="normal"
          label="Price"
          variant="outlined"
          size="small"
          type="number"
          name="price"
          onChange={e => this.onChange(e)}
          error={this.state.price.error !== ""}
          helperText={this.state.price.error}
          defaultValue={this.state.price.value}
        />
        <TextField
          margin="normal"
          style={{ marginLeft: "16px" }}
          label="Cutted price"
          variant="outlined"
          size="small"
          type="number"
          name="cutted_price"
          onChange={e => this.onChange(e)}
          error={this.state.cutted_price.error !== ""}
          helperText={this.state.cutted_price.error}
          defaultValue={this.state.cutted_price.value}
        />

        <br />
        <TextField
          margin="normal"
          label="Free Coupons"
          variant="outlined"
          size="small"
          type="number"
          name="free_coupons"
          onChange={e => this.onChange(e)}
          error={this.state.free_coupons.error !== ""}
          helperText={this.state.free_coupons.error}
          defaultValue={this.state.free_coupons.value}
        />

        <br />

        <FormControlLabel
          value="attach_copon"
          control={<Switch color="primary"
            onChange={(e) => {
              this.setState({
                attach_copon: e.target.checked
              })
            }
            }
          />
          }
          label="Attach Coupon"
          labelPlacement="end"
        />

        <Box border={1} p={4} borderRadius={8} hidden={!this.state.attach_copon}>
          <RadioGroup
            aria-label="gender"
            name="coupon_type"
            defaultValue="discount"
            onChange={e => {
              this.setState({
                coupon_type: e.target.value,
              })
            }}
          >
            <FormControlLabel
              value="discount"
              control={<Radio />}
              label="Discount"
            />
            <FormControlLabel
              value="percentage"
              control={<Radio />}
              label="Flat Rs *OFF"
            />
          </RadioGroup>

          <br />
          <TextField
            margin="normal"
            label="Coupon Title"
            variant="outlined"
            size="small"
            name="coupon_title"
            onChange={e => this.onChange(e)}
            error={this.state.coupon_title.error !== ""}
            helperText={this.state.coupon_title.error}
            defaultValue={this.state.coupon_title.value}
          />
          <TextField
            margin="normal"
            style={{ marginLeft: "16px" }}
            label="Valid for days"
            variant="outlined"
            size="small"
            type="number"
            name="valid_for_days"
            onChange={e => this.onChange(e)}
            error={this.state.valid_for_days.error !== ""}
            helperText={this.state.valid_for_days.error}
            defaultValue={this.state.valid_for_days.value}
          />


          <br />
          <TextField
            margin="normal"
            id="outlined-multiline-static"
            label="Coupon Body"
            multiline
            fullWidth
            rows={4}
            variant="outlined"
            name="coupon_body"
            onChange={e => this.onChange(e)}
            error={this.state.coupon_body.error !== ""}
            helperText={this.state.coupon_body.error}
            defaultValue={this.state.coupon_body.value}
          />

          <br />
          <TextField
            margin="normal"
            label="Lower Limit"
            variant="outlined"
            size="small"
            type="number"
            name="lower_limit"
            onChange={e => this.onChange(e)}
            error={this.state.lower_limit.error !== ""}
            helperText={this.state.lower_limit.error}
            defaultValue={this.state.lower_limit.value}
          />
          <TextField
            margin="normal"
            style={{ marginLeft: "16px" }}
            label="Upper Limit"
            variant="outlined"
            size="small"
            type="number"
            name="upper_limit"
            onChange={e => this.onChange(e)}
            error={this.state.upper_limit.error !== ""}
            helperText={this.state.upper_limit.error}
            defaultValue={this.state.upper_limit.value}
          />
          {this.state.coupon_type === "percentage" ?
            <TextField
              margin="normal"
              style={{ marginLeft: "16px" }}
              label="Discount Amount"
              variant="outlined"
              size="small"
              type="number"
              name="percentage"
              onChange={e => this.onChange(e)}
              error={this.state.percentage.error !== ""}
              helperText={this.state.percentage.error}
              defaultValue={this.state.percentage.value}
            />
            :
            <TextField
              margin="normal"
              style={{ marginLeft: "16px" }}
              label="Percentage"
              variant="outlined"
              size="small"
              type="number"
              name="discount"
              onChange={e => this.onChange(e)}
              error={this.state.discount.error !== ""}
              helperText={this.state.discount.error}
              defaultValue={this.state.discount.value}
            />
          }

        </Box>




        <br />
        <TextField
          margin="normal"
          label="Max-Quantity"
          variant="outlined"
          size="small"
          type="number"
          name="max_quantity"
          onChange={e => this.onChange(e)}
          error={this.state.max_quantity.error !== ""}
          helperText={this.state.max_quantity.error}
          defaultValue={this.state.max_quantity.value}
        />
        <TextField
          margin="normal"
          style={{ marginLeft: "16px" }}
          label="Offers Applied"
          variant="outlined"
          size="small"
          name="offers_applied"
          onChange={e => this.onChange(e)}
          error={this.state.offers_applied.error !== ""}
          helperText={this.state.offers_applied.error}
          defaultValue={this.state.offers_applied.value}
        />


        <br />
        <TextField
          margin="normal"
          id="outlined-multiline-static"
          label="Description"
          multiline
          fullWidth
          rows={4}
          variant="outlined"
          name="description"
          onChange={e => this.onChange(e)}
          error={this.state.description.error !== ""}
          helperText={this.state.description.error}
          defaultValue={this.state.description.value}
        />

        <br />
        <FormControlLabel
          value="use_tab_layout"
          control={<Switch color="primary"
            onChange={(e) => {
              this.setState({
                use_tab_layout: e.target.checked,
              })
            }
            }
          />
          }
          label="Use Tab Layout"
          labelPlacement="end"
        />
        <br />
        {this.state.use_tab_layout &&
          <MaterialTable
            icons={tableIcons}
            options={{ search: false, paging: false }}
            title="Editable Example"
            columns={this.state.columns}
            data={this.state.data}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  resolve();
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.push(newData);
                    return { ...prevState, data };
                  });
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  resolve();
                  if (oldData) {
                    this.setState((prevState) => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      return { ...prevState, data };
                    });
                  }
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  resolve();
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }),
            }}
          />
        }


        <br />
        <TextField
          margin="normal"
          id="outlined-multiline-static"
          label="Other Details"
          multiline
          fullWidth
          rows={4}
          variant="outlined"
          name="other_details"
          onChange={e => this.onChange(e)}
          error={this.state.other_details.error !== ""}
          helperText={this.state.other_details.error}
          defaultValue={this.state.other_details.value}
        />

        <br />
        <TextField
          margin="normal"
          label="Stock Quantity"
          variant="outlined"
          size="small"
          type="number"
          name="stock_quantity"
          onChange={e => this.onChange(e)}
          error={this.state.stock_quantity.error !== ""}
          helperText={this.state.stock_quantity.error}
          defaultValue={this.state.stock_quantity.value}
        />
        <br />
        <FormControlLabel
          value="COD"
          control={<Switch color="primary"
            onChange={(e) => {
              this.setState({
                COD: e.target.checked,
              })
            }
            }
          />
          }
          label="COD"
          labelPlacement="end"
        />






        <br />
        <TextField
          margin="normal"
          label="Tags"
          fullWidth
          variant="outlined"
          size="small"
          name="tags"
          onChange={e => this.onChange(e)}
          error={this.state.tags.error !== ""}
          helperText={this.state.tags.error}
          defaultValue={this.state.tags.value}
        />

        <Button
          variant="contained"
          color="primary"
          component="span"
          fullWidth
          onClick={e => {
            this.uploadProduct();
          }}>
          Upload
        </Button>



        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snakbar}
          autoHideDuration={1000}
          onClose={e => this.setState({
            snakbar: false
          })}
          message={this.state.snackbar_error}

        />


        <Backdrop
          style={{ zIndex: "1600" }}
          open={this.state.loading} >
          <CircularProgress color="primary" />
        </Backdrop>





      </Box>
    )
  }
}

export default AddProduct