import { Controller } from "@hotwired/stimulus"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

export default class extends Controller {
  static values = { apiKey: String }

  connect() {
    this.geocoder = new MapboxGeocoder({
      accessToken: this.apiKeyValue,
      types: "country,region,place,postcode,locality,neighborhood,address",
      minLength: 2,
      limit: 5,
      debounce: 300,
      countries: 'fr',
      placeholder: 'Rechercher une ville...'
    })

    const geocoderContainer = document.getElementById('map-geocoder')
    if (geocoderContainer) {
      this.geocoder.addTo(geocoderContainer)
    } else {
      this.geocoder.addTo(this.element)
    }

    this.geocoder.on("result", event => this.#centerMainMap(event))
  }

  #centerMainMap(event) {
    const [lng, lat] = event.result.center

    document.dispatchEvent(new CustomEvent("map:center", {
      detail: { lat: lat, lng: lng, zoom: 12 }
    }))
  }

  disconnect() {
    if (this.geocoder) {
      this.geocoder.onRemove()
    }
  }
}
