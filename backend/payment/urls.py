from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import *

router = SimpleRouter()
router.register('gateway',GateWayView,basename='gateway')

urlpatterns = [
    path('payment/<int:pk>/',PaymentView.as_view(),name='payment'),
] + router.urls