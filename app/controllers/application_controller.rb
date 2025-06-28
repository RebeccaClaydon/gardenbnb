class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def configure_permitted_parameters
    # Paramètres autorisés pour l'inscription
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name])

    # Paramètres autorisés pour la mise à jour du compte
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name])
  end
end
