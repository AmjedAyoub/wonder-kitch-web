import React, { Component } from "react";
import Container from "../components/Container";
import Col from "../components/Col";
import DeleteBtn from "../components/DeleteBtn";
import Row from "../components/Row";
import API from "../utils/API";
import { Input, FormBtn } from "../components/Form";
import { List, ListItem } from "../components/List";
import axios from "axios";

class Inventory2 extends Component {
  constructor(props) {
    super(props);
    this.state = {  file: null,
      receiptResults:[],
      itemName:"",
      itemQuantity:"",
      itemQuantityUpdate:"",
      ReceiptQuantityChange:"",
      ReceiptItemsChange:"",
      DBItems:[] };
      this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
  }

   componentDidMount() {
    axios.get("http://localhost:3001/AllItems/" +localStorage.getItem("userID"))
    .then(res => {
      if (res.status === "error") {
        throw new Error(res.data.message);
      }
      console.log(res.data[0].items)
      this.setState({DBItems:res.data[0].items})
      // this.setState({ results: res.data.message, error: "" });
    })
    .catch(err => this.setState({ error: err.message }));
  }

handlePictureChange = event =>{
  this.setState({
      file: event.target.files[0],
      loaded: 0
  })
}

handleUpdateSubmit = (id,event) =>{
  axios.post("http://localhost:3001/updateItem",{
    userID: localStorage.getItem("userID"),
    itemID: this.state.DBItems[id]._id,
    name:this.state.DBItems[id].name,
    quantity:this.state.DBItems[id].quantity
  }
)
.then(res => {
  if (res.status === "error") {
    throw new Error(res.data.message);
  }
  axios.get("http://localhost:3001/AllItems/" +localStorage.getItem("userID"))
  .then(res => {
    if (res.status === "error") {
      throw new Error(res.data.message);
    }
    console.log(res.data[0].items)
    this.setState({DBItems:res.data[0].items})
    let arr =[];
    this.setState({receiptResults:arr})
  })
  .catch(err => this.setState({ error: err.message }));
})
.catch(err => this.setState({ error: err.message }));
}

handleDeleteSubmit = (id,event) =>{
  axios.post("http://localhost:3001/deleteItem",{
      userID: localStorage.getItem("userID"),
      itemID: this.state.DBItems[id]._id,
    }
  )
  .then(res => {
    if (res.status === "error") {
      throw new Error(res.data.message);
    }
    axios.get("http://localhost:3001/AllItems/" +localStorage.getItem("userID"))
    .then(res => {
      if (res.status === "error") {
        throw new Error(res.data.message);
      }
      console.log(res.data[0].items)
      this.setState({DBItems:res.data[0].items})
      let arr =[];
      this.setState({receiptResults:arr})
    })
    .catch(err => this.setState({ error: err.message }));
  })
  .catch(err => this.setState({ error: err.message }));
}

handleAddItemsSubmit = event => {
  event.preventDefault();
  console.log(this.state.receiptResults)
  for (let i = 0; i < this.state.receiptResults.length; i++) {
    axios.post("http://localhost:3001/addItems",{
      userID: localStorage.getItem("userID"),
      name: this.state.receiptResults[i].annotation,
      quantity: this.state.receiptResults[i].tag
    }
  )
    .then(res => {
      if (res.status === "error") {
        throw new Error(res.data.message);
      }
      this.setState({ DBItems: [this.state.receiptResults[i].annotation, this.state.receiptResults[i].tag] })
      console.log(res.config.data)
      axios.get("http://localhost:3001/AllItems/" +localStorage.getItem("userID"))
      .then(res => {
        if (res.status === "error") {
          throw new Error(res.data.message);
        }
        console.log(res.data[0].items)
        this.setState({DBItems:res.data[0].items})
        let arr =[];
        this.setState({receiptResults:arr})
      })
      .catch(err => this.setState({ error: err.message }));
    })
    .catch(err => this.setState({ error: err.message }));
  }
}

handleReceiptItemsChange = (i,event) => {
  const { name, value } = event.target;
  let users = [...this.state.receiptResults];
  users[i] = {...users[i], [name]: value};
  this.setState({receiptResults:users });
}

handlDBItemsChange = (i,event) => {
  const { name, value } = event.target;
  let users = [...this.state.DBItems];
  users[i] = {...users[i], [name]: value};
  this.setState({DBItems:users });
}

handleReceiptDeleteSubmit = (i,event) => {
  let users = [...this.state.receiptResults];
  users.splice(i, 1);
  this.setState({receiptResults:users });
}

handlePictureSubmit=event=>{
  event.preventDefault();
    API.takePicture(this.state.file) 
    .then(res => {
      for (let i = 0; i < res.data.annotations.length; i++) {
        res.data.annotations[i].tag="";        
      }
      this.setState({receiptResults:res.data.annotations})
    })
    .catch(err => console.log(err));
        }
        
