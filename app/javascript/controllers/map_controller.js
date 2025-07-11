import { Controller } from "@hotwired/stimulus"
import mapboxgl from 'mapbox-gl'

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/outdoors-v12"
    })

    // Stocker les marqueurs pour l'interaction
    this.mapboxMarkers = []

    this.#addMarkersToMap()
    this.#fitMapToMarkers()

    // Écouter les événements de recherche
    document.addEventListener("map:center", (event) => {
      this.#centerMap(event.detail.lat, event.detail.lng)
    })

    // Écouter les événements de hover
    document.addEventListener("garden:hover", (event) => {
      this.#highlightMarker(event.detail.gardenId)
    })

    document.addEventListener("garden:unhover", (event) => {
      this.#unhighlightMarkers()
    })
  }

  #addMarkersToMap() {
    this.markersValue.forEach((marker, index) => {
      const popup = new mapboxgl.Popup().setHTML(marker.info_window_html)

      // Custom marker avec badge prix
      const customMarker = document.createElement("div")
      customMarker.innerHTML = marker.marker_html
      customMarker.dataset.gardenId = marker.garden_id

      const mapboxMarker = new mapboxgl.Marker(customMarker)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(this.map)

      // Stocker le marqueur avec son garden_id
      this.mapboxMarkers.push({
        marker: mapboxMarker,
        element: customMarker,
        gardenId: marker.garden_id
      })
    })
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach(marker => bounds.extend([marker.lng, marker.lat]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }

  #centerMap(lat, lng) {
    this.map.flyTo({
      center: [lng, lat],
      zoom: 14,
      duration: 2000
    })
  }

  #highlightMarker(gardenId) {
  this.mapboxMarkers.forEach(({ marker, element, gardenId: markerId }) => {
    if (markerId == gardenId) {
      element.classList.add('mapbox-marker-highlighted')
    }
  })
}

  #unhighlightMarkers() {
    this.mapboxMarkers.forEach(({ element }) => {
      element.classList.remove('mapbox-marker-highlighted')
    })
  }
}
