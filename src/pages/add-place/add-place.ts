import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { MapPage } from '../../pages/map/map';
import { File } from '@ionic-native/file';

import { Location } from '../../models/location';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { PlacesService } from '../../services/places';



@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {

  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  };
  
  imageUrl="";

  locationIsSet = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, 
    private geolocation: Geolocation, private loadingCtrl: LoadingController, private toastCtrl: ToastController,
    private camera: Camera, private placesService: PlacesService, private file: File) {
  }

  onSubmit(form: NgForm) {
    this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imageUrl);
    form.reset();
    this.location = {
      lat: 40.7624324,
      lng: -73.9759827
    };
    this.imageUrl = '';
    this.locationIsSet = false;
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(MapPage, {
      location: this.location,
      isSet: this.locationIsSet
    });
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    );
  }

  onLocate(){
    const loading = this.loadingCtrl.create({
      content: 'Getting your location...'
    });
    loading.present();
    this.geolocation.getCurrentPosition()
    .then(
      location => {
        loading.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.locationIsSet = true;
      }
    )
    .catch(
      error => {
        loading.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Could not get location, please pick it manually!',
          duration: 2500
        });
        toast.present();
      }
    );
  }

  onTakePhoto(){
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
    .then(
      imageData => {
        const currentName = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        const newFileName = new Date().getUTCMilliseconds() + '.jpg';
        this.file.moveFile(path, currentName, this.file.dataDirectory, newFileName)
        .then(
          (data) => {
            this.imageUrl = data.nativeURL;
            this.camera.cleanup();
          }
        )
        .catch(
          err => {
            this.imageUrl = '';
            const toast = this.toastCtrl.create({
              message: 'Could not save the image. Please try again',
              duration: 2500
            });
            toast.present();
            this.camera.cleanup();
          }
        );
        this.imageUrl = imageData;
      }
    )
    .catch(
      err => {
        const toast = this.toastCtrl.create({
          message: 'Could not take the image. Please try again',
          duration: 2500
        });
        toast.present();
      }
    );
  }

}
