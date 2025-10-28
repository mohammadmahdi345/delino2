from django.db import IntegrityError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.contrib import messages
from django.db.models import Q,Count
from django.db import IntegrityError



from .models import City, Food, Restorant, Order,Like
from .serializer import RestorantSerializer, LikeSerializer, OrderGetSerializer, OrderPostSerializer, FoodSerializer
from delino.authentication import CustomTokenAuthentication


from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Restorant, Food, MenuItem  # مطمئن شو importها درست هستن

class Search(APIView):
    def post(self, request, name):
        # ۱. پیدا کردن رستوران‌هایی که خودشون اسمشون شامل name هست
        restorants = Restorant.objects.filter(name__icontains=name)

        # ۲. پیدا کردن غذاهایی که اسمشون شامل name هست
        foods = Food.objects.filter(name__icontains=name)

        # ۳. ساخت دادهٔ JSON برای رستوران‌ها
        rest_data = [
            {
                "id": r.id,
                "name": r.name,
                "type": "restorant",
                "description": r.description,
            }
            for r in restorants
        ]

        # ۴. برای هر غذا، پیدا کردن رستوران‌هایی که اون غذا رو دارند
        food_data = []
        for f in foods:
            # همه‌ی منوهایی که این غذا رو دارند
            menus = MenuItem.objects.filter(food=f).select_related("restorant")
            for menu in menus:
                food_data.append({
                    "id": f.id,
                    "name": f.name,
                    "type": "food",
                    "description": f.description,
                    "restorant_id": menu.restorant.id,   # ✅ حالا درست شد
                    "restorant_name": menu.restorant.name,  # اختیاری
                })

        return Response(rest_data + food_data)





class RestorantView(APIView):

    def get(self,request):
        res = Restorant.objects.all()
        serializer = RestorantSerializer(res,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class RestorantDetailView(APIView):

    def get(self,request,pk):
        restorant = get_object_or_404(Restorant,pk=pk)
        serializer = RestorantSerializer(restorant)
        return Response(serializer.data,status=200)





class BestSellingRestaurantsAPIView(APIView):
    def get(self, request):
        best_restaurants = (
            Restorant.objects
            .annotate(order_count=Count('res_order'))   # related_name از Order
            .order_by('-order_count')[:10]
        )
        serializer = RestorantSerializer(best_restaurants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class Category(APIView):
    pass




class LikeView(APIView):
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """
        تعداد کل لایک‌های رستوران
        """
        res = get_object_or_404(Restorant, pk=pk)
        like_count = res.likes.filter(is_liked=True).count()
        return Response({'likes': like_count}, status=status.HTTP_200_OK)

    def post(self, request, pk):
        """
        لایک کردن یا فعال کردن لایک
        """
        res = get_object_or_404(Restorant, pk=pk)
        like_obj, created = Like.objects.get_or_create(user=request.user, res=res)

        if like_obj.is_liked:
            return Response({'detail': 'already liked'}, status=status.HTTP_400_BAD_REQUEST)

        like_obj.is_liked = True
        like_obj.save()
        return Response({'detail': 'liked'}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """
        دیسلایک (غیرفعال‌کردن لایک)
        """
        res = get_object_or_404(Restorant, pk=pk)
        like_obj = Like.objects.filter(user=request.user, res=res).first()

        if like_obj and like_obj.is_liked:
            like_obj.is_liked = False
            like_obj.save()
            return Response({'detail': 'disliked'}, status=status.HTTP_200_OK)

        return Response({'detail': 'not liked yet'}, status=status.HTTP_400_BAD_REQUEST)



class OrderView(APIView):
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        orders = Order.objects.filter(user=request.user,status='PENDING')
        other_orders = Order.objects.filter(user=request.user).exclude(status='PENDING')
        order_data = OrderGetSerializer(orders,many=True).data
        other_order_data = OrderGetSerializer(other_orders, many=True).data

        return Response({'orders':order_data,
                         'other_orders':other_order_data})


class OrderPostView(APIView):

    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self,request,pk):
        res = get_object_or_404(Restorant,pk=pk)

        serializer = OrderPostSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user,res=res)
            return Response({'detail':'order sabt shod'})
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)



class FoodView(ReadOnlyModelViewSet):
    serializer_class = FoodSerializer
    queryset = Food.objects.all()



class FoodResView(APIView):
    def get(self,request,pk):
        res = Restorant.objects.filter(foods__pk=pk)
        serializer = RestorantSerializer(res,many=True)
        return Response(serializer.data,status=200)


