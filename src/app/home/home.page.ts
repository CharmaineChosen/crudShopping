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

  selectedFile: File = null;
  upload: any;


  constructor(private firebaseService: FirebaseService, private fb: FormBuilder) { }

  ngOnInit() {

    this.myForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      img: ['', Validators.required],
    })

    this.firebaseService.read_myShop().subscribe(data => {
      this.shoppingList = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          name: e.payload.doc.data()['name'],
          quantity: e.payload.doc.data()['quantity'],
          img: this.myForm.value.img
        };
      })
      console.log(this.shoppingList);

    });
  }

  onSelected(event) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadstart = (p) => {
      console.log(p);
    };
    reader.onloadend = (e) => {
      console.log(e.target);
      this.upload = reader.result;
      this.myForm.get('img').setValue(this.upload);
    };
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
    console.log('edit - id: ', item)
    item.isEdit = true;
    item.Editname = item.name;
    item.Editimage = item.img;
    item.Editquantity = item.quantity;
  }

  UpdateItem(itemRow){
    console.log('update - id: ', itemRow)
    let item = {};
    item['name'] = itemRow.Editname;
    item['img'] = itemRow.Editimage;
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