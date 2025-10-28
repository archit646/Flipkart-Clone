# Image Upload Guide for Flipkart Clone

## How to Upload Product Images

### Method 1: Django Admin Panel (Recommended)

1. **Access the Admin Panel**
   - Navigate to: http://localhost:8000/admin
   - Login with your superuser credentials:
     - Username: archit
     - Password: (your password)

2. **Upload Images for Products**
   - Click on "Products" in the admin panel
   - Select a product to edit
   - In the "Image" field, click "Choose File" and select an image from your computer
   - Click "Save" to upload the image

3. **View the Images**
   - The images will be stored in: `media/products/` directory
   - They will be accessible at: http://localhost:8000/media/products/filename.jpg
   - The frontend will automatically display them using the `image_url` field

### Method 2: API Upload (Programmatic)

You can also upload images via the API using form-data:

```javascript
const formData = new FormData();
formData.append('name', 'Product Name');
formData.append('description', 'Product Description');
formData.append('price', 1000);
formData.append('category', categoryId);
formData.append('stock', 50);
formData.append('image', imageFile); // File object from input[type="file"]

fetch('http://localhost:8000/api/products/products/', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${yourAuthToken}`
  },
  body: formData
})
```

## Image Configuration Details

### Settings Configuration
The following settings have been configured in `flipkart_backend/settings.py`:

```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

### URL Configuration
Media files are served during development via `flipkart_backend/urls.py`:

```python
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Frontend Integration
The frontend now uses the `image_url` field from the API response, which includes the full URL to the image:

```javascript
// Product card example
<img src={product.image_url || 'https://via.placeholder.com/200'} alt={product.name} />
```

## Troubleshooting

### Images Not Showing?
1. Check if the `media/products/` directory exists
2. Verify file permissions on the media directory
3. Ensure the Django server is running
4. Check browser console for 404 errors
5. Verify the CORS settings include your frontend URL

### Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Recommended Image Sizes
- Product thumbnails: 200x200 pixels
- Product detail: 400x400 pixels or larger
- Maximum file size: 5MB (can be configured in Django settings)

## Production Deployment

**Important**: For production deployment, you should:
1. Use a cloud storage service (AWS S3, Google Cloud Storage, etc.)
2. Configure Django Storages for media file handling
3. Never serve media files directly from Django in production
4. Use a CDN for optimal image delivery

### Example: Using AWS S3 for Production

```python
# settings.py
INSTALLED_APPS += ['storages']

AWS_ACCESS_KEY_ID = 'your-access-key'
AWS_SECRET_ACCESS_KEY = 'your-secret-key'
AWS_STORAGE_BUCKET_NAME = 'your-bucket-name'
AWS_S3_REGION_NAME = 'us-east-1'

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
```
