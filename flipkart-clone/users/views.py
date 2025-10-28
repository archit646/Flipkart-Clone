from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import UserSerializer, UserProfileSerializer

# API view for user registration
class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    
    # Register new user
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid():
            # Create user account
            user = serializer.save()
            
            # Generate auth token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API view for user login
class UserLoginView(APIView):
    permission_classes = [AllowAny]
    
    # Login user
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Validate credentials
        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Authenticate user
        user = authenticate(username=username, password=password)
        
        if user:
            # Get or create auth token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        else:
            return Response(
                {'error': 'Invalid username or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

# API view for user profile operations
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    # Get user profile
    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    # Update user profile
    def put(self, request):
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