        handleInputChange = event => {
          const {name ,value} =event.target;
          this.setState({ [name]: value });
        };
        
        handleFormSubmit = event => {
          event.preventDefault();          
          axios.post("http://localhost:3001/addItems",{
              userID: localStorage.getItem("userID"),
              name: this.state.itemName,
              quantity: this.state.itemQuantity
            }
            )
            .then(res => {
              if (res.status === "error") {
                throw new Error(res.data.message);
              }
              this.setState({ DBItems: [this.state.itemName, this.state.itemQuantity] })
              console.log(res.config.data)
              axios.get("http://localhost:3001/AllItems/" +localStorage.getItem("userID"))
              .then(res => {
                if (res.status === "error") {
                  throw new Error(res.data.message);
                }
                console.log(res.data[0].items)
                this.setState({DBItems:res.data[0].items})
                this.setState({itemName:"", itemQuantity:""})
              })
              .catch(err => this.setState({ error: err.message }));
            })
            .catch(err => this.setState({ error: err.message }));

        }

        render() {
          return (
            
            <div>
      <Container style={{ minHeight: "80%" }}>
      <Row>
          <Col size="md-6">
        <form>
        <Input
                onChange={this.handlePictureChange}
                type="file"
                encType="multipart/form-data"
                name="file"
              />
              <FormBtn
                onClick={this.handlePictureSubmit}
              >
                  Upload Picture
              </FormBtn>
        </form>
        <div>
    {this.state.receiptResults.length ? (
      <div>
              <List>
                {this.state.receiptResults.map((result, i)=> (
                  <ListItem key={i}>
                      <DeleteBtn onClick={this.handleReceiptDeleteSubmit.bind(this,i)} >Delete</DeleteBtn>     
                      <img alt="recipe" src= {result.image}  height="100px" width="100px"></img>
                  
                      <Input
                        value={result.annotation||""}
                          onChange={this.handleReceiptItemsChange.bind(this,i)}
                          name="annotation"
                          />
                      <p>
                        Quantity:
                        </p>
                        <Input
                        value={result.tag||""}
                        onChange={this.handleReceiptItemsChange.bind(this,i)}
                        name="tag"
                        placeholder="quantity in numbers"/>
                  </ListItem>
                ))}
              </List>
               <button
               onClick={this.handleAddItemsSubmit}
             >
                 Add items
             </button>
             </div>
            ) : (
              <h4>Upload your receipt to Display</h4>
            )}
    </div>
    </Col>
    <Col size="md-6" >
    <strong>
    Item:
    </strong>
    <Input
                value={this.state.itemName}
                onChange={this.handleInputChange}
                name="itemName"
                placeholder="Name of the item"
              />
    <strong>
    Quantity:
    </strong>
    <Input
                value={this.state.itemQuantity}
                onChange={this.handleInputChange}
                name="itemQuantity"
                placeholder="Quantity in numbers"
              />
              <FormBtn
                onClick={this.handleFormSubmit}
              >
                Add item
              </FormBtn>
              <div>
    {this.state.DBItems.length ? (
              <List>
                {this.state.DBItems.map((result,i) => (

                  <ListItem key={result._id} >
                    
                      <strong>
                        Item:
                      </strong>
                        <Input
                        value={result.name||""}
                        onChange={this.handlDBItemsChange.bind(this,i)}
                        name="name"
                        placeholder="item name"/>
                      <strong>
                        Quantity:
                        </strong>
                        <Input
                        value={result.quantity||""}
                        onChange={this.handlDBItemsChange.bind(this,i)}
                        name="quantity"
                        placeholder="quantity in numbers"/>
                      <FormBtn
                      onClick={this.handleUpdateSubmit.bind(this,i)}
                      >
                      Update
                      </FormBtn>
                      <DeleteBtn onClick={this.handleDeleteSubmit.bind(this,i)} >Delete</DeleteBtn>                    
                  </ListItem>
                ))}
              </List>
            ) : (
              <h4>No items in your kitchen</h4>
            )}
    </div>
      </Col>
        </Row>
      </Container>
      </div>
    
    );
    }
};

export default Inventory2;
