import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddPlacePage } from '../../pages/add-place/add-place';
import { PlacesService } from '../../services/places';
import { Place } from '../../models/place';
import { PlacePage } from '../../pages/place/place'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  addPlacePage = AddPlacePage;
  places: Place[] = [];

  constructor(public navCtrl: NavController, private placesService: PlacesService, private modalCtrl: ModalController) {

  }

  ngOnInit(){
    this.placesService.fetchPlaces()
    .then(
      (places: Place[]) => this.places = places
    );
  }

  ionViewWillEnter(){
    this.places = this.placesService.loadPlaces();
  }

  onOpenPlace(place: Place, index: number){
    const modal = this.modalCtrl.create(PlacePage, {place: place, index: index});
    modal.present();
    modal.onDidDismiss(() => {
      this.places =  this.placesService.loadPlaces();
    });
  }

}
