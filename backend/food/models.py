from datetime import datetime

from django.core import validators
from django.db import models
from django.core.validators import MinValueValidator,MaxValueValidator,RegexValidator
from django.utils import timezone



class City(models.Model):
    name = models.CharField(max_length=15)

    def __str__(self):
        return self.name

class Food(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=300)
    avatar = models.ImageField(upload_to='foods/')

    def __str__(self):
        return self.name


class Restorant(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=200, null=True, blank=True)
    phone_number = models.CharField(
        max_length=13,
        unique=True,
        null=True,
        blank=True,
        validators=[
            validators.RegexValidator(
                r'^989[0-3,9]\d{8}$',
                'Enter a valid mobile number.',
                'invalid'
            ),
        ]
    )
    star = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        blank=True,
        null=True
    )
    created_time = models.DateTimeField(auto_now=True)
    address = models.TextField(max_length=150)
    min_post_time = models.PositiveIntegerField(default=45)
    max_post_time = models.PositiveIntegerField(default=120)

    foods = models.ManyToManyField(Food, through='MenuItem')  # 👈 رابطه با مدل واسط

    def __str__(self):
        return self.name


class MenuItem(models.Model):  # 👈 مدل واسط
    food = models.ForeignKey(Food, on_delete=models.CASCADE, related_name='meno_foods')
    restorant = models.ForeignKey(Restorant, on_delete=models.CASCADE, related_name='menu_items')
    price = models.PositiveIntegerField(default=0)
    is_sale = models.BooleanField(default=False)
    sale_price = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('food', 'restorant')  # هر غذا فقط یکبار در منوی هر رستوران

    def __str__(self):
        return f"{self.restorant.name} - {self.food.name} ({self.price})"



class Like(models.Model):
    res = models.ForeignKey(to='Restorant', on_delete=models.PROTECT, related_name='likes')
    user = models.ForeignKey(to='user.User', on_delete=models.CASCADE)
    is_liked = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'res')



# from django.contrib.gis.db import models
# class Location(models.Model):
#     name = models.CharField(max_length=255)
#     coordinates = models.PointField()  # ذخیره مختصات (طول و عرض جغرافیایی)
#
#     def __str__(self):
#         return f"{self.name} - {self.coordinates}"
#


class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'در انتظار پرداخت'),
        ('SHIPPED', 'ارسال شده'),
        ('DELIVERED', 'تحویل داده شده'),
    ]
    user = models.ForeignKey('user.User', on_delete=models.CASCADE)
    res = models.ForeignKey('Restorant',on_delete=models.CASCADE,related_name='res_order')
    food = models.ForeignKey('Food',on_delete=models.CASCADE,related_name='food_order')
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=100,choices=STATUS_CHOICES,default='PENDING')
    last_update = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.pk:
            old_status = Order.objects.get(id=self.pk).status
            if old_status != self.status:
                self.last_update = timezone.now()
        super().save(*args, **kwargs)

    def total_price(self):
        try:
            # پیدا کردن MenuItem مربوط به این غذا و رستوران
            menu_item = MenuItem.objects.get(food=self.food, restorant=self.res)
            price = menu_item.sale_price if menu_item.is_sale else menu_item.price
            return self.quantity * price
        except MenuItem.DoesNotExist:
            return 0


    def __str__(self):
        return f"{self.user} ordered {self.quantity} x {self.food.name}"