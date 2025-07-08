// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "@popperjs/core"
import "bootstrap"
import MapHighlightController from "./controllers/map-highlight_controller"
application.register("map-highlight", MapHighlightController)
