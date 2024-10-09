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
    individual_recommend_songs_api,
    team_recommend_songs_api,
)

urlpatterns = [
    path('individual/recommends', individual_recommend_songs_api, name='individual_recommend_songs_api'),
    path('team/recommends', team_recommend_songs_api, name='team_recommend_songs_api'),
    path('admin/', admin.site.urls),
]

# http://127.0.0.1:8000/recommend/mf/?songs=69605&songs=53341&songs=80930&songs=85300&songs=53410
# http://127.0.0.1:8000/recommend/mf/?songs=27615&songs=9290&songs=4448&songs=64011&songs=44253