from django.contrib import admin

from .models import *

admin.site.register(Food)
admin.site.register(City)
admin.site.register(Order)
admin.site.register(MenuItem)
class ResAdmin(admin.ModelAdmin):

    filter_horizontal = ['foods']

admin.site.register(Restorant,ResAdmin)