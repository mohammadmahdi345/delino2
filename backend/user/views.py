from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.shortcuts import redirect,HttpResponseRedirect
from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.contrib import messages
from django.contrib.auth import authenticate

from django.shortcuts import get_object_or_404
from delino.authentication import CustomTokenAuthentication

import random

from food.models import Restorant
from user.serializer import RegisterSerializer, LoginSerializer,UserSerializer

from .models import User
from .serializer import CommentSerializer

import logging

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.validated_data['phone_number']
        password = serializer.validated_data['password']

        if User.objects.filter(phone_number=phone_number).exists():
            return Response({'detail': 'user already exists'}, status=400)

        user = User.objects.create_user(phone_number=phone_number, password=password)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return Response({'detail': 'register successful',
                            'access_token': access_token,
                            'refresh_token': str(refresh)}, status=status.HTTP_200_OK)





class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone_number = serializer.validated_data['phone_number'].strip()
        password = serializer.validated_data['password']

        try:
            user = User.objects.get(phone_number=phone_number)
        except User.DoesNotExist:
            logger.debug(f'User not found: {phone_number}')
            return Response({'detail': 'user not found'}, status=404)

        logger.debug(f'User password hash: {user.password}')
        logger.debug(f'Check password result: {user.check_password(password)}')
        logger.debug(f'Password from request (repr): {repr(password)}')

        user = authenticate(request, username=phone_number, password=password)
        if user is None:
            return Response({'detail': 'password is wrong or user not found'}, status=400)

        refresh = RefreshToken.for_user(user)
        return Response({
            'detail': 'login successful',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }, status=200)




class UserView(APIView):
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self,request):
        user = User.objects.get(id=request.user.id)
        if user:
            serializer = UserSerializer(user,data=request.data)
            if serializer.is_valid(raise_exception=True):
                # full_name = serializer.validated_data['full_name']
                # password = serializer.validated_data['password']
                # email = serializer.validated_data['email']
                serializer.save()
                return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


class CommentView(APIView):
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,pk):
        try:
            restorant = Restorant.objects.get(pk=pk)
        except Restorant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        comments = restorant.comments.filter(is_approved=True)
        serializer = CommentSerializer(comments,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


    def post(self,request,pk):
        restorant = Restorant.objects.get(pk=pk)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user,res=restorant)
            return Response({"detail":"comment is post wait to geted ok"},status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



class MeUserView(APIView):
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = User.objects.get(id=request.user.id)
        serailizer = UserSerializer(user)
        return Response(serailizer.data,status=200)