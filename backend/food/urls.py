from django.db import router
from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import *

router = SimpleRouter()
router.register('foods',FoodView,basename='foods')

urlpatterns = [
    path('restorant/', RestorantView.as_view(), name='restorant'),
    path('restorant/<int:pk>/', RestorantDetailView.as_view(), name='RestorantDetail'),
    path('likes/<int:pk>/', LikeView.as_view(), name='likes'),
    path('search/<str:name>/', Search.as_view(), name='search'),
    path('best-restorant/', BestSellingRestaurantsAPIView.as_view(), name='poplar res'),
    path('order/<int:pk>/', OrderPostView.as_view(), name='order'),
    path('orders/', OrderView.as_view(), name='orders'),
    # path('profile/',ProfileView.as_view(),name='profile'),
    # path('orders/',OrderView.as_view(),name='orders'),
    # path('order-detail/',OrderDetail.as_view(),name='order-detail'),

] + router.urls
