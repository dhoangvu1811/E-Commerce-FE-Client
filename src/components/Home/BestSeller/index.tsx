'use client'
import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import Link from 'next/link'

import toast from 'react-hot-toast'

import SingleItem from './SingleItem'

import { productService } from '@/services'
import type { Product } from '@/types/product.type'
import PreLoader from '@/components/Common/PreLoader'


const BestSeller = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const data = await productService.getAll({
          // Note: 'selled_desc' is not in official API docs but may be supported by backend
          // @ts-ignore - Using non-documented sort option
          sort: 'selled_desc',
          itemsPerPage: 6
        })

        setProducts(data.data.products)
      } catch (error) {
        console.error('Failed to fetch best sellers', error)
        toast.error('Không thể tải sản phẩm bán chạy. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }

    fetchBestSellers()
  }, [])

  return (
    <section className='overflow-hidden'>
      <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
        {/* <!-- section title --> */}
        <div className='mb-10 flex items-center justify-between'>
          <div>
            <span className='flex items-center gap-2.5 font-medium text-dark mb-1.5'>
              <Image
                src='/images/icons/icon-07.svg'
                alt='icon'
                width={17}
                height={17}
              />
              This Month
            </span>
            <h2 className='font-semibold text-xl xl:text-heading-5 text-dark'>
              Best Sellers
            </h2>
          </div>
        </div>

        {loading ? (
          <PreLoader />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5'>
            {/* <!-- Best Sellers item --> */}
            {products.map((item, key) => (
              <SingleItem item={item} key={item.id || key} />
            ))}
          </div>
        )}

        <div className='text-center mt-12.5'>
          <Link
            href='/shop-without-sidebar'
            className='inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent'
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BestSeller
