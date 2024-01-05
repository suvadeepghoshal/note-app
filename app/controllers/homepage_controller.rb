class HomepageController < ApplicationController
  def index
    @csrf_token = form_authenticity_token
    response.headers['csrf_token'] = @csrf_token
  end
end
