import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    lat: Number,
    lng: Number
  }

  highlight() {
    const event = new CustomEvent("highlight-marker", {
      detail: {
        lat: this.latValue,
        lng: this.lngValue
      }
    })
    window.dispatchEvent(event)
  }
}
