from django.db import models

class Gateway(models.Model):
    name = models.CharField(max_length=60)
    description = models.CharField(max_length=200)
    is_active = models.BooleanField(default=False)

class Payment(models.Model):
    order = models.ForeignKey('food.Order', on_delete=models.CASCADE, related_name='order')
    gateway = models.ForeignKey('Gateway',on_delete=models.CASCADE)
    is_paid = models.BooleanField(default=False)
    ref_id = models.CharField(max_length=100, blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)


