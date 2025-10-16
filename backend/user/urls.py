from django.urls import path
from .views import *

urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path('login/',LoginView.as_view(),name='login'),
    path('user/',UserView.as_view(),name='user'),
    path('users/me',MeUserView.as_view(),name='me'),
    path('comments/<int:pk>/',CommentView.as_view(),name='comments')
    # path('profile/',ProfileView.as_view(),name='profile'),
    # path('orders/',OrderView.as_view(),name='orders'),
    # path('order-detail/',OrderDetail.as_view(),name='order-detail'),

]