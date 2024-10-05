"""
URL configuration for songpicker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from songs.views import (
    recommend_songs_api ,
    recommend_songs_test,
    recommend_songs_cosine, 
    recommend_songs_mf, 
    recommend_songs_neural_network, 
    get_songs_json
)

urlpatterns = [
    path('api/recommend_songs/', recommend_songs_api, name='recommend_songs_api'),
    path('admin/', admin.site.urls),
    path('recommend/test/', recommend_songs_test),
    path('recommend/cosine/', recommend_songs_cosine, name='recommend_songs_cosine'),
    path('recommend/mf/', recommend_songs_mf, name='recommend_songs_mf'),
    path('recommend/neural-network/', recommend_songs_neural_network, name='recommend_songs_neural_network'),
    path('songs-json/', get_songs_json, name='get_songs_json'),
]

# http://127.0.0.1:8000/recommend/mf/?songs=69605&songs=53341&songs=80930&songs=85300&songs=53410
# http://127.0.0.1:8000/recommend/mf/?songs=27615&songs=9290&songs=4448&songs=64011&songs=44253