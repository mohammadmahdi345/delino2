import uuid
from datetime import datetime
from uuid import uuid4

from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from food.models import Order
from .models import Gateway, Payment
from .serializers import GatewaySerializer


class GateWayView(viewsets.ReadOnlyModelViewSet):

    permission_classes = [IsAuthenticated]
    queryset = Gateway.objects.filter(is_active=True)
    serializer_class = GatewaySerializer

class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request,pk):
        gateway = Gateway.objects.first()

        order = get_object_or_404(Order,pk=pk)

        payment = Payment.objects.create(
            gateway=gateway,
            order=order,
            paid_at=datetime.now(),
            ref_id=str(uuid.uuid4())
        )

        is_paid = True

        if is_paid:
            payment.is_paid = True
            payment.order.status = 'DELIVERED'
            payment.save()
            return Response({
                'detail': 'پرداخت با موفقیت انجام شد ✅',
                'user': {
                    'id': payment.order.user.id,
                    'full_name': payment.order.user.full_name,
                    'email': payment.order.user.email,
                },
                'paid_at': payment.paid_at,
                'ref_id': payment.ref_id,
                'pk': pk,
            }, status=status.HTTP_201_CREATED)



