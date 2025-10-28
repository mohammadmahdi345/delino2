from rest_framework import serializers

from .models import User,Comment
import re
from rest_framework.validators import UniqueValidator

def validate_phone_number(value):
    phone_regex = r'^989[0-3,9]\d{8}$'
    if not re.match(phone_regex,value):
        raise serializers.ValidationError
    return value

class RegisterSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(required=True,validators=[validate_phone_number,UniqueValidator])
    class Meta:
        model = User
        fields = ['phone_number','password']
        extra_kwargs = {
            'password': {'write_only':True}
        }

class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id','full_name','email')

        
class CommentSerializer(serializers.ModelSerializer):

    user =  UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ('user','res','description','created_time','is_approved')
        extra_kwargs = {
            'user':{'read_only':True},
            'is_approved':{'read_only':True},
            'res': {'read_only': True}
        }

