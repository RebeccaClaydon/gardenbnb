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

    this.mapMarkers = []

    this.#addMarkersToMap()
    this.#fitMapToMarkers()
    this.#setupCardHoverEvents()
    this.#setupCustomEventListeners()
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

      this.mapMarkers.push({
        marker: marker,
        element: customMarker,
        lat: markerData.lat,
        lng: markerData.lng
      })
    })
  }

  #fitMapToMarkers() {
    if (this.markersValue.length === 0) return

    if (this.markersValue.length === 1) {
      const marker = this.markersValue[0]
      this.map.flyTo({
        center: [marker.lng, marker.lat],
        zoom: 14,
        duration: 1000
      })
    } else {
      const bounds = new mapboxgl.LngLatBounds()
      this.markersValue.forEach(marker => bounds.extend([marker.lng, marker.lat]))

      this.map.fitBounds(bounds, {
        padding: 70,
        maxZoom: 15,
        duration: 1000
      })
    }
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

  #setupCustomEventListeners() {
    this.mapCenterHandler = (event) => {
      const { lat, lng, zoom = 12 } = event.detail
      this.map.flyTo({
        center: [lng, lat],
        zoom: zoom,
        duration: 1000
      })
    }

    this.highlightMarkerHandler = (event) => {
      const { lat, lng } = event.detail
      this.#centerMap(lat, lng)
      this.#highlightMarker(lat, lng)
    }

    document.addEventListener("map:center", this.mapCenterHandler)
    window.addEventListener("highlight-marker", this.highlightMarkerHandler)
  }

  disconnect() {
    if (this.mapCenterHandler) {
      document.removeEventListener("map:center", this.mapCenterHandler)
    }
    if (this.highlightMarkerHandler) {
      window.removeEventListener("highlight-marker", this.highlightMarkerHandler)
    }
  }
}
