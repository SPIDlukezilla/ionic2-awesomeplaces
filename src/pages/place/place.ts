import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Place } from '../../models/place';
import { PlacesService } from '../../services/places';


@IonicPage()
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {

  place: Place;
  index: number;  

  constructor(public navCtrl: NavController, public navParams: NavParams, private veiwCtrl: ViewController, private placesService: PlacesService) {
    this.place = this.navParams.get('place');
    this.index = this.navParams.get('index');
  }

  onLeave(){
    this.veiwCtrl.dismiss();
  }

  onDelete(){
    this.placesService.deletePlace(this.index);
    this.onLeave();
  }


}
