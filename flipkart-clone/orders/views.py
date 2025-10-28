from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product

# API view for listing and creating orders
class OrderListView(APIView):
    permission_classes = [IsAuthenticated]
    
    # Get all orders for current user
    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    # Create new order
    def post(self, request):
        items = request.data.get('items', [])
        shipping_address = request.data.get('shipping_address', '')
        
        if not items:
            return Response(
                {'error': 'No items in order'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        total_amount = 0
        order_items_data = []
        
        # Validate each item and calculate total
        for item in items:
            try:
                product = Product.objects.get(id=item['product_id'])
                quantity = int(item['quantity'])
                
                # Check stock availability
                if quantity > product.stock:
                    return Response(
                        {'error': f'{product.name} is out of stock. Only {product.stock} available.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                total_amount = total_amount + (product.price * quantity)
                
                order_items_data.append({
                    'product': product,
                    'quantity': quantity,
                    'price': product.price
                })
                
            except Product.DoesNotExist:
                return Response(
                    {'error': f'Product with id {item["product_id"]} not found'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Create order with transaction
        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                total_amount=total_amount,
                shipping_address=shipping_address,
                status='pending'
            )
            
            # Create order items and update stock
            for item_data in order_items_data:
                OrderItem.objects.create(
                    order=order,
                    product=item_data['product'],
                    quantity=item_data['quantity'],
                    price=item_data['price']
                )
                
                # Reduce product stock
                product = item_data['product']
                product.stock = product.stock - item_data['quantity']
                product.save()
        
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# API view for order detail operations
class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    # Get single order
    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
    # Update order
    def put(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete order (cancel)
    def delete(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
