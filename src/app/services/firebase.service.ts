import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  collectionName = 'myShop';

  constructor(
    private firestore: AngularFirestore
  ) { }

  create_myShop(record){
    return this.firestore.collection(this.collectionName).add(record);
  }

  read_myShop(){
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  update_myShop(recordID, record){
    this.firestore.doc(this.collectionName + '/' + recordID).update(record);
  }

  delete_myShop(record_id){
    this.firestore.doc(this.collectionName + '/' + record_id).delete();
  }
}
