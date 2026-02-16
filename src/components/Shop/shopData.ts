import type { Product } from '@/types/product.type'

const shopData: Product[] = [
  {
    name: 'Havit HV-G69 USB Gamepad',
    slug: 'havit-hv-g69-usb-gamepad',
    image: '/images/products/product-1-bg-1.png',
    rating: 4.5,
    reviews: 15, // Note: reviews not in type, but good to keep if I add it back or it is ignored
    price: 59.0,
    discount: 50, // 29 is approx 50% off 59
    id: 1,
    stock: 100,
    selled: 200,
    categoryId: 1,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'Awesome gamepad',
    images: [
      {
        id: 1,
        productId: 1,
        image: '/images/products/product-1-bg-1.png',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        productId: 1,
        image: '/images/products/product-1-bg-2.png',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    name: 'iPhone 14 Plus , 6/128GB',
    slug: 'iphone-14-plus-6-128gb',
    image: '/images/products/product-2-bg-1.png',
    rating: 4.8,
    reviews: 5,
    price: 899.0,
    discount: 88, // 99 is big discount
    id: 2,
    stock: 50,
    selled: 10,
    categoryId: 2,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'Latest iPhone',
    images: [
      {
        id: 3,
        productId: 2,
        image: '/images/products/product-2-bg-1.png',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        productId: 2,
        image: '/images/products/product-2-bg-2.png',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    name: 'Apple iMac M1 24-inch 2021',
    slug: 'apple-imac-m1-24-inch-2021',
    image: '/images/products/product-3-bg-1.png',
    rating: 4.7,
    reviews: 5,
    price: 59.0,
    discount: 50,
    id: 3,
    stock: 20,
    selled: 5,
    categoryId: 3,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'Powerful iMac',
    images: [
      {
        id: 5,
        productId: 3,
        image: '/images/products/product-3-bg-1.png',
        createdAt: new Date().toISOString()
      },
      {
        id: 6,
        productId: 3,
        image: '/images/products/product-3-bg-2.png',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    name: 'MacBook Air M1 chip, 8/256GB',
    slug: 'macbook-air-m1-chip-8-256gb',
    image: '/images/products/product-4-bg-1.png',
    rating: 4.9,
    reviews: 6,
    price: 59.0,
    discount: 50,
    id: 4,
    stock: 30,
    selled: 15,
    categoryId: 3,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'Lightweight and powerful',
    images: [
      {
        id: 7,
        productId: 4,
        image: '/images/products/product-4-bg-1.png',
        createdAt: new Date().toISOString()
      },
      {
        id: 8,
        productId: 4,
        image: '/images/products/product-4-bg-2.png',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    name: 'Apple Watch Ultra',
    slug: 'apple-watch-ultra',
    image: '/images/products/product-5-bg-1.png',
    rating: 4.6,
    reviews: 3,
    price: 99.0,
    discount: 70,
    id: 5,
    stock: 40,
    selled: 25,
    categoryId: 4,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'Rugged apple watch',
    images: [
      {
        id: 9,
        productId: 5,
        image: '/images/products/product-5-bg-1.png',
        createdAt: new Date().toISOString()
      },
      {
        id: 10,
        productId: 5,
        image: '/images/products/product-5-bg-2.png',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    name: 'Logitech MX Master 3 Mouse',
    slug: 'logitech-mx-master-3-mouse',
    image: '/images/products/product-6-bg-1.png',
    rating: 4.8,
    reviews: 15,
    price: 59.0,
    discount: 50,
    id: 6,
    stock: 150,
    selled: 300,
    categoryId: 5,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'Best productivity mouse',
    images: [
      {
        id: 11,
        productId: 6,
        image: '/images/products/product-6-bg-1.png',
        createdAt: new Date().toISOString()
      },
      {
        id: 12,
        productId: 6,
        image: '/images/products/product-6-bg-2.png',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    name: 'Apple iPad Air 5th Gen - 64GB',
    slug: 'apple-ipad-air-5th-gen-64gb',
    image: '/images/products/product-7-bg-1.png',
    rating: 4.7,
    reviews: 15,
    price: 59.0,
    discount: 50,
    id: 7,
    stock: 60,
    selled: 40,
    categoryId: 2,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'Versatile tablet',
    images: [
      {
        id: 13,
        productId: 7,
        image: '/images/products/product-7-bg-1.png',
        createdAt: new Date().toISOString()
      },
      {
        id: 14,
        productId: 7,
        image: '/images/products/product-7-bg-2.png',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    name: 'Asus RT Dual Band Router',
    slug: 'asus-rt-dual-band-router',
    image: '/images/products/product-8-bg-1.png',
    rating: 4.5,
    reviews: 15,
    price: 59.0,
    discount: 50,
    id: 8,
    stock: 80,
    selled: 60,
    categoryId: 5,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'High speed router',
    images: [
      {
        id: 15,
        productId: 8,
        image: '/images/products/product-8-bg-1.png',
        createdAt: new Date().toISOString()
      },
      {
        id: 16,
        productId: 8,
        image: '/images/products/product-8-bg-2.png',
        createdAt: new Date().toISOString()
      }
    ]
  }
]

export default shopData
