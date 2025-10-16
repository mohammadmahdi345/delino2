from rest_framework import serializers

from food.models import Restorant, Like, Order, Food



class FoodSerializer(serializers.ModelSerializer):

    class Meta:
        model = Food
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Like
        fields = ('res', 'user', 'is_liked')
        extra_kwargs = {
            'user': {'read_only':True},
            'res': {'read_only': True},
            'is_liked': {'required':False}
        }



class RestorantSerializer(serializers.ModelSerializer):

    foods = FoodSerializer(many=True, read_only=True)
    order_count = serializers.IntegerField(read_only=True)
    like_count = serializers.SerializerMethodField()

    class Meta:
        model = Restorant
        fields = '__all__'

    def get_like_count(self,obj):
        return obj.likes.filter(is_liked=True).count()



class OrderGetSerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField()
    food = FoodSerializer(read_only=True)
    res = RestorantSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True},
            'status': {'read_only': True},
            'res': {'read_only': True},
        }

    def get_total_price(self, obj):
        # متد model.total_price() را فراخوانی می‌کنیم
        try:
            return obj.total_price()
        except Exception:
            return None


class OrderPostSerializer(serializers.ModelSerializer):

    class Meta:
        #food = serializers.CharField(required=True)
        quantity = serializers.IntegerField(required=True)
        model = Order
        fields = '__all__'
        extra_kwargs = {
            'status': {'read_only': True},
            'user': {'read_only': True},
            'res': {'read_only': True}
        }