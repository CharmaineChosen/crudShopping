import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

//import { Item} from '../model/item';
import { FirebaseService } from '../services/firebase.service'



interface Item {
  name: string;
  quantity: number;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  Editname="";
  shoppingList = [];
  items: Item;
  myForm: FormGroup;

  constructor(private firebaseService: FirebaseService, private fb: FormBuilder) { }

  ngOnInit() {

    this.myForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required]
    })


    this.firebaseService.read_myShop().subscribe(data => {

      this.shoppingList = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          name: e.payload.doc.data()['name'],
          quantity: e.payload.doc.data()['quantity'],
        };
      })
      console.log(this.shoppingList);

    });



  }

  CreateItem() {
    console.log(this.myForm.value);
    this.firebaseService.create_myShop(this.myForm.value).then(resp => {
      this.myForm.reset();
    })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveItem(rowID){
    this.firebaseService.delete_myShop(rowID);
  }

  EditItem(item){
    item.isEdit = true;
    item.Editname = item.name;
    item.Editquantity = item.quantity;
  }

  UpdateItem(itemRow){
    let item = {};
    item['name'] = itemRow.Editname;
    item['quantity'] = itemRow.Editquantity;
    this.firebaseService.update_myShop(itemRow.id, item);
    itemRow.isEdit = false;
  }


  // title = 'Shopping List';
  // products = [
  //   {name: "Cheese", quantity:"four"},
  //   {name: "Juice", quantity:"two"},
  //   {name: "Apples", quantity:"six"},
  // ];
  // model:any={};
  // model2:any={};
  // addProduct(){
  //   this.products.push(this.model);
  //   this.model = {};
  // }
  // deleteProduct(i){
  //   this.products.splice(i, 1)
  
  // }
  // myValue;
  // editProduct(k){
  //     console.log(k)
    
  //   this.model2.name = this.products[k].name;
  //   this.model2.quantity = this.products[k].quantity;
  //   this.myValue = k;
  // }
  // updateProduct(){
  //   let k= this.myValue;
  //   for(let i=0; i<this.products.length;i++){
  //     if(i==k){
  //       this.products[i]= this.model2;
  //       this.model2 = {};
  //     }
  //   }
  // }
}