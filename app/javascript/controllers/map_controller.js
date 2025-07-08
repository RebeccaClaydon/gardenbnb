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

    this.mapMarkers = [] // pour conserver la liste des markers et leurs coords

    this.#addMarkersToMap()
    this.#fitMapToMarkers()
    this.#setupCardHoverEvents()
  }

  #addMarkersToMap() {
    this.markersValue.forEach((markerData) => {
      const popup = new mapboxgl.Popup().setHTML(markerData.info_window_html)

      const customMarker = document.createElement("div")
      customMarker.innerHTML = markerData.marker_html
      customMarker.classList.add("custom-marker")

      const marker = new mapboxgl.Marker(customMarker)
        .setLngLat([markerData.lng, markerData.lat])
        .setPopup(popup)
        .addTo(this.map)

      // On stocke le marker + DOM + coords
      this.mapMarkers.push({
        marker: marker,
        element: customMarker,
        lat: markerData.lat,
        lng: markerData.lng
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
      duration: 500
    })
  }

  #setupCardHoverEvents() {
    const cards = document.querySelectorAll("[data-lat][data-lng]")
    cards.forEach((card) => {
      card.addEventListener("mouseover", () => {
        const lat = parseFloat(card.dataset.lat)
        const lng = parseFloat(card.dataset.lng)

        if (!isNaN(lat) && !isNaN(lng)) {
          this.#centerMap(lat, lng)
          this.#highlightMarker(lat, lng)
        }
      })
    })
  }

  #highlightMarker(lat, lng) {
    this.mapMarkers.forEach(({ lat: mLat, lng: mLng, element }) => {
      if (mLat === lat && mLng === lng) {
        element.classList.add("marker-highlight")
      } else {
        element.classList.remove("marker-highlight")
      }
    })
  }
}
