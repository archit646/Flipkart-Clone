from django.core.management.base import BaseCommand
from products.models import Category, Product
from decimal import Decimal


class Command(BaseCommand):
    help = 'Populate database with 10 products per category'

    def handle(self, *args, **kwargs):
        # Delete all existing products
        Product.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Deleted all existing products'))

        # Create Books category if it doesn't exist
        books_category, created = Category.objects.get_or_create(
            name='Books',
            defaults={'description': 'Books and Literature'}
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Created Books category'))

        # Get all categories
        categories = Category.objects.all()
        
        if not categories.exists():
            self.stdout.write(self.style.ERROR('No categories found. Please create categories first.'))
            return

        # Product templates for each category
        products_data = {
            'phone': [
                {'name': 'iPhone 15 Pro Max', 'price': '159900', 'description': '6.7" Super Retina XDR, A17 Pro, 256GB, Titanium Blue', 'stock': 40, 'image': 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500&q=80'},
                {'name': 'Samsung Galaxy S24 Ultra', 'price': '124999', 'description': '6.8" Dynamic AMOLED, Snapdragon 8 Gen 3, 12GB RAM, 512GB', 'stock': 35, 'image': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80'},
                {'name': 'OnePlus 12', 'price': '64999', 'description': '6.82" AMOLED, Snapdragon 8 Gen 3, 16GB RAM, 5400mAh Battery', 'stock': 50, 'image': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'},
                {'name': 'Google Pixel 8 Pro', 'price': '106999', 'description': '6.7" LTPO OLED, Tensor G3, AI Camera, 12GB RAM, 256GB', 'stock': 30, 'image': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80'},
                {'name': 'Xiaomi 14 Pro', 'price': '79999', 'description': '6.73" AMOLED, Snapdragon 8 Gen 3, Leica Camera, 50MP', 'stock': 60, 'image': 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&q=80'},
                {'name': 'Vivo X100 Pro', 'price': '89999', 'description': '6.78" AMOLED, Dimensity 9300, Zeiss Optics, 5400mAh', 'stock': 45, 'image': 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&q=80'},
                {'name': 'Oppo Find X7', 'price': '69999', 'description': '6.7" AMOLED, Snapdragon 8 Gen 2, Hasselblad Camera', 'stock': 55, 'image': 'https://images.unsplash.com/photo-1592286927505-2fd5f6f549d7?w=500&q=80'},
                {'name': 'Realme GT 5 Pro', 'price': '54999', 'description': '6.74" AMOLED, Snapdragon 8 Gen 3, 100W Charging', 'stock': 70, 'image': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80'},
                {'name': 'Nothing Phone (2)', 'price': '44999', 'description': '6.7" OLED, Snapdragon 8+ Gen 1, Glyph Interface, 45W Fast Charge', 'stock': 80, 'image': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80'},
                {'name': 'Motorola Edge 40 Pro', 'price': '49999', 'description': '6.67" OLED, Snapdragon 8 Gen 2, 125W Charging, Stock Android', 'stock': 65, 'image': 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&q=80'},
            ],
            'Electronics': [
                {'name': 'Sony WH-1000XM5', 'price': '29990', 'description': 'Wireless Noise Cancelling Headphones, 30hr Battery, Premium Sound', 'stock': 100, 'image': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80'},
                {'name': 'MacBook Air M2', 'price': '114900', 'description': '13.6" Liquid Retina, M2 Chip, 8GB RAM, 256GB SSD', 'stock': 25, 'image': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80'},
                {'name': 'iPad Air 5th Gen', 'price': '59900', 'description': '10.9" Display, M1 Chip, 64GB, Apple Pencil Compatible', 'stock': 40, 'image': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80'},
                {'name': 'Dell XPS 13', 'price': '99990', 'description': '13.4" FHD+, Intel i7, 16GB RAM, 512GB SSD, Windows 11', 'stock': 20, 'image': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80'},
                {'name': 'Canon EOS R50', 'price': '54999', 'description': 'Mirrorless Camera, 24.2MP, 4K Video, RF Lens Mount', 'stock': 15, 'image': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80'},
                {'name': 'LG 55" OLED TV', 'price': '129990', 'description': '4K Ultra HD, Smart TV, Dolby Vision, HDMI 2.1', 'stock': 10, 'image': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80'},
                {'name': 'Bose SoundLink', 'price': '14999', 'description': 'Portable Bluetooth Speaker, 12hr Battery, Waterproof', 'stock': 75, 'image': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80'},
                {'name': 'Apple Watch Series 9', 'price': '41900', 'description': 'GPS, Always-On Display, Health Tracking, Water Resistant', 'stock': 60, 'image': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80'},
                {'name': 'JBL Flip 6 Speaker', 'price': '12999', 'description': 'Portable Bluetooth, IP67 Waterproof, 12hr Playtime, Bass Boost', 'stock': 90, 'image': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80'},
                {'name': 'Logitech MX Master 3', 'price': '8995', 'description': 'Wireless Mouse, Ergonomic, Multi-device, USB-C Charging', 'stock': 120, 'image': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80'},
            ],
            'Fashion': [
                {'name': 'Levi\'s 501 Original Jeans', 'price': '3999', 'description': 'Classic Fit, 100% Cotton Denim, Button Fly, Multiple Colors', 'stock': 200, 'image': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80'},
                {'name': 'Nike Air Max Shoes', 'price': '8995', 'description': 'Running Shoes, Air Cushioning, Breathable Mesh, Premium Comfort', 'stock': 150, 'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'},
                {'name': 'Adidas Originals Hoodie', 'price': '4499', 'description': 'Unisex Pullover, Fleece Material, Kangaroo Pocket, Logo Print', 'stock': 180, 'image': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80'},
                {'name': 'Ray-Ban Aviator', 'price': '7999', 'description': 'Classic Sunglasses, UV Protection, Metal Frame, Multiple Colors', 'stock': 120, 'image': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80'},
                {'name': 'Tommy Hilfiger Polo', 'price': '2999', 'description': 'Men\'s Polo T-Shirt, Cotton Pique, Regular Fit, Signature Logo', 'stock': 250, 'image': 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80'},
                {'name': 'Zara Leather Jacket', 'price': '12999', 'description': 'Genuine Leather, Slim Fit, Zipper Closure, Multiple Pockets', 'stock': 50, 'image': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80'},
                {'name': 'H&M Summer Dress', 'price': '1999', 'description': 'Women\'s Floral Dress, Cotton Blend, Knee Length, Casual Wear', 'stock': 300, 'image': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80'},
                {'name': 'Puma Track Pants', 'price': '2499', 'description': 'Men\'s Joggers, Polyester, Tapered Fit, Side Pockets', 'stock': 220, 'image': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80'},
                {'name': 'Allen Solly Formal Shirt', 'price': '1799', 'description': 'Men\'s Slim Fit, Cotton Blend, Easy Iron, Office Wear', 'stock': 280, 'image': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80'},
                {'name': 'Fossil Leather Belt', 'price': '1499', 'description': 'Genuine Leather, Metal Buckle, Reversible, Adjustable Size', 'stock': 150, 'image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80'},
            ],
            'Home & Kitchen': [
                {'name': 'Prestige Cooker 5L', 'price': '1699', 'description': 'Pressure Cooker, Stainless Steel, Induction Compatible, ISI Certified', 'stock': 100, 'image': 'https://images.unsplash.com/photo-1584990347449-39b4aa027c1d?w=500&q=80'},
                {'name': 'Philips Air Fryer', 'price': '8999', 'description': '4.1L Capacity, Digital Display, Fat Removal Technology, 7 Presets', 'stock': 60, 'image': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80'},
                {'name': 'Bajaj Mixer Grinder', 'price': '3499', 'description': '750W Motor, 3 Jars, Stainless Steel Blades, 2 Year Warranty', 'stock': 80, 'image': 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&q=80'},
                {'name': 'Milton Water Bottles', 'price': '599', 'description': 'Set of 4, 1 Liter Each, BPA Free, Leak Proof, Fridge Safe', 'stock': 200, 'image': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80'},
                {'name': 'Havells Room Heater', 'price': '2999', 'description': '2000W, Fan Heater, Overheat Protection, Adjustable Thermostat', 'stock': 50, 'image': 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=500&q=80'},
                {'name': 'Urban Ladder Sofa 3-Seater', 'price': '34999', 'description': 'Fabric Upholstery, Sheesham Wood Frame, Comfortable Cushions', 'stock': 15, 'image': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80'},
                {'name': 'IKEA Study Table', 'price': '8999', 'description': 'Wooden Desk, Drawer Storage, Cable Management, Modern Design', 'stock': 30, 'image': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80'},
                {'name': 'Sleepwell Mattress', 'price': '15999', 'description': 'Queen Size, Memory Foam, Orthopedic Support, 10 Year Warranty', 'stock': 25, 'image': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80'},
                {'name': 'Cello Storage Containers', 'price': '899', 'description': 'Set of 6, Plastic, Airtight Lid, Microwave Safe, BPA Free', 'stock': 150, 'image': 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=500&q=80'},
                {'name': 'Crompton Ceiling Fan', 'price': '2299', 'description': '1200mm, 5 Star Rated, Energy Efficient, High Air Delivery', 'stock': 70, 'image': 'https://images.unsplash.com/photo-1614176258025-5ea2679e2c99?w=500&q=80'},
            ],
            'Books': [
                {'name': 'Think Like a Monk', 'price': '299', 'description': 'By Jay Shetty, Self-Help, Paperback, 352 Pages, Bestseller', 'stock': 500, 'image': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80'},
                {'name': 'Atomic Habits', 'price': '399', 'description': 'By James Clear, Personal Development, Hardcover, 320 Pages', 'stock': 450, 'image': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80'},
                {'name': 'The Psychology of Money', 'price': '349', 'description': 'By Morgan Housel, Finance, Paperback, Timeless Lessons', 'stock': 400, 'image': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&q=80'},
                {'name': 'Sapiens', 'price': '499', 'description': 'By Yuval Noah Harari, History, Paperback, 512 Pages, Bestseller', 'stock': 350, 'image': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80'},
                {'name': 'Harry Potter Box Set', 'price': '2999', 'description': 'Complete 7 Books, J.K. Rowling, Fiction, Hardcover Collection', 'stock': 100, 'image': 'https://images.unsplash.com/photo-1621351183012-e2f1f0509a86?w=500&q=80'},
                {'name': 'The Alchemist', 'price': '250', 'description': 'By Paulo Coelho, Fiction, Paperback, 197 Pages, Classic', 'stock': 600, 'image': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80'},
                {'name': 'Rich Dad Poor Dad', 'price': '299', 'description': 'By Robert Kiyosaki, Finance, Paperback, Personal Finance Guide', 'stock': 550, 'image': 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&q=80'},
                {'name': 'The Subtle Art', 'price': '349', 'description': 'By Mark Manson, Self-Help, Paperback, Life Philosophy', 'stock': 480, 'image': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80'},
                {'name': 'Ikigai', 'price': '199', 'description': 'Japanese Secret to Long Life, Self-Help, Paperback, Wellness', 'stock': 520, 'image': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80'},
                {'name': 'Wings of Fire', 'price': '199', 'description': 'By APJ Abdul Kalam, Autobiography, Paperback, Inspiring Story', 'stock': 700, 'image': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80'},
            ],
        }

        # Create products for each category
        total_products = 0
        for category in categories:
            category_name = category.name
            
            # Check if we have products for this category
            if category_name in products_data:
                products_list = products_data[category_name]
                
                for product_data in products_list:
                    Product.objects.create(
                        name=product_data['name'],
                        description=product_data['description'],
                        price=Decimal(product_data['price']),
                        category=category,
                        stock=product_data['stock'],
                        image_url=product_data.get('image', '')
                    )
                    total_products += 1
                
                self.stdout.write(
                    self.style.SUCCESS(f'Created {len(products_list)} products for {category_name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'No products defined for category: {category_name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully created {total_products} products in total!')
        )
        
